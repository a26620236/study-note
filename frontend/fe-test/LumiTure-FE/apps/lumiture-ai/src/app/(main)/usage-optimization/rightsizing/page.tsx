import { Suspense } from 'react';

import { VStack } from '@lumiture-ui';

import { RightsizingHydration } from './components/Rightsizing/RightsizingHydration';
import { RightsizingSkeleton } from './components/RightsizingSkeleton/RightsizingSkeleton';
import { RightsizingTableSkeleton } from './components/RightsizingTable/RightsizingTableSkeleton';

export default function Rightsizing() {
  return (
    <Suspense
      fallback={
        <VStack>
          <RightsizingSkeleton />
          <RightsizingTableSkeleton />
        </VStack>
      }
    >
      <RightsizingHydration />
    </Suspense>
  );
}
