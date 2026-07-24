import { Paper } from '@mui/material';

import { VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';

import { RightsizingTableFilterSkeleton } from '../RightsizingTableFilter/RightsizingTableFilterSkeleton';

export function RightsizingTableSkeleton() {
  return (
    <Paper sx={{ padding: 6, width: '100%', marginTop: 4 }}>
      <VStack gap={6}>
        <RightsizingTableFilterSkeleton />
        <TableSkeleton rows={6} columns={6} />
      </VStack>
    </Paper>
  );
}
