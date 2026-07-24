import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { fiscalMetricsSettingsQueryFn, fiscalMetricsSettingsQueryKey } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { FiscalMetricsSettings } from './FiscalMetricsSettings';

export async function FiscalMetricsSettingsHydration({ year }: { year?: string }) {
  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: fiscalMetricsSettingsQueryKey(year),
    queryFn: async () => await fiscalMetricsSettingsQueryFn(headers, year),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FiscalMetricsSettings />
    </HydrationBoundary>
  );
}
