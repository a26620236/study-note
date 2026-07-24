import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { tierTwoGroupsQueryFn, tierTwoGroupsQueryKey } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { TierTwoGroupsTable } from '../../components/TierTwoGroupsTable/TierTwoGroupsTable';

interface TierTwoGroupsHydrationProps {
  tierOneGroupId: string;
}

export async function TierTwoGroupsHydration({ tierOneGroupId }: TierTwoGroupsHydrationProps) {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: tierTwoGroupsQueryKey(tierOneGroupId),
    queryFn: async () => await tierTwoGroupsQueryFn(tierOneGroupId, headers),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TierTwoGroupsTable />
    </HydrationBoundary>
  );
}
