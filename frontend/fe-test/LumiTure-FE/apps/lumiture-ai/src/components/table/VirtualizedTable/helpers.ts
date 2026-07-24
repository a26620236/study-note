import type { Column } from '@tanstack/react-table';

export const renderSize = <TData, TValue>(column: Column<TData, TValue>) => {
  const maxWidth =
    column.columnDef.maxSize && column.columnDef.maxSize < Number.MAX_SAFE_INTEGER
      ? column.columnDef.maxSize
      : 'unset';

  return {
    flex: `${column.getSize()} 1 auto`,
    width: column.getSize() || 'unset',
    minWidth: column.columnDef.minSize ?? 'unset',
    maxWidth,
  };
};

export const renderAlignStyles = (align?: 'left' | 'center' | 'right') => {
  if (align === 'center') return { justifyContent: 'center' };
  if (align === 'left') return { justifyContent: 'flex-start' };
  return { justifyContent: 'flex-end' };
};
