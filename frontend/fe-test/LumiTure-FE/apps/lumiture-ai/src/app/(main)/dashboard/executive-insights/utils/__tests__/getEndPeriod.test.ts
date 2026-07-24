import { getEndPeriod } from '../getEndPeriod';

describe('getEndPeriod', () => {
  describe('when endDate is absent', () => {
    it('should return "--" when endDate is undefined', () => {
      const result = getEndPeriod(undefined);

      expect(result).toBe('--');
    });

    it('should return "--" when endDate is empty string', () => {
      const result = getEndPeriod('');

      expect(result).toBe('--');
    });
  });

  describe('when endDate is provided', () => {
    it('should format endDate as "Period: MMM. yyyy"', () => {
      const result = getEndPeriod('2026-03-18');

      expect(result).toBe('Period: Mar. 2026');
    });

    it('should correctly format January', () => {
      const result = getEndPeriod('2026-01-01');

      expect(result).toBe('Period: Jan. 2026');
    });

    it('should correctly format December', () => {
      const result = getEndPeriod('2025-12-31');

      expect(result).toBe('Period: Dec. 2025');
    });

    it('should include the "Period: " prefix', () => {
      const result = getEndPeriod('2026-06-15');

      expect(result).toMatch(/^Period: /u);
    });
  });
});
