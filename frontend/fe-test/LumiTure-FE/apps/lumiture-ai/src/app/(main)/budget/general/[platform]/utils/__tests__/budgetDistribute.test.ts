import { MAXIMUM_BUDGET, MONTHS } from '../../constants/budget';
import { handleAllocateBudget, handleBalanceBudget, handleFillBudget } from '../budgetDistribute';
import { DEC, JAN, makeMonthBudgets } from './budgetTestUtils';

describe('handleAllocateBudget', () => {
  it('should evenly allocate the amount across months for a single group', () => {
    const result = handleAllocateBudget(makeMonthBudgets(0), MONTHS * 100);
    expect(result[JAN]).toBe(100);
  });

  it('should split the amount across the selected groups', () => {
    const result = handleAllocateBudget(makeMonthBudgets(0), MONTHS * 100 * 2, 2);
    expect(result[JAN]).toBe(100);
  });

  it('should round the per-month amount down when not divisible', () => {
    const result = handleAllocateBudget(makeMonthBudgets(0), 1300);
    // floor(1300 / 12) = 108
    expect(Object.values(result)).toEqual(Array(MONTHS).fill(108));
  });

  it('should cap each month at the maximum', () => {
    const result = handleAllocateBudget(makeMonthBudgets(0), (MAXIMUM_BUDGET + 1) * MONTHS);
    expect(Object.values(result)).toEqual(Array(MONTHS).fill(MAXIMUM_BUDGET));
  });
});

describe('handleFillBudget', () => {
  it('should fill every month with the amount', () => {
    const result = handleFillBudget(makeMonthBudgets(0), 50);
    expect(result[JAN]).toBe(50);
    expect(result[DEC]).toBe(50);
  });

  it('should cap each month at the maximum', () => {
    const result = handleFillBudget(makeMonthBudgets(0), MAXIMUM_BUDGET + 1);
    expect(Object.values(result)).toEqual(Array(MONTHS).fill(MAXIMUM_BUDGET));
  });
});

describe('handleBalanceBudget', () => {
  it('should rebalance the total evenly across months', () => {
    const result = handleBalanceBudget(makeMonthBudgets(100));
    expect(result[JAN]).toBe(100);
  });

  it('should round the rebalanced per-month amount down when not divisible', () => {
    const result = handleBalanceBudget(makeMonthBudgets(100, { [JAN]: 113 }));
    // sum = 100 * 11 + 113 = 1213 → floor(1213 / 12) = 101
    expect(Object.values(result)).toEqual(Array(MONTHS).fill(101));
  });
});
