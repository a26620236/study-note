import type { FormBudget, MonthBudgets } from '../../types/budgetSettings';

// 測試用財年 2026 的 period（'2026-01' … '2026-12'），對齊 API 的 `${year}-${month}` 格式
const buildPeriod = (month: number) => `2026-${String(month).padStart(2, '0')}`;

export const PERIODS = Array.from({ length: 12 }, (_, index) => buildPeriod(index + 1));

export const [JAN, FEB, MAR, APR] = PERIODS;
export const DEC = PERIODS[11];

// 產生 12 個月皆為 value 的 MonthBudgets，可用 overrides 覆寫特定 period
export const makeMonthBudgets = (
  value: FormBudget,
  overrides: Partial<MonthBudgets> = {}
): MonthBudgets => {
  const filled: MonthBudgets = {};
  PERIODS.forEach((period) => {
    filled[period] = value;
  });
  return Object.assign(filled, overrides);
};
