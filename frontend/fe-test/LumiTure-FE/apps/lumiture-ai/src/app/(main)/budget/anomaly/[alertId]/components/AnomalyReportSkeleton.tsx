'use client';

import { Paper, Skeleton, Typography } from '@mui/material';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import { LineChartSkeleton } from '@components/echart/LineChartSkeleton';
import TableSkeleton from '@components/table/TableSkeleton';
import { PlatformsValue } from '@constants';

import { AnomalyReportHeader } from './AnomalyReportHeader';

const LABELS = {
  title: 'Anomaly Detection Report',
  goBackButtonLabel: 'Anomaly Alert List',
  viewCostTrendButtonLabel: 'View 1-Month Cost Trend',
  costByTop10SpendingServices: 'Cost by Top Spending 10 Services',
  top10ServicesCostBreakdown: {
    title: 'Top 10 Services: 36-Hour Cost Breakdown',
    description:
      'We recommend logging into your console to verify the accurate status and fees. The cost information here is for reference.',
  },
  alertInformation: {
    cost: 'Cost',
    resourceName: {
      gcp: 'Project Name / ID',
      aws: 'Account Name / ID',
      azure: 'Resource Group Name / ID',
    },
    anomalyTime: 'Anomaly Time',
    assignedTo: 'Assigned to',
  },
  downloadButtonLabel: 'Download CSV',
};

interface AlertDetailSkeletonProps {
  label: string;
  skeletonWidth?: number;
  skeletonHeight?: number;
}

function AlertDetailSkeleton({
  label,
  skeletonWidth = 200,
  skeletonHeight = 20,
}: AlertDetailSkeletonProps) {
  return (
    <VStack gap={2}>
      <Typography variant="captionBold" color="text.secondary">
        {label}
      </Typography>
      <Skeleton variant="text" width={skeletonWidth} height={skeletonHeight} />
    </VStack>
  );
}

function CostByTop10SpendingServicesChartSkeleton() {
  const chartHeight = 250;

  return (
    <VStack gap={4}>
      <Typography variant="h5">{LABELS.costByTop10SpendingServices}</Typography>
      <Skeleton variant="rounded" height={12} width={80} />
      <LineChartSkeleton height={chartHeight} />
    </VStack>
  );
}

function Top10ServicesCostBreakdownTableSkeleton() {
  return (
    <VStack gap={4}>
      <VStack gap={1}>
        <HStack justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{LABELS.top10ServicesCostBreakdown.title}</Typography>
          <Button
            startIcon={<Icon name="download" sx={{ color: 'text.hint' }} />}
            variant="outlined"
            size="small"
            data-testid="download-csv-button"
            disabled
          >
            {LABELS.downloadButtonLabel}
          </Button>
        </HStack>
        <Typography variant="body1" color="text.secondary">
          {LABELS.top10ServicesCostBreakdown.description}
        </Typography>
      </VStack>
      <TableSkeleton rows={4} />
    </VStack>
  );
}

export function AnomalyReportSkeleton() {
  return (
    <Paper>
      <VStack gap={8}>
        <AnomalyReportHeader isLoading={true} />

        {/* alert detail */}
        <VStack gap={4}>
          <AlertDetailSkeleton
            label={LABELS.alertInformation.resourceName[PlatformsValue.GCP]}
            skeletonWidth={320}
          />
          <AlertDetailSkeleton skeletonHeight={36} label={LABELS.alertInformation.cost} />
          <AlertDetailSkeleton skeletonHeight={14} label={LABELS.alertInformation.anomalyTime} />
          <AlertDetailSkeleton skeletonHeight={12} label={LABELS.alertInformation.assignedTo} />
        </VStack>

        {/* cost by top 10 spending services */}
        <CostByTop10SpendingServicesChartSkeleton />

        {/* top 10 services cost breakdown */}
        <Top10ServicesCostBreakdownTableSkeleton />
      </VStack>
    </Paper>
  );
}
