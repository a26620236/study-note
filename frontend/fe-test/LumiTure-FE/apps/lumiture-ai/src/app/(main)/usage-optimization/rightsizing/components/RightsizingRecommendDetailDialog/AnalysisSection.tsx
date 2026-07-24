import { Box, Grid, Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

import { useGetRightsizingRecommendDetail, type RecommendationItem } from '@hooks-api';

import { DetailedAnalysisSkeleton, UsageAnalysisSkeleton } from './AnalysisSectionSkeleton';
import { ExpandableText } from './ExpandableText';

const DETAIL_LABELS = {
  title: 'Detailed Analysis',
};

const USAGE_LABELS = {
  title: 'Usage Analysis',
  averageCPUUtilization: 'Average CPU Utilization',
  maximumCPUUtilization: 'Maximum CPU Utilization',
  averageMemoryUtilization: 'Average Memory Utilization',
  maximumMemoryUtilization: 'Maximum Memory Utilization',
  averageDiskTotalOpsCount: 'Average Disk Total Ops Count',
  maximumDiskTotalOpsCount: 'Maximum Disk Total Ops Count',
  averageNetworkTotalOpsCount: 'Average Network Total Ops Count',
  maximumNetworkTotalOpsCount: 'Maximum Network Total Ops Count',
};

interface AnalysisSectionProps {
  recId: RecommendationItem['recId'];
}

export function AnalysisSection({ recId }: AnalysisSectionProps) {
  const { data: recommendDetail, isLoading } = useGetRightsizingRecommendDetail(recId);
  const { usageAnalysis, analysis = '--' } = recommendDetail?.data ?? {};
  const {
    averageCPUUtilization,
    averageMemoryUtilization,
    averageDiskTotalOpsCount,
    averageNetworkTotalOpsCount,
    maximumCPUUtilization,
    maximumMemoryUtilization,
    maximumDiskTotalOpsCount,
    maximumNetworkTotalOpsCount,
  } = usageAnalysis ?? {};

  return (
    <VStack mt={4} gap={4}>
      <VStack gap={4}>
        <Typography variant="h5">{USAGE_LABELS.title}</Typography>
        <Box flexGrow={1}>
          {isLoading ? (
            <UsageAnalysisSkeleton />
          ) : (
            <Grid container columns={3} spacing={2}>
              <UtilizationCell
                label={USAGE_LABELS.averageCPUUtilization}
                utilization={averageCPUUtilization}
                suffix="%"
              />
              <UtilizationCell
                label={USAGE_LABELS.averageMemoryUtilization}
                utilization={averageMemoryUtilization}
                suffix="%"
              />
              <UtilizationCell
                label={USAGE_LABELS.averageDiskTotalOpsCount}
                utilization={averageDiskTotalOpsCount}
              />
              <UtilizationCell
                label={USAGE_LABELS.averageNetworkTotalOpsCount}
                utilization={averageNetworkTotalOpsCount}
              />
              <UtilizationCell
                label={USAGE_LABELS.maximumCPUUtilization}
                utilization={maximumCPUUtilization}
                suffix="%"
              />
              <UtilizationCell
                label={USAGE_LABELS.maximumMemoryUtilization}
                utilization={maximumMemoryUtilization}
                suffix="%"
              />
              <UtilizationCell
                label={USAGE_LABELS.maximumDiskTotalOpsCount}
                utilization={maximumDiskTotalOpsCount}
              />
              <UtilizationCell
                label={USAGE_LABELS.maximumNetworkTotalOpsCount}
                utilization={maximumNetworkTotalOpsCount}
              />
            </Grid>
          )}
        </Box>
      </VStack>
      <VStack gap={2} mt={2}>
        <Typography variant="h5">{DETAIL_LABELS.title}</Typography>
        {isLoading ? <DetailedAnalysisSkeleton /> : <ExpandableText text={analysis} />}
      </VStack>
    </VStack>
  );
}

interface UtilizationCellProps {
  label: string;
  utilization?: number;
  suffix?: string;
}

const UtilizationCell = ({ label, utilization, suffix = '' }: UtilizationCellProps) => {
  const formattedUtilization = (utilization?: number) =>
    utilization ? `${utilization.toFixed(2)}${suffix}` : '--';

  return (
    <Grid size={1} height={24.5}>
      <HStack gap={2} alignItems="center" height="100%">
        <Typography variant="captionBold" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="bodyMedium">{formattedUtilization(utilization)}</Typography>
      </HStack>
    </Grid>
  );
};
