import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';

import {
  aiQuotaQueryFn,
  aiQuotaQueryKey,
  recommendOptionsQueryFn,
  recommendOptionsQueryKey,
  RecommendStatus,
  resourcesAssignmentStatusQueryFn,
  resourcesAssignmentStatusQueryKey,
  rightsizingOverviewQueryFn,
  rightsizingOverviewQueryKey,
  rightsizingRecommendQueryFn,
  rightsizingRecommendQueryKey,
} from '@hooks-api';
import { authOptions, getServerAuthHeaders } from '@utils';

import { Rightsizing } from './Rightsizing';

export async function RightsizingHydration() {
  const session = await getServerSession(authOptions);
  const groupId = String(session?.user.group?.groupId || '');
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await Promise.all([
    // rightsizing related API
    queryClient.prefetchQuery({
      queryKey: rightsizingOverviewQueryKey,
      queryFn: async () => await rightsizingOverviewQueryFn(headers),
    }),
    queryClient.prefetchQuery({
      queryKey: rightsizingRecommendQueryKey(RecommendStatus.Recommendations),
      queryFn: async () =>
        await rightsizingRecommendQueryFn(headers, RecommendStatus.Recommendations),
    }),
    queryClient.prefetchQuery({
      queryKey: recommendOptionsQueryKey(),
      queryFn: async () => await recommendOptionsQueryFn(headers),
    }),
    // resources assignment status API
    queryClient.prefetchQuery({
      queryKey: resourcesAssignmentStatusQueryKey(groupId),
      queryFn: async () => await resourcesAssignmentStatusQueryFn(groupId, headers),
    }),
    // AI Quota
    queryClient.prefetchQuery({
      queryKey: aiQuotaQueryKey(),
      queryFn: async () => await aiQuotaQueryFn(headers),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Rightsizing />
    </HydrationBoundary>
  );
}
