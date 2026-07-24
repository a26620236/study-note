import { Suspense } from 'react';

import { VStack } from '@lumiture-ui';

import { LumiTagHydration } from './components/LumiTag/LumiTagHydration';
import { LumiTagSkeleton } from './components/LumiTagSkeleton/LumiTagSkeleton';
import { LumiTagTableSkeleton } from './components/LumiTagTable/LumiTagTableSkeleton';

export default function LumiTagPage() {
  return (
    <Suspense
      fallback={
        <VStack>
          <LumiTagSkeleton />
          <LumiTagTableSkeleton />
        </VStack>
      }
    >
      <LumiTagHydration />
    </Suspense>
  );
}
