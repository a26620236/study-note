import { PlatformsValue } from '@constants';
import {
  AWSGroupBy,
  AzureGroupBy,
  GCPGroupBy,
  Granularity,
  type AWSFilter,
  type AzureFilter,
  type GCPFilter,
} from '@hooks-api';

import { validateAIAnalysisFilters } from '../validateAIAnalysisFilters';

function createGCPFilter(overrides?: Partial<GCPFilter>): GCPFilter {
  return {
    startDate: '2026-02-17',
    endDate: '2026-03-18',
    period: Granularity.Day,
    groups: [],
    services: [],
    platform: PlatformsValue.GCP,
    groupBy: { type: GCPGroupBy.Organization, key: null },
    projects: [],
    skus: [],
    labels: [],
    lumitag: [],
    credits: [],
    ...overrides,
  };
}

function createAWSFilter(overrides?: Partial<AWSFilter>): AWSFilter {
  return {
    startDate: '2026-02-17',
    endDate: '2026-03-18',
    period: Granularity.Day,
    groups: [],
    services: [],
    platform: PlatformsValue.AWS,
    groupBy: { type: AWSGroupBy.Organization, key: null },
    accounts: [],
    skus: [],
    tags: [],
    lumitag: [],
    chargeTypes: [],
    ...overrides,
  };
}

function createAzureFilter(overrides?: Partial<AzureFilter>): AzureFilter {
  return {
    startDate: '2026-02-17',
    endDate: '2026-03-18',
    period: Granularity.Day,
    groups: [],
    services: [],
    platform: PlatformsValue.AZURE,
    groupBy: { type: AzureGroupBy.Organization, key: null },
    resourceGroups: [],
    skus: [],
    tags: [],
    lumitag: [],
    ...overrides,
  };
}

describe('validateAIAnalysisFilters', () => {
  describe('date range validation (shared across platforms)', () => {
    it('should return true when date range is within 31 days', () => {
      const result = validateAIAnalysisFilters(
        createGCPFilter({
          startDate: '2026-02-01',
          endDate: '2026-03-01',
        })
      );

      expect(result).toBe(true);
    });

    it('should return false when date range exceeds 31 days', () => {
      const result = validateAIAnalysisFilters(
        createGCPFilter({
          startDate: '2026-01-01',
          endDate: '2026-02-02',
        })
      );

      expect(result).toBe(false);
    });

    it('should return true when date range is exactly 31 days', () => {
      const result = validateAIAnalysisFilters(
        createGCPFilter({
          startDate: '2026-02-01',
          endDate: '2026-03-04',
        })
      );

      expect(result).toBe(true);
    });

    it('should return true when startDate is empty (treated as absent)', () => {
      // Empty string is falsy — isDateRangeExceedsLimit returns false early
      const result = validateAIAnalysisFilters(createGCPFilter({ startDate: '' }));

      expect(result).toBe(true);
    });

    it('should return true when endDate is empty (treated as absent)', () => {
      const result = validateAIAnalysisFilters(createGCPFilter({ endDate: '' }));

      expect(result).toBe(true);
    });
  });

  describe('GCP group by validation', () => {
    it('should return false when groupBy is LabelKey', () => {
      const result = validateAIAnalysisFilters(
        createGCPFilter({ groupBy: { type: GCPGroupBy.LabelKey, key: 'env' } })
      );

      expect(result).toBe(false);
    });

    it('should return false when groupBy is LumiTag', () => {
      const result = validateAIAnalysisFilters(
        createGCPFilter({ groupBy: { type: GCPGroupBy.LumiTag, key: '123' } })
      );

      expect(result).toBe(false);
    });

    it('should return false when groupBy is Sku', () => {
      const result = validateAIAnalysisFilters(
        createGCPFilter({ groupBy: { type: GCPGroupBy.Sku, key: null } })
      );

      expect(result).toBe(false);
    });

    it('should return true when groupBy is Organization', () => {
      const result = validateAIAnalysisFilters(
        createGCPFilter({ groupBy: { type: GCPGroupBy.Organization, key: null } })
      );

      expect(result).toBe(true);
    });

    it('should return true when groupBy is Project', () => {
      const result = validateAIAnalysisFilters(
        createGCPFilter({ groupBy: { type: GCPGroupBy.Project, key: null } })
      );

      expect(result).toBe(true);
    });
  });

  describe('AWS group by validation', () => {
    it('should return false when groupBy is TagKey', () => {
      const result = validateAIAnalysisFilters(
        createAWSFilter({ groupBy: { type: AWSGroupBy.TagKey, key: 'env' } })
      );

      expect(result).toBe(false);
    });

    it('should return false when groupBy is LumiTag', () => {
      const result = validateAIAnalysisFilters(
        createAWSFilter({ groupBy: { type: AWSGroupBy.LumiTag, key: '123' } })
      );

      expect(result).toBe(false);
    });

    it('should return false when groupBy is Sku', () => {
      const result = validateAIAnalysisFilters(
        createAWSFilter({ groupBy: { type: AWSGroupBy.Sku, key: null } })
      );

      expect(result).toBe(false);
    });

    it('should return true when groupBy is Organization', () => {
      const result = validateAIAnalysisFilters(
        createAWSFilter({ groupBy: { type: AWSGroupBy.Organization, key: null } })
      );

      expect(result).toBe(true);
    });

    it('should return true when groupBy is Account', () => {
      const result = validateAIAnalysisFilters(
        createAWSFilter({ groupBy: { type: AWSGroupBy.Account, key: null } })
      );

      expect(result).toBe(true);
    });
  });

  describe('Azure group by validation', () => {
    it('should return false when groupBy is TagKey', () => {
      const result = validateAIAnalysisFilters(
        createAzureFilter({ groupBy: { type: AzureGroupBy.TagKey, key: 'env' } })
      );

      expect(result).toBe(false);
    });

    it('should return false when groupBy is LumiTag', () => {
      const result = validateAIAnalysisFilters(
        createAzureFilter({ groupBy: { type: AzureGroupBy.LumiTag, key: '123' } })
      );

      expect(result).toBe(false);
    });

    it('should return false when groupBy is Sku', () => {
      const result = validateAIAnalysisFilters(
        createAzureFilter({ groupBy: { type: AzureGroupBy.Sku, key: null } })
      );

      expect(result).toBe(false);
    });

    it('should return true when groupBy is Organization', () => {
      const result = validateAIAnalysisFilters(
        createAzureFilter({ groupBy: { type: AzureGroupBy.Organization, key: null } })
      );

      expect(result).toBe(true);
    });

    it('should return true when groupBy is ResourceGroup', () => {
      const result = validateAIAnalysisFilters(
        createAzureFilter({ groupBy: { type: AzureGroupBy.ResourceGroup, key: null } })
      );

      expect(result).toBe(true);
    });
  });

  describe('Granularity.Month period', () => {
    it('should return false when date range exceeds 31 days with Month granularity', () => {
      // period 不影響日期驗證邏輯，validateAIAnalysisFilters 只看 startDate / endDate 字串
      const result = validateAIAnalysisFilters(
        createGCPFilter({
          period: Granularity.Month,
          startDate: '2026-01-01',
          endDate: '2026-02-02',
        })
      );

      expect(result).toBe(false);
    });

    it('should return true when date range is within 31 days with Month granularity', () => {
      const result = validateAIAnalysisFilters(
        createGCPFilter({
          period: Granularity.Month,
          startDate: '2026-01-01',
          endDate: '2026-01-31',
        })
      );

      expect(result).toBe(true);
    });
  });
});
