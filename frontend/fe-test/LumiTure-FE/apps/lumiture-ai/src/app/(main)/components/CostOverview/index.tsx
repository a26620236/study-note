import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  endOfMonth,
  format,
  getYear,
  isSameMonth,
  isSameYear,
  startOfYear,
  subYears,
} from 'date-fns';

import { MonthPicker } from '@lumiture-ui';
import { ScreenShot } from '@lumiture-ui/SvgIcon';

import {
  DEFAULT_THRESHOLD,
  OVERVIEW_INIT_PARAMS,
} from '@app/(main)/components/CostOverview/constants';
import CostSummaryCard from '@app/(main)/components/CostOverview/CostSummaryCard';
import useOverviewParamChange from '@app/(main)/useOverviewParamChange';
import CurrencySelector from '@components/CurrencySelector/CurrencySelector';
import UpdateAt from '@components/UpdateAt';
import { useGetDashboardOverviewOrg } from '@hooks-api';

import { TotalCost } from './TotalCost/TotalCost';

// 取得往前三年的1月
const janThreeYearsAgo = startOfYear(subYears(new Date(), 2));

type DateString = `${number}-${number}-${number}`;

interface CostOverviewPRops {
  isScreenshotMode?: boolean;
  onTakeScreenshot?: () => void;
}
const CostOverview = ({ isScreenshotMode = false, onTakeScreenshot }: CostOverviewPRops) => {
  const { period, handleParamsChange } = useOverviewParamChange();
  const periodDate = new Date(period);

  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);

  const { data: overviewData, isLoading, isError } = useGetDashboardOverviewOrg({ period });
  const budgetInfo = {
    budget: overviewData?.totalCost.budget ?? null,
    warningThreshold: overviewData?.threshold.warning ?? DEFAULT_THRESHOLD.WARNING,
    alertThreshold: overviewData?.threshold.alert ?? DEFAULT_THRESHOLD.ALERT,
  };

  const costs = [
    {
      title: 'Monthly Total Cost',
      desc: 'Compared to last month',
      ...overviewData?.currentMonth,
    },
    {
      title: 'Cost from Last Month',
      desc: 'Compared to last year',
      ...overviewData?.lastMonth,
    },
    {
      title: 'Average Monthly Cost',
      desc: 'Compared to last month',
      ...overviewData?.monthlyAvg,
    },
    {
      title: 'Spend by This Year',
      desc: 'Compare to last year',
      ...overviewData?.currentYear,
    },
  ];

  const learnMoreTooltip =
    'Please note that due to varying billing time zones and currencies among cloud service providers, the values displayed on LumiTure.ai may slightly differ from what you see on your console. The primary purpose of LumiTure.ai is to provide a comprehensive overview of your cloud spending, enabling you to easily identify cost trends and distribution. We appreciate your understanding and trust in our platform to help you optimize your cloud costs.';

  const monthPickerTooltip =
    'You can choose to view data for the current year, as well as the two years prior.';

  const handleUpdateSelectedDate = (date: Date | null) => {
    setTempSelectedDate(date);
  };

  const handleResetSelectedDate = () => {
    setTempSelectedDate(OVERVIEW_INIT_PARAMS.PERIOD);
  };

  const handleApplySelectedDate = () => {
    const now = new Date();
    const isCurrentYearMonth =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      isSameMonth(tempSelectedDate as Date, now) && isSameYear(tempSelectedDate as Date, now);

    const period = isCurrentYearMonth
      ? now // 若選中的年月是當前年月，則返回當日
      : // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
        endOfMonth(tempSelectedDate as Date); // 若選中的年月非當前年月，則返回該年月的最後一天

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
    handleParamsChange({ period: format(period, 'yyyy-MM-dd') as DateString });
  };

  const handleCalendarClose = () => setTempSelectedDate(periodDate);

  useEffect(() => {
    setTempSelectedDate(new Date(period));
  }, [period]);

  return (
    <Stack>
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Cloud Cost Overview</Typography>
        <UpdateAt
          isScreenshotMode={isScreenshotMode}
          sx={{
            '& .nextUpdate': { display: isScreenshotMode ? 'none' : 'block' },
            '& .MuiSvgIcon-root': { display: isScreenshotMode ? 'none' : 'block' },
          }}
        />
        {/* screenshot */}
        {isScreenshotMode && <CurrencySelector sx={{ '& .MuiIcon-root': { display: 'none' } }} />}
        {!isScreenshotMode && (
          <Tooltip title="Take Screenshot">
            <Box>
              <IconButton sx={{ ml: 2 }} disabled={isLoading} onClick={onTakeScreenshot}>
                <ScreenShot />
              </IconButton>
            </Box>
          </Tooltip>
        )}
      </Stack>

      {!isScreenshotMode && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Typography variant="caption" color="text.secondary">
            Please note that LumiTure.ai values may slightly differ from your console
            <br />
            due to variations in cloud provider time zones, currency settings, and the{' '}
            <strong>EXCLUSION OF CREDITS</strong> on this page. (
            <Tooltip title={learnMoreTooltip}>
              <Typography variant="caption" sx={{ textDecoration: 'underline' }}>
                Learn More
              </Typography>
            </Tooltip>
            )
          </Typography>
          <Stack direction="row" alignItems="center" gap={2}>
            <CurrencySelector />
            <MonthPicker
              selected={tempSelectedDate}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
              openToDate={tempSelectedDate as Date}
              onChange={handleUpdateSelectedDate}
              onReset={handleResetSelectedDate}
              onApply={handleApplySelectedDate}
              shouldCloseOnSelect={false}
              minDate={janThreeYearsAgo}
              maxDate={OVERVIEW_INIT_PARAMS.PERIOD}
              onCalendarClose={handleCalendarClose}
              tooltip={monthPickerTooltip}
            />
          </Stack>
        </Stack>
      )}
      {isLoading ? (
        <Stack sx={{ height: 400 }}>
          <CircularProgress size={50} sx={{ m: 'auto' }} />
        </Stack>
      ) : (
        <Grid container spacing={4} sx={{ mt: 8 }}>
          {/* total cost */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TotalCost
              year={getYear(new Date(period)).toString()}
              budget={budgetInfo.budget ?? null}
              spending={overviewData?.totalCost.spending ?? null}
              predict={overviewData?.totalCost.predict ?? null}
              isError={isError}
              isScreenshotMode={isScreenshotMode}
            />
          </Grid>
          {/* cost cards */}
          <Grid container size={{ xs: 12, md: 6 }}>
            {costs.map((_cost) => (
              <Grid key={_cost.title} size={6}>
                <CostSummaryCard {..._cost} {...budgetInfo} isError={isError} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Stack>
  );
};

export default CostOverview;
