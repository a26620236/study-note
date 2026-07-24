import {
  AWSGroupBy,
  AzureGroupBy,
  GCPGroupBy,
  type AWSFilter,
  type AzureFilter,
  type FOCUSFilter,
  type GCPFilter,
} from '@hooks-api';

type PlatformFilter = GCPFilter | AWSFilter | AzureFilter | FOCUSFilter;

export enum GroupByHintKind {
  LumiTag = 'lumitag',
  Label = 'label',
  Tag = 'tag',
}

/**
 * 依目前的 group by 維度決定 Cost Details 表頭要顯示哪一種 hint：
 * - LumiTag（三平台）→ Untagged
 * - GCP Label → Charges of other usages
 * - AWS / Azure Tag → No Tag Key
 *
 * 內建維度（Organization / Sku 等）與 FOCUS 不顯示 hint，回 null。
 */
export function getGroupByHint(filters: PlatformFilter): GroupByHintKind | null {
  if ('projects' in filters) {
    const { type } = filters.groupBy;
    if (type === GCPGroupBy.LumiTag) return GroupByHintKind.LumiTag;
    if (type === GCPGroupBy.LabelKey) return GroupByHintKind.Label;
    return null;
  }

  if ('accounts' in filters) {
    const { type } = filters.groupBy;
    if (type === AWSGroupBy.LumiTag) return GroupByHintKind.LumiTag;
    if (type === AWSGroupBy.TagKey) return GroupByHintKind.Tag;
    return null;
  }

  if ('resourceGroups' in filters) {
    const { type } = filters.groupBy;
    if (type === AzureGroupBy.LumiTag) return GroupByHintKind.LumiTag;
    if (type === AzureGroupBy.TagKey) return GroupByHintKind.Tag;
    return null;
  }

  return null;
}
