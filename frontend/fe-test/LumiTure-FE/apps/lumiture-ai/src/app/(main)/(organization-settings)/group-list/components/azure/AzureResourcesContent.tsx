import { VStack } from '@lumiture-ui';

import { AzureResourcesHeader } from './AzureResourcesHeader/AzureResourcesHeader';
import { AzureResourcesTable } from './AzureResourcesTable';

export function AzureResourcesContent() {
  return (
    <VStack gap={4}>
      <AzureResourcesHeader />
      <AzureResourcesTable />
    </VStack>
  );
}
