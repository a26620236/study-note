import type { AWSFilter, AzureFilter, GCPFilter, PostDashboardAnalysisPayload } from '@hooks-api';

const withDefaultAll = (value: string[]) => (value.length === 0 ? ['all'] : value);

export function transformFilterToPayload(
  filters: GCPFilter | AWSFilter | AzureFilter
): PostDashboardAnalysisPayload {
  if ('projects' in filters) {
    return {
      startDate: filters.startDate,
      endDate: filters.endDate,
      period: filters.period,
      groupBy: filters.groupBy,
      groups: withDefaultAll(filters.groups),
      services: withDefaultAll(filters.services),
      projects: withDefaultAll(filters.projects),
      skus: withDefaultAll(filters.skus),
      credits: filters.credits,
      labels: filters.labels,
      lumitag: filters.lumitag,
    };
  }

  if ('accounts' in filters) {
    return {
      startDate: filters.startDate,
      endDate: filters.endDate,
      period: filters.period,
      groupBy: filters.groupBy,
      groups: withDefaultAll(filters.groups),
      services: withDefaultAll(filters.services),
      accounts: withDefaultAll(filters.accounts),
      skus: withDefaultAll(filters.skus),
      tags: filters.tags,
      lumitag: filters.lumitag,
      chargeTypes: filters.chargeTypes,
    };
  } else {
    return {
      startDate: filters.startDate,
      endDate: filters.endDate,
      period: filters.period,
      groupBy: filters.groupBy,
      groups: withDefaultAll(filters.groups),
      services: withDefaultAll(filters.services),
      resourceGroups: withDefaultAll(filters.resourceGroups),
      skus: withDefaultAll(filters.skus),
      tags: filters.tags,
      lumitag: filters.lumitag,
    };
  }
}
