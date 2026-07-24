'use client';

import { useRouter } from 'next/navigation';

import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format, getYear } from 'date-fns';

import { HStack, Markdown, VStack } from '@lumiture-ui';
import { ScreenShot } from '@lumiture-ui/SvgIcon';

import CurrencySelector from '@components/CurrencySelector/CurrencySelector';
import { DASHBOARD_PATHS } from '@constants';

import { useGetFiscalReportQuery } from '../hooks/useGetFiscalReportQuery';
import { ExecutiveInsightsMonthPicker } from './ExecutiveInsightsMonthPicker';

const LABELS = {
  fiscalReport: {
    title: 'Executive Insights',
    desc: `Please note that certain dashboard are group-based, so totals may differ from the organization's overall total due to resources counted in multiple groups. Values may also vary from your console due to cloud provider time zone and currency settings, and the <strong>INCLUSION OF CREDITS</strong> on this page.`,
    learnMore: '&nbsp;(<u>Learn More</u>)',
    fiscalSettings: 'Fiscal Settings',
    fiscalYear: 'Fiscal Year',
    lastUpdated: 'Last Updated',
    nextUpdate: 'Next Update',
    getNextUpdateTime: (nextUpdate: string) => `${nextUpdate} (UTC+0)`,
    tooltip: {
      updateTime:
        'Due to data latency from cloud service provider, the cloud cost here may be slightly different from the final billing.',
      takeScreenshot: 'Take Screenshot',
      learnMore: `According to the status of cloud platform's data, the usage data for the current day may be available only on the next day and may differ from actual usage. Accurate cost information is typically available approximately 48 hours after the usage is generated.`,
    },
  },
};

interface ExecutiveInsightsPageHeaderProps {
  onTakeScreenshot?: () => void;
  isScreenshotMode?: boolean;
}

export function ExecutiveInsightsPageHeader({
  onTakeScreenshot,
  isScreenshotMode = false,
}: ExecutiveInsightsPageHeaderProps) {
  const router = useRouter();
  const { data: fiscalReport } = useGetFiscalReportQuery();

  const { lastUpdated, nextUpdate, period } = fiscalReport?.data ?? {};
  const fiscalYear = period?.start ? getYear(new Date(period.start)) : null;

  const handleSettingsClick = () => {
    router.push(`${DASHBOARD_PATHS.executiveInsightsSettings.pathname}?year=${fiscalYear}`);
  };

  if (isScreenshotMode) {
    return (
      <HStack alignItems="start" justifyContent="space-between">
        <VStack sx={{ mb: 4 }} gap={2}>
          <Typography variant="h4">{LABELS.fiscalReport.title}</Typography>
        </VStack>

        <HStack alignItems="center" gap={2}>
          <HStack alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary">
              {LABELS.fiscalReport.lastUpdated}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(lastUpdated ?? ''), 'MM/dd/yyyy')}
            </Typography>
          </HStack>
          <CurrencySelector sx={{ '& .MuiIcon-root': { display: 'none' } }} />
        </HStack>
      </HStack>
    );
  }

  return (
    <VStack sx={{ mb: 4 }} gap={2}>
      <HStack alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{LABELS.fiscalReport.title}</Typography>

        {/* update time */}
        <HStack alignItems="center">
          <HStack gap={5}>
            <HStack alignItems="center" gap={1}>
              <Typography variant="caption" color="text.secondary">
                {LABELS.fiscalReport.lastUpdated}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(lastUpdated ?? ''), 'MM/dd/yyyy')}
              </Typography>
            </HStack>
            <HStack alignItems="center" gap={1}>
              <Typography variant="caption" color="text.secondary">
                {LABELS.fiscalReport.nextUpdate}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {LABELS.fiscalReport.getNextUpdateTime(
                  format(new Date(nextUpdate ?? ''), 'MM/dd/yyyy')
                )}
              </Typography>
            </HStack>
          </HStack>

          <Tooltip title={LABELS.fiscalReport.tooltip.updateTime}>
            <InfoRoundedIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 1 }} />
          </Tooltip>
          <Tooltip title={LABELS.fiscalReport.tooltip.takeScreenshot}>
            <IconButton onClick={onTakeScreenshot} sx={{ ml: 2 }}>
              <ScreenShot />
            </IconButton>
          </Tooltip>
        </HStack>
      </HStack>

      <HStack alignItems="end" gap={2}>
        {/* description */}
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          <Markdown>{LABELS.fiscalReport.desc}</Markdown>
          <Tooltip title={LABELS.fiscalReport.tooltip.learnMore}>
            <span style={{ cursor: 'pointer' }}>
              <Markdown>{LABELS.fiscalReport.learnMore}</Markdown>
            </span>
          </Tooltip>
        </Typography>

        {/* action buttons */}
        <HStack alignItems="center" gap={2}>
          <CurrencySelector />
          <ExecutiveInsightsMonthPicker />
          <Button variant="contained" startIcon={<SettingsIcon />} onClick={handleSettingsClick}>
            {LABELS.fiscalReport.fiscalSettings}
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
}
