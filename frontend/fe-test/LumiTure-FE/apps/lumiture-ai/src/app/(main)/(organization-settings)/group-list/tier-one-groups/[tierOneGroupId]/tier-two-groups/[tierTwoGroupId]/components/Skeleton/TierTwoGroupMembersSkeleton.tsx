'use client';

import { Typography } from '@mui/material';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';

import { LABELS } from '../TierTwoGroupMembers/TierTwoGroupMembers';
import { TabsSkeleton } from './TabsSkeleton';

export function TierTwoGroupMembersSkeleton() {
  return (
    <>
      <TabsSkeleton tabValue="group-members" />
      <VStack gap={4} mt={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {LABELS.description}
          </Typography>
          <Button variant="contained" color="primary" startIcon={<Icon name="add" />} disabled>
            Invite User
          </Button>
        </HStack>
        <TableSkeleton rows={6} columns={6} />
      </VStack>
    </>
  );
}
