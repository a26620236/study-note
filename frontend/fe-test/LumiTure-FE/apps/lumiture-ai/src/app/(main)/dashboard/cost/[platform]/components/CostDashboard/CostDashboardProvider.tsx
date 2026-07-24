'use client';

import { createContext, useRef, type PropsWithChildren } from 'react';

import type { StoreApi } from 'zustand';

import {
  createCostDashboardStore,
  type CostDashboardStore,
} from '../../utils/createCostDashboardStore';

export const CostDashboardContext = createContext<StoreApi<CostDashboardStore> | null>(null);

export const CostDashboardProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<StoreApi<CostDashboardStore>>(null);

  storeRef.current ??= createCostDashboardStore();

  return (
    <CostDashboardContext.Provider value={storeRef.current}>
      {children}
    </CostDashboardContext.Provider>
  );
};
