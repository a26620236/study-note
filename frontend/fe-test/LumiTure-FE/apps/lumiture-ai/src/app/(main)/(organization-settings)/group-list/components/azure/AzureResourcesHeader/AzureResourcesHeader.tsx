import { HStack } from '@lumiture-ui';

import { PlatformsValue } from '@constants';

import { ResourcesSearch } from '../../ResourcesSearch';
import { AzureAssignResources } from '../AzureAssignResources/AzureAssignResources';
import { AzureResourcesRemove } from './AzureResourcesRemove';

export function AzureResourcesHeader() {
  return (
    <HStack justifyContent="space-between">
      <ResourcesSearch platform={PlatformsValue.AZURE} />
      <HStack gap={2}>
        <AzureResourcesRemove />
        <AzureAssignResources />
      </HStack>
    </HStack>
  );
}
