import { describe, expect, it } from 'vitest';

import { nFormatAbbreviation, nFormatter } from '../src/formatter';

describe('nFormatter', () => {
  it('should return "--" for null or undefined', () => {
    expect(nFormatter({ num: null })).toBe('--');
    expect(nFormatter({ num: undefined })).toBe('--');
  });

  it('should return "--" for NaN number input', () => {
    expect(nFormatter({ num: NaN })).toBe('--');
  });

  it('should return "--" for Infinity', () => {
    expect(nFormatter({ num: Infinity })).toBe('--');
    expect(nFormatter({ num: -Infinity })).toBe('--');
  });

  it('should return the original string for non-numeric string input', () => {
    expect(nFormatter({ num: 'N/A' })).toBe('N/A');
    expect(nFormatter({ num: 'abc' })).toBe('abc');
  });

  it('should format numeric string as number', () => {
    expect(nFormatter({ num: '1234' })).toBe('1,234');
  });

  it('should format integer correctly', () => {
    expect(nFormatter({ num: 0 })).toBe('0');
    expect(nFormatter({ num: 1000 })).toBe('1,000');
    expect(nFormatter({ num: 123456 })).toBe('123,456');
  });

  it('should apply fixed decimal places', () => {
    expect(nFormatter({ num: 1234.5, fixed: 2 })).toBe('1,234.50');
    expect(nFormatter({ num: 100, fixed: 3 })).toBe('100.000');
  });

  it('should apply prefix', () => {
    expect(nFormatter({ num: 100, prefix: '$' })).toBe('$100');
  });

  it('should apply suffix', () => {
    expect(nFormatter({ num: 100, suffix: '%' })).toBe('100%');
  });

  it('should apply both prefix and suffix', () => {
    expect(nFormatter({ num: 1000, prefix: '$', suffix: ' USD' })).toBe('$1,000 USD');
  });

  it('should handle negative numbers with prefix', () => {
    expect(nFormatter({ num: -500, prefix: '$' })).toBe('-$500');
  });

  it('should handle negative numbers without prefix', () => {
    expect(nFormatter({ num: -1234 })).toBe('-1,234');
  });

  it('should handle zero', () => {
    expect(nFormatter({ num: 0, prefix: '$' })).toBe('$0');
  });
});

describe('nFormatAbbreviation', () => {
  it('should return "--" for null or undefined', () => {
    expect(nFormatAbbreviation({ num: null })).toBe('--');
    expect(nFormatAbbreviation({ num: undefined })).toBe('--');
    expect(nFormatAbbreviation({})).toBe('--');
  });

  it('should return the original string for non-numeric string', () => {
    expect(nFormatAbbreviation({ num: 'N/A' })).toBe('N/A');
  });

  it('should not abbreviate numbers below 1,000', () => {
    expect(nFormatAbbreviation({ num: 0 })).toBe('0.00');
    expect(nFormatAbbreviation({ num: 999 })).toBe('999.00');
    expect(nFormatAbbreviation({ num: 50 })).toBe('50.00');
  });

  it('should abbreviate thousands with K', () => {
    expect(nFormatAbbreviation({ num: 1000 })).toBe('1K');
    expect(nFormatAbbreviation({ num: 1500 })).toBe('1.50K');
    expect(nFormatAbbreviation({ num: 99999 })).toBe('100.00K');
  });

  it('should abbreviate millions with M', () => {
    expect(nFormatAbbreviation({ num: 1000000 })).toBe('1M');
    expect(nFormatAbbreviation({ num: 2500000 })).toBe('2.50M');
  });

  it('should abbreviate billions with B', () => {
    expect(nFormatAbbreviation({ num: 1000000000 })).toBe('1B');
    expect(nFormatAbbreviation({ num: 3750000000 })).toBe('3.75B');
  });

  it('should abbreviate trillions with T', () => {
    expect(nFormatAbbreviation({ num: 1000000000000 })).toBe('1T');
  });

  it('should abbreviate quadrillions with Qa', () => {
    expect(nFormatAbbreviation({ num: 1e15 })).toBe('1Qa');
  });

  it('should abbreviate quintillions with Qi', () => {
    expect(nFormatAbbreviation({ num: 1e18 })).toBe('1Qi');
  });

  it('should omit decimal places when result is a whole number', () => {
    expect(nFormatAbbreviation({ num: 5000 })).toBe('5K');
    expect(nFormatAbbreviation({ num: 2000000 })).toBe('2M');
  });

  it('should apply prefix and suffix with abbreviation', () => {
    expect(nFormatAbbreviation({ num: 5000, prefix: '$' })).toBe('$5K');
    // suffix 接在單位符號之後，而非之前
    expect(nFormatAbbreviation({ num: 1500, suffix: '+' })).toBe('1.50K+');
    expect(nFormatAbbreviation({ num: 2651, suffix: '%' })).toBe('2.65K%');
    expect(nFormatAbbreviation({ num: -2500, prefix: '$', suffix: '%' })).toBe('-$2.50K%');
  });

  it('should handle negative numbers with abbreviation', () => {
    expect(nFormatAbbreviation({ num: -5000 })).toBe('-5K');
    expect(nFormatAbbreviation({ num: -2500000 })).toBe('-2.50M');
  });

  it('should handle negative numbers with prefix', () => {
    expect(nFormatAbbreviation({ num: -5000, prefix: '$' })).toBe('-$5K');
  });

  it('should respect custom fixed parameter', () => {
    expect(nFormatAbbreviation({ num: 1234, fixed: 1 })).toBe('1.2K');
    expect(nFormatAbbreviation({ num: 1234, fixed: 3 })).toBe('1.234K');
  });

  it('should return the string itself for numeric string (lodash isFinite returns false for strings)', () => {
    expect(nFormatAbbreviation({ num: '5000' })).toBe('5000');
    expect(nFormatAbbreviation({ num: '100' })).toBe('100');
  });
});
