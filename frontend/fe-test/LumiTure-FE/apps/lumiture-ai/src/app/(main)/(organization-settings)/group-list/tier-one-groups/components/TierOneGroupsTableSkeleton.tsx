'use client';

import { Typography } from '@mui/material';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';

import { LABELS } from './TierOneGroupsTable/TierOneGroupsTable';

export function TierOneGroupsTableSkeleton() {
  return (
    <VStack gap={8}>
      <HStack justifyContent="space-between" alignItems="flex-end">
        <VStack gap={2}>
          <Typography variant="h6">Tier 1 Group List (0)</Typography>
          <Typography variant="caption">{LABELS.description}</Typography>
        </VStack>
        <Button variant="contained" color="primary" startIcon={<Icon name="add" />} disabled>
          create group
        </Button>
      </HStack>
      <TableSkeleton rows={8} columns={7} />
    </VStack>
  );
}
