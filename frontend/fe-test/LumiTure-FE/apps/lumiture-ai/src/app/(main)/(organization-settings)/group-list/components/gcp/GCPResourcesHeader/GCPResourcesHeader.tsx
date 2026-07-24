import { HStack } from '@lumiture-ui';

import { PlatformsValue } from '@constants';

import { ResourcesSearch } from '../../ResourcesSearch';
import { GCPAssignResources } from '../GCPAssignResources/GCPAssignResources';
import { GCPResourcesRemove } from './GCPResourcesRemove';

export function GCPResourcesHeader() {
  return (
    <HStack justifyContent="space-between">
      <ResourcesSearch platform={PlatformsValue.GCP} />
      <HStack gap={2}>
        <GCPResourcesRemove />
        <GCPAssignResources />
      </HStack>
    </HStack>
  );
}
