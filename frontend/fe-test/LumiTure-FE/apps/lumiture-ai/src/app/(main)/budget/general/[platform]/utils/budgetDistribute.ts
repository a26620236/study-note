import { mapValues, sumBy } from 'lodash-es';

import { MONTHS } from '../constants/budget';
import type { MonthBudgets } from '../types/budgetSettings';
import { validateMaxBudget } from './budgetCalc';

export const handleAllocateBudget = (
  segmentPeriod: MonthBudgets,
  amount: number,
  selectedGroupsCnt = 1
): MonthBudgets => {
  const newBudget = Math.floor(amount / (selectedGroupsCnt * MONTHS));
  return mapValues(segmentPeriod, () => validateMaxBudget(newBudget));
};

export const handleFillBudget = (segmentPeriod: MonthBudgets, amount: number): MonthBudgets =>
  mapValues(segmentPeriod, () => validateMaxBudget(amount));

export const handleBalanceBudget = (segmentPeriod: MonthBudgets): MonthBudgets => {
  const sum = sumBy(Object.values(segmentPeriod), Number);
  const newBudget = Math.floor(sum / MONTHS);
  return mapValues(segmentPeriod, () => validateMaxBudget(newBudget));
};
