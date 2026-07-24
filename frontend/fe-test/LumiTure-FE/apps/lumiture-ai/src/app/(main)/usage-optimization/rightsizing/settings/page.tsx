import { Suspense } from 'react';

import { Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';

import GoBack from '@components/GoBack';
import { OPTIMIZATION_PATHS } from '@constants';

import { RightsizingSettingsHydration } from './components/RightsizingSettingsHydration';
import { RightsizingSettingsSkeleton } from './components/RightsizingSettingsSkeleton';

const LABELS = {
  goBackContent: 'Rightsizing',
  title: 'Scope Settings',
};

interface RightsizingSettingsPageProps {
  searchParams: Promise<{
    scopeId?: string;
  }>;
}

export default async function RightsizingSettingsPage({
  searchParams,
}: RightsizingSettingsPageProps) {
  const { scopeId } = await searchParams;

  return (
    <VStack>
      <GoBack
        content={LABELS.goBackContent}
        url={OPTIMIZATION_PATHS.usageOptimization.pathname}
        sx={{ justifyContent: 'flex-start', width: 'fit-content' }}
      />
      <Typography variant="h4" sx={{ mt: 5, mb: 8 }}>
        {LABELS.title}
      </Typography>

      <Suspense fallback={<RightsizingSettingsSkeleton />}>
        <RightsizingSettingsHydration scopeId={scopeId} />
      </Suspense>
    </VStack>
  );
}
