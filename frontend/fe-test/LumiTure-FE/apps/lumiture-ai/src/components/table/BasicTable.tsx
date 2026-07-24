import * as React from 'react';

import { Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { theme } from '@lumiture-ui/theme';

import CenteredBox from '@components/CenteredBox';
import EllipsisTooltipCell from '@components/table/EllipsisTooltipCell';

export interface Column<T> {
  key: keyof T;
  label: string;
  minWidth?: number;
  width?: number;
  align?: 'right' | 'left' | 'center';
  customizedCell?: (row: T) => React.ReactNode;
}

interface BasicTableProps<T> {
  isLoading: boolean;
  rows: T[];
  columns: readonly Column<T>[];
  handleRowClick?: (row: T) => void;
}

const BasicTable = <T,>({ isLoading, rows, columns, handleRowClick }: BasicTableProps<T>) =>
  isLoading ? (
    <CenteredBox sx={{ flexGrow: 1 }}>
      <CircularProgress size={30} />
    </CenteredBox>
  ) : (
    <Paper
      sx={{
        bgcolor: 'common.white',
        overflow: 'scroll',
        width: '100%',
        borderRadius: '16px',
        boxShadow: `0px 0px 6px 0px ${alpha(theme.palette.black.main, 0.2)}`,
      }}
    >
      <TableContainer sx={{ maxHeight: 575 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    minWidth: column.minWidth,
                    width: column.width,
                  }}
                  key={String(column.key)}
                  align={column.align}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                hover={!!handleRowClick}
                key={index}
                sx={{ cursor: handleRowClick ? 'pointer' : 'default' }}
                onClick={(event) => {
                  event.preventDefault();
                  handleRowClick?.(row);
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    align={column.align}
                    sx={{
                      maxWidth: 150,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {column.customizedCell ? (
                      column.customizedCell(row)
                    ) : (
                      <EllipsisTooltipCell
                        tooltipText={String(row[column.key])}
                        text={String(row[column.key])}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

export default BasicTable;
