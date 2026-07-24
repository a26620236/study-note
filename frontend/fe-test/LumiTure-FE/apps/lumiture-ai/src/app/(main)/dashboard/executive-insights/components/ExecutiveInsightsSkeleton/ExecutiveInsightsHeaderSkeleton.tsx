'use client';

import SettingsIcon from '@mui/icons-material/Settings';
import { Button, IconButton, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { HStack, Markdown, VStack } from '@lumiture-ui';
import { ScreenShot } from '@lumiture-ui/SvgIcon';

import CurrencySelector from '@components/CurrencySelector/CurrencySelector';

import { ExecutiveInsightsMonthPicker } from '../ExecutiveInsightsMonthPicker';

const LABELS = {
  header: {
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

export function ExecutiveInsightsHeaderSkeleton() {
  return (
    <VStack sx={{ mb: 4 }} gap={2}>
      <HStack alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{LABELS.header.title}</Typography>
        <HStack alignItems="center" gap={2}>
          <Skeleton variant="text" sx={{ width: '200px', height: '14px' }} />
          <IconButton disabled>
            <ScreenShot />
          </IconButton>
        </HStack>
      </HStack>

      <HStack alignItems="end" gap={2}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          <Markdown>{LABELS.header.desc}</Markdown>
          <Markdown>{LABELS.header.learnMore}</Markdown>
        </Typography>

        <HStack alignItems="center" gap={2}>
          <CurrencySelector disabled />
          <ExecutiveInsightsMonthPicker disabled />
          <Button variant="contained" startIcon={<SettingsIcon />} disabled>
            {LABELS.header.fiscalSettings}
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
}
