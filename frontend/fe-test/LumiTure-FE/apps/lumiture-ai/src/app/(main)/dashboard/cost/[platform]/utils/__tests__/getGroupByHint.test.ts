import { PlatformsValue } from '@constants';
import {
  AWSGroupBy,
  AzureGroupBy,
  FOCUSGroupBy,
  GCPGroupBy,
  Granularity,
  type AWSFilter,
  type AzureFilter,
  type FOCUSFilter,
  type GCPFilter,
} from '@hooks-api';

import { getGroupByHint, GroupByHintKind } from '../getGroupByHint';

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

function createFOCUSFilter(overrides?: Partial<FOCUSFilter>): FOCUSFilter {
  return {
    startDate: '2026-02-17',
    endDate: '2026-03-18',
    period: Granularity.Day,
    groups: [],
    services: [],
    platform: [PlatformsValue.GCP, PlatformsValue.AWS],
    groupBy: { type: FOCUSGroupBy.Organization, key: null },
    credits: [],
    ...overrides,
  };
}

describe('getGroupByHint', () => {
  describe('GCP', () => {
    it('returns LumiTag hint when grouping by LumiTag', () => {
      expect(
        getGroupByHint(createGCPFilter({ groupBy: { type: GCPGroupBy.LumiTag, key: 'lt-1' } }))
      ).toBe(GroupByHintKind.LumiTag);
    });

    it('returns Label hint when grouping by LabelKey', () => {
      expect(
        getGroupByHint(createGCPFilter({ groupBy: { type: GCPGroupBy.LabelKey, key: 'env' } }))
      ).toBe(GroupByHintKind.Label);
    });

    it('returns null for built-in dimensions', () => {
      expect(
        getGroupByHint(createGCPFilter({ groupBy: { type: GCPGroupBy.Project, key: null } }))
      ).toBeNull();
    });
  });

  describe('AWS', () => {
    it('returns LumiTag hint when grouping by LumiTag', () => {
      expect(
        getGroupByHint(createAWSFilter({ groupBy: { type: AWSGroupBy.LumiTag, key: 'lt-1' } }))
      ).toBe(GroupByHintKind.LumiTag);
    });

    it('returns Tag hint when grouping by TagKey', () => {
      expect(
        getGroupByHint(createAWSFilter({ groupBy: { type: AWSGroupBy.TagKey, key: 'env' } }))
      ).toBe(GroupByHintKind.Tag);
    });

    it('returns null for built-in dimensions', () => {
      expect(
        getGroupByHint(createAWSFilter({ groupBy: { type: AWSGroupBy.Account, key: null } }))
      ).toBeNull();
    });
  });

  describe('Azure', () => {
    it('returns LumiTag hint when grouping by LumiTag', () => {
      expect(
        getGroupByHint(createAzureFilter({ groupBy: { type: AzureGroupBy.LumiTag, key: 'lt-1' } }))
      ).toBe(GroupByHintKind.LumiTag);
    });

    it('returns Tag hint when grouping by TagKey', () => {
      expect(
        getGroupByHint(createAzureFilter({ groupBy: { type: AzureGroupBy.TagKey, key: 'env' } }))
      ).toBe(GroupByHintKind.Tag);
    });

    it('returns null for built-in dimensions', () => {
      expect(
        getGroupByHint(
          createAzureFilter({ groupBy: { type: AzureGroupBy.ResourceGroup, key: null } })
        )
      ).toBeNull();
    });
  });

  describe('FOCUS', () => {
    it('returns null (no LumiTag/Label/Tag dimensions)', () => {
      expect(
        getGroupByHint(
          createFOCUSFilter({ groupBy: { type: FOCUSGroupBy.CloudServiceProvider, key: null } })
        )
      ).toBeNull();
    });
  });
});
