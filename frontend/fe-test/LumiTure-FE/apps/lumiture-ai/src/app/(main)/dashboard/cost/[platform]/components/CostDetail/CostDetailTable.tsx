import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { Box, useTheme } from '@mui/material';

import { VStack } from '@lumiture-ui';

import EmptyState from '@components/EmptyState/EmptyState';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import type { PlatformValueWithFOCUS } from '@constants';
import { useGetCostTrend } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { useCostDetailColumns } from '../../hooks/useCostDetailColumns';
import { transformCostTrendData, type CostDetailRow } from '../../utils/transformCostTrendData';
import { CostDetailHeader } from './CostDetailHeader';
import { CostDetailTableSkeleton } from './CostDetailTableSkeleton';

export function CostDetailTable() {
  const theme = useTheme();
  const { platform } = useParams<{ platform: PlatformValueWithFOCUS }>();
  const { [platform]: platformFilters } = useCostDashboardStore((state) => state);
  const { data: costTrendData, isSuccess, isLoading } = useGetCostTrend(platformFilters);

  const costTrend = costTrendData?.data;
  const { dateAxis, series } = costTrend ?? {};

  const tableData = useMemo<CostDetailRow[]>(
    () => transformCostTrendData({ series, dateAxis }),
    [series, dateAxis]
  );

  const isEmpty = isSuccess && (!series || series.length === 0);

  const columns = useCostDetailColumns();

  if (isLoading) return <CostDetailTableSkeleton />;

  return (
    <VStack sx={{ width: '100%', mt: 4 }}>
      <CostDetailHeader />
      {isEmpty ? (
        <EmptyState type="emptyChart" />
      ) : (
        <Box mt={4} width="100%">
          <VirtualizedTable
            data={tableData}
            columns={columns}
            footerRowSx={{
              bgcolor: theme.palette.primary.light10,
            }}
          />
        </Box>
      )}
    </VStack>
  );
}
