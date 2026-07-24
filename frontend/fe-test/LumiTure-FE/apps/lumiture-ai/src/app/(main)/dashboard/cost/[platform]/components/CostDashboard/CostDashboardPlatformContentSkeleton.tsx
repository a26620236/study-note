import { Paper } from '@mui/material';

import { VStack } from '@lumiture-ui';

import { AIInsightCenterSkeleton } from '../AIInsightCenter/AIInsightCenterSkeleton';
import { CostDetailTableSkeleton } from '../CostDetail/CostDetailTableSkeleton';
import { CostTrendSkeleton } from '../CostTrend/CostTrendSkeleton';

export function CostDashboardPlatformContentSkeleton() {
  return (
    <VStack mt={8} gap={5}>
      <AIInsightCenterSkeleton />
      <Paper sx={{ p: 6, width: '100%' }}>
        <CostTrendSkeleton />
        <CostDetailTableSkeleton />
      </Paper>
    </VStack>
  );
}
