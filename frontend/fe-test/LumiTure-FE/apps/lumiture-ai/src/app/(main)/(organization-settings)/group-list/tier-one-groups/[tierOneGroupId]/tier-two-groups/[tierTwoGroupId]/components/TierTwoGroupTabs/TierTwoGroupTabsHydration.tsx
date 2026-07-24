import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { gcpAssignedResourcesQueryFn, gcpAssignedResourcesQueryKey } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { TierTwoGroupTabs } from './TierTwoGroupTabs';

interface TierTwoGroupTabsHydrationProps {
  tierTwoGroupId: string;
}

export async function TierTwoGroupTabsHydration({
  tierTwoGroupId,
}: TierTwoGroupTabsHydrationProps) {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: gcpAssignedResourcesQueryKey(tierTwoGroupId),
      queryFn: async () => await gcpAssignedResourcesQueryFn(tierTwoGroupId, headers),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TierTwoGroupTabs />
    </HydrationBoundary>
  );
}
