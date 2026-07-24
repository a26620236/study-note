import { formatFiscalMonth } from '../formatFiscalMonth';

describe('formatFiscalMonth', () => {
  it('should format a date as abbreviated month + two-digit year', () => {
    expect(formatFiscalMonth(new Date(2036, 1, 1))).toBe('Feb. ’36');
  });

  it('should use the given date own year for the two-digit suffix', () => {
    expect(formatFiscalMonth(new Date(2037, 0, 1))).toBe('Jan. ’37');
  });

  it('should zero-pad the two-digit year', () => {
    expect(formatFiscalMonth(new Date(2000, 0, 1))).toBe('Jan. ’00');
  });

  it('should format the last month of the year', () => {
    expect(formatFiscalMonth(new Date(2036, 11, 1))).toBe('Dec. ’36');
  });
});
