import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { sidebarQueryFn, sidebarQueryKey } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { MainSidebar } from './MainSidebar';

export async function MainSidebarHydration() {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: sidebarQueryKey,
    queryFn: async () => await sidebarQueryFn(headers),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainSidebar />
    </HydrationBoundary>
  );
}
