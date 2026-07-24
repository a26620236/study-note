import { isNil, isString, sum } from 'lodash-es';

import { MAXIMUM_BUDGET } from '../constants/budget';
import type { FormBudget, MonthBudgets } from '../types/budgetSettings';

// 有效格：非 null/undefined 且非空字串
export const isBudgetValid = (budget: FormBudget) =>
  !isNil(budget) && !(isString(budget) && budget === '');

// 任一格無效 → null（單列 total：缺任何月份就視為無法加總）
export const calculateTotalBudget = (budgets: FormBudget[]) =>
  budgets.some((budget) => !isBudgetValid(budget)) ? null : sum(budgets.map(Number));

// 夾上限：超過 MAXIMUM_BUDGET 則回上限；null/undefined 原樣回傳
export const validateMaxBudget = (budget: FormBudget) => {
  if (isNil(budget)) return budget;
  return +budget > MAXIMUM_BUDGET ? MAXIMUM_BUDGET : +budget;
};

export const handleGetTotalRowBudget = (rowBudgets: MonthBudgets) => {
  const budgets = Object.values(rowBudgets);
  return calculateTotalBudget(budgets);
};
