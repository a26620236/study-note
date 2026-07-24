import { useParams } from 'next/navigation';

import { Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

import { HStack, VStack } from '@lumiture-ui';
import { nFormatAbbreviation, nFormatter } from '@shared/utils';

import EmptyState from '@components/EmptyState/EmptyState';
import UpdateAt from '@components/UpdateAt';
import { CrossCloudValue, Currency, PlatformsValue, type PlatformValueWithFOCUS } from '@constants';
import { useGetCostTrend, useGetPlatformFilterOptions } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { getGroupByLabel } from '../../utils/getGroupByLabel';
import { hasCreditsSelected } from '../../utils/hasCreditsSelected';
import { CostTrendChart } from './CostTrendChart';
import { CostTrendSkeleton } from './CostTrendSkeleton';

const LABELS = {
  costTrendTitle: 'Cost Trend',
  totalCost: 'Total Cost',
  period: (startDate: string, endDate: string) => `Period: ${startDate} ~ ${endDate}`,
  includeCredits: (totalCredits: number, currency: string) =>
    `Include Credits ${nFormatAbbreviation({ num: totalCredits })} ${currency}`,
  groupBy: 'Group By',
  groupByValue: (prefix: string, value: string) => (value ? `${prefix}: ${value}` : prefix),
};

export function CostTrend() {
  const { platform } = useParams<{ platform: PlatformValueWithFOCUS }>();
  const { data: session } = useSession();
  const currency = session?.user.currency ?? Currency.USD;

  const { [platform]: platformFilters } = useCostDashboardStore((state) => state);

  const { data: costTrendData, isSuccess, isLoading } = useGetCostTrend(platformFilters);
  const costTrend = costTrendData?.data;
  const { dateAxis: costTrendDateAxis, series: costTrendSeries } = costTrend ?? {};

  const isEmpty = isSuccess && !costTrendDateAxis?.length;
  const hasData = isSuccess && !!costTrendDateAxis?.length;

  const hasCredits = hasCreditsSelected(platform, platformFilters);

  const optionsPlatform = platform === CrossCloudValue.FOCUS ? PlatformsValue.GCP : platform;
  const { data: filterOptionsData } = useGetPlatformFilterOptions(
    optionsPlatform,
    { start_date: platformFilters.startDate, end_date: platformFilters.endDate },
    { enabled: platform !== CrossCloudValue.FOCUS }
  );
  const lumiTagKeys = filterOptionsData?.data.lumitag.keys ?? [];
  const { prefix: groupByPrefix, value: groupByValue } = getGroupByLabel(
    platformFilters,
    lumiTagKeys
  );

  const totalCredits = hasData
    ? (costTrendSeries?.reduce<number>((acc, curr) => acc + curr.totalCredits, 0) ?? 0)
    : 0;

  const totalCost = hasCredits
    ? costTrendSeries?.reduce<number>((acc, curr) => acc + curr.totalCost + curr.totalCredits, 0)
    : costTrendSeries?.reduce<number>((acc, curr) => acc + curr.totalCost, 0);

  const startDateLabel = format(new Date(platformFilters.startDate), 'd MMM. yyyy');
  const endDateLabel = format(new Date(platformFilters.endDate), 'd MMM. yyyy');

  if (isLoading) return <CostTrendSkeleton />;

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
      {isEmpty && <EmptyState type="emptyChart" />}

      {hasData && (
        <VStack>
          <HStack alignItems="top" justifyContent="space-between">
            <Tooltip
              title={`${nFormatter({ num: totalCost, fixed: 2 })} ${currency}`}
              placement="top-start"
            >
              <HStack gap={2} alignItems="flex-end">
                <Typography variant="h2">
                  {nFormatAbbreviation({ num: totalCost })}
                </Typography>
                <Typography variant="captionBold" sx={{ mb: 2 }}>
                  {currency}
                </Typography>
              </HStack>
            </Tooltip>
            <HStack gap={1}>
              <Typography variant="captionMedium" color="text.hint" sx={{ fontStyle: 'italic' }}>
                {LABELS.groupBy}
              </Typography>
              <Typography variant="captionBold" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {LABELS.groupByValue(groupByPrefix, groupByValue)}
              </Typography>
            </HStack>
          </HStack>

          {hasCredits && (
            <Tooltip
              title={`${nFormatter({ num: totalCredits, fixed: 2 })} ${currency}`}
              placement="top-start"
            >
              <Typography variant="caption" color="text.hint">
                {LABELS.includeCredits(totalCredits, currency)}
              </Typography>
            </Tooltip>
          )}
        </VStack>
      )}
      <Typography variant="caption" color="text.hint">
        {`(${currency})`}
      </Typography>
      <CostTrendChart dateAxis={costTrendDateAxis} series={costTrendSeries} />
    </VStack>
  );
}
