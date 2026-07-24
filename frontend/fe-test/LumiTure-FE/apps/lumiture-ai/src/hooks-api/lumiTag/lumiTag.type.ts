import type { PlatformValueWithFOCUS } from '@constants';

export enum Logic {
  Base = 'BASE',
  And = 'AND',
  Or = 'OR',
}

export enum Operator {
  Equals,
  NotEquals,
  Contains,
  NotContains,
  StartsWith,
  EndsWith,
  Matches,
}

export enum LumiTagStatus {
  All = 'all',
  Active = 'active',
  Inactive = 'inactive',
}

export enum CoverageStatus {
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

interface StandardCriteria {
  operator: Operator;
  values: string[];
}

interface NativeTagCriteria {
  tagKey: string;
  tagValue?: {
    operator: Operator;
    values: string[];
  };
}

type ConditionCriteria = StandardCriteria | NativeTagCriteria;

// --- Condition / Scope / Value ---

export interface LumiTagCondition {
  logic: Logic;
  field: number;
  criteria: ConditionCriteria;
}

export interface LumiTagScope {
  platform: PlatformValueWithFOCUS;
  conditions: LumiTagCondition[];
}

export interface LumiTagValue {
  id: number;
  name: string;
  displayOrder: number;
  scopes: LumiTagScope[];
}

// --- Detail ---

export interface LumiTag {
  id: string;
  name: string;
  values: LumiTagValue[];
}

// --- Field Values ---

export interface NativeTagFieldValue {
  key: string;
  values: string[];
}

type PlatformValueWithFOCUSFieldValues = Record<string, string[] | NativeTagFieldValue[]>;

export interface LumiTagFieldValuesItem {
  platform: PlatformValueWithFOCUS;
  fields: PlatformValueWithFOCUSFieldValues;
}

// --- Preview ---

export const enum PreviewDetailType {
  BillingAccount = 0,
  Project = 1,
  Service = 2,
  Resource = 3,
}

export interface LumiTagPreviewValueItem {
  name: string;
  cost: number;
  portion: number;
}

export interface LumiTagPreviewOverview {
  totalCost: number;
  values: LumiTagPreviewValueItem[];
}

export interface LumiTagPreviewDetailBreakdownItem {
  id: string;
  name: string;
  matchedCost: number;
  totalCost: number;
  percentage: number;
  resourceType?: string;
  service?: string;
}

export interface LumiTagPreviewDetail {
  groupBy: string;
  platform: PlatformValueWithFOCUS;
  itemCount: number;
  totalCost: number;
  untaggedCost?: number;
  breakdown: LumiTagPreviewDetailBreakdownItem[];
}

// --- List ---

interface MetricsBanner {
  updateTime: string;
  nextUpdateTime: string;
  aai: number;
  untaggedCost: number;
  untaggedPercentage: number;
}

export interface LumiTagItem {
  id: number;
  name: string;
  valuesCount: number;
  coverage: string;
  coverageStatus: CoverageStatus;
  status: LumiTagStatus.Active | LumiTagStatus.Inactive;
  lastEditor: string;
  lastModified: string;
}

export interface LumiTagList {
  metricsBanner: MetricsBanner;
  tags: LumiTagItem[];
}
