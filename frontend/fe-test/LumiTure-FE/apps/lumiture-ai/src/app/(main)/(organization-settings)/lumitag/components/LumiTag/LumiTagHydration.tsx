import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getLumiTagListQueryKey, lumiTagListQueryFn } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { LumiTag } from './LumiTag';

export async function LumiTagHydration() {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: getLumiTagListQueryKey(),
    queryFn: async () => await lumiTagListQueryFn(headers),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LumiTag />
    </HydrationBoundary>
  );
}
