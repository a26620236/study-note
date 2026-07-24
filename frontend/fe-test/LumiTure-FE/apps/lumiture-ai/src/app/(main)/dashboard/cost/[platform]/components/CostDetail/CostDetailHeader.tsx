'use client';

import { useParams } from 'next/navigation';

import { Tooltip, Typography } from '@mui/material';
import { sendGAEvent } from '@next/third-parties/google';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

import { Button, HStack, Icon, Markdown } from '@lumiture-ui';
import { downloadFile } from '@shared/utils';

import { Currency, EVENT_COST_DASHBOARD, type PlatformValueWithFOCUS } from '@constants';
import { useDownloadCostDetailCsv } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { getGroupByHint, GroupByHintKind } from '../../utils/getGroupByHint';

const LABELS = {
  costDetails: 'Cost Details',
  downloadCSV: 'Download CSV',
  period: (startDate: string, endDate: string) => `Period: ${startDate} ~ ${endDate}`,
  hints: {
    [GroupByHintKind.LumiTag]: {
      learnMore: 'Learn More About “Untagged”',
      tooltip: `**Untagged**<br/>Spend that does not match any existing rule within this LumiTag. This may include resources with no corresponding metadata or system-level charges that cannot be attributed to your defined categories.`,
    },
    [GroupByHintKind.Label]: {
      learnMore: 'Learn More About “Charges of other usages.”',
      tooltip: `**Charges of other usages**<br/>Expenses that couldn't be accurately attributed to your selected labels or projects. This may include untagged resources, shared infrastructure, account-level fees, or platform-generated charges.`,
    },
    [GroupByHintKind.Tag]: {
      learnMore: 'Learn More About “No Tag Key”',
      tooltip: `**No Tag Key**<br/>Expenses from resources that are missing the specific tag key used for grouping. These resources may still contain other tags, but not the one currently being analyzed.`,
    },
  },
};

export function CostDetailHeader() {
  const { platform } = useParams<{ platform: PlatformValueWithFOCUS }>();
  const { data: session } = useSession();
  const { [platform]: platformFilters } = useCostDashboardStore((state) => state);

  const currency = session?.user.currency ?? Currency.USD;
  const startDate = format(new Date(platformFilters.startDate), 'd MMM. yyyy');
  const endDate = format(new Date(platformFilters.endDate), 'd MMM. yyyy');
  const hintKind = getGroupByHint(platformFilters);
  const hint = hintKind ? LABELS.hints[hintKind] : null;

  const { mutateAsync: downloadCsv, isPending } = useDownloadCostDetailCsv();

  const handleDownloadCsv = async () => {
    try {
      const data = await downloadCsv({ filters: platformFilters });
      if (!data.data.link) return;
      downloadFile({ downloadUrl: data.data.link, filename: 'cost_detail.csv' });
      sendGAEvent('event', EVENT_COST_DASHBOARD.CLICK_DOWNLOAD_CSV, { platform });
    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  };

  return (
    <>
      <HStack justifyContent="space-between">
        <Typography variant="h4">{LABELS.costDetails}</Typography>
        <Button
          startIcon={<Icon name="download" sx={{ color: 'primary.main' }} />}
          variant="outlined"
          onClick={handleDownloadCsv}
          disabled={isPending}
          isLoading={isPending}
          data-testid={`${platform}-download-csv-button`}
        >
          {LABELS.downloadCSV}
        </Button>
      </HStack>
      <HStack justifyContent="space-between" mt={1}>
        <Typography variant="caption" color="text.hint">
          {currency}
        </Typography>
        <Typography variant="bodyMedium" color="text.hint" sx={{ fontStyle: 'italic' }}>
          {LABELS.period(startDate, endDate)}
        </Typography>
      </HStack>

      {hint && (
        <HStack gap={0.5} alignItems="center" mt={1}>
          <Tooltip title={<Markdown>{hint.tooltip}</Markdown>}>
            <Icon name="help" sx={{ color: 'text.secondary', fontSize: 18 }} />
          </Tooltip>
          <Typography
            variant="bodyBold"
            color="text.secondary"
            sx={{ textDecoration: 'underline' }}
          >
            {hint.learnMore}
          </Typography>
        </HStack>
      )}
    </>
  );
}
