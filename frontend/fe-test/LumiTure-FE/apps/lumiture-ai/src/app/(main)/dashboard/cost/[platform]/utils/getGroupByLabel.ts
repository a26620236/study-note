import {
  AWSGroupBy,
  AWSGroupByMap,
  AzureGroupBy,
  AzureGroupByMap,
  FOCUSGroupByMap,
  GCPGroupBy,
  GCPGroupByMap,
  type AWSFilter,
  type AzureFilter,
  type FOCUSFilter,
  type GCPFilter,
} from '@hooks-api';

import { GROUP_LABELS } from '../constants/groupByOptions';

interface GroupByLabel {
  prefix: string;
  value: string;
}

type PlatformFilter = GCPFilter | AWSFilter | AzureFilter | FOCUSFilter;

/**
 * 依目前的 group by 維度推導出 Cost Detail 第一欄要顯示的 { prefix, value }。
 * 只有 Label / Tag / LumiTag 維度會帶 key（value 才有值），其餘內建維度 value 為空字串。
 * LumiTag 需透過 lumiTagKeys 把 keyId 還原成顯示名稱。
 */
export function getGroupByLabel(
  filters: PlatformFilter,
  lumiTagKeys: { id: string; name: string }[]
): GroupByLabel {
  const resolveLumiTagName = (lumiTagKeyId: string) =>
    lumiTagKeys.find((lumiTagKey) => lumiTagKey.id === lumiTagKeyId)?.name ?? '';

  const dynamicKey = filters.groupBy.key ?? '';

  if ('projects' in filters) {
    const { type } = filters.groupBy;
    if (type === GCPGroupBy.LumiTag)
      return { prefix: GROUP_LABELS.lumitag, value: resolveLumiTagName(dynamicKey) };
    if (type === GCPGroupBy.LabelKey) return { prefix: GROUP_LABELS.label, value: dynamicKey };
    return { prefix: GCPGroupByMap[type], value: '' };
  }

  if ('accounts' in filters) {
    const { type } = filters.groupBy;
    if (type === AWSGroupBy.LumiTag)
      return { prefix: GROUP_LABELS.lumitag, value: resolveLumiTagName(dynamicKey) };
    if (type === AWSGroupBy.TagKey) return { prefix: GROUP_LABELS.tag, value: dynamicKey };
    return { prefix: AWSGroupByMap[type], value: '' };
  }

  if ('resourceGroups' in filters) {
    const { type } = filters.groupBy;
    if (type === AzureGroupBy.LumiTag)
      return { prefix: GROUP_LABELS.lumitag, value: resolveLumiTagName(dynamicKey) };
    if (type === AzureGroupBy.TagKey) return { prefix: GROUP_LABELS.tag, value: dynamicKey };
    return { prefix: AzureGroupByMap[type], value: '' };
  }

  return { prefix: FOCUSGroupByMap[filters.groupBy.type], value: '' };
}
