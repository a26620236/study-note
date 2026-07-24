import { Paper } from '@mui/material';

import TableSkeleton from '@components/table/TableSkeleton';

export function LumiTagTableSkeleton() {
  return (
    <Paper sx={{ padding: 6, width: '100%', marginTop: 4 }}>
      <TableSkeleton rows={6} columns={6} />
    </Paper>
  );
}
