import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { tierOneGroupsQueryFn, tierOneGroupsQueryKey } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { TierOneGroupsTable } from './TierOneGroupsTable/TierOneGroupsTable';

export async function TierOneGroupsHydration() {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: tierOneGroupsQueryKey,
    queryFn: async () => await tierOneGroupsQueryFn(headers),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TierOneGroupsTable />
    </HydrationBoundary>
  );
}
