import {
  ConditionFieldName,
  CreateBy,
  MonitoringPeriod,
} from '@app/(main)/budget/customized/components/types';
import { PlatformsValue } from '@constants';

export const FORM_ID = {
  ALERT: 'alerts',
  NAME: 'name',
  PERIOD: 'period',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  AMOUNT: 'budget',
  CREDIT: 'credit',
  RECIPIENTS: 'recipients',
  RECIPIENTS_INPUT: 'recipients_input',
  STATUS: 'status',
  THRESHOLDS: 'thresholds',
  RULES: 'rules',
} as const;

export const CREATE_BY_OPTIONS = [
  {
    label: 'Groups',
    value: CreateBy.GROUPS,
    platform: null,
  },
  {
    label: 'Google Cloud Projects',
    value: CreateBy.GcpProjects,
    platform: PlatformsValue.GCP,
  },
  {
    label: 'AWS Accounts',
    value: CreateBy.AwsAccounts,
    platform: PlatformsValue.AWS,
  },
  {
    label: 'Azure Resources Groups',
    value: CreateBy.AzureResourcesGroups,
    platform: PlatformsValue.AZURE,
  },
] as const;

export const NAME_MAX_LENGTH = 300;
export const LAST_UNIVERSAL_DAY = 28;
export const LEAP_YEAR_DAY = 29;
export const MAXIMUM_THRESHOLDS = 5;
export const DEFAULT_THRESHOLD = 90;

export const PERIOD_OPTIONS = [
  {
    label: 'Repeats Monthly',
    value: MonitoringPeriod.MONTHLY,
  },
  {
    label: 'Repeats Yearly',
    value: MonitoringPeriod.YEARLY,
  },
  {
    label: 'Repeats Daily',
    value: MonitoringPeriod.DAILY,
  },
  {
    label: 'Fixed Period',
    value: MonitoringPeriod.CUSTOMIZED,
  },
] as const;
export const CREDIT_OPTIONS = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
] as const;
export const STATUS_OPTIONS = [
  {
    label: 'Active',
    value: true,
  },
  {
    label: 'Inactive',
    value: false,
  },
] as const;

export const availablePlatforms = [
  PlatformsValue.GCP,
  PlatformsValue.AWS,
  PlatformsValue.AZURE,
] as const;

export const RULE_LIMIT = 10;

export const CUSTOM_ERROR_TYPE = { INVALID_IDS: 'invalid_ids' };

export const FIELD_LABEL = {
  GROUP: 'Group',
  PROJECT: 'Project',
  SERVICE: 'Service',
  ACCOUNT: 'Account',
  RESOURCE_GROUP: 'Resource Group',
};

/**
 * 根據平台取得對應的條件欄位配置（標籤和值）
 * - AWS: Groups, Accounts, Services
 * - GCP: Groups, Projects, Services
 * - Azure: Groups, Resource Groups, Services
 */
export const getPlatformConditionOption = (
  fieldName: ConditionFieldName,
  platform: PlatformsValue | null | undefined
): { label: string; value: ConditionFieldName } => {
  const getLabel = (): string => {
    switch (fieldName) {
      case ConditionFieldName.GROUPS:
        return FIELD_LABEL.GROUP;
      case ConditionFieldName.SERVICES:
        return FIELD_LABEL.SERVICE;
      case ConditionFieldName.PROJECTS:
        switch (platform) {
          case PlatformsValue.AWS:
            return FIELD_LABEL.ACCOUNT;
          case PlatformsValue.AZURE:
            return FIELD_LABEL.RESOURCE_GROUP;
          case PlatformsValue.GCP:
          default:
            return FIELD_LABEL.PROJECT;
        }
    }
  };

  return { label: getLabel(), value: fieldName };
};

/**
 * 根據平台取得對應的 API 欄位名稱
 * - AWS: accounts
 * - GCP: projects
 * - Azure: resourceGroups
 */
export const getPlatformApiFieldName = (
  fieldName: ConditionFieldName,
  platform: PlatformsValue | null | undefined
): string => {
  if (fieldName === ConditionFieldName.PROJECTS) {
    switch (platform) {
      case PlatformsValue.AWS:
        return 'accounts';
      case PlatformsValue.AZURE:
        return 'resourceGroups';
      case PlatformsValue.GCP:
      default:
        return 'projects';
    }
  }
  return fieldName;
};
