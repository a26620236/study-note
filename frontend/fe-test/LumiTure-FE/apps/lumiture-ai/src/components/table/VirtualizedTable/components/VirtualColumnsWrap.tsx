import React from 'react';

import TableCell, { type TableCellProps } from '@mui/material/TableCell';

import { STYLES } from '@components/table/VirtualizedTable/styles';
import { useTableContext } from '@components/table/VirtualizedTable/TableContext';

interface VirtualColumnsWrapProps {
  variant: TableCellProps['variant'];
  children: React.ReactNode;
}

const VirtualColumnsWrap = ({ variant, children }: VirtualColumnsWrapProps) => {
  const { virtualPaddingLeft, virtualPaddingRight } = useTableContext();

  return (
    <>
      {virtualPaddingLeft ? (
        <TableCell variant={variant} sx={{ ...STYLES.TD, width: virtualPaddingLeft }} />
      ) : null}

      {children}

      {virtualPaddingRight ? (
        <TableCell variant={variant} sx={{ ...STYLES.TD, width: virtualPaddingRight }} />
      ) : null}
    </>
  );
};

export default VirtualColumnsWrap;
