import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';

import {
  fiscalReportQueryFn,
  fiscalReportQueryKey,
  resourcesAssignmentStatusQueryFn,
  resourcesAssignmentStatusQueryKey,
} from '@hooks-api';
import { authOptions, getServerAuthHeaders } from '@utils';

import { getMaxSelectableDate } from '../hooks/useExecutiveInsightsStore';
import { ExecutiveInsights } from './ExecutiveInsights';

export async function ExecutiveInsightsHydration() {
  const session = await getServerSession(authOptions);
  const groupId = String(session?.user.group?.groupId ?? '');

  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  const initialDate = getMaxSelectableDate();
  const params = {
    year: initialDate.getFullYear().toString(),
    month: (initialDate.getMonth() + 1).toString(),
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: fiscalReportQueryKey(params),
      queryFn: async () => await fiscalReportQueryFn(headers, params),
    }),
    queryClient.prefetchQuery({
      queryKey: resourcesAssignmentStatusQueryKey(groupId),
      queryFn: async () => await resourcesAssignmentStatusQueryFn(groupId, headers),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExecutiveInsights />
    </HydrationBoundary>
  );
}
