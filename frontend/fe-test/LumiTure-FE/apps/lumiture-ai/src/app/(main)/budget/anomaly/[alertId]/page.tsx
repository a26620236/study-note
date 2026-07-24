import { Suspense } from 'react';

import { VStack } from '@lumiture-ui';

import GoBack from '@components/GoBack';
import { BUDGET_PATHS } from '@constants';

import { AnomalyReportProvider } from './components/AnomalyReportProvider';
import { AnomalyReportSkeleton } from './components/AnomalyReportSkeleton';

const GO_BACK_BUTTON_STYLE = {
  alignSelf: 'flex-start',
  '&.MuiButton-root': {
    height: 'auto',
  },
};

const LABELS = {
  goBackButtonLabel: 'Anomaly Alert List',
};

interface AnomalyReportPageProps {
  params: Promise<{ alertId: string }>;
}

export default async function AnomalyReportPage({ params }: AnomalyReportPageProps) {
  const { alertId } = await params;

  return (
    <VStack gap={5}>
      <GoBack
        url={BUDGET_PATHS.anomalyDetection.pathname}
        content={LABELS.goBackButtonLabel}
        sx={GO_BACK_BUTTON_STYLE}
      />

      <Suspense fallback={<AnomalyReportSkeleton />}>
        <AnomalyReportProvider alertId={alertId} />
      </Suspense>
    </VStack>
  );
}
