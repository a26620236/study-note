import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { analysisHistoryQueryFn, analysisHistoryQueryKey } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { AlertHistoryTable } from './AnalysisHistoryTable';

export async function AlertHistoryTableHydration() {
  const headers = await getServerAuthHeaders();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: analysisHistoryQueryKey,
    queryFn: async () => await analysisHistoryQueryFn(headers),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AlertHistoryTable />
    </HydrationBoundary>
  );
}
