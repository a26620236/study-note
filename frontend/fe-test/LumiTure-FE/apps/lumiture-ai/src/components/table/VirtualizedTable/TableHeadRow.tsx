import type { ReactElement } from 'react';

import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { flexRender, type HeaderGroup } from '@tanstack/react-table';

import { Icon } from '@lumiture-ui';

import StickyColumns from '@components/table/VirtualizedTable/components/StickyColumns';
import VirtualColumnsWrap from '@components/table/VirtualizedTable/components/VirtualColumnsWrap';
import { renderAlignStyles, renderSize } from '@components/table/VirtualizedTable/helpers';
import { STYLES } from '@components/table/VirtualizedTable/styles';
import { useTableContext } from '@components/table/VirtualizedTable/TableContext';

interface TableHeadRowProps<TData> {
  headerGroup: HeaderGroup<TData>;
}

const TableHeadRow = <TData,>({ headerGroup }: TableHeadRowProps<TData>) => {
  const { columnVirtualizer, leftStickyColumns } = useTableContext();

  const virtualColumns = columnVirtualizer.getVirtualItems();

  const SortIcons: Partial<Record<'asc' | 'desc', ReactElement>> = {
    asc: <Icon name="arrow_upward" sx={{ color: 'primary.main' }} />,
    desc: <Icon name="arrow_downward" sx={{ color: 'primary.main' }} />,
  };

  return (
    <TableRow key={headerGroup.id} sx={STYLES.TR}>
      {/* Left sticky columns */}
      <StickyColumns
        position="left"
        cells={headerGroup.headers}
        variant="head"
        renderTableCellProps={(column) => ({
          onClick: column.getToggleSortingHandler(),
        })}
        renderSlot={(column) => {
          const sortDirection = column.getIsSorted();
          return sortDirection ? (SortIcons[sortDirection] ?? null) : null;
        }}
      />

      <VirtualColumnsWrap variant="head">
        {virtualColumns.map((virtualColumn) => {
          const header = headerGroup.headers[leftStickyColumns.length + virtualColumn.index];
          const align = header.column.columnDef.meta?.align;
          const sortDirection = header.column.getIsSorted();
          return (
            <TableCell
              key={header.id}
              className={header.id}
              variant="head"
              sx={{
                ...STYLES.TD,
                ...renderSize(header.column),
                ...renderAlignStyles(align),
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                sx={{ gap: 1, cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {sortDirection ? (SortIcons[sortDirection] ?? null) : null}
              </Stack>
            </TableCell>
          );
        })}
      </VirtualColumnsWrap>

      {/* Right sticky columns */}
      <StickyColumns position="right" cells={headerGroup.headers} variant="head" />
    </TableRow>
  );
};

export default TableHeadRow;
