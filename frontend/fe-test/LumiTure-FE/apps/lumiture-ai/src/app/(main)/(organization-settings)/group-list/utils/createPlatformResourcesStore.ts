import type { RowSelectionState } from '@tanstack/react-table';
import { createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { PlatformsValue } from '@constants';

export interface GCPResourcesState {
  searchText: string;
  resourcesRowSelection: RowSelectionState;
}

export interface AWSResourcesState {
  searchText: string;
  resourcesRowSelection: RowSelectionState;
}

export interface AzureResourcesState {
  searchText: string;
  resourcesRowSelection: RowSelectionState;
}

interface PlatformResourcesState {
  gcp: GCPResourcesState;
  aws: AWSResourcesState;
  azure: AzureResourcesState;
}

interface PlatformResourcesActions {
  setSearchText: (platform: PlatformsValue, searchText: string) => void;
  setResourcesRowSelection: (platform: PlatformsValue, rowSelection: RowSelectionState) => void;
}

export type PlatformResourcesStore = PlatformResourcesState & PlatformResourcesActions;

export const createPlatformResourcesStore = () =>
  createStore<PlatformResourcesStore>()(
    immer((set) => ({
      gcp: {
        searchText: '',
        resourcesRowSelection: {},
      },
      aws: {
        searchText: '',
        resourcesRowSelection: {},
      },
      azure: {
        searchText: '',
        resourcesRowSelection: {},
      },

      setSearchText: (platform, searchText) =>
        set((state) => {
          state[platform].searchText = searchText;
        }),
      setResourcesRowSelection: (platform, rowSelection) =>
        set((state) => {
          state[platform].resourcesRowSelection = rowSelection;
        }),
    }))
  );
