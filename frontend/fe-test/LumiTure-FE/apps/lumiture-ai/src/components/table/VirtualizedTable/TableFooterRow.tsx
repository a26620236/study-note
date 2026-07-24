import { useTheme, type TableCellProps } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { flexRender, type Header, type HeaderGroup } from '@tanstack/react-table';

import StickyColumns from '@components/table/VirtualizedTable/components/StickyColumns';
import VirtualColumnsWrap from '@components/table/VirtualizedTable/components/VirtualColumnsWrap';
import { renderAlignStyles, renderSize } from '@components/table/VirtualizedTable/helpers';
import { STYLES } from '@components/table/VirtualizedTable/styles';
import { useTableContext } from '@components/table/VirtualizedTable/TableContext';

interface TableFooterRowProps<TData> {
  footerGroup: HeaderGroup<TData>;
  footerRowSx?: TableCellProps['sx'];
}

const checkHasFooter = <TData,>(footerGroup: HeaderGroup<TData>): boolean =>
  footerGroup.headers.some((header: Header<TData, unknown>) => header.column.columnDef.footer);
const TableFooterRow = <TData,>({ footerGroup, footerRowSx }: TableFooterRowProps<TData>) => {
  const theme = useTheme();
  const { columnVirtualizer, leftStickyColumns } = useTableContext();

  const virtualColumns = columnVirtualizer.getVirtualItems();
  const hasFooter = checkHasFooter(footerGroup);

  if (!hasFooter) return null;

  return (
    <TableRow key={footerGroup.id} sx={STYLES.TR}>
      {/* Left sticky columns */}
      <StickyColumns
        position="left"
        cells={footerGroup.headers}
        variant="footer"
        cellSx={footerRowSx}
      />

      <VirtualColumnsWrap variant="footer">
        {virtualColumns.map((virtualColumn) => {
          const footer = footerGroup.headers[leftStickyColumns.length + virtualColumn.index];
          const align = footer.column.columnDef.meta?.align;
          return (
            <TableCell
              key={footer.id}
              className={footer.id}
              variant="footer"
              sx={{
                ...theme.typography.bodyMedium,
                ...STYLES.TD,
                ...renderSize(footer.column),
                ...renderAlignStyles(align),
                ...footerRowSx,
              }}
            >
              {flexRender(footer.column.columnDef.footer, footer.getContext())}
            </TableCell>
          );
        })}
      </VirtualColumnsWrap>

      {/* Right sticky columns */}
      <StickyColumns
        position="right"
        cells={footerGroup.headers}
        variant="footer"
        cellSx={footerRowSx}
      />
    </TableRow>
  );
};

export default TableFooterRow;
