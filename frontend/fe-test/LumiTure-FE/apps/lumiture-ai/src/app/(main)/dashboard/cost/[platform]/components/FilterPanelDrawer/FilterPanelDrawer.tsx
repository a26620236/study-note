'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

import { Drawer } from '@mui/material';

import {
  CrossCloudValue,
  DRAWER_WIDTH,
  MAIN_HEADER_HEIGHT,
  type PlatformValueWithFOCUS,
} from '@constants';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { getFilterFormCostDashboard } from '../../utils/getFilterFormCostDashboard';
import { FilterPanel } from '../FilterPanel/FilterPanel';
import { FOCUSFilterPanel } from '../FOCUSFilterPanel/FOCUSFilterPanel';

export function FilterPanelDrawer() {
  const { platform } = useParams<{ platform: PlatformValueWithFOCUS }>();
  const { isDrawerOpen, initializeFilters } = useCostDashboardStore((state) => state);
  const isFOCUS = platform === CrossCloudValue.FOCUS;

  // 在客戶端 hydration 後初始化 store，從 URL 參數同步 filterValues
  useEffect(() => {
    const filterValues = getFilterFormCostDashboard();
    if (filterValues) {
      initializeFilters(platform, filterValues);
    }
  }, [platform, initializeFilters]);

  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: 0,
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          marginTop: `${MAIN_HEADER_HEIGHT}px`,
        },
      }}
      variant="persistent"
      anchor="right"
      open={isDrawerOpen}
    >
      {isFOCUS ? <FOCUSFilterPanel /> : <FilterPanel />}
    </Drawer>
  );
}
