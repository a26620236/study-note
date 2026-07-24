'use client';

import { Typography } from '@mui/material';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';

import { LABELS } from '../TierTwoGroupsTable/TierTwoGroupsTable';
import { TabsSkeleton } from './TabsSkeleton';

interface TierTwoGroupsTableSkeletonProps {
  hasTabs?: boolean;
}

export function TierTwoGroupsTableSkeleton({ hasTabs = true }: TierTwoGroupsTableSkeletonProps) {
  return (
    <>
      {hasTabs && <TabsSkeleton tabValue="tier-2-groups" />}
      <VStack gap={4} mt={4}>
        <HStack justifyContent="space-between">
          <VStack gap={2} justifyContent="center">
            {!hasTabs && <Typography variant="h6">Tier 2 Group List (0)</Typography>}
            <Typography variant="caption" color="text.secondary">
              {LABELS.description}
            </Typography>
          </VStack>
          <HStack alignItems="flex-end">
            <Button variant="contained" color="primary" startIcon={<Icon name="add" />} disabled>
              create group
            </Button>
          </HStack>
        </HStack>
        <TableSkeleton rows={6} columns={6} />
      </VStack>
    </>
  );
}
