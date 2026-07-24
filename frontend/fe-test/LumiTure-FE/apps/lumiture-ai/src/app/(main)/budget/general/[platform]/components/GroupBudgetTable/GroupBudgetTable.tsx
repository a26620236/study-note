import { useCallback, useMemo } from 'react';

import { useTheme } from '@mui/material';
import type { ColumnDef, OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { isEmpty, isNumber, sum } from 'lodash-es';
import { useSession } from 'next-auth/react';
import { useFormContext } from 'react-hook-form';

import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { Depth } from '@constants';
import {
  Segment,
  useGetChildGroupBudget,
  useGetCurrentGroupBudget,
  type Budget,
  type BudgetPlatformValue,
} from '@hooks-api';

import { BudgetAction, MonthlyViewMode } from '../../constants/budget';
import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';
import { useGroupTableDynamicColumns } from '../../hooks/useGroupTableDynamicColumns';
import { useGroupTableStickyColumns } from '../../hooks/useGroupTableStickyColumns';
import type { ChildGroupsBudget, EditingBudget, FormattedData } from '../../types/budgetSettings';
import { calculateTotalBudget } from '../../utils/budgetCalc';
import {
  handleAllocateBudget,
  handleBalanceBudget,
  handleFillBudget,
} from '../../utils/budgetDistribute';
import { toFormValues } from '../../utils/budgetTransform';

interface GroupBudgetTableProps {
  platform: BudgetPlatformValue;
}

export const GroupBudgetTable = ({ platform }: GroupBudgetTableProps) => {
  const theme = useTheme();
  const { data: session } = useSession();
  const depth = session?.user.group?.depth;
  const { isEditing, viewMode, rowSelection, setRowSelection } = useBudgetSettingsStore(
    (state) => state
  );
  const fiscalYear = useBudgetSettingsStore((state) => state.fiscalYear);

  const { data: childGroupBudgetData } = useGetChildGroupBudget({
    platform,
    segment: Segment.MONTHLY,
    fiscalYear,
  });

  const budgetGroups = useMemo(
    () => childGroupBudgetData?.data.budget ?? [],
    [childGroupBudgetData]
  );
  const periods = useMemo(() => childGroupBudgetData?.data.period ?? [], [childGroupBudgetData]);

  // 依 viewMode 切換顯示的資料來源（budget / spend / remaining）
  const viewData = useMemo(() => {
    if (viewMode === MonthlyViewMode.Spend) return childGroupBudgetData?.data.spend ?? [];
    if (viewMode === MonthlyViewMode.Remaining) return childGroupBudgetData?.data.remaining ?? [];
    return childGroupBudgetData?.data.budget ?? [];
  }, [childGroupBudgetData, viewMode]);

  // footer 平台年度彙總：由 budgetGroups 加總（不用舊的 totalBudgets）
  const platformAnnualSummary = useMemo(() => {
    const spends = budgetGroups.map((grp) => grp.spend).filter(isNumber);
    const spend = spends.length > 0 ? sum(spends) : null;
    const totalBudget = calculateTotalBudget(budgetGroups.map((grp) => grp.total));
    const remaining = isNumber(totalBudget) ? totalBudget - (spend ?? 0) : null;
    const spendPercentage =
      isNumber(totalBudget) && totalBudget > 0 && isNumber(spend)
        ? (spend / totalBudget) * 100
        : null;
    return { spend, remaining, spendPercentage };
  }, [budgetGroups]);

  const { data: currentGroupBudgetData } = useGetCurrentGroupBudget({
    segment: Segment.MONTHLY,
    fiscalYear,
  });
  // 各平台（含 Total 跨雲加總）的 allocatedBudgets map 轉為 Budget[]
  const currentGroupBudget: Budget[] | undefined = useMemo(() => {
    const allocated = currentGroupBudgetData?.data[platform].allocatedBudgets;
    if (!allocated) return undefined;
    return Object.entries(allocated)
      .filter(([key]) => key !== 'total')
      .map(([period, value]) => ({ period, value }));
  }, [currentGroupBudgetData, platform]);

  const groupIds = useMemo(() => budgetGroups.map((grp) => grp.id), [budgetGroups]);

  const { getValues, setValue } = useFormContext<ChildGroupsBudget>();

  const { footerColumns, budgetColumns } = useGroupTableDynamicColumns({
    isEditing,
    viewMode,
    viewData,
    currentGroupBudget,
    platformAnnualSummary,
    periods,
    depth,
  });

  const handleEditConfirm = useCallback(
    (original: FormattedData) => (data: EditingBudget) => {
      const budgets = getValues(`${original.id}`);

      // REBALANCE 不需 amount；ALLOCATE / FILL 由表單保證 amount 非空（amount 為空時確認鈕 disabled）
      if (data.action === BudgetAction.REBALANCE) {
        setValue(`${original.id}`, handleBalanceBudget(budgets));
      } else if (data.amount !== null) {
        const { amount } = data;

        if (data.action === BudgetAction.ALLOCATE) {
          setValue(`${original.id}`, handleAllocateBudget(budgets, amount));
        }

        if (data.action === BudgetAction.FILL) {
          setValue(`${original.id}`, handleFillBudget(budgets, amount));
        }
      }
    },
    [getValues, setValue]
  );

  const stickyColumns = useGroupTableStickyColumns({
    isEditing,
    depth,
    groupIds,
    footerColumns,
    handleEditConfirm,
  });

  const formattedColumns: ColumnDef<FormattedData>[] = useMemo(
    () => [...stickyColumns, ...budgetColumns],
    [stickyColumns, budgetColumns]
  );

  // row data：id / name + 年度彙總欄位（sticky columns 直讀 row.original）+ 初始月份預算
  const initialBudgets = useMemo(
    () => toFormValues(budgetGroups, periods),
    [budgetGroups, periods]
  );
  const formattedData: FormattedData[] = useMemo(
    () =>
      budgetGroups.map((group) => ({
        id: group.id,
        name: group.name,
        spend: group.spend,
        remaining: group.remaining,
        spendPercentage: group.spendPercentage,
        ...initialBudgets[group.id],
      })),
    [budgetGroups, initialBudgets]
  );

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    (updater) => {
      setRowSelection(typeof updater === 'function' ? updater(rowSelection) : updater);
    },
    [rowSelection, setRowSelection]
  );

  if (isEmpty(formattedData)) return null;

  return (
    <VirtualizedTable
      columns={formattedColumns}
      data={formattedData}
      footerRowSx={{ bgcolor: theme.palette.primary.light10, p: 0 }}
      enableRowSelection={isEditing && depth !== Depth.T2}
      rowSelection={rowSelection}
      onRowSelectionChange={handleRowSelectionChange}
      getRowId={(row) => String(row.id)}
    />
  );
};
