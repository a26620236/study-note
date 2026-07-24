import type { Option, RangeItem } from '@lumiture-ui';

import { DomainType, Ordering, Provider } from '@hooks-api';

export const PROVIDER_OPTIONS: Option<Provider>[] = [
  { id: Provider.Password, name: 'Password' },
  { id: Provider.Google, name: 'Google' },
  { id: Provider.Microsoft, name: 'Microsoft' },
  { id: Provider.Github, name: 'Github' },
];

export const DOMAIN_TYPE_OPTIONS: Option<DomainType>[] = [
  { id: DomainType.GeneralBudget, name: 'General Budget' },
  { id: DomainType.CustomizedBudget, name: 'Customized Budget' },
  { id: DomainType.AnomalyDetection, name: 'Anomaly Detection' },
  { id: DomainType.Group, name: 'Group' },
  { id: DomainType.User, name: 'User' },
  { id: DomainType.UsageOptimization, name: 'Usage Optimization' },
  { id: DomainType.Authorization, name: 'Authorization' },
  { id: DomainType.ExecutiveInsights, name: 'Executive Insights' },
  { id: DomainType.LumiTag, name: 'LumiTag' },
];

export const ORDERING_OPTIONS: Option<Ordering>[] = [
  { id: Ordering.Ascending, name: 'Ascending' },
  { id: Ordering.Descending, name: 'Descending' },
];

export const DATE_QUICK_RANGE_LIST: RangeItem[] = [
  { label: 'allTime', value: 'All Time' },
  { label: 'last1Day', value: 'Last 1 Day' },
  { label: 'last7Days', value: 'Last 7 Days' },
  { label: 'lastMonth', value: 'Last Month' },
];
