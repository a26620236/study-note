import { PlatformsValue } from '@constants';
import {
  AWSChargeTypes,
  AWSGroupBy,
  AzureGroupBy,
  FOCUSCredit,
  FOCUSGroupBy,
  GCPCredit,
  GCPGroupBy,
  Granularity,
  type AWSFilter,
  type AzureFilter,
  type FOCUSFilter,
  type GCPFilter,
} from '@hooks-api';

import { hasCreditsSelected } from '../hasCreditsSelected';

function createGCPFilter(credits: GCPCredit[]): GCPFilter {
  return {
    startDate: '2026-02-17',
    endDate: '2026-03-18',
    period: Granularity.Day,
    groups: [],
    services: [],
    platform: PlatformsValue.GCP,
    groupBy: { type: GCPGroupBy.Organization, key: null },
    projects: ['proj-1'],
    skus: [],
    labels: [],
    lumitag: [],
    credits,
  };
}

function createAWSFilter(chargeTypes: AWSChargeTypes[]): AWSFilter {
  return {
    startDate: '2026-02-17',
    endDate: '2026-03-18',
    period: Granularity.Day,
    groups: [],
    services: [],
    platform: PlatformsValue.AWS,
    groupBy: { type: AWSGroupBy.Organization, key: null },
    accounts: ['acc-1'],
    skus: [],
    tags: [],
    lumitag: [],
    chargeTypes,
  };
}

function createAzureFilter(): AzureFilter {
  return {
    startDate: '2026-02-17',
    endDate: '2026-03-18',
    period: Granularity.Day,
    groups: [],
    services: [],
    platform: PlatformsValue.AZURE,
    groupBy: { type: AzureGroupBy.Organization, key: null },
    resourceGroups: ['rg-1'],
    skus: [],
    tags: [],
    lumitag: [],
  };
}

function createFOCUSFilter(credits: FOCUSCredit[]): FOCUSFilter {
  return {
    startDate: '2026-02-17',
    endDate: '2026-03-18',
    period: Granularity.Day,
    groups: [],
    services: [],
    platform: [],
    groupBy: { type: FOCUSGroupBy.Organization, key: null },
    credits,
  };
}

describe('hasCreditsSelected', () => {
  describe('GCP (projects in filter)', () => {
    it('should return true when credits array is non-empty', () => {
      const result = hasCreditsSelected(
        PlatformsValue.GCP,
        createGCPFilter([GCPCredit.CommittedUsageDiscount])
      );

      expect(result).toBe(true);
    });

    it('should return false when credits array is empty', () => {
      const result = hasCreditsSelected(PlatformsValue.GCP, createGCPFilter([]));

      expect(result).toBe(false);
    });

    it('should return true when credits array has multiple items', () => {
      const result = hasCreditsSelected(
        PlatformsValue.GCP,
        createGCPFilter([GCPCredit.FreeTier, GCPCredit.Discount])
      );

      expect(result).toBe(true);
    });
  });

  describe('AWS (accounts in filter)', () => {
    it('should return true when chargeTypes includes Credit', () => {
      const result = hasCreditsSelected(
        PlatformsValue.AWS,
        createAWSFilter([AWSChargeTypes.Usage, AWSChargeTypes.Credit, AWSChargeTypes.SupportFees])
      );

      expect(result).toBe(true);
    });

    it('should return false when chargeTypes does not include Credit', () => {
      const result = hasCreditsSelected(
        PlatformsValue.AWS,
        createAWSFilter([
          AWSChargeTypes.Usage,
          AWSChargeTypes.OtherOutOfCycleCharge,
          AWSChargeTypes.SupportFees,
          AWSChargeTypes.Tax,
        ])
      );

      expect(result).toBe(false);
    });

    it('should return false when chargeTypes is empty', () => {
      const result = hasCreditsSelected(PlatformsValue.AWS, createAWSFilter([]));

      expect(result).toBe(false);
    });
  });

  describe('Azure (resourceGroups in filter)', () => {
    it('should always return false regardless of filter content', () => {
      const result = hasCreditsSelected(PlatformsValue.AZURE, createAzureFilter());

      expect(result).toBe(false);
    });
  });

  describe('FOCUS', () => {
    it('should return true when credits[0] is On (1)', () => {
      const result = hasCreditsSelected(PlatformsValue.GCP, createFOCUSFilter([FOCUSCredit.On]));

      expect(result).toBe(true);
    });

    it('should return false when credits[0] is Off (0)', () => {
      const result = hasCreditsSelected(PlatformsValue.GCP, createFOCUSFilter([FOCUSCredit.Off]));

      expect(result).toBe(false);
    });
  });
});
