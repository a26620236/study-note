import type { SxProps } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { flexRender, type Row } from '@tanstack/react-table';
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual';
import { isFunction } from 'lodash-es';

import { theme } from '@lumiture-ui/theme';

import StickyColumns from '@components/table/VirtualizedTable/components/StickyColumns';
import VirtualColumnsWrap from '@components/table/VirtualizedTable/components/VirtualColumnsWrap';
import { renderAlignStyles, renderSize } from '@components/table/VirtualizedTable/helpers';
import { STYLES } from '@components/table/VirtualizedTable/styles';
import { useTableContext } from '@components/table/VirtualizedTable/TableContext';

interface TableBodyRowProps<TData> {
  row: Row<TData>;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  virtualRow: VirtualItem;
  onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
  bodyRowSx?: SxProps;
}

const TableBodyRow = <TData,>({
  row,
  rowVirtualizer,
  virtualRow,
  onClick,
  bodyRowSx,
}: TableBodyRowProps<TData>) => {
  const { columnVirtualizer, leftStickyColumns } = useTableContext<TData>();

  const visibleCells = row.getVisibleCells();
  const virtualColumns = columnVirtualizer.getVirtualItems();

  const isSubRow = row.depth > 0;

  // 判斷是否需要顯示左側標記
  const shouldShowMarker = row.getIsExpanded() || isSubRow;

  return (
    <TableRow
      key={row.id}
      className={row.id}
      data-index={virtualRow.index}
      ref={(node) => rowVirtualizer.measureElement(node)}
      onClick={onClick}
      sx={{
        ...STYLES.TR,
        position: 'absolute',
        transform: `translateY(${virtualRow.start}px)`,
        cursor: isFunction(onClick) ? 'pointer' : 'default',
        ...bodyRowSx,
      }}
    >
      {/* 左側顏色標記 */}
      {shouldShowMarker && (
        <td
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            backgroundColor: theme.palette.primary.light30,
            zIndex: 4,
          }}
        />
      )}
      {/* Left sticky columns */}
      <StickyColumns position="left" cells={visibleCells} variant="body" isSubRow={isSubRow} />

      <VirtualColumnsWrap variant="body">
        {virtualColumns.map((virtualColumn) => {
          const cell = visibleCells[leftStickyColumns.length + virtualColumn.index];
          const align = cell.column.columnDef.meta?.align;

          return (
            <TableCell
              key={cell.id}
              variant="body"
              sx={{
                ...STYLES.TD,
                ...renderSize(cell.column),
                ...renderAlignStyles(align),
                '&.MuiTableCell-body': {
                  ...(isSubRow && { backgroundColor: theme.palette.gray.hover }),
                },
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })}
      </VirtualColumnsWrap>

      {/* Right sticky columns */}
      <StickyColumns position="right" cells={visibleCells} variant="body" isSubRow={isSubRow} />
    </TableRow>
  );
};

export default TableBodyRow;
