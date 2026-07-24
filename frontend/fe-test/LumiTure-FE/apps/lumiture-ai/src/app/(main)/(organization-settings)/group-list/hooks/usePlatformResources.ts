'use client';

import { useContext } from 'react';

import { useStore } from 'zustand';

import { PlatformResourcesContext } from '../components/PlatformResourcesProvider';
import type { PlatformResourcesStore } from '../utils/createPlatformResourcesStore';

export const usePlatformResources = <T>(selector: (state: PlatformResourcesStore) => T): T => {
  const store = useContext(PlatformResourcesContext);

  if (!store) {
    throw new Error('usePlatformResources must be used within PlatformResourcesProvider');
  }

  return useStore(store, selector);
};
