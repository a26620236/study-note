import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';

import {
  anomalyDetectionListQueryFn,
  anomalyDetectionListQueryKey,
  anomalyDetectionSettingsQueryFn,
  anomalyDetectionSettingsQueryKey,
  resourcesAssignmentStatusQueryFn,
  resourcesAssignmentStatusQueryKey,
} from '@hooks-api';
import { authOptions, getServerAuthHeaders } from '@utils';

import { Anomaly } from './Anomaly';

export async function AnomalyProvider() {
  const session = await getServerSession(authOptions);
  const groupId = String(session?.user.group?.groupId ?? '');

  const headers = await getServerAuthHeaders();
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: anomalyDetectionListQueryKey(),
      queryFn: async () => await anomalyDetectionListQueryFn(headers),
    }),
    queryClient.prefetchQuery({
      queryKey: anomalyDetectionSettingsQueryKey(),
      queryFn: async () => await anomalyDetectionSettingsQueryFn(headers),
    }),
    queryClient.prefetchQuery({
      queryKey: resourcesAssignmentStatusQueryKey(groupId),
      queryFn: async () => await resourcesAssignmentStatusQueryFn(groupId, headers),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Anomaly />
    </HydrationBoundary>
  );
}
