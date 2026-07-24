import { useEffect, useRef } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { sendGAEvent } from '@next/third-parties/google';
import { useSession } from 'next-auth/react';

import { Button, Icon } from '@lumiture-ui';

import CardContainer from '@app/(main)/components/CardContainer';
import CostByCloudChart from '@app/(main)/components/optimize-cloud-spend/costByCloud/CostByCloudChart';
import HighestSpendingChart from '@app/(main)/components/optimize-cloud-spend/highestSpending/HighestSpendingChart';
import useOverviewParamChange from '@app/(main)/useOverviewParamChange';
import EmptyState from '@components/EmptyState/EmptyState';
import { Depth, EVENT_OVERVIEW, OVERVIEW_PATHS } from '@constants';
import { useGetOverviewByCloud, type OverviewPeriod } from '@hooks-api';

interface GetActionButtonsParams {
  isScreenshotMode: boolean;
  isError: boolean;
  isEmpty: boolean;
  onClick: () => void;
}

const getActionButtons = ({
  isScreenshotMode,
  isError,
  isEmpty,
  onClick,
}: GetActionButtonsParams) => {
  if (isScreenshotMode || isError || isEmpty) {
    return [];
  }

  return [
    <Tooltip key="see-full-rankings" title="View the complete spending ranking chart for all teams">
      <div>
        <Button
          key="see-full-rankings"
          variant="outlined"
          color="primary"
          startIcon={<Icon name="bar_chart" sx={{ transform: 'rotate(90deg)' }} />}
          onClick={onClick}
          sx={{ ml: 2 }}
        >
          See Full Rankings
        </Button>
      </div>
    </Tooltip>,
  ];
};

interface OptimizeCloudSpendProps {
  isScreenshotMode?: boolean;
}

const OptimizeCloudSpend = ({ isScreenshotMode = false }: OptimizeCloudSpendProps) => {
  const { data: session } = useSession();
  const depth = session?.user.group?.depth;

  const { frequency, period, handleParamsChange } = useOverviewParamChange();

  const preFrequency = useRef<OverviewPeriod | null>(null);

  const {
    data: overviewByCloudData,
    isPending: isPendingOverviewByCloud,
    isSuccess: isSuccessOverviewByCloud,
    isError: isErrorOverviewByCloud,
  } = useGetOverviewByCloud({ freq: frequency, period });

  const overviewByCloud = overviewByCloudData?.data;

  const hasSpendingGroupMetrics = overviewByCloud?.highestSpendingGroups.some(({ ...metrics }) =>
    Object.values(metrics).some((metric) => typeof metric === 'number')
  );

  const isEmptyHighestSpendingGroups = isSuccessOverviewByCloud && !hasSpendingGroupMetrics;
  const hasHighestSpendingGroupsData = isSuccessOverviewByCloud && hasSpendingGroupMetrics;

  const hasCostByCloudValues = Object.values(overviewByCloud?.costByCloud ?? {}).some(
    (item) => typeof item.cost === 'number' || typeof item.budget === 'number'
  );
  const isEmptyCostByCloud = isSuccessOverviewByCloud && !hasCostByCloudValues;
  const hasCostByCloudData = isSuccessOverviewByCloud && hasCostByCloudValues;

  const handleGoToSpendingRankings = () => {
    sendGAEvent('event', EVENT_OVERVIEW.CLICK_FULL_RANK);
    handleParamsChange({ path: OVERVIEW_PATHS.spendingRankings.pathname });
  };

  useEffect(() => {
    if (preFrequency.current === frequency) return;
    preFrequency.current = frequency;
    sendGAEvent('event', EVENT_OVERVIEW.DISPLAY_FREQ, { freq: frequency });
  }, [frequency]);

  return (
    <Stack sx={{ gap: 8 }}>
      {isPendingOverviewByCloud ? (
        <Stack sx={{ minHeight: 500 }}>
          <CircularProgress sx={{ m: 'auto' }} />
        </Stack>
      ) : (
        <>
          {/* Top 10 Highest Spending Team */}
          {/* IAM (depth !== Depth.T2) 邏輯寫在前端是比較不佳的作法，
          能否顯示的邏輯應該寫在後端（目前後端 T2 時不會回傳資料），
          但是空資料無法判斷是：1. 沒資料 or 2. 沒權限
          理想上後端應該要回傳 availableActions: { viewSpendingRanking: boolean } 一類的欄位來判斷是否有權限
          已經和後端反應過，之後相關的功能可以再補上 */}
          {depth !== Depth.T2 && (
            <CardContainer
              showCurrency={!isErrorOverviewByCloud && !isEmptyHighestSpendingGroups}
              isScreenshotMode={isScreenshotMode}
              title="Top 10 Highest Spending Team"
              buttons={getActionButtons({
                isScreenshotMode,
                isError: isErrorOverviewByCloud,
                isEmpty: isEmptyHighestSpendingGroups,
                onClick: handleGoToSpendingRankings,
              })}
              sx={{ minHeight: 540 }}
            >
              <>
                {isErrorOverviewByCloud && <EmptyState type="error" />}
                {isEmptyHighestSpendingGroups && <EmptyState type="emptyChart" />}
                {hasHighestSpendingGroupsData && (
                  <Stack sx={{ gap: 2 }}>
                    <HighestSpendingChart
                      sourceData={overviewByCloud?.highestSpendingGroups ?? []}
                      platformBudget={overviewByCloud?.costByCloud ?? {}}
                      isScreenshotMode={isScreenshotMode}
                    />
                    <Typography
                      variant="caption"
                      color="text.hint"
                      sx={{
                        textAlign: 'center',
                        whiteSpace: 'pre-line',
                        fontStyle: 'italic',
                      }}
                    >{`*Please note that this chart is displayed on a group basis.\nThe total amount in this chart may not match the organization’s total amount due to the duplication of resources assigned to multiple groups.`}</Typography>
                  </Stack>
                )}
              </>
            </CardContainer>
          )}
          {/* Cost by Cloud */}
          <CardContainer
            showCurrency={!isErrorOverviewByCloud && !isEmptyCostByCloud}
            isScreenshotMode={isScreenshotMode}
            title="Cost by Cloud"
            sx={{ minHeight: 320 }}
          >
            <>
              {isErrorOverviewByCloud && <EmptyState type="error" />}
              {isEmptyCostByCloud && <EmptyState type="emptyChart" />}
              {hasCostByCloudData && (
                <CostByCloudChart
                  sourceData={overviewByCloud?.costByCloud}
                  isScreenshotMode={isScreenshotMode}
                />
              )}
            </>
          </CardContainer>
        </>
      )}
    </Stack>
  );
};

export default OptimizeCloudSpend;
