'use client';

import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';

import { theme } from '@lumiture-ui/theme';

const STYLES = {
  WRAPPER: {
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: '8px',
    padding: '16px',
    width: 'fit-content',
    height: 'fit-content',
  },
  TABLE: {
    width: 'fit-content',
    tableLayout: 'fixed',
  },
  TABLE_HEADER_CELL: {
    padding: '4px',
    border: 'none',
  },
  TABLE_BODY_CELL: {
    '& td': {
      padding: '4px 4px',
      border: 'none',
    },
  },
};

interface GroupRankTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  headerBackgroundColor?: string;
}

interface GetBorderRadiusProps {
  isFirstCell: boolean;
  isLastCell: boolean;
}

const getBorderRadius = ({ isFirstCell, isLastCell }: GetBorderRadiusProps) => {
  if (isFirstCell) {
    return '8px 0 0 8px';
  }
  if (isLastCell) {
    return '0 8px 8px 0';
  }
  return '0';
};

export function GroupRankTable<T>({
  data,
  columns,
  headerBackgroundColor,
}: GroupRankTableProps<T>) {
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is not compatible with React Compiler
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box sx={STYLES.WRAPPER}>
      <Table sx={{ width: 'fit-content', tableLayout: 'fixed' }}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                const isFirstCell = index === 0;
                const isLastCell = index === headerGroup.headers.length - 1;

                return (
                  <TableCell
                    key={header.id}
                    sx={{
                      ...STYLES.TABLE_HEADER_CELL,
                      width: header.column.columnDef.size,
                      minWidth: header.column.columnDef.minSize,
                      backgroundColor: headerBackgroundColor,
                      borderRadius: getBorderRadius({ isFirstCell, isLastCell }),
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} sx={STYLES.TABLE_BODY_CELL}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  sx={{
                    width: cell.column.columnDef.size,
                    minWidth: cell.column.columnDef.minSize,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
