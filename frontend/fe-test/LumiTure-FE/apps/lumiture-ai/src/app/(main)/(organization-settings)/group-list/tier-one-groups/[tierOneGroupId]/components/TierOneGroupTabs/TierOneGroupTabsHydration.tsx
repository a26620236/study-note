import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import {
  awsAssignedResourcesQueryFn,
  awsAssignedResourcesQueryKey,
  azureAssignedResourcesQueryFn,
  azureAssignedResourcesQueryKey,
  gcpAssignedResourcesQueryFn,
  gcpAssignedResourcesQueryKey,
  tierTwoGroupsQueryFn,
  tierTwoGroupsQueryKey,
} from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { TierOneGroupTabs } from './TierOneGroupTabs';

interface TierOneGroupTabsHydrationProps {
  tierOneGroupId: string;
}

export async function TierOneGroupTabsHydration({
  tierOneGroupId,
}: TierOneGroupTabsHydrationProps) {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: gcpAssignedResourcesQueryKey(tierOneGroupId),
      queryFn: async () => await gcpAssignedResourcesQueryFn(tierOneGroupId, headers),
    }),
    queryClient.prefetchQuery({
      queryKey: awsAssignedResourcesQueryKey(tierOneGroupId),
      queryFn: async () => await awsAssignedResourcesQueryFn(tierOneGroupId, headers),
    }),
    queryClient.prefetchQuery({
      queryKey: azureAssignedResourcesQueryKey(tierOneGroupId),
      queryFn: async () => await azureAssignedResourcesQueryFn(tierOneGroupId, headers),
    }),
    queryClient.prefetchQuery({
      queryKey: tierTwoGroupsQueryKey(tierOneGroupId),
      queryFn: async () => await tierTwoGroupsQueryFn(tierOneGroupId, headers),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TierOneGroupTabs />
    </HydrationBoundary>
  );
}
