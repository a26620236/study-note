import type { FiscalYearOption } from '@hooks-api';

import { formatBudgetDisplay, formatFiscalPeriodLabel, formatSpentPercent } from '../budgetFormat';

describe('formatBudgetDisplay', () => {
  it('should show -- for unlimited (null / empty string)', () => {
    expect(formatBudgetDisplay(null)).toBe('--');
    expect(formatBudgetDisplay('')).toBe('--');
  });

  it('should prefix valid values with $', () => {
    expect(formatBudgetDisplay(0).startsWith('$')).toBe(true);
    expect(formatBudgetDisplay(50).startsWith('$')).toBe(true);
  });

  it('should coerce numeric strings the same as numbers', () => {
    expect(formatBudgetDisplay('50')).toBe(formatBudgetDisplay(50));
  });
});

describe('formatSpentPercent', () => {
  it('四捨五入為整數並加上 % 後綴', () => {
    expect(formatSpentPercent(80.4)).toBe('80%');
    expect(formatSpentPercent(80.5)).toBe('81%');
  });

  it('無值時顯示 --', () => {
    expect(formatSpentPercent(null)).toBe('--');
    expect(formatSpentPercent(undefined)).toBe('--');
  });
});

describe('formatFiscalPeriodLabel', () => {
  it('組出財年區間標籤', () => {
    const option: FiscalYearOption = {
      fiscalYear: 2036,
      startMonth: '2036-02',
      endMonth: '2037-01',
    };
    expect(formatFiscalPeriodLabel(option)).toBe('Feb. ’36 - Jan. ’37');
  });
});
