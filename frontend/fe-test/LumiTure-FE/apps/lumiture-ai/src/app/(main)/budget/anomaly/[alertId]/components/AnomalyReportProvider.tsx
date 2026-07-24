import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { anomalyDetectionDetailQueryFn, anomalyDetectionDetailQueryKey } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { AnomalyReport } from './AnomalyReport';

interface AnomalyReportProviderProps {
  alertId: string;
}

export async function AnomalyReportProvider({ alertId }: AnomalyReportProviderProps) {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: anomalyDetectionDetailQueryKey(alertId),
      queryFn: async () => await anomalyDetectionDetailQueryFn(alertId, headers),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnomalyReport />
    </HydrationBoundary>
  );
}
