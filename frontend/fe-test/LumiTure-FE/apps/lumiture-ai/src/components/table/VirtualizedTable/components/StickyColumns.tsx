import React from 'react';

import TableCell, { type TableCellProps } from '@mui/material/TableCell';
import { flexRender, type Cell, type Column, type Header } from '@tanstack/react-table';
import { isFunction } from 'lodash-es';

import { theme } from '@lumiture-ui/theme';

import { renderAlignStyles, renderSize } from '@components/table/VirtualizedTable/helpers';
import { STYLES } from '@components/table/VirtualizedTable/styles';
import { useTableContext } from '@components/table/VirtualizedTable/TableContext';

interface StickyColumnsProps<TData> {
  position: 'left' | 'right';
  cells: (Header<TData, unknown> | Cell<TData, unknown>)[];
  variant: TableCellProps['variant'];
  renderTableCellProps?: (cell: Column<TData>) => TableCellProps;
  renderSlot?: (cell: Column<TData>) => React.ReactNode;
  isSubRow?: boolean;
  cellSx?: TableCellProps['sx'];
}

const renderContent = <TData,>(
  cell: Header<TData, unknown> | Cell<TData, unknown>,
  variant: TableCellProps['variant']
): React.ReactNode => {
  switch (variant) {
    case 'head': {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      const header = cell as Header<TData, unknown>;
      return flexRender(header.column.columnDef.header, header.getContext());
    }
    case 'body': {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      const bodyCell = cell as Cell<TData, unknown>;
      return flexRender(bodyCell.column.columnDef.cell, bodyCell.getContext());
    }
    case 'footer': {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      const header = cell as Header<TData, unknown>;
      return flexRender(header.column.columnDef.footer, header.getContext());
    }
    default:
      return null;
  }
};

const StickyColumns = <TData,>({
  position,
  cells,
  variant,
  renderTableCellProps,
  renderSlot,
  isSubRow = false,
  cellSx,
}: StickyColumnsProps<TData>) => {
  const {
    isAtStart,
    isAtEnd,
    leftStickyColumns,
    rightStickyColumns,
    leftStickyOffsets,
    rightStickyOffsets,
  } = useTableContext<TData>();
  const stickyColumns = position === 'left' ? leftStickyColumns : rightStickyColumns;
  const stickyOffsets = position === 'left' ? leftStickyOffsets : rightStickyOffsets;

  const stickyStyles = (index: number) => {
    const baseStyles = {
      position: 'sticky',
      [position]: stickyOffsets[index],
      zIndex: 3,
    };

    let boxShadow = 'unset';

    if (position === 'left') {
      // 左側陰影
      if (index === leftStickyColumns.length - 1 && !isAtStart) {
        boxShadow = STYLES._START_SHADOW;
      }
    } else {
      // 右側陰影
      // eslint-disable-next-line no-lonely-if
      if (index === 0 && !isAtEnd) {
        boxShadow = STYLES._END_SHADOW;
      }
    }

    return {
      ...baseStyles,
      boxShadow,
    };
  };

  return (
    <>
      {stickyColumns.map((column, index) => {
        const cell =
          position === 'left' ? cells[index] : cells[cells.length - stickyColumns.length + index];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!cell) return null;

        const align = column.columnDef.meta?.align;
        const content = renderContent<TData>(cell, variant);

        return (
          <TableCell
            key={column.id}
            className={column.id}
            variant={variant}
            sx={
              [
                {
                  ...STYLES.TD,
                  ...stickyStyles(index),
                  ...renderSize(column),
                  ...renderAlignStyles(align),
                  ...(isSubRow && {
                    '&.MuiTableCell-body': { backgroundColor: theme.palette.gray.hover },
                  }),
                },
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ...(Array.isArray(cellSx) ? cellSx : cellSx ? [cellSx] : []),
              ] as TableCellProps['sx']
            }
            {...(isFunction(renderTableCellProps) && renderTableCellProps(column))}
          >
            {content}
            {isFunction(renderSlot) && renderSlot(column)}
          </TableCell>
        );
      })}
    </>
  );
};

export default StickyColumns;
