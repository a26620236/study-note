import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { floor } from 'lodash-es';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showFooter?: boolean;
}

export default function TableSkeleton({
  columns = 5,
  rows = 4,
  showFooter = false,
}: TableSkeletonProps) {
  // Exclude the first column and row
  const formattedColumns = Math.max(columns - 1, 0);
  const formattedRows = Math.max(rows - 1, 0);

  const cell = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    px: 4,
  };

  const tableStyle = {
    table: {
      borderTop: '1px solid',
      borderColor: 'gray.borderLight',
    },
    boundary: {
      bgcolor: 'gray.disableLight',
      borderBottom: '1px solid',
      borderColor: 'gray.borderLight',
    },
    row: {
      borderBottom: '1px solid',
      borderColor: 'gray.borderLight',
    },
    cell,
    firstCell: {
      ...cell,
      justifyContent: 'flex-start',
      borderRight: '1px solid',
      borderColor: 'gray.borderLight',
    },
  };

  const TableCellSkeleton = () => (
    <Grid size={floor(6 / formattedColumns, 2)} sx={tableStyle.cell}>
      <Skeleton width={50} height={12} />
    </Grid>
  );

  return (
    <Stack sx={tableStyle.table}>
      {/* table head */}
      <Grid container sx={tableStyle.boundary}>
        <Grid size={6} sx={tableStyle.firstCell}>
          <Skeleton width={100} height={12} />
        </Grid>
        {new Array(formattedColumns).fill(true).map((_, colIndex) => (
          <TableCellSkeleton key={`th${colIndex}`} />
        ))}
      </Grid>
      {/* table body */}
      {new Array(formattedRows).fill(true).map((_, rowIndex) => (
        <Grid key={`tr${rowIndex}`} container sx={tableStyle.row}>
          <Grid size={6} sx={tableStyle.firstCell}>
            <Skeleton width="100%" height={12} />
          </Grid>
          {new Array(formattedColumns).fill(true).map((_, colIndex) => (
            <TableCellSkeleton key={`td${colIndex}`} />
          ))}
        </Grid>
      ))}
      {/* table footer */}
      {showFooter && (
        <Grid container sx={tableStyle.boundary}>
          <Grid size={12} sx={{ ...tableStyle.cell, justifyContent: 'flex-start' }}>
            <Skeleton width={100} height={12} />
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}
