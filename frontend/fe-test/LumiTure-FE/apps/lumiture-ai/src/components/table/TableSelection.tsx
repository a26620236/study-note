import type { MouseEvent } from 'react';

import { Box, Checkbox } from '@mui/material';
import type { Row, Table } from '@tanstack/react-table';

interface TableSelectionHeaderProps<T> {
  table: Table<T>;
}

interface TableSelectionCellProps<T> {
  row: Row<T>;
}

const handleClickPopper = (event: MouseEvent<HTMLElement>) => {
  event.stopPropagation();
};

export const TableSelectionHeader = <T,>({ table }: TableSelectionHeaderProps<T>) => (
  <Box onClick={handleClickPopper}>
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  </Box>
);

export const TableSelectionCell = <T,>({ row }: TableSelectionCellProps<T>) => (
  <Box onClick={handleClickPopper}>
    <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
  </Box>
);
