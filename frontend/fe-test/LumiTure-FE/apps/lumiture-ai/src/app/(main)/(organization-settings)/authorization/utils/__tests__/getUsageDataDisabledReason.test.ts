import { getUsageDataDisabledReason } from '../getUsageDataDisabledReason';

describe('getUsageDataDisabledReason', () => {
  describe('when billingCount is 0', () => {
    it('should return "no-billing"', () => {
      const result = getUsageDataDisabledReason(0, 0);
      expect(result).toBe('no-billing');
    });

    it('should return "no-billing" regardless of usageCount', () => {
      const result = getUsageDataDisabledReason(0, 5);
      expect(result).toBe('no-billing');
    });
  });

  describe('when billingCount equals usageCount', () => {
    it('should return "all-paired"', () => {
      const result = getUsageDataDisabledReason(3, 3);
      expect(result).toBe('all-paired');
    });

    it('should return "all-paired" when both are 1', () => {
      const result = getUsageDataDisabledReason(1, 1);
      expect(result).toBe('all-paired');
    });
  });

  describe('when billingCount is greater than usageCount', () => {
    it('should return null', () => {
      const result = getUsageDataDisabledReason(3, 1);
      expect(result).toBeNull();
    });

    it('should return null when usageCount is 0', () => {
      const result = getUsageDataDisabledReason(1, 0);
      expect(result).toBeNull();
    });
  });
});
