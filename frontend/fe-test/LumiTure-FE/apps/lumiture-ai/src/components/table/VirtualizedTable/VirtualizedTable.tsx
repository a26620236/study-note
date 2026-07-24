import React, { useMemo, useRef, useState } from 'react';

import {
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  type SxProps,
} from '@mui/material';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type OnChangeFn,
  type Row,
  type RowData,
  type RowSelectionState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { isFunction } from 'lodash-es';

import { STYLES } from '@components/table/VirtualizedTable/styles';
import TableBodyRow from '@components/table/VirtualizedTable/TableBodyRow';
import TableContext from '@components/table/VirtualizedTable/TableContext';
import TableFooterRow from '@components/table/VirtualizedTable/TableFooterRow';
import TableHeadRow from '@components/table/VirtualizedTable/TableHeadRow';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    sticky?: null | 'left' | 'right';
    align?: 'left' | 'center' | 'right';
  }
}

interface VirtualizedTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onTableRowClick?: (rowOriginal: TData, event: React.MouseEvent<HTMLTableRowElement>) => void;
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  getRowId?: (row: TData) => string;
  enableExpanding?: boolean;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  bodyRowSx?: (row: Row<TData>) => SxProps;
  footerRowSx?: SxProps;
}

const VirtualizedTable = <TData,>({
  data,
  columns,
  onTableRowClick,
  enableRowSelection = false,
  rowSelection = {},
  onRowSelectionChange,
  getRowId,
  enableExpanding = false,
  onExpandedChange,
  getSubRows,
  getRowCanExpand,
  bodyRowSx,
  footerRowSx,
}: VirtualizedTableProps<TData>) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const handleExpandedChange: OnChangeFn<ExpandedState> = (updater) => {
    setExpanded(updater);
    onExpandedChange?.(updater);
  };
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is not compatible with React Compiler
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: process.env.NODE_ENV === 'development',
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    ...(getRowId && { getRowId }),
    state: {
      ...(enableRowSelection && { rowSelection }),
      ...(enableExpanding && { expanded }),
    },
    ...(enableRowSelection && {
      enableRowSelection: true,
      onRowSelectionChange,
    }),
    ...(enableExpanding && {
      getExpandedRowModel: getExpandedRowModel(),
      onExpandedChange: handleExpandedChange,
      ...(getSubRows && { getSubRows }),
      ...(getRowCanExpand && { getRowCanExpand }),
    }),
  });
  const { rows } = table.getRowModel();
  const visibleColumns = table.getVisibleLeafColumns();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isAtStart = !tableContainerRef.current?.scrollLeft;
  const isAtEnd = !!(
    tableContainerRef.current &&
    tableContainerRef.current.scrollLeft + tableContainerRef.current.clientWidth >=
      tableContainerRef.current.scrollWidth
  );

  // Split sticky columns by position
  const leftStickyColumns = useMemo(
    () => visibleColumns.filter((col) => col.columnDef.meta?.sticky === 'left'),
    [visibleColumns]
  );
  const rightStickyColumns = useMemo(
    () => visibleColumns.filter((col) => col.columnDef.meta?.sticky === 'right'),
    [visibleColumns]
  );
  const nonStickyColumns = useMemo(
    () =>
      visibleColumns.filter(
        (col) => col.columnDef.meta?.sticky !== 'left' && col.columnDef.meta?.sticky !== 'right'
      ),
    [visibleColumns]
  );

  const handleTableRowClick =
    (row: Row<TData>) => (event: React.MouseEvent<HTMLTableRowElement>) => {
      if (isFunction(onTableRowClick)) onTableRowClick(row.original, event);
    };

  // Calculate sticky column offsets
  const leftStickyOffsets = leftStickyColumns.reduce<number[]>((acc, col, index) => {
    const offset = index === 0 ? 0 : acc[index - 1] + leftStickyColumns[index - 1].getSize();
    acc.push(offset);
    return acc;
  }, []);
  const rightStickyOffsets = rightStickyColumns.reduce<number[]>((acc, col, index) => {
    const offset =
      index === 0
        ? rightStickyColumns.slice(index + 1).reduce((sum, c) => sum + c.getSize(), 0)
        : acc[index - 1] - col.getSize();
    acc.push(offset);
    return acc;
  }, []);

  const nonStickyColumnVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableCellElement>({
    count: nonStickyColumns.length,
    estimateSize: (index) => nonStickyColumns[index].getSize(),
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 7,
  });
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' && !navigator.userAgent.includes('Firefox')
        ? (element) => element.getBoundingClientRect().height
        : undefined,
    overscan: 7,
  });

  const virtualNonStickyColumns = nonStickyColumnVirtualizer.getVirtualItems();
  const virtualRows = rowVirtualizer.getVirtualItems();

  let virtualPaddingLeft: number | undefined = undefined;
  let virtualPaddingRight: number | undefined = undefined;

  if (virtualNonStickyColumns.length) {
    virtualPaddingLeft = virtualNonStickyColumns[0]?.start ?? 0;
    virtualPaddingRight =
      nonStickyColumnVirtualizer.getTotalSize() -
      (virtualNonStickyColumns[virtualNonStickyColumns.length - 1]?.end ?? 0);
  }

  const contextValue = {
    isAtStart,
    isAtEnd,
    columnVirtualizer: nonStickyColumnVirtualizer,
    virtualPaddingLeft,
    virtualPaddingRight,
    leftStickyColumns,
    rightStickyColumns,
    leftStickyOffsets,
    rightStickyOffsets,
  };

  return (
    <TableContext.Provider value={contextValue}>
      <TableContainer className="tableContainer" ref={tableContainerRef} sx={STYLES.CONTAINER}>
        <Table sx={STYLES.TABLE}>
          <TableHead sx={STYLES.TABLE_HEAD}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableHeadRow key={headerGroup.id} headerGroup={headerGroup} />
            ))}
          </TableHead>
          <TableBody
            sx={{
              ...STYLES.TABLE_BODY,
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <TableBodyRow
                  key={row.id}
                  row={row}
                  rowVirtualizer={rowVirtualizer}
                  virtualRow={virtualRow}
                  onClick={handleTableRowClick(row)}
                  bodyRowSx={bodyRowSx?.(row)}
                />
              );
            })}
          </TableBody>
          <TableFooter sx={{ ...STYLES.TABLE_FOOTER, ...footerRowSx }}>
            {table.getFooterGroups().map((footerGroup) => (
              <TableFooterRow
                key={footerGroup.id}
                footerGroup={footerGroup}
                footerRowSx={footerRowSx}
              />
            ))}
          </TableFooter>
        </Table>
      </TableContainer>
    </TableContext.Provider>
  );
};

export default VirtualizedTable;
