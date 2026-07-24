import { AWSGroupBy, AzureGroupBy, GCPGroupBy, type GroupBySelection } from '@hooks-api';

import {
  awsUngroupedOptions,
  azureUngroupedOptions,
  gcpUngroupedOptions,
  GROUP_KEY,
  type GroupByValue,
} from '../constants/groupByOptions';

// 依 onChange 帶回的 group key，把 (group, value) 還原成該平台的 { type, key }：
// lumitag / label / tag 直接對應 enum + key；其餘為內建維度，value 本身即是該平台 enum
export const toGcpGroupBy = (group: string, value: GroupByValue): GroupBySelection<GCPGroupBy> => {
  if (group === GROUP_KEY.lumitag) return { type: GCPGroupBy.LumiTag, key: String(value) };
  if (group === GROUP_KEY.label) return { type: GCPGroupBy.LabelKey, key: String(value) };
  return {
    type: gcpUngroupedOptions.find((option) => option.id === value)?.id ?? GCPGroupBy.Organization,
    key: null,
  };
};

export const toAwsGroupBy = (group: string, value: GroupByValue): GroupBySelection<AWSGroupBy> => {
  if (group === GROUP_KEY.lumitag) return { type: AWSGroupBy.LumiTag, key: String(value) };
  if (group === GROUP_KEY.tag) return { type: AWSGroupBy.TagKey, key: String(value) };
  return {
    type: awsUngroupedOptions.find((option) => option.id === value)?.id ?? AWSGroupBy.Organization,
    key: null,
  };
};

export const toAzureGroupBy = (
  group: string,
  value: GroupByValue
): GroupBySelection<AzureGroupBy> => {
  if (group === GROUP_KEY.lumitag) return { type: AzureGroupBy.LumiTag, key: String(value) };
  if (group === GROUP_KEY.tag) return { type: AzureGroupBy.TagKey, key: String(value) };
  return {
    type:
      azureUngroupedOptions.find((option) => option.id === value)?.id ?? AzureGroupBy.Organization,
    key: null,
  };
};
