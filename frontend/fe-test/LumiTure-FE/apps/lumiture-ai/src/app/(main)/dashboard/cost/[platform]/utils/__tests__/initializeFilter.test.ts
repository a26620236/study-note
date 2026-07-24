import { CrossCloudValue, PlatformsValue } from '@constants';
import { Granularity } from '@hooks-api';

import { initializePlatformFilters } from '../initializeFilter';

describe('initializePlatformFilters', () => {
  beforeEach(() => {
    // 2026-03-19 → initializeDate produces startDate: 2026-02-17, endDate: 2026-03-18
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-19T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  describe('GCP filter initialization', () => {
    it('should use default dates when no filterValues provided', () => {
      const result = initializePlatformFilters.gcp(PlatformsValue.GCP);

      expect(result.startDate).toBe('2026-02-17');
      expect(result.endDate).toBe('2026-03-18');
    });

    it('should use filterValues dates when provided and platform matches', () => {
      const filterValues = {
        period: Granularity.Month,
        group_by: 3,
        start_date: '2026-01-01',
        end_date: '2026-01-31',
        projects: ['proj-a'],
      };

      const result = initializePlatformFilters.gcp(PlatformsValue.GCP, filterValues);

      expect(result.startDate).toBe('2026-01-01');
      expect(result.endDate).toBe('2026-01-31');
      expect(result.groupBy.type).toBe(3);
      expect(result.projects).toEqual(['proj-a']);
    });

    it('should NOT apply GCP-specific filterValues when platform is AWS', () => {
      const filterValues = {
        period: Granularity.Day,
        group_by: 3,
        start_date: '2026-01-01',
        end_date: '2026-01-31',
        projects: ['proj-a'],
      };

      const result = initializePlatformFilters.gcp(PlatformsValue.AWS, filterValues);

      // groupBy should fall back to default (GCPGroupBy.Organization = 0) when platform doesn't match
      expect(result.groupBy.type).toBe(0);
      expect(result.projects).toEqual([]);
    });

    it('should initialize GCP-specific fields with defaults', () => {
      const result = initializePlatformFilters.gcp(PlatformsValue.GCP);

      expect(result).toMatchObject({
        platform: 'gcp',
        groupBy: { type: 0, key: null },
        projects: [],
        skus: [],
        labels: [],
        credits: [],
      });
    });
  });

  describe('AWS filter initialization', () => {
    it('should initialize with default chargeTypes excluding Credit', () => {
      const result = initializePlatformFilters.aws(PlatformsValue.AWS);

      expect(result.chargeTypes).toContain('0'); // Usage
      expect(result.chargeTypes).not.toContain('1'); // Credit excluded by default
    });

    it('should initialize AWS-specific fields with defaults', () => {
      const result = initializePlatformFilters.aws(PlatformsValue.AWS);

      expect(result).toMatchObject({
        platform: 'aws',
        groupBy: { type: 0, key: null },
        accounts: [],
        skus: [],
        tags: [],
      });
    });

    it('should apply accounts from filterValues when platform is AWS', () => {
      const filterValues = {
        period: Granularity.Day,
        group_by: 3,
        start_date: '2026-01-01',
        end_date: '2026-01-31',
        accounts: ['acc-1', 'acc-2'],
      };

      const result = initializePlatformFilters.aws(PlatformsValue.AWS, filterValues);

      expect(result.accounts).toEqual(['acc-1', 'acc-2']);
    });

    it('should NOT apply AWS-specific filterValues when platform is GCP', () => {
      const filterValues = {
        period: Granularity.Day,
        group_by: 3,
        start_date: '2026-01-01',
        end_date: '2026-01-31',
        accounts: ['acc-1'],
      };

      const result = initializePlatformFilters.aws(PlatformsValue.GCP, filterValues);

      // shouldInitializeFilterValues = false，groupBy / accounts 應回到預設值
      expect(result.groupBy.type).toBe(0);
      expect(result.accounts).toEqual([]);
    });
  });

  describe('Azure filter initialization', () => {
    it('should initialize Azure-specific fields with defaults', () => {
      const result = initializePlatformFilters.azure(PlatformsValue.AZURE);

      expect(result).toMatchObject({
        platform: 'azure',
        groupBy: { type: 0, key: null },
        resourceGroups: [],
        skus: [],
        tags: [],
      });
    });

    it('should apply resourceGroups from filterValues when platform is Azure', () => {
      const filterValues = {
        period: Granularity.Day,
        group_by: 2,
        start_date: '2026-01-01',
        end_date: '2026-01-31',
        resourceGroups: ['rg-prod'],
      };

      const result = initializePlatformFilters.azure(PlatformsValue.AZURE, filterValues);

      expect(result.resourceGroups).toEqual(['rg-prod']);
    });

    it('should NOT apply Azure-specific filterValues when platform is GCP', () => {
      const filterValues = {
        period: Granularity.Day,
        group_by: 2,
        start_date: '2026-01-01',
        end_date: '2026-01-31',
        resourceGroups: ['rg-prod'],
      };

      const result = initializePlatformFilters.azure(PlatformsValue.GCP, filterValues);

      // shouldInitializeFilterValues = false，groupBy / resourceGroups 應回到預設值
      expect(result.groupBy.type).toBe(0);
      expect(result.resourceGroups).toEqual([]);
    });
  });

  describe('FOCUS filter initialization', () => {
    it('should initialize FOCUS-specific fields with defaults', () => {
      const result = initializePlatformFilters.focus(CrossCloudValue.FOCUS);

      expect(result).toMatchObject({
        platform: [],
        groupBy: { type: 0, key: null },
      });
    });

    it('should set credits to [Off] (0) by default', () => {
      const result = initializePlatformFilters.focus(CrossCloudValue.FOCUS);

      expect(result.credits).toEqual([0]);
    });

    it('should use default dates', () => {
      const result = initializePlatformFilters.focus(CrossCloudValue.FOCUS);

      expect(result.startDate).toBe('2026-02-17');
      expect(result.endDate).toBe('2026-03-18');
    });

    it('should use filterValues dates when provided', () => {
      const filterValues = {
        period: Granularity.Month,
        group_by: 0,
        start_date: '2026-01-01',
        end_date: '2026-01-31',
      };

      const result = initializePlatformFilters.focus(CrossCloudValue.FOCUS, filterValues);

      expect(result.startDate).toBe('2026-01-01');
      expect(result.endDate).toBe('2026-01-31');
    });
  });
});
