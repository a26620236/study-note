import { MAXIMUM_BUDGET, MONTHS } from '../../constants/budget';
import {
  calculateTotalBudget,
  handleGetTotalRowBudget,
  isBudgetValid,
  validateMaxBudget,
} from '../budgetCalc';
import { JAN, makeMonthBudgets } from './budgetTestUtils';

describe('isBudgetValid', () => {
  it('should treat null and empty string as invalid', () => {
    expect(isBudgetValid(null)).toBe(false);
    expect(isBudgetValid('')).toBe(false);
  });

  it('should treat numbers (including 0) and numeric strings as valid', () => {
    expect(isBudgetValid(0)).toBe(true);
    expect(isBudgetValid('0')).toBe(true);
    expect(isBudgetValid(50)).toBe(true);
    expect(isBudgetValid('50')).toBe(true);
  });
});

describe('calculateTotalBudget', () => {
  it('should sum valid numbers and numeric strings', () => {
    expect(calculateTotalBudget([10, '20', 30])).toBe(60);
  });

  it('should return null when any value is null', () => {
    expect(calculateTotalBudget([10, null])).toBeNull();
  });

  it('should return null when any value is an empty string', () => {
    expect(calculateTotalBudget([10, ''])).toBeNull();
  });

  it('should return 0 for an empty array', () => {
    expect(calculateTotalBudget([])).toBe(0);
  });
});


describe('validateMaxBudget', () => {
  it('should return the value unchanged when it is null', () => {
    expect(validateMaxBudget(null)).toBeNull();
  });

  it('should cap values above the maximum', () => {
    expect(validateMaxBudget(MAXIMUM_BUDGET + 1)).toBe(MAXIMUM_BUDGET);
  });

  it('should keep a value equal to the maximum uncapped', () => {
    expect(validateMaxBudget(MAXIMUM_BUDGET)).toBe(MAXIMUM_BUDGET);
  });

  it('should return the numeric value when within range', () => {
    expect(validateMaxBudget('50')).toBe(50);
  });

  it('should treat an empty string as 0', () => {
    expect(validateMaxBudget('')).toBe(0);
  });

  it('should return NaN for non-numeric strings', () => {
    expect(validateMaxBudget('abc')).toBeNaN();
  });
});

describe('handleGetTotalRowBudget', () => {
  it('should sum every month in the row', () => {
    expect(handleGetTotalRowBudget(makeMonthBudgets(10))).toBe(10 * MONTHS);
  });

  it('should return null when a month is unset', () => {
    expect(handleGetTotalRowBudget(makeMonthBudgets(10, { [JAN]: null }))).toBeNull();
  });
});


