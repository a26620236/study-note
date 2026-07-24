import { PlatformsValue } from '@constants';
import { AWSGroupByMap, AzureGroupByMap, GCPGroupByMap } from '@hooks-api';

export const GroupByLabelMap = {
  [PlatformsValue.GCP]: GCPGroupByMap,
  [PlatformsValue.AWS]: AWSGroupByMap,
  [PlatformsValue.AZURE]: AzureGroupByMap,
} as const;
