import type { GroupRow, GroupRowBase, PeriodData } from '@hooks-api';

import { toFormValues } from '../budgetTransform';
import { FEB, JAN } from './budgetTestUtils';

const makeGroupRow = (
  id: number,
  name: string,
  periodValues: Partial<Record<string, number | null>>
): GroupRow => {
  const base: GroupRowBase = { id, name, total: null, spend: null, remaining: null, spendPercentage: null };
  const periods: Record<string, PeriodData> = Object.fromEntries(
    Object.entries(periodValues).map(([period, value]) => [
      period,
      { value: value ?? null, plannedBudget: null },
    ])
  );
  return Object.assign(base, periods);
};

describe('toFormValues', () => {
  it('should map groups into a budget record keyed by group id', () => {
    const groups: GroupRow[] = [makeGroupRow(1, 'A', { [JAN]: 10, [FEB]: null })];

    expect(toFormValues(groups, [JAN, FEB])).toEqual({
      '1': { [JAN]: 10, [FEB]: null },
    });
  });
});

