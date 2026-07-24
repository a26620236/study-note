import { CrossCloudValue, PlatformsValue, type PlatformValueWithFOCUS } from '@constants';
import {
  AWSChargeTypes,
  AWSGroupBy,
  AzureGroupBy,
  FOCUSCredit,
  FOCUSGroupBy,
  GCPGroupBy,
  Granularity,
  type AWSFilter,
  type AzureFilter,
  type BaseFilter,
  type FOCUSFilter,
  type GCPFilter,
} from '@hooks-api';

import { initializeDate } from './initializeDate';

export interface FilterValuesQueryString {
  period: Granularity;
  group_by: number;
  start_date: string;
  end_date: string;
  projects?: string[];
  accounts?: string[];
  resourceGroups?: string[];
}

// 泛用的初始化基礎 Filter
const initializeBaseFilter = (
  platform: PlatformValueWithFOCUS,
  filterValues?: FilterValuesQueryString
): BaseFilter => {
  const { startDate, endDate } = initializeDate();

  return {
    startDate: filterValues?.start_date ?? startDate,
    endDate: filterValues?.end_date ?? endDate,
    period: filterValues?.period ?? Granularity.Day,
    groups: [],
    services: [],
  };
};

// 初始化 GCP Filter
const initializeGCPFilter = (
  platform: PlatformValueWithFOCUS,
  filterValues?: FilterValuesQueryString
): GCPFilter => {
  const baseFilter = initializeBaseFilter(PlatformsValue.GCP, filterValues);
  const shouldInitializeFilterValues = platform === PlatformsValue.GCP;

  const groupBy = shouldInitializeFilterValues ? filterValues?.group_by : undefined;
  const projects = shouldInitializeFilterValues ? filterValues?.projects : undefined;

  return {
    ...baseFilter,
    platform: PlatformsValue.GCP,
    groupBy: { type: groupBy ?? GCPGroupBy.Organization, key: null },
    projects: projects ?? [],
    skus: [],
    labels: [],
    lumitag: [],
    credits: [],
  };
};

// 初始化 AWS Filter
const initializeAWSFilter = (
  platform: PlatformValueWithFOCUS,
  filterValues?: FilterValuesQueryString
): AWSFilter => {
  const baseFilter = initializeBaseFilter(PlatformsValue.AWS, filterValues);
  const shouldInitializeFilterValues = platform === PlatformsValue.AWS;

  const groupBy = shouldInitializeFilterValues ? filterValues?.group_by : undefined;
  const accounts = shouldInitializeFilterValues ? filterValues?.accounts : undefined;

  return {
    ...baseFilter,
    platform: PlatformsValue.AWS,
    groupBy: { type: groupBy ?? AWSGroupBy.Organization, key: null },
    accounts: accounts ?? [],
    skus: [],
    tags: [],
    lumitag: [],
    chargeTypes: [
      AWSChargeTypes.Usage,
      AWSChargeTypes.OtherOutOfCycleCharge,
      AWSChargeTypes.SupportFees,
      AWSChargeTypes.Tax,
    ],
  };
};

// 初始化 Azure Filter
const initializeAzureFilter = (
  platform: PlatformValueWithFOCUS,
  filterValues?: FilterValuesQueryString
): AzureFilter => {
  const baseFilter = initializeBaseFilter(PlatformsValue.AZURE, filterValues);
  const shouldInitializeFilterValues = platform === PlatformsValue.AZURE;

  const groupBy = shouldInitializeFilterValues ? filterValues?.group_by : undefined;
  const resourceGroups = shouldInitializeFilterValues ? filterValues?.resourceGroups : undefined;

  return {
    ...baseFilter,
    platform: PlatformsValue.AZURE,
    skus: [],
    groupBy: { type: groupBy ?? AzureGroupBy.Organization, key: null },
    resourceGroups: resourceGroups ?? [],
    tags: [],
    lumitag: [],
  };
};

const initializeFOCUSFilter = (
  platform: PlatformValueWithFOCUS,
  filterValues?: FilterValuesQueryString
): FOCUSFilter => {
  const baseFilter = initializeBaseFilter(CrossCloudValue.FOCUS, filterValues);

  return {
    ...baseFilter,
    platform: [],
    groupBy: { type: FOCUSGroupBy.Organization, key: null },
    credits: [FOCUSCredit.Off],
  };
};

export const initializePlatformFilters = {
  [PlatformsValue.GCP]: initializeGCPFilter,
  [PlatformsValue.AWS]: initializeAWSFilter,
  [PlatformsValue.AZURE]: initializeAzureFilter,
  [CrossCloudValue.FOCUS]: initializeFOCUSFilter,
};
