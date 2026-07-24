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

import { getGroupByLabel } from '../getGroupByLabel';

const LUMI_TAG_KEYS = [
  { id: 'lt-1', name: 'Environment' },
  { id: 'lt-2', name: 'Team' },
];

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

describe('getGroupByLabel', () => {
  describe('GCP', () => {
    it('returns the built-in dimension name with empty value for non-key dimensions', () => {
      const result = getGroupByLabel(
        createGCPFilter({ groupBy: { type: GCPGroupBy.Project, key: null } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'Project', value: '' });
    });

    it('returns Label prefix with the raw key for LabelKey dimension', () => {
      const result = getGroupByLabel(
        createGCPFilter({ groupBy: { type: GCPGroupBy.LabelKey, key: 'env' } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'Label', value: 'env' });
    });

    it('resolves the LumiTag key id to its name', () => {
      const result = getGroupByLabel(
        createGCPFilter({ groupBy: { type: GCPGroupBy.LumiTag, key: 'lt-1' } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'LumiTag', value: 'Environment' });
    });

    it('falls back to empty value when the LumiTag key id is unknown', () => {
      const result = getGroupByLabel(
        createGCPFilter({ groupBy: { type: GCPGroupBy.LumiTag, key: 'unknown' } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'LumiTag', value: '' });
    });
  });

  describe('AWS', () => {
    it('returns the built-in dimension name with empty value for non-key dimensions', () => {
      const result = getGroupByLabel(
        createAWSFilter({ groupBy: { type: AWSGroupBy.Account, key: null } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'Account', value: '' });
    });

    it('returns Tag prefix with the raw key for TagKey dimension', () => {
      const result = getGroupByLabel(
        createAWSFilter({ groupBy: { type: AWSGroupBy.TagKey, key: 'cost-center' } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'Tag', value: 'cost-center' });
    });

    it('resolves the LumiTag key id to its name', () => {
      const result = getGroupByLabel(
        createAWSFilter({ groupBy: { type: AWSGroupBy.LumiTag, key: 'lt-2' } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'LumiTag', value: 'Team' });
    });
  });

  describe('Azure', () => {
    it('returns the built-in dimension name with empty value for non-key dimensions', () => {
      const result = getGroupByLabel(
        createAzureFilter({ groupBy: { type: AzureGroupBy.ResourceGroup, key: null } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'Resource Group', value: '' });
    });

    it('returns Tag prefix with the raw key for TagKey dimension', () => {
      const result = getGroupByLabel(
        createAzureFilter({ groupBy: { type: AzureGroupBy.TagKey, key: 'env' } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'Tag', value: 'env' });
    });

    it('resolves the LumiTag key id to its name', () => {
      const result = getGroupByLabel(
        createAzureFilter({ groupBy: { type: AzureGroupBy.LumiTag, key: 'lt-1' } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'LumiTag', value: 'Environment' });
    });
  });

  describe('FOCUS', () => {
    it('returns the built-in dimension name with empty value (no key dimensions)', () => {
      const result = getGroupByLabel(
        createFOCUSFilter({ groupBy: { type: FOCUSGroupBy.CloudServiceProvider, key: null } }),
        LUMI_TAG_KEYS
      );

      expect(result).toEqual({ prefix: 'Cloud Service Provider', value: '' });
    });
  });
});
