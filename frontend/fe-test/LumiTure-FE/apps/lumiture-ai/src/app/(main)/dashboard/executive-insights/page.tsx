import { Suspense } from 'react';

import { ExecutiveInsightsHydration } from './components/ExecutiveInsightsHydration';
import { ExecutiveInsightsSkeleton } from './components/ExecutiveInsightsSkeleton/ExecutiveInsightsSkeleton';

export default function ExecutiveInsightsPage() {
  return (
    <Suspense fallback={<ExecutiveInsightsSkeleton />}>
      <ExecutiveInsightsHydration />
    </Suspense>
  );
}
