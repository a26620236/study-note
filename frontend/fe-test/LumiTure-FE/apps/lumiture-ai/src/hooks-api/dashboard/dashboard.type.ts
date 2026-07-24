import type { CrossCloudValue, Currency, PlatformsValue, PlatformValueWithFOCUS } from '@constants';
import type { AIAnalysisData } from '@hooks-ws';

import type { Top10CostByFOCUS } from '../fiscalMetrics/fiscalMetrics.type';

export enum Granularity {
  Day = '0',
  Month = '1',
}

export type DateString = `${number}-${number}-${number}`;

export const GranularityMap = {
  [Granularity.Day]: 'Day',
  [Granularity.Month]: 'Month',
} as const;

export enum GCPGroupBy {
  Organization = 0,
  Group = 1,
  ServiceCategory = 2,
  Project = 3,
  Sku = 4,
  LabelKey = 5,
  LumiTag = 6,
}

export const GCPGroupByMap = {
  [GCPGroupBy.Organization]: 'Organization',
  [GCPGroupBy.Group]: 'Group',
  [GCPGroupBy.ServiceCategory]: 'Service Category',
  [GCPGroupBy.Project]: 'Project',
  [GCPGroupBy.Sku]: 'SKU',
  [GCPGroupBy.LabelKey]: 'Label Key',
  [GCPGroupBy.LumiTag]: 'LumiTag',
} as const;

export enum AWSGroupBy {
  Organization = 0,
  Group = 1,
  ServiceCategory = 2,
  Account = 3,
  Sku = 4,
  TagKey = 5,
  LumiTag = 6,
}

export const AWSGroupByMap = {
  [AWSGroupBy.Organization]: 'Organization',
  [AWSGroupBy.Group]: 'Group',
  [AWSGroupBy.ServiceCategory]: 'Service Category',
  [AWSGroupBy.Account]: 'Account',
  [AWSGroupBy.Sku]: 'SKU',
  [AWSGroupBy.TagKey]: 'Tag Key',
  [AWSGroupBy.LumiTag]: 'LumiTag',
} as const;

export enum AzureGroupBy {
  Organization = 0,
  Group = 1,
  ServiceCategory = 2,
  ResourceGroup = 3,
  Sku = 4,
  TagKey = 5,
  LumiTag = 6,
}

export const AzureGroupByMap = {
  [AzureGroupBy.Organization]: 'Organization',
  [AzureGroupBy.Group]: 'Group',
  [AzureGroupBy.ServiceCategory]: 'Service Category',
  [AzureGroupBy.ResourceGroup]: 'Resource Group',
  [AzureGroupBy.Sku]: 'SKU',
  [AzureGroupBy.TagKey]: 'Tag Key',
  [AzureGroupBy.LumiTag]: 'LumiTag',
} as const;

export enum FOCUSGroupBy {
  Organization = 0,
  Group = 1,
  ServiceCategory = 2,
  CloudServiceProvider = 7,
}

export const FOCUSGroupByMap = {
  [FOCUSGroupBy.Organization]: 'Organization',
  [FOCUSGroupBy.Group]: 'Group',
  [FOCUSGroupBy.ServiceCategory]: 'FOCUS Service Category',
  [FOCUSGroupBy.CloudServiceProvider]: 'Cloud Service Provider',
} as const;

export enum GCPCredit {
  FreeTier = '0',
  Discount = '1',
  SustainedUsageDiscount = '2',
  CommittedUsageDiscount = '3',
  Promotion = '4',
  Others = '5',
}

export const GCPCreditMap = {
  [GCPCredit.FreeTier]: 'Free Tier',
  [GCPCredit.Discount]: 'Discount - Spending based discounts (contractual)',
  [GCPCredit.SustainedUsageDiscount]: 'Discount - Sustained Usage Discount',
  [GCPCredit.CommittedUsageDiscount]: 'Discount - Committed Usage Discount',
  [GCPCredit.Promotion]: 'Promotion',
  [GCPCredit.Others]: 'Others',
} as const;

export enum AWSChargeTypes {
  Usage = '0',
  Credit = '1',
  OtherOutOfCycleCharge = '2',
  SupportFees = '3',
  Tax = '4',
}

export const AWSChargeTypesMap = {
  [AWSChargeTypes.Usage]: 'Usage',
  [AWSChargeTypes.Credit]: 'Credit',
  [AWSChargeTypes.OtherOutOfCycleCharge]: 'Other Out of cycle charges',
  [AWSChargeTypes.SupportFees]: 'Support fee',
  [AWSChargeTypes.Tax]: 'Tax',
} as const;

export enum FOCUSCredit {
  On = 1,
  Off = 0,
}

export const FOCUSCreditMap = {
  [FOCUSCredit.On]: 'ON',
  [FOCUSCredit.Off]: 'OFF',
} as const;

export interface GroupBySelection<T> {
  type: T;
  key: string | null;
}

export interface LumitagSelection {
  keyId: string;
  valueIds: string[];
}

export interface GCPFilter extends BaseFilter {
  platform: PlatformsValue.GCP;
  projects: string[];
  groupBy: GroupBySelection<GCPGroupBy>;
  labels: { key: string; values: string[] }[];
  lumitag: LumitagSelection[];
  credits: GCPCredit[];
  skus: string[];
}

export interface AWSFilter extends BaseFilter {
  platform: PlatformsValue.AWS;
  accounts: string[];
  groupBy: GroupBySelection<AWSGroupBy>;
  tags: { key: string; values: string[] }[];
  lumitag: LumitagSelection[];
  chargeTypes: AWSChargeTypes[];
  skus: string[];
}

export interface AzureFilter extends BaseFilter {
  platform: PlatformsValue.AZURE;
  resourceGroups: string[];
  groupBy: GroupBySelection<AzureGroupBy>;
  tags: { key: string; values: string[] }[];
  lumitag: LumitagSelection[];
  skus: string[];
}

export interface FOCUSFilter extends BaseFilter {
  platform: PlatformsValue[];
  groupBy: GroupBySelection<FOCUSGroupBy>;
  credits: FOCUSCredit[];
}

export interface BaseFilter {
  endDate: string;
  groups: string[];
  period: Granularity;
  services: string[];
  startDate: string;
  currency?: Currency;
}

export interface GCPFilterOptions extends BaseFilterOptions {
  projects: { id: string; name: string }[];
  labels: { key: string; values: string[] }[];
}

export interface AWSFilterOptions extends BaseFilterOptions {
  accounts: { id: string; name: string }[];
  tags: { key: string; values: string[] }[];
}

export interface AzureFilterOptions extends BaseFilterOptions {
  resourceGroups: { id: string; name: string }[];
  tags: { key: string; values: string[] }[];
}

interface BaseFilterOptions {
  groups: { id: string; name: string }[];
  services: string[];
  skus: { id: string; description: string }[];
  lumitag: {
    keys: { id: string; name: string; values: { id: string; name: string }[] }[];
  };
}

export interface FOCUSFilterOptions {
  groups: { id: string; name: string }[];
  services: { key: CrossCloudValue.FOCUS | PlatformsValue.GCP; values: string[] }[];
}

export interface AnalysisHistoryItem {
  id: string;
  pin: boolean;
  platform: PlatformsValue;
  totalCost: number;
  filterOptions: AIAnalysisData['filterOptions'];
  summary: AIAnalysisData['summary'];
  createdTime: string;
}

export interface OverviewByCloud {
  highestSpendingGroups: SpendingGroup[];
  costByCloud: Record<PlatformsValue, CostByCloud>;
}

export interface SpendingGroup {
  groupName: string;
  awsCost: number | null;
  gcpCost: number | null;
  azureCost: number | null;
  awsBudget?: number | null;
  gcpBudget?: number | null;
  azureBudget?: number | null;
  budget: number | null;
}

interface CostByCloud {
  cost: number | null;
  budget: number | null;
}

export interface SpendingRankings {
  costRankings: SpendingGroup[];
}

export interface CostTrend {
  total: number;
  dateAxis: string[];
  series: {
    title: string;
    id?: string;
    totalCost: number;
    totalCredits: number;
    platform?: PlatformValueWithFOCUS;
    data: number[];
    credits: number[];
  }[];
}

export interface OverviewFOCUSCostRankings {
  focusRankings: Top10CostByFOCUS[];
}
