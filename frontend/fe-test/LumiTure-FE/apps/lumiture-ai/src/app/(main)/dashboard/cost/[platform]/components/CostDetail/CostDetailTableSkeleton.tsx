import { Box } from '@mui/material';

import { VStack } from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';

import { CostDetailHeaderSkeleton } from './CostDetailHeaderSkeleton';

export function CostDetailTableSkeleton() {
  return (
    <VStack sx={{ width: '100%', mt: 4 }}>
      <CostDetailHeaderSkeleton />
      <Box mt={4} width="100%">
        <TableSkeleton rows={5} columns={2} />
      </Box>
    </VStack>
  );
}
