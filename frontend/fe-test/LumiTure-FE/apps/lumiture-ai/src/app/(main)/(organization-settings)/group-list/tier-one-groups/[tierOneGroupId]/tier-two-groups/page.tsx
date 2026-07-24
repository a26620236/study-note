import { Suspense } from 'react';

import { InstructionButton, InstructionName } from '@features';
import { Paper, Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';

import { TierTwoGroupsTableSkeleton } from '../components/Skeleton/TierTwoGroupsTableSkeleton';
import { TierTwoGroupsHydration } from './components/TierTwoGroupsHydration';

interface PageProps {
  params: Promise<{ tierOneGroupId: string }>;
}

export default async function TierTwoGroups({ params }: PageProps) {
  const { tierOneGroupId } = await params;

  return (
    <Paper data-testid="tier-two-groups-page">
      <Typography variant="h3">CloudMile</Typography>
      <Suspense fallback={<TierTwoGroupsTableSkeleton hasTabs={false} />}>
        <TierTwoGroupsHydration tierOneGroupId={tierOneGroupId} />
      </Suspense>
      <VStack gap={2} mt={8}>
        <InstructionButton name={InstructionName.OrgAndRole} />
        <InstructionButton name={InstructionName.AuthAndResourceAssignment} />
      </VStack>
    </Paper>
  );
}
