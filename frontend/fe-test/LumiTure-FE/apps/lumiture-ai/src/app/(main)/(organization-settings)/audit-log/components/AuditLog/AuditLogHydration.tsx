import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import {
  loginActivityFiltersQueryFn,
  loginActivityFiltersQueryKey,
  loginActivityListQueryFn,
  loginActivityListQueryKey,
} from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { getDefaultLoginActivityPayload } from '../../hooks/useLoginActivityStore';
import { AuditLog } from './AuditLog';

export async function AuditLogHydration() {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();
  const defaultPayload = getDefaultLoginActivityPayload();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: loginActivityFiltersQueryKey(),
      queryFn: async () => await loginActivityFiltersQueryFn(headers),
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: loginActivityListQueryKey(defaultPayload),
      queryFn: async ({ pageParam }) =>
        await loginActivityListQueryFn(headers, { ...defaultPayload, page: pageParam }),
      initialPageParam: 1,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuditLog />
    </HydrationBoundary>
  );
}
