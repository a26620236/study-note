import { getFilterFormCostDashboard } from '../getFilterFormCostDashboard';

describe('getFilterFormCostDashboard', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true,
      configurable: true,
    });
  });

  describe('when window is undefined (SSR)', () => {
    it('should return undefined in SSR environment', () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error — intentionally removing window to simulate SSR
      delete globalThis.window;

      const result = getFilterFormCostDashboard();

      globalThis.window = originalWindow;
      expect(result).toBeUndefined();
    });
  });

  describe('when filter_values query param is absent', () => {
    it('should return undefined when search string is empty', () => {
      const result = getFilterFormCostDashboard();

      expect(result).toBeUndefined();
    });

    it('should return undefined when filter_values param is missing', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?other_param=value' },
        writable: true,
        configurable: true,
      });

      const result = getFilterFormCostDashboard();

      expect(result).toBeUndefined();
    });
  });

  describe('when filter_values query param is present', () => {
    it('should parse and return the filter values from query string', () => {
      const filterValues = {
        period: '0',
        group_by: 0,
        start_date: '2026-02-17',
        end_date: '2026-03-18',
      };
      const encoded = encodeURIComponent(JSON.stringify(filterValues));

      Object.defineProperty(window, 'location', {
        value: { search: `?filter_values=${encoded}` },
        writable: true,
        configurable: true,
      });

      const result = getFilterFormCostDashboard();

      expect(result).toEqual(filterValues);
    });
  });
});
