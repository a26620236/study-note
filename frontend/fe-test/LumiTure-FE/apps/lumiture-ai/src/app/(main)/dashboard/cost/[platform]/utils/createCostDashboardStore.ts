import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { CrossCloudValue, PlatformsValue, type PlatformValueWithFOCUS } from '@constants';
import type { AWSFilter, AzureFilter, FOCUSFilter, GCPFilter } from '@hooks-api';

import { initializePlatformFilters, type FilterValuesQueryString } from '../utils/initializeFilter';

interface PlatformFilters {
  [PlatformsValue.GCP]: GCPFilter;
  [PlatformsValue.AWS]: AWSFilter;
  [PlatformsValue.AZURE]: AzureFilter;
  [CrossCloudValue.FOCUS]: FOCUSFilter;
}
export interface CostDashboardStore extends PlatformFilters {
  // 控制 Cost Dashboard 的 Filter Panel是否開啟
  isDrawerOpen: boolean;
  handleDrawerToggle: (isOpen: boolean) => void;

  handleSetFilter: <T extends PlatformValueWithFOCUS>(
    platform: T,
    filter: Partial<PlatformFilters[T]>
  ) => void;
  handleResetFilter: (platform: PlatformValueWithFOCUS) => void;
  // 初始化 store，從 URL 參數同步 filterValues（僅在客戶端調用）
  initializeFilters: (
    platform: PlatformValueWithFOCUS,
    filterValues?: FilterValuesQueryString
  ) => void;
}

export const createCostDashboardStore = () =>
  create<CostDashboardStore>()(
    immer((set) => ({
      isDrawerOpen: true,
      handleDrawerToggle: (isOpen: boolean) =>
        set((state) => {
          state.isDrawerOpen = isOpen;
        }),
      // 使用預設值初始化，確保 SSR 和客戶端一致，避免 hydration 錯誤
      [PlatformsValue.GCP]: initializePlatformFilters[PlatformsValue.GCP](PlatformsValue.GCP),
      [PlatformsValue.AWS]: initializePlatformFilters[PlatformsValue.AWS](PlatformsValue.AWS),
      [PlatformsValue.AZURE]: initializePlatformFilters[PlatformsValue.AZURE](PlatformsValue.AZURE),
      [CrossCloudValue.FOCUS]: initializePlatformFilters[CrossCloudValue.FOCUS](
        CrossCloudValue.FOCUS
      ),

      handleSetFilter: (platform, filter) =>
        set((state) => {
          if (platform === PlatformsValue.GCP) {
            state[PlatformsValue.GCP] = { ...state[PlatformsValue.GCP], ...filter };
          }
          if (platform === PlatformsValue.AWS) {
            state[PlatformsValue.AWS] = { ...state[PlatformsValue.AWS], ...filter };
          }
          if (platform === PlatformsValue.AZURE) {
            state[PlatformsValue.AZURE] = { ...state[PlatformsValue.AZURE], ...filter };
          }
          if (platform === CrossCloudValue.FOCUS) {
            state[CrossCloudValue.FOCUS] = { ...state[CrossCloudValue.FOCUS], ...filter };
          }
          return state;
        }),

      handleResetFilter: (platform) =>
        set((state) => {
          if (platform === PlatformsValue.GCP) {
            state[PlatformsValue.GCP] = initializePlatformFilters[PlatformsValue.GCP](
              PlatformsValue.GCP
            );
          }
          if (platform === PlatformsValue.AWS) {
            state[PlatformsValue.AWS] = initializePlatformFilters[PlatformsValue.AWS](
              PlatformsValue.AWS
            );
          }
          if (platform === PlatformsValue.AZURE) {
            state[PlatformsValue.AZURE] = initializePlatformFilters[PlatformsValue.AZURE](
              PlatformsValue.AZURE
            );
          }
          if (platform === CrossCloudValue.FOCUS) {
            state[CrossCloudValue.FOCUS] = initializePlatformFilters[CrossCloudValue.FOCUS](
              CrossCloudValue.FOCUS
            );
          }
          return state;
        }),

      initializeFilters: (platform, filterValues) =>
        set((state) => {
          state[PlatformsValue.GCP] = initializePlatformFilters[PlatformsValue.GCP](
            platform,
            filterValues
          );
          state[PlatformsValue.AWS] = initializePlatformFilters[PlatformsValue.AWS](
            platform,
            filterValues
          );
          state[PlatformsValue.AZURE] = initializePlatformFilters[PlatformsValue.AZURE](
            platform,
            filterValues
          );
          state[CrossCloudValue.FOCUS] = initializePlatformFilters[CrossCloudValue.FOCUS](
            platform,
            filterValues
          );
        }),
    }))
  );
