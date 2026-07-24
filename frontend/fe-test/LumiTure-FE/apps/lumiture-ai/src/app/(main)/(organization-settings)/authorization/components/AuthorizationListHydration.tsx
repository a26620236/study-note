import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { authorizationListQueryFn, authorizationListQueryKey } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { AuthorizationList } from './AuthorizationList';

export async function AuthorizationListHydration() {
  const queryClient = new QueryClient();
  const headers = await getServerAuthHeaders();

  await queryClient.prefetchQuery({
    queryKey: authorizationListQueryKey,
    queryFn: async () => await authorizationListQueryFn(headers),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthorizationList />
    </HydrationBoundary>
  );
}
