import { HStack } from '@lumiture-ui';

import { PlatformsValue } from '@constants';

import { ResourcesSearch } from '../../ResourcesSearch';
import { AWSAssignResources } from '../AWSAssignResources/AWSAssignResources';
import { AWSResourcesRemove } from './AWSResourcesRemove';

export function AWSResourcesHeader() {
  return (
    <HStack justifyContent="space-between">
      <ResourcesSearch platform={PlatformsValue.AWS} />
      <HStack gap={2}>
        <AWSResourcesRemove />
        <AWSAssignResources />
      </HStack>
    </HStack>
  );
}
