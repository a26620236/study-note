import { PlatformsValue } from '@constants';
import { Operator } from '@hooks-api';

import { AWSField, AzureField, GCPField, type FieldKey } from './lumiTagFields';

export const MAX_VALUES = 1000;
export const MAX_CONDITIONS = 20;
export const MAX_CONDITION_VALUE_LENGTH = 512;

export const TAG_KEY_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/u;

export const ALL_PLATFORMS = [
  PlatformsValue.GCP,
  PlatformsValue.AWS,
  PlatformsValue.AZURE,
] as const;

export const LABELS = {
  nameRequired: 'Tag key cannot be empty.',
  nameFormat:
    'Please use lowercase letters, numbers, and hyphens only. No underscores or leading/trailing hyphens.',
  nameMaxLength: 'Tag key cannot exceed 128 characters.',
  nameDuplicate: (name: string) => `"${name}" already exists. Please use a different name.`,
  valueNameRequired: 'Value name cannot be empty.',
  valueNameMaxLength: 'Value name cannot exceed 256 characters.',
  maxValues: `A tag can have at most ${MAX_VALUES} values.`,
  maxConditions: `A scope can have at most ${MAX_CONDITIONS} conditions.`,
  valuesRequired: 'Please add at least one tag value before previewing.',
  scopeRequired: 'Please add at least one tag value before previewing.',
  conditionRequired: 'At least one condition is required.',
  tagKeyRequired: 'Native tag key is required.',
  conditionValueRequired: 'Condition value cannot be empty.',
  conditionValueMaxLength: `Condition value cannot exceed ${MAX_CONDITION_VALUE_LENGTH} characters.`,
  matchesInvalidRegex: (detail: string) => `Invalid regex: ${detail}`,
} as const;

// --- Field metadata and operator config ---

export interface PlatformFieldMeta {
  key: FieldKey;
  displayName: string;
}

export const MULTI_VALUE_OPERATORS: readonly Operator[] = [Operator.Equals, Operator.NotEquals];

export const FREE_INPUT_MULTI_OPERATORS: readonly Operator[] = [
  Operator.Contains,
  Operator.NotContains,
  Operator.StartsWith,
  Operator.EndsWith,
];

export const OPERATOR_LABELS: Record<Operator, string> = {
  [Operator.Equals]: 'equals',
  [Operator.NotEquals]: 'not equals',
  [Operator.Contains]: 'contains',
  [Operator.NotContains]: 'not contains',
  [Operator.StartsWith]: 'starts with',
  [Operator.EndsWith]: 'ends with',
  [Operator.Matches]: 'matches',
};

export const PLATFORM_FIELD_META: Record<PlatformsValue, PlatformFieldMeta[]> = {
  [PlatformsValue.GCP]: [
    { key: GCPField.BillingAccountId, displayName: 'Billing Account ID' },
    { key: GCPField.ProjectId, displayName: 'Project ID' },
    { key: GCPField.Service, displayName: 'Service' },
    { key: GCPField.Sku, displayName: 'SKU' },
    { key: GCPField.ResourceName, displayName: 'Resource' },
    { key: GCPField.Region, displayName: 'Region' },
    { key: GCPField.NativeTag, displayName: 'Label' },
  ],
  [PlatformsValue.AWS]: [
    { key: AWSField.PayerAccount, displayName: 'Payer Account' },
    { key: AWSField.AccountId, displayName: 'Account ID' },
    { key: AWSField.Service, displayName: 'Service' },
    { key: AWSField.UsageType, displayName: 'Usage Type' },
    { key: AWSField.ResourceName, displayName: 'Resource' },
    { key: AWSField.Region, displayName: 'Region' },
    { key: AWSField.NativeTag, displayName: 'Tag' },
  ],
  [PlatformsValue.AZURE]: [
    { key: AzureField.SubscriptionId, displayName: 'Billing Account ID' },
    { key: AzureField.ResourceGroupId, displayName: 'Resource Group ID' },
    { key: AzureField.Service, displayName: 'Service' },
    { key: AzureField.Sku, displayName: 'SKU' },
    { key: AzureField.ResourceName, displayName: 'Resource' },
    { key: AzureField.Region, displayName: 'Region' },
    { key: AzureField.NativeTag, displayName: 'Tag' },
  ],
};
