import { VStack } from '@lumiture-ui';

import { AWSResourcesHeader } from './AWSResourcesHeader/AWSResourcesHeader';
import { AWSResourcesTable } from './AWSResourcesTable';

export function AWSResourcesContent() {
  return (
    <VStack gap={4}>
      <AWSResourcesHeader />
      <AWSResourcesTable />
    </VStack>
  );
}
