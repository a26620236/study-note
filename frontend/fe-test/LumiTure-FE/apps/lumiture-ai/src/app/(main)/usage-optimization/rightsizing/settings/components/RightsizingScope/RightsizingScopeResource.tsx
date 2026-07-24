import { HStack } from '@lumiture-ui';

import { useGetRightsizingAvailableResources } from '@hooks-api';

import { AWSScopeResource } from './AWSScopeResource';
import { AzureScopeResource } from './AzureScopeResource';
import { GCPScopeResource } from './GCPScopeResource';
import { PlatformResourceSkeleton } from './PlatformResourceSkeleton';

interface RightsizingScopeResourceProps {
  selectedGroupIds: string[];
  scopeId: string;
}

export function RightsizingScopeResource({
  scopeId,
  selectedGroupIds,
}: RightsizingScopeResourceProps) {
  const { isLoading } = useGetRightsizingAvailableResources(scopeId, selectedGroupIds);

  if (isLoading) return <PlatformResourceSkeleton />;

  return (
    <HStack gap={4}>
      <GCPScopeResource scopeId={scopeId} selectedGroupIds={selectedGroupIds} />
      <AWSScopeResource scopeId={scopeId} selectedGroupIds={selectedGroupIds} />
      <AzureScopeResource scopeId={scopeId} selectedGroupIds={selectedGroupIds} />
    </HStack>
  );
}
