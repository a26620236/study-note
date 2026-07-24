import { useMemo, type ReactNode } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { compact, isNumber } from 'lodash-es';

import { TableSelectionCell, TableSelectionHeader } from '@components/table/TableSelection';
import { Depth } from '@constants';

import { EditBudgetCell } from '../components/GroupBudgetTable/EditBudgetCell';
import { RowTotalCell } from '../components/GroupBudgetTable/RowTotalCell';
import {
  RemainingCell,
  SpendCell,
  SpentPercentCell,
} from '../components/GroupBudgetTable/SummaryCells';
import { TruncatedGroupName } from '../components/GroupBudgetTable/TruncatedGroupName';
import type { EditingBudget, FormattedData } from '../types/budgetSettings';

const LABELS = {
  groupName: 'Group Name',
  budget: 'Budget',
  spend: 'Spend',
  spentPercent: 'Spent %',
  remaining: 'Remaining',
};

const SUMMARY_COLUMN_SIZE = 120;

interface UseGroupTableStickyColumnsParams {
  isEditing: boolean;
  depth: number | undefined;
  groupIds: number[];
  footerColumns: {
    title: () => ReactNode;
    totalByGroups: () => ReactNode;
    spend: () => ReactNode;
    spentPercent: () => ReactNode;
    remaining: () => ReactNode;
    placeholder: () => ReactNode;
  };
  handleEditConfirm: (original: FormattedData) => (data: EditingBudget) => void;
}

export const useGroupTableStickyColumns = ({
  isEditing,
  depth,
  footerColumns,
  handleEditConfirm,
}: UseGroupTableStickyColumnsParams): ColumnDef<FormattedData>[] => {
  const isT2 = depth === Depth.T2;

  const stickyColumns: ColumnDef<FormattedData>[] = useMemo(
    () =>
      compact([
        // T2 沒有 checkbox / groupName / budget / editAction
        !isT2 &&
          isEditing && {
            accessorKey: 'selectedAll',
            header: ({ table }) => <TableSelectionHeader table={table} />,
            enableSorting: false,
            size: 56,
            meta: { sticky: 'left' },
            cell: ({ row }) => <TableSelectionCell row={row} />,
            footer: footerColumns.placeholder,
          },
        !isT2 && {
          accessorKey: 'name',
          header: LABELS.groupName,
          size: 160,
          meta: { sticky: 'left', align: 'left' },
          cell: ({ row }) => <TruncatedGroupName name={row.original.name} />,
          footer: footerColumns.title,
        },
        !isT2 && {
          accessorKey: 'total',
          header: LABELS.budget,
          size: SUMMARY_COLUMN_SIZE,
          meta: { sticky: 'left' },
          cell: ({ row }) => <RowTotalCell groupId={row.original.id} />,
          footer: footerColumns.totalByGroups,
        },
        {
          accessorKey: 'spend',
          header: LABELS.spend,
          enableSorting: false,
          size: SUMMARY_COLUMN_SIZE,
          meta: { sticky: 'left' },
          cell: ({ row }) => {
            const isSpendOver = isNumber(row.original.remaining) && row.original.remaining < 0;
            return <SpendCell value={row.original.spend} isSpendOver={isSpendOver} />;
          },
          footer: footerColumns.spend,
        },
        // Spent % / Remaining 僅瀏覽模式顯示（編輯模式只保留 Budget / Spend）
        // T2 永遠顯示（不進入編輯模式）
        (isT2 || !isEditing) && {
          accessorKey: 'spentPercent',
          header: LABELS.spentPercent,
          enableSorting: false,
          size: 120,
          meta: { sticky: 'left', align: 'left' },
          cell: ({ row }) => <SpentPercentCell spendPercentage={row.original.spendPercentage} />,
          footer: footerColumns.spentPercent,
        },
        (isT2 || !isEditing) && {
          accessorKey: 'remaining',
          header: LABELS.remaining,
          enableSorting: false,
          size: SUMMARY_COLUMN_SIZE,
          meta: { sticky: 'left' },
          cell: ({ row }) => {
            const isSpendOver = isNumber(row.original.remaining) && row.original.remaining < 0;
            return <RemainingCell value={row.original.remaining} isSpendOver={isSpendOver} />;
          },
          footer: footerColumns.remaining,
        },
        !isT2 &&
          isEditing && {
            accessorKey: 'action',
            header: '',
            enableSorting: false,
            size: 56,
            meta: { sticky: 'left' },
            cell: ({ row }) => <EditBudgetCell onConfirm={handleEditConfirm(row.original)} />,
            footer: footerColumns.placeholder,
          },
      ]),
    [footerColumns, handleEditConfirm, isEditing, isT2]
  );

  return stickyColumns;
};
