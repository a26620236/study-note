import { Skeleton, Typography } from '@mui/material';
import { format } from 'date-fns';

import { HStack, VStack } from '@lumiture-ui';
import { nFormatAbbreviation } from '@shared/utils';

import { BarChartSkeleton } from '@components/echart/BarChartSkeleton';
import UpdateAt from '@components/UpdateAt';

import { initializeDate } from '../../utils/initializeDate';

const LABELS = {
  costTrendTitle: 'Cost Trend',
  totalCost: 'Total Cost',
  period: (startDate: string, endDate: string) => `Period: ${startDate} ~ ${endDate}`,
  includeCredits: (totalCredits: number, currency: string) =>
    `Include Credits ${nFormatAbbreviation({ num: totalCredits })} ${currency}`,
};

export function CostTrendSkeleton() {
  const { startDate, endDate } = initializeDate();

  const startDateLabel = format(new Date(startDate), 'd MMM. yyyy');

  const endDateLabel = format(new Date(endDate), 'd MMM. yyyy');

  return (
    <VStack gap={2}>
      <HStack alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{LABELS.costTrendTitle}</Typography>
        <UpdateAt
          placement="bottom-end"
          sx={{ color: 'text.hint' }}
          iconSx={{ color: 'text.hint' }}
        />
      </HStack>
      <HStack alignItems="center" justifyContent="space-between">
        <Typography variant="captionBold" sx={{ color: 'text.secondary' }}>
          {LABELS.totalCost}
        </Typography>
        <Typography variant="bodyMedium" fontStyle="italic" color="text.hint">
          {LABELS.period(startDateLabel, endDateLabel)}
        </Typography>
      </HStack>
      <Skeleton variant="rounded" width={120} height={54} />
      <BarChartSkeleton />
    </VStack>
  );
}
