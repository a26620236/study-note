import { differenceInDays } from 'date-fns';

import {
  AWSGroupBy,
  AzureGroupBy,
  GCPGroupBy,
  type AWSFilter,
  type AzureFilter,
  type GCPFilter,
} from '@hooks-api';

const MAX_DATE_RANGE_DAYS = 31;

function isDateRangeExceedsLimit(startDate: string | null, endDate: string | null): boolean {
  if (!startDate || !endDate) return false;

  const diffDays = differenceInDays(new Date(endDate), new Date(startDate));

  return diffDays > MAX_DATE_RANGE_DAYS;
}

export function validateAIAnalysisFilters(filters: GCPFilter | AWSFilter | AzureFilter) {
  if (isDateRangeExceedsLimit(filters.startDate, filters.endDate)) return false;

  if (
    'projects' in filters &&
    (filters.groupBy.type === GCPGroupBy.LabelKey ||
      filters.groupBy.type === GCPGroupBy.LumiTag ||
      filters.groupBy.type === GCPGroupBy.Sku)
  )
    return false;

  if (
    'accounts' in filters &&
    (filters.groupBy.type === AWSGroupBy.TagKey ||
      filters.groupBy.type === AWSGroupBy.LumiTag ||
      filters.groupBy.type === AWSGroupBy.Sku)
  )
    return false;

  if (
    'resourceGroups' in filters &&
    (filters.groupBy.type === AzureGroupBy.TagKey ||
      filters.groupBy.type === AzureGroupBy.LumiTag ||
      filters.groupBy.type === AzureGroupBy.Sku)
  )
    return false;

  return true;
}
