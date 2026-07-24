import { Suspense } from 'react';

import { VStack } from '@lumiture-ui';

import GoBack from '@components/GoBack';
import { DASHBOARD_PATHS } from '@constants';

import { FiscalMetricsFieldsSkeleton } from './components/FiscalMetricsFieldsSkeleton';
import { FiscalMetricsSettingsHydration } from './components/FiscalMetricsSettingsHydration';

const LABELS = {
  goBackContent: 'Executive Insights',
};

interface FiscalMetricsSettingsPageProps {
  searchParams: Promise<{
    year?: string;
  }>;
}

export default async function FiscalMetricsSettingsPage({
  searchParams,
}: FiscalMetricsSettingsPageProps) {
  const { year } = await searchParams;

  return (
    <VStack sx={{ alignItems: 'flex-start', width: '100%' }}>
      <GoBack
        content={LABELS.goBackContent}
        url={DASHBOARD_PATHS.executiveInsights.pathname}
        sx={{ height: 'fit-content', mb: 5 }}
      />

      <Suspense fallback={<FiscalMetricsFieldsSkeleton />}>
        <FiscalMetricsSettingsHydration year={year} />
      </Suspense>
    </VStack>
  );
}
