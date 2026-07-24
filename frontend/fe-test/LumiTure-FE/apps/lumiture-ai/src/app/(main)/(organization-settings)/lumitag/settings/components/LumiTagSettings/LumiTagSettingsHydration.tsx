import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import {
  getLumiTagFieldValuesQueryKey,
  getLumiTagListQueryKey,
  getLumiTagQueryKey,
  lumiTagFieldValuesQueryFn,
  lumiTagListQueryFn,
  lumiTagQueryFn,
} from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { LumiTagSettings } from './LumiTagSettings';

interface LumiTagSettingsHydrationProps {
  tagId?: string;
}

export async function LumiTagSettingsHydration({ tagId }: LumiTagSettingsHydrationProps) {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  const prefetches: Promise<void>[] = [
    queryClient.prefetchQuery({
      queryKey: getLumiTagFieldValuesQueryKey(),
      queryFn: async () => await lumiTagFieldValuesQueryFn(headers),
    }),
    queryClient.prefetchQuery({
      queryKey: getLumiTagListQueryKey(),
      queryFn: async () => await lumiTagListQueryFn(headers),
    }),
  ];

  if (tagId) {
    prefetches.push(
      queryClient.prefetchQuery({
        queryKey: getLumiTagQueryKey(tagId),
        queryFn: async () => await lumiTagQueryFn(headers, tagId),
      })
    );
  }

  await Promise.all(prefetches);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LumiTagSettings />
    </HydrationBoundary>
  );
}
