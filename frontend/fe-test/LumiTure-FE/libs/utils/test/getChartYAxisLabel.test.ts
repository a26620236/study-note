import { getChartYAxisLabel } from '../src/getChartYAxisLabel';

describe('getChartYAxisLabel', () => {
  it('should return "0" for 0', () => {
    expect(getChartYAxisLabel(0)).toBe('0');
  });

  it('should format numbers below 1000 with fixed decimals (default 2)', () => {
    expect(getChartYAxisLabel(500)).toBe('500.00');
    expect(getChartYAxisLabel(1)).toBe('1.00');
    expect(getChartYAxisLabel(999.9)).toBe('999.90');
  });

  it('should respect custom fixed parameter for numbers below 1000', () => {
    expect(getChartYAxisLabel(500, 0)).toBe('500');
    expect(getChartYAxisLabel(123.456, 1)).toBe('123.5');
  });

  it('should abbreviate numbers >= 1000 using K/M/B', () => {
    expect(getChartYAxisLabel(1000)).toBe('1K');
    expect(getChartYAxisLabel(1500)).toBe('1.50K');
    expect(getChartYAxisLabel(1000000)).toBe('1M');
    expect(getChartYAxisLabel(1000000000)).toBe('1B');
  });

  it('should handle negative numbers below -1000', () => {
    expect(getChartYAxisLabel(-500)).toBe('-500.00');
    expect(getChartYAxisLabel(-1500)).toBe('-1.50K');
  });
});
