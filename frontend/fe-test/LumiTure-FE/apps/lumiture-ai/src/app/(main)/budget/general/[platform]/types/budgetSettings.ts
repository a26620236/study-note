import type { Budget, GroupRow } from '@hooks-api';

import type { AllocateType, BudgetAction } from '../constants/budget';

export interface EditingBudget {
  action: BudgetAction;
  amount: number | null;
  allocateType: AllocateType | null;
}

export type FormBudget = number | string | null;

export type ChildGroupsBudget = Record<string, Record<Budget['period'], FormBudget>>;

// key 為 API 的 period（`${year}-${month}`，如 '2026-03'）
export type MonthBudgets = Record<Budget['period'], FormBudget>;

export type FormattedData = {
  id: GroupRow['id'];
  name: GroupRow['name'];
  spend: GroupRow['spend'];
  remaining: GroupRow['remaining'];
  spendPercentage: GroupRow['spendPercentage'];
} & MonthBudgets;
