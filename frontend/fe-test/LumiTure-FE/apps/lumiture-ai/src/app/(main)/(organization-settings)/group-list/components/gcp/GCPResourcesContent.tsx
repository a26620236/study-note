import { VStack } from '@lumiture-ui';

import { GCPResourcesHeader } from './GCPResourcesHeader/GCPResourcesHeader';
import { GCPResourcesTable } from './GCPResourcesTable';

export function GCPResourcesContent() {
  return (
    <VStack gap={4}>
      <GCPResourcesHeader />
      <GCPResourcesTable />
    </VStack>
  );
}
