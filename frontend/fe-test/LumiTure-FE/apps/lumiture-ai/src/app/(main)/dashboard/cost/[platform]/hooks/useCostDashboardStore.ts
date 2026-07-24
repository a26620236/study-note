'use client';

import { useContext } from 'react';

import { useStore } from 'zustand';

import { CostDashboardContext } from '../components/CostDashboard/CostDashboardProvider';
import type { CostDashboardStore } from '../utils/createCostDashboardStore';

export const useCostDashboardStore = <T>(selector: (state: CostDashboardStore) => T): T => {
  const store = useContext(CostDashboardContext);

  if (!store) {
    throw new Error('useCostDashboardStore must be used within CostDashboardProvider');
  }

  return useStore(store, selector);
};
