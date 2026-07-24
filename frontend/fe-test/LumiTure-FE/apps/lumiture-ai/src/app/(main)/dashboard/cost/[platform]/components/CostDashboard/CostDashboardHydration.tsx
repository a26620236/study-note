import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';

import { CrossCloudValue, PlatformsValue, type PlatformValueWithFOCUS } from '@constants';
import {
  aiQuotaQueryFn,
  aiQuotaQueryKey,
  awsAssignedResourcesQueryFn,
  awsAssignedResourcesQueryKey,
  azureAssignedResourcesQueryFn,
  azureAssignedResourcesQueryKey,
  costTrendQueryFn,
  costTrendQueryKey,
  focusFilterOptionsQueryFn,
  focusFilterOptionsQueryKey,
  gcpAssignedResourcesQueryFn,
  gcpAssignedResourcesQueryKey,
  platformFilterOptionsQueryFn,
  platformFilterOptionsQueryKey,
} from '@hooks-api';
import { authOptions, getServerAuthHeaders } from '@utils';

import {
  initializePlatformFilters,
  type FilterValuesQueryString,
} from '../../utils/initializeFilter';
import { CostDashboard } from './CostDashboard';
import { CostDashboardProvider } from './CostDashboardProvider';

interface CostDashboardProviderProps {
  platform: PlatformValueWithFOCUS;
  filterValues?: FilterValuesQueryString;
}

export async function CostDashboardHydration({
  platform,
  filterValues,
}: CostDashboardProviderProps) {
  const queryClient = new QueryClient();
  const headers = await getServerAuthHeaders();
  const session = await getServerSession(authOptions);

  const groupId = String(session?.user.group?.groupId ?? '');

  // 使用與 store 初始化相同的邏輯來獲取日期，確保 queryKey 一致
  const filter = initializePlatformFilters[platform](platform, filterValues);
  const { startDate, endDate } = filter;
  const dateRange = { start_date: startDate, end_date: endDate };

  const resourcePrefetchMap: Record<PlatformValueWithFOCUS, () => Promise<void>> = {
    [PlatformsValue.GCP]: async () =>
      await queryClient.prefetchQuery({
        queryKey: gcpAssignedResourcesQueryKey(groupId),
        queryFn: async () => await gcpAssignedResourcesQueryFn(groupId, headers),
      }),
    [PlatformsValue.AWS]: async () =>
      await queryClient.prefetchQuery({
        queryKey: awsAssignedResourcesQueryKey(groupId),
        queryFn: async () => await awsAssignedResourcesQueryFn(groupId, headers),
      }),
    [PlatformsValue.AZURE]: async () =>
      await queryClient.prefetchQuery({
        queryKey: azureAssignedResourcesQueryKey(groupId),
        queryFn: async () => await azureAssignedResourcesQueryFn(groupId, headers),
      }),
    [CrossCloudValue.FOCUS]: async () => await Promise.resolve(),
  };

  const filterOptionsPrefetchMap: Record<PlatformValueWithFOCUS, () => Promise<void>> = {
    [PlatformsValue.GCP]: async () =>
      await queryClient.prefetchQuery({
        queryKey: platformFilterOptionsQueryKey(PlatformsValue.GCP, dateRange),
        queryFn: async () =>
          await platformFilterOptionsQueryFn(PlatformsValue.GCP, dateRange, headers),
      }),
    [PlatformsValue.AWS]: async () =>
      await queryClient.prefetchQuery({
        queryKey: platformFilterOptionsQueryKey(PlatformsValue.AWS, dateRange),
        queryFn: async () =>
          await platformFilterOptionsQueryFn(PlatformsValue.AWS, dateRange, headers),
      }),
    [PlatformsValue.AZURE]: async () =>
      await queryClient.prefetchQuery({
        queryKey: platformFilterOptionsQueryKey(PlatformsValue.AZURE, dateRange),
        queryFn: async () =>
          await platformFilterOptionsQueryFn(PlatformsValue.AZURE, dateRange, headers),
      }),
    [CrossCloudValue.FOCUS]: async () =>
      await queryClient.prefetchQuery({
        queryKey: focusFilterOptionsQueryKey(CrossCloudValue.FOCUS, dateRange),
        queryFn: async () =>
          await focusFilterOptionsQueryFn(CrossCloudValue.FOCUS, dateRange, headers),
      }),
  };

  await Promise.all([
    resourcePrefetchMap[platform](),
    queryClient.prefetchQuery({
      queryKey: costTrendQueryKey(filter),
      queryFn: async () => await costTrendQueryFn(filter, headers),
    }),
    filterOptionsPrefetchMap[platform](),
    queryClient.prefetchQuery({
      queryKey: aiQuotaQueryKey(),
      queryFn: async () => await aiQuotaQueryFn(headers),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CostDashboardProvider>
        <CostDashboard />
      </CostDashboardProvider>
    </HydrationBoundary>
  );
}
