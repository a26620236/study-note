import { PlatformsValue } from '@constants';
import {
  AWSChargeTypes,
  AWSGroupBy,
  AzureGroupBy,
  GCPCredit,
  GCPGroupBy,
  Granularity,
  type AWSFilter,
  type AzureFilter,
  type GCPFilter,
} from '@hooks-api';

import { transformFilterToPayload } from '../transformFilterToPayload';

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

describe('transformFilterToPayload', () => {
  describe("withDefaultAll — empty arrays become ['all']", () => {
    it("should convert empty groups to ['all'] for GCP", () => {
      const result = transformFilterToPayload(createGCPFilter({ groups: [] }));

      expect(result.groups).toEqual(['all']);
    });

    it('should keep non-empty groups as-is for GCP', () => {
      const result = transformFilterToPayload(createGCPFilter({ groups: ['group-1', 'group-2'] }));

      expect(result.groups).toEqual(['group-1', 'group-2']);
    });

    it("should convert empty projects to ['all'] for GCP", () => {
      const result = transformFilterToPayload(createGCPFilter({ projects: [] }));

      expect(result).toMatchObject({ projects: ['all'] });
    });

    it('should keep non-empty projects as-is for GCP', () => {
      const result = transformFilterToPayload(createGCPFilter({ projects: ['proj-a'] }));

      expect(result).toMatchObject({ projects: ['proj-a'] });
    });
  });

  describe('GCP filter (projects in filter)', () => {
    it('should include all GCP-specific fields in payload', () => {
      const filter = createGCPFilter({
        projects: ['proj-1'],
        skus: ['sku-1'],
        credits: [GCPCredit.CommittedUsageDiscount],
        labels: [],
        groupBy: { type: GCPGroupBy.LabelKey, key: 'env' },
      });

      const result = transformFilterToPayload(filter);

      expect(result).toMatchObject({
        startDate: '2026-02-17',
        endDate: '2026-03-18',
        groupBy: { type: GCPGroupBy.LabelKey, key: 'env' },
        credits: [GCPCredit.CommittedUsageDiscount],
        labels: [],
      });
    });

    it('should not include AWS-specific fields (accounts) in GCP payload', () => {
      const result = transformFilterToPayload(createGCPFilter());

      expect(result).not.toHaveProperty('accounts');
    });
  });

  describe('AWS filter (accounts in filter)', () => {
    it('should include all AWS-specific fields in payload', () => {
      const filter = createAWSFilter({
        accounts: ['acc-1'],
        chargeTypes: [AWSChargeTypes.Usage, AWSChargeTypes.Credit],
        tags: [],
        groupBy: { type: AWSGroupBy.TagKey, key: 'env' },
      });

      const result = transformFilterToPayload(filter);

      expect(result).toMatchObject({
        startDate: '2026-02-17',
        endDate: '2026-03-18',
        chargeTypes: [AWSChargeTypes.Usage, AWSChargeTypes.Credit],
        tags: [],
        groupBy: { type: AWSGroupBy.TagKey, key: 'env' },
      });
    });

    it("should convert empty accounts to ['all']", () => {
      const result = transformFilterToPayload(createAWSFilter({ accounts: [] }));

      expect(result).toMatchObject({ accounts: ['all'] });
    });

    it('should not include GCP-specific fields (projects) in AWS payload', () => {
      const result = transformFilterToPayload(createAWSFilter());

      expect(result).not.toHaveProperty('projects');
    });
  });

  describe('Azure filter (resourceGroups in filter)', () => {
    it('should include all Azure-specific fields in payload', () => {
      const filter = createAzureFilter({
        resourceGroups: ['rg-1'],
        tags: [],
        groupBy: { type: AzureGroupBy.TagKey, key: 'env' },
      });

      const result = transformFilterToPayload(filter);

      expect(result).toMatchObject({
        startDate: '2026-02-17',
        endDate: '2026-03-18',
        tags: [],
        groupBy: { type: AzureGroupBy.TagKey, key: 'env' },
      });
    });

    it("should convert empty resourceGroups to ['all']", () => {
      const result = transformFilterToPayload(createAzureFilter({ resourceGroups: [] }));

      expect(result).toMatchObject({ resourceGroups: ['all'] });
    });

    it('should not include GCP-specific fields (projects) in Azure payload', () => {
      const result = transformFilterToPayload(createAzureFilter());

      expect(result).not.toHaveProperty('projects');
    });
  });
});
