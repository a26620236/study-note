import {
  formatRelativeTime,
  formatUtcToLocalTime,
  getFormattedDatePeriod,
  isEqualDate,
} from '../src/time';

describe('time utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatUtcToLocalTime', () => {
    it('should return "--" for empty string', () => {
      expect(formatUtcToLocalTime('')).toBe('--');
    });

    it('should format a UTC date string with the default format dd/MM/yyyy', () => {
      expect(formatUtcToLocalTime('2024-01-15T00:00:00.000Z')).toBe('15/01/2024');
    });

    it('should format with a custom format string', () => {
      expect(formatUtcToLocalTime('2024-06-01T00:00:00.000Z', 'yyyy-MM-dd')).toBe('2024-06-01');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "--" for empty string', () => {
      expect(formatRelativeTime('')).toBe('--');
    });

    it('should return a relative time string ending with "ago"', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));

      const result = formatRelativeTime('2024-01-15T09:00:00.000Z');

      expect(result).toContain('ago');
    });
  });

  describe('getFormattedDatePeriod', () => {
    it('should return "--" when startDate is null', () => {
      expect(getFormattedDatePeriod(null, '2024-01-31T00:00:00.000Z')).toBe('--');
    });

    it('should return "--" when endDate is null', () => {
      expect(getFormattedDatePeriod('2024-01-01T00:00:00.000Z', null)).toBe('--');
    });

    it('should return "--" when both dates are null', () => {
      expect(getFormattedDatePeriod(null, null)).toBe('--');
    });

    it('should format a date period with " ~ " separator', () => {
      const result = getFormattedDatePeriod('2024-01-01T00:00:00.000Z', '2024-01-31T00:00:00.000Z');
      expect(result).toBe('01/01/2024 ~ 31/01/2024');
    });
  });

  describe('isEqualDate', () => {
    it('should return true for two dates on the same calendar day', () => {
      const dayA = new Date(2024, 0, 15, 8, 0, 0);
      const dayB = new Date(2024, 0, 15, 20, 0, 0);
      expect(isEqualDate(dayA, dayB)).toBe(true);
    });

    it('should return false for two dates on different calendar days', () => {
      const dayA = new Date(2024, 0, 15);
      const dayB = new Date(2024, 0, 16);
      expect(isEqualDate(dayA, dayB)).toBe(false);
    });

    it('should return true for the same Date object', () => {
      const day = new Date(2024, 5, 15, 12, 0, 0);
      expect(isEqualDate(day, day)).toBe(true);
    });
  });
});
