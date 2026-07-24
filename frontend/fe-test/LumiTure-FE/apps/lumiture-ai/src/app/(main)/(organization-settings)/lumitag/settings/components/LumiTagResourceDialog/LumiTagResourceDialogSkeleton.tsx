'use client';

import { VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';

import { LumiTagResourceDialogControlsSkeleton } from './LumiTagResourceDialogControlsSkeleton';

export function LumiTagResourceDialogSkeleton() {
  return (
    <VStack gap={2} mt={8}>
      <LumiTagResourceDialogControlsSkeleton />
      <TableSkeleton rows={5} columns={4} />
    </VStack>
  );
}
