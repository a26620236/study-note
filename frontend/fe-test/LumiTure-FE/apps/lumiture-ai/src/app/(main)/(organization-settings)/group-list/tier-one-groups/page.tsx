import { Suspense } from 'react';

import { InstructionButton, InstructionName } from '@features';
import { Paper, Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';

import { TierOneGroupsHydration } from './components/TierOneGroupsHydration';
import { TierOneGroupsTableSkeleton } from './components/TierOneGroupsTableSkeleton';

export default function TierOneGroups() {
  return (
    <Paper sx={{ marginBottom: 8 }} data-testid="group-list-tier-one-groups">
      <VStack gap={8}>
        <Typography variant="h3">CloudMile</Typography>
        <Suspense fallback={<TierOneGroupsTableSkeleton />}>
          <TierOneGroupsHydration />
        </Suspense>
        <VStack gap={2}>
          <InstructionButton name={InstructionName.OrgAndRole} />
          <InstructionButton name={InstructionName.AuthAndResourceAssignment} />
        </VStack>
      </VStack>
    </Paper>
  );
}
