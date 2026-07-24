export enum Provider {
  Password = 1,
  Google = 2,
  Microsoft = 3,
  Github = 4,
}

export enum Ordering {
  Ascending = 1,
  Descending = 2,
}

export enum Action {
  Create = 1,
  Update = 2,
  Delete = 3,
}

export const ACTION_LABELS: Record<Action, string> = {
  [Action.Create]: 'Create',
  [Action.Update]: 'Update',
  [Action.Delete]: 'Delete',
};

export enum DomainType {
  GeneralBudget = 1,
  CustomizedBudget = 2,
  AnomalyDetection = 3,
  Group = 4,
  User = 5,
  UsageOptimization = 6,
  Authorization = 7,
  ExecutiveInsights = 8,
  LumiTag = 9,
}

export const DOMAIN_TYPE_LABELS: Record<DomainType, string> = {
  [DomainType.GeneralBudget]: 'General Budget',
  [DomainType.CustomizedBudget]: 'Customized Budget',
  [DomainType.AnomalyDetection]: 'Anomaly Detection',
  [DomainType.Group]: 'Group',
  [DomainType.User]: 'User',
  [DomainType.UsageOptimization]: 'Usage Optimization',
  [DomainType.Authorization]: 'Authorization',
  [DomainType.ExecutiveInsights]: 'Executive Insights',
  [DomainType.LumiTag]: 'LumiTag',
};
export interface LoginActivityFiltersData {
  users: { key: string; values: string[] }[];
  countries: string[];
}

export interface UserActivityFiltersData {
  users: { key: string; values: string[] }[];
  countries: string[];
  domainTypes: DomainType[];
}

export interface ActivityItem {
  id: number;
  email: string;
  ipAddress: string;
  city: string;
  country: string;
  createdAt: string;
}

export interface LoginActivityItem extends ActivityItem {
  provider: Provider;
  status: string;
}

export interface UserActivityItem extends ActivityItem {
  action: Action;
  domainType: DomainType;
  description: string;
}
