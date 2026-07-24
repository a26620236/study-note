'use client';

import { Box } from '@mui/material';

import { MainContentWithDrawer } from '@components/layout/Drawer';

import { CostDashboardHeaderSkeleton } from '../CostDashboardHeader/CostDashboardHeaderSkeleton';
import { FilterPanelDrawerSkeleton } from '../FilterPanelDrawer/FilterPanelDrawerSkeleton';
import { CostDashboardPlatformTabsSkeleton } from './CostDashboardPlatformTabsSkeleton';

export function CostDashboardSkeleton() {
  return (
    <Box display="flex">
      <MainContentWithDrawer open={true}>
        <CostDashboardHeaderSkeleton />
        <CostDashboardPlatformTabsSkeleton />
      </MainContentWithDrawer>
      <FilterPanelDrawerSkeleton />
    </Box>
  );
}
