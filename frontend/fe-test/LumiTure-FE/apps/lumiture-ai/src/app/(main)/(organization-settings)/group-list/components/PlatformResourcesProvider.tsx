'use client';

import { createContext, useRef, type ReactNode } from 'react';

import type { StoreApi } from 'zustand';

import {
  createPlatformResourcesStore,
  type PlatformResourcesStore,
} from '../utils/createPlatformResourcesStore';

export const PlatformResourcesContext = createContext<StoreApi<PlatformResourcesStore> | null>(
  null
);

interface PlatformResourcesProviderProps {
  children: ReactNode;
}

export const PlatformResourcesProvider = ({ children }: PlatformResourcesProviderProps) => {
  const storeRef = useRef<StoreApi<PlatformResourcesStore>>(null);

  storeRef.current ??= createPlatformResourcesStore();

  return (
    <PlatformResourcesContext.Provider value={storeRef.current}>
      {children}
    </PlatformResourcesContext.Provider>
  );
};
