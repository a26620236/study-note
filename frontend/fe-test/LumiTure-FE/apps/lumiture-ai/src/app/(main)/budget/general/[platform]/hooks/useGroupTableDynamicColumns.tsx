import { useCallback, useMemo } from 'react';

import { Typography } from '@mui/material';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import { isEmpty, isNumber, keyBy, sum } from 'lodash-es';
import { useSession } from 'next-auth/react';
import { Controller, useFormContext } from 'react-hook-form';

import { HStack, VStack } from '@lumiture-ui';

import { ProgressBar } from '@components/ProgressBar';
import { TableFooterCell } from '@components/table/TableFooterCell';
import { Depth } from '@constants';
import type { Budget, GroupRow } from '@hooks-api';

import { BudgetInput } from '../components/GroupBudgetTable/BudgetInput';
import {
  FooterColumnTotal,
  FooterGrandTotal,
  FooterTitle,
} from '../components/GroupBudgetTable/GroupBudgetFooter';
import { MonthValueCell } from '../components/GroupBudgetTable/MonthValueCell';
import { PeriodHeader } from '../components/GroupBudgetTable/PeriodHeader';
import {
  getSpentPercentColor,
  RemainingCell,
  SpendCell,
} from '../components/GroupBudgetTable/SummaryCells';
import { MonthlyViewMode } from '../constants/budget';
import type { ChildGroupsBudget, FormattedData } from '../types/budgetSettings';
import { calculateTotalBudget } from '../utils/budgetCalc';
import { formatBudgetDisplay, formatSpentPercent } from '../utils/budgetFormat';

export const useGroupTableDynamicColumns = ({
  isEditing,
  viewMode,
  viewData,
  currentGroupBudget,
  platformAnnualSummary,
  periods,
  depth: depthProp,
}: {
  isEditing: boolean;
  viewMode: MonthlyViewMode;
  viewData: GroupRow[];
  currentGroupBudget?: Budget[];
  platformAnnualSummary: {
    spend: number | null;
    remaining: number | null;
    spendPercentage: number | null;
  };
  periods: string[];
  depth?: number;
}) => {
  const { data: session } = useSession();
  const sessionDepth = session?.user.group?.depth;
  const depth = depthProp ?? sessionDepth;
  const { control } = useFormContext<ChildGroupsBudget>();

  // currentGroupBudget 可能為 undefined（Total / loading）或缺某月份，故 entry 可能為 undefined
  const expectedBudgetMap = useMemo<Record<string, Budget | undefined>>(
    () => keyBy(currentGroupBudget, 'period'),
    [currentGroupBudget]
  );
  const totalExpectedBudget = useMemo(
    () => calculateTotalBudget(currentGroupBudget?.map(({ value }) => value) ?? []),
    [currentGroupBudget]
  );

  // Expected 行只在 Budget view 顯示，Spend / Remaining 無論什麼層級都隱藏
  const showExpected = depth === Depth.T1 && viewMode === MonthlyViewMode.Budget;
  const isT2 = depth === Depth.T2;

  const footerColumns = useMemo(
    () => ({
      title: () => (isT2 ? null : <FooterTitle showExpected={showExpected} />),
      totalByGroups: () =>
        isT2 ? null : (
          <FooterGrandTotal
            depth={depth}
            totalExpectedBudget={totalExpectedBudget}
            showExpected={showExpected}
          />
        ),
      spend: () => {
        if (isT2) return null;
        const isSpendOver =
          isNumber(platformAnnualSummary.remaining) && platformAnnualSummary.remaining < 0;
        return (
          <VStack sx={{ flex: 1 }}>
            <TableFooterCell>
              <SpendCell value={platformAnnualSummary.spend} isSpendOver={isSpendOver} />
            </TableFooterCell>
            <TableFooterCell hidden={!showExpected} />
          </VStack>
        );
      },
      spentPercent: () => {
        if (isT2) return null;
        const { spendPercentage } = platformAnnualSummary;
        const color = getSpentPercentColor(spendPercentage);
        const content = isNumber(spendPercentage) ? (
          <HStack gap={2} alignItems="center" justifyContent="flex-start" width="100%">
            <ProgressBar percentage={spendPercentage} getColor={getSpentPercentColor} width={40} />
            <Typography color={color}>{formatSpentPercent(spendPercentage)}</Typography>
          </HStack>
        ) : (
          <Typography color={color}>{formatSpentPercent(spendPercentage)}</Typography>
        );
        return (
          <VStack sx={{ flex: 1 }}>
            <TableFooterCell>{content}</TableFooterCell>
            <TableFooterCell hidden={!showExpected} />
          </VStack>
        );
      },
      remaining: () => {
        if (isT2) return null;
        const isSpendOver =
          isNumber(platformAnnualSummary.remaining) && platformAnnualSummary.remaining < 0;
        return (
          <VStack sx={{ flex: 1 }}>
            <TableFooterCell>
              <RemainingCell value={platformAnnualSummary.remaining} isSpendOver={isSpendOver} />
            </TableFooterCell>
            <TableFooterCell hidden={!showExpected} />
          </VStack>
        );
      },
      placeholder: () =>
        isT2 ? null : (
          <VStack sx={{ flex: 1 }}>
            <TableFooterCell />
            <TableFooterCell hidden={!showExpected} />
          </VStack>
        ),
    }),
    [depth, isT2, totalExpectedBudget, platformAnnualSummary, showExpected]
  );

  const renderCell = useCallback(
    (cells: CellContext<FormattedData, unknown>) => {
      // 瀏覽模式：依 viewMode 顯示 value（含紅字、Cap Dot、空值 tooltip）
      if (!isEditing) {
        const group = viewData.find((grp) => grp.id === cells.row.original.id);
        const periodData = group?.[cells.column.id];
        return <MonthValueCell periodData={periodData} viewMode={viewMode} />;
      }

      // 編輯模式：可輸入的 BudgetInput（透過 RHF Controller）
      return (
        <VStack sx={{ width: 110 }}>
          <Controller
            name={`${cells.row.original.id}.${cells.column.id}`}
            control={control}
            render={({ field: { ref, ...others } }) => (
              <BudgetInput
                {...others}
                inputRef={ref}
                disabled={!isEditing}
                autoFocus={cells.row.index === 0 && cells.column.getIndex() === 4}
              />
            )}
          />
        </VStack>
      );
    },
    [isEditing, viewMode, viewData, control]
  );

  const budgetColumns: ColumnDef<FormattedData>[] = useMemo(
    () =>
      isEmpty(periods)
        ? []
        : periods.map((period) => ({
            accessorKey: period,
            header: () => <PeriodHeader period={period} />,
            size: 120,
            cell: renderCell,
            footer: () => {
              if (isT2) return null;
              // Spend / Remaining view：直接從 viewData 加總（無編輯模式，不需 form）
              if (viewMode !== MonthlyViewMode.Budget) {
                const total = sum(viewData.map((grp) => grp[period].value).filter(isNumber));
                return (
                  <TableFooterCell>
                    <Typography color={total < 0 ? 'error.main' : 'text.primary'}>
                      {formatBudgetDisplay(total)}
                    </Typography>
                  </TableFooterCell>
                );
              }
              // Budget view：RHF form（edit mode 即時更新）
              return (
                <FooterColumnTotal
                  depth={depth}
                  month={period}
                  expected={expectedBudgetMap[period]?.value ?? null}
                  showExpected={showExpected}
                />
              );
            },
          })),
    [periods, renderCell, depth, isT2, expectedBudgetMap, viewMode, viewData, showExpected]
  );

  return { footerColumns, budgetColumns };
};
