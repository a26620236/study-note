import { Suspense } from 'react';

import { Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';

import { AnomalyProvider } from './components/AnomalyProvider';
import { AnomalySkeleton } from './components/AnomalySkeleton';

const LABELS = {
  title: 'Anomaly Detection',
  description:
    'Displaying resources with detected anomalies in the last 30 days within your group (organization) based on the alert settings configured by admins.',
};

export default function AnomalyPage() {
  return (
    <VStack>
      <VStack gap={1} sx={{ mb: 5 }}>
        <Typography variant="h4">{LABELS.title}</Typography>
        <Typography variant="body1" color="text.secondary">
          {LABELS.description}
        </Typography>
      </VStack>

      <Suspense fallback={<AnomalySkeleton />}>
        <AnomalyProvider />
      </Suspense>
    </VStack>
  );
}
