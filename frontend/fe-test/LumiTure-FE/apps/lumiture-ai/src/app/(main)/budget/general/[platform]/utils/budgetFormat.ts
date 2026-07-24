import { isNumber } from 'lodash-es';

import { nFormatter } from '@shared/utils';

import { Month, type FiscalYearOption } from '@hooks-api';

import type { FormBudget } from '../types/budgetSettings';
import { isBudgetValid } from './budgetCalc';

const CURRENCY_PREFIX = '$';
const EMPTY_DISPLAY = '--';
const MONTH_ABBREVIATIONS = Object.values(Month);

interface ParsedYearMonth {
  abbreviation: string;
  shortYear: string;
}

// 'YYYY-MM' → { abbreviation: 'Feb', shortYear: '36' }
export const parseYearMonth = (yearMonth: string): ParsedYearMonth => {
  const [year, month] = yearMonth.split('-');
  const monthIndex = Number(month) - 1;
  return { abbreviation: MONTH_ABBREVIATIONS[monthIndex], shortYear: year.slice(-2) };
};

// null / 空字串（unlimited）→ '--'，否則前綴 $ 並以 nFormatter 格式化
export const formatBudgetDisplay = (value: FormBudget): string =>
  isBudgetValid(value)
    ? nFormatter({ num: Number(value), prefix: CURRENCY_PREFIX, fixed: 0 })
    : EMPTY_DISPLAY;

// Spent % 顯示：四捨五入加 % 後綴；無值顯示 '--'
export const formatSpentPercent = (spendPercentage: number | null | undefined): string =>
  isNumber(spendPercentage) ? `${nFormatter({ num: spendPercentage, fixed: 0 })}%` : EMPTY_DISPLAY;

// FiscalYearOption → `Feb. ’36 - Jan. ’37`（財年區間，不含 FY 前綴；FY 前綴由顯示元件組）
export const formatFiscalPeriodLabel = (option: FiscalYearOption): string => {
  const start = parseYearMonth(option.startMonth);
  const end = parseYearMonth(option.endMonth);
  return `${start.abbreviation}. ’${start.shortYear} - ${end.abbreviation}. ’${end.shortYear}`;
};
