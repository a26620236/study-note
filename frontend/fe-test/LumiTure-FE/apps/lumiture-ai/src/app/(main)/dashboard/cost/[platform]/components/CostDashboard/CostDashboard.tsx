'use client';

import { Box } from '@mui/material';

import { MainContentWithDrawer } from '@components/layout/Drawer';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { CostDashboardHeader } from '../CostDashboardHeader/CostDashboardHeader';
import { FilterPanelDrawer } from '../FilterPanelDrawer/FilterPanelDrawer';
import { CostDashboardPlatformTabs } from './CostDashboardPlatformTabs';

export const CostDashboard = () => {
  const { isDrawerOpen } = useCostDashboardStore((state) => state);
  return (
    <Box display="flex">
      <MainContentWithDrawer open={isDrawerOpen}>
        <CostDashboardHeader />
        <CostDashboardPlatformTabs />
      </MainContentWithDrawer>
      <FilterPanelDrawer />
    </Box>
  );
};
