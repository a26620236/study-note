import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { PlatformsValue } from '@constants';
import { awsExternalIdQueryFn, awsExternalIdQueryKey } from '@hooks-api';
import { getServerAuthHeaders } from '@utils';

import { AWSBillingIntegration } from './aws/AWSBillingIntegration';
import { AzureBillingIntegration } from './azure/AzureBillingIntegration';
import { GCPBillingIntegration } from './gcp/GCPBillingIntegration';

interface BillingIntegrationHydrationProps {
  platform: PlatformsValue;
}

export async function BillingIntegrationHydration({ platform }: BillingIntegrationHydrationProps) {
  const queryClient = new QueryClient();
  const headers = await getServerAuthHeaders();

  if (platform === PlatformsValue.AWS) {
    await queryClient.prefetchQuery({
      queryKey: awsExternalIdQueryKey,
      queryFn: async () => await awsExternalIdQueryFn(headers),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {platform === PlatformsValue.AWS && <AWSBillingIntegration />}
      {platform === PlatformsValue.AZURE && <AzureBillingIntegration />}
      {platform === PlatformsValue.GCP && <GCPBillingIntegration />}
    </HydrationBoundary>
  );
}
