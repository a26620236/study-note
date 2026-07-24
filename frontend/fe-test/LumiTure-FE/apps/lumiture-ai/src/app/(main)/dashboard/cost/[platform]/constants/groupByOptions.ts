import type { GroupedSingleSelectOption } from '@lumiture-ui';

import {
  AWSGroupBy,
  AWSGroupByMap,
  AzureGroupBy,
  AzureGroupByMap,
  GCPGroupBy,
  GCPGroupByMap,
} from '@hooks-api';

// 下拉選單可能的值：內建 group by 為數字 enum，動態的 lumitag / label / tag key 為字串
export type GroupByValue = GCPGroupBy | AWSGroupBy | AzureGroupBy | string;

// 動態維度群組的 key（onChange 帶回的 group 識別字）
export const GROUP_KEY = {
  lumitag: 'lumitag',
  label: 'label',
  tag: 'tag',
};

// 動態維度群組的顯示名稱
export const GROUP_LABELS = {
  lumitag: 'LumiTag',
  label: 'Label',
  tag: 'Tag',
};

// 各平台的內建（非動態 key）group by 維度選項
export const gcpUngroupedOptions: GroupedSingleSelectOption<GCPGroupBy>[] = [
  { id: GCPGroupBy.Organization, name: GCPGroupByMap[GCPGroupBy.Organization] },
  { id: GCPGroupBy.Group, name: GCPGroupByMap[GCPGroupBy.Group] },
  { id: GCPGroupBy.ServiceCategory, name: GCPGroupByMap[GCPGroupBy.ServiceCategory] },
  { id: GCPGroupBy.Project, name: GCPGroupByMap[GCPGroupBy.Project] },
  { id: GCPGroupBy.Sku, name: GCPGroupByMap[GCPGroupBy.Sku] },
];

export const awsUngroupedOptions: GroupedSingleSelectOption<AWSGroupBy>[] = [
  { id: AWSGroupBy.Organization, name: AWSGroupByMap[AWSGroupBy.Organization] },
  { id: AWSGroupBy.Group, name: AWSGroupByMap[AWSGroupBy.Group] },
  { id: AWSGroupBy.ServiceCategory, name: AWSGroupByMap[AWSGroupBy.ServiceCategory] },
  { id: AWSGroupBy.Account, name: AWSGroupByMap[AWSGroupBy.Account] },
  { id: AWSGroupBy.Sku, name: AWSGroupByMap[AWSGroupBy.Sku] },
];

export const azureUngroupedOptions: GroupedSingleSelectOption<AzureGroupBy>[] = [
  { id: AzureGroupBy.Organization, name: AzureGroupByMap[AzureGroupBy.Organization] },
  { id: AzureGroupBy.Group, name: AzureGroupByMap[AzureGroupBy.Group] },
  { id: AzureGroupBy.ServiceCategory, name: AzureGroupByMap[AzureGroupBy.ServiceCategory] },
  { id: AzureGroupBy.ResourceGroup, name: AzureGroupByMap[AzureGroupBy.ResourceGroup] },
  { id: AzureGroupBy.Sku, name: AzureGroupByMap[AzureGroupBy.Sku] },
];
