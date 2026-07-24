import { createContext, useContext } from 'react';

import type { Column } from '@tanstack/react-table';
import type { Virtualizer } from '@tanstack/react-virtual';

interface TableContextProps<TData> {
  isAtStart: boolean;
  isAtEnd: boolean;
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
  virtualPaddingLeft?: number;
  virtualPaddingRight?: number;
  leftStickyColumns: Column<TData>[];
  rightStickyColumns: Column<TData>[];
  leftStickyOffsets: number[];
  rightStickyOffsets: number[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableContext = createContext<TableContextProps<any> | null>(null);

export const useTableContext = <TData,>() => {
  const context = useContext(TableContext as React.Context<TableContextProps<TData> | null>);

  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }

  return context;
};

export default TableContext;
