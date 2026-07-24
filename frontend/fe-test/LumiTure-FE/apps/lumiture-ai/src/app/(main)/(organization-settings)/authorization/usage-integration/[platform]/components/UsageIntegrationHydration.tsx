import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { PlatformsValue } from '@constants';
import {
  authorizationListQueryFn,
  authorizationListQueryKey,
  awsExternalIdQueryFn,
  awsExternalIdQueryKey,
} from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { AWSUsageIntegration } from './AWSUsageIntegration/AWSUsageIntegration';
import { AzureUsageIntegration } from './AzureUsageIntegration/AzureUsageIntegration';
import { GCPUsageIntegration } from './GCPUsageIntegration/GCPUsageIntegration';

interface UsageIntegrationHydrationProps {
  platform: PlatformsValue;
}

export async function UsageIntegrationHydration({ platform }: UsageIntegrationHydrationProps) {
  const queryClient = new QueryClient();
  const headers = await getServerAuthHeaders();

  const prefetchMap: Record<PlatformsValue, () => Promise<void>> = {
    [PlatformsValue.AWS]: async () =>
      await queryClient.prefetchQuery({
        queryKey: awsExternalIdQueryKey,
        queryFn: async () => await awsExternalIdQueryFn(headers),
      }),
    [PlatformsValue.AZURE]: async () =>
      await queryClient.prefetchQuery({
        queryKey: authorizationListQueryKey,
        queryFn: async () => await authorizationListQueryFn(headers),
      }),
    [PlatformsValue.GCP]: async () => await Promise.resolve(),
  };

  await prefetchMap[platform]();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {platform === PlatformsValue.AWS && <AWSUsageIntegration />}
      {platform === PlatformsValue.AZURE && <AzureUsageIntegration />}
      {platform === PlatformsValue.GCP && <GCPUsageIntegration />}
    </HydrationBoundary>
  );
}
