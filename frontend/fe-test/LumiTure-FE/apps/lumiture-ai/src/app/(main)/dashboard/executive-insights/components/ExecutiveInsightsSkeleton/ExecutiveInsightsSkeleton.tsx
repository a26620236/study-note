'use client';

import { Box, Paper, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { HStack, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import { CostByFOCUSSectionSkeleton } from './CostByFOCUSSectionSkeleton';
import { ExecutiveInsightsHeaderSkeleton } from './ExecutiveInsightsHeaderSkeleton';

interface RankingSectionSkeletonProps {
  title: string;
  chartPosition?: 'left' | 'right';
}

interface MetricRowSkeletonProps {
  count?: number;
}

interface ChartSkeletonProps {
  height: string;
}

interface TableSkeletonProps {
  rows?: number;
}

const LABELS = {
  cvr: {
    title: 'Cloud Value Realization (CVR)',
  },
  cloudSpendRevenue: {
    title: 'Cloud Spend as a % of Revenue',
  },
  cloudCostPerCustomer: {
    title: 'Cloud Cost per Customer',
  },
  cloudCostForecast: {
    title: 'Cloud Cost Forecast & Variance',
  },
  rankings: {
    overspendTeams: 'Top 10 Highest Budget Overspend Teams',
    spendingTeams: 'Top 10 Highest Spending Teams',
  },
};

function MetricSkeleton() {
  return (
    <VStack gap={2} sx={{ flex: 1 }}>
      <Skeleton variant="text" sx={{ width: '70%', height: '12px', borderRadius: '8px' }} />
      <Skeleton variant="text" sx={{ width: '100%', height: '36px' }} />
    </VStack>
  );
}

function MetricRowSkeleton({ count = 3 }: MetricRowSkeletonProps) {
  return (
    <HStack gap={4}>
      {Array.from({ length: count }, (_, index) => (
        <MetricSkeleton key={index} />
      ))}
    </HStack>
  );
}

function ChartSkeleton({ height }: ChartSkeletonProps) {
  return <Skeleton variant="text" sx={{ width: '100%', height, borderRadius: '8px' }} />;
}

function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <VStack
      sx={{
        flex: 1,
        justifyContent: 'space-between',
        padding: '16px',
        border: `1px solid ${theme.palette.gray.borderLight}`,
        borderRadius: '8px',
      }}
    >
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} variant="text" sx={{ height: '14px' }} />
      ))}
    </VStack>
  );
}

function CVRSectionSkeleton() {
  return (
    <Paper>
      <VStack>
        <Typography variant="h5">{LABELS.cvr.title}</Typography>
        <HStack gap={4} sx={{ mt: 4 }}>
          <VStack gap={4} sx={{ flexWrap: 'nowrap', flex: 'auto' }}>
            <MetricRowSkeleton />
            <MetricRowSkeleton />
          </VStack>
          <Box sx={{ flex: 1 }}>
            <ChartSkeleton height="140px" />
          </Box>
        </HStack>
      </VStack>
    </Paper>
  );
}

function CloudCostRelatedSectionSkeleton() {
  const cardTitles = [
    LABELS.cloudSpendRevenue.title,
    LABELS.cloudCostPerCustomer.title,
    LABELS.cloudCostForecast.title,
  ];

  return (
    <HStack sx={{ gap: 4 }}>
      {cardTitles.map((title, index) => (
        <Paper key={index} sx={{ padding: '24px', flex: 'auto' }}>
          <Typography variant="h5" sx={{ marginBottom: '16px' }}>
            {title}
          </Typography>
          <VStack gap={4}>
            <ChartSkeleton height="140px" />
            <MetricRowSkeleton count={2} />
          </VStack>
        </Paper>
      ))}
    </HStack>
  );
}

function RankingSectionSkeleton({ title, chartPosition = 'right' }: RankingSectionSkeletonProps) {
  const chart = <ChartSkeleton height="190px" />;
  const table = <TableSkeleton />;

  return (
    <Paper sx={{ padding: '24px', borderRadius: '12px', width: '100%' }}>
      <Typography variant="h6" sx={{ marginBottom: '16px' }}>
        {title}
      </Typography>
      <HStack
        sx={{ width: '100%', flexFlow: chartPosition === 'left' ? 'row' : 'row-reverse' }}
        gap={4}
      >
        <Box style={{ flex: 3 }}>{chart}</Box>
        {table}
      </HStack>
    </Paper>
  );
}

export function ExecutiveInsightsSkeleton() {
  return (
    <VStack gap={4}>
      <ExecutiveInsightsHeaderSkeleton />
      <CVRSectionSkeleton />
      <CloudCostRelatedSectionSkeleton />
      <RankingSectionSkeleton title={LABELS.rankings.overspendTeams} />
      <RankingSectionSkeleton title={LABELS.rankings.spendingTeams} chartPosition="left" />
      <CostByFOCUSSectionSkeleton />
    </VStack>
  );
}
