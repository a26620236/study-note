import { PlatformsValue } from '@constants';

export enum GCPField {
  BillingAccountId,
  ProjectId,
  Service,
  Sku,
  ResourceName,
  Region,
  NativeTag,
}

export enum AWSField {
  PayerAccount,
  AccountId,
  Service,
  UsageType,
  ResourceName,
  Region,
  NativeTag,
}

export enum AzureField {
  SubscriptionId,
  ResourceGroupId,
  Service,
  Sku,
  ResourceName,
  Region,
  NativeTag,
}

export type FieldKey = GCPField | AWSField | AzureField;

const NATIVE_TAG_KEYS: ReadonlySet<FieldKey> = new Set([
  GCPField.NativeTag,
  AWSField.NativeTag,
  AzureField.NativeTag,
]);

export function isNativeTagField(key: FieldKey): boolean {
  return NATIVE_TAG_KEYS.has(key);
}

// --- API name maps ---
// The `useGetLumiTagFieldValues` endpoint returns a `fields` object keyed by camelCase strings.
// The form uses numeric enums internally, so these maps convert numeric fields back to camelCase
// for fieldValuesData lookup.
const GCP_FIELD_API_NAME_MAP: Record<GCPField, string> = {
  [GCPField.BillingAccountId]: 'billingAccountId',
  [GCPField.ProjectId]: 'projectId',
  [GCPField.Service]: 'service',
  [GCPField.Sku]: 'sku',
  [GCPField.ResourceName]: 'resourceName',
  [GCPField.Region]: 'region',
  [GCPField.NativeTag]: 'nativeTag',
};

const AWS_FIELD_API_NAME_MAP: Record<AWSField, string> = {
  [AWSField.PayerAccount]: 'payerAccount',
  [AWSField.AccountId]: 'accountId',
  [AWSField.Service]: 'service',
  [AWSField.UsageType]: 'usageType',
  [AWSField.ResourceName]: 'resourceName',
  [AWSField.Region]: 'region',
  [AWSField.NativeTag]: 'nativeTag',
};

const AZURE_FIELD_API_NAME_MAP: Record<AzureField, string> = {
  [AzureField.SubscriptionId]: 'subscriptionId',
  [AzureField.ResourceGroupId]: 'resourceGroupId',
  [AzureField.Service]: 'service',
  [AzureField.Sku]: 'sku',
  [AzureField.ResourceName]: 'resourceName',
  [AzureField.Region]: 'region',
  [AzureField.NativeTag]: 'nativeTag',
};

export const FIELD_API_NAME_MAP: Record<PlatformsValue, Record<number, string>> = {
  [PlatformsValue.GCP]: GCP_FIELD_API_NAME_MAP,
  [PlatformsValue.AWS]: AWS_FIELD_API_NAME_MAP,
  [PlatformsValue.AZURE]: AZURE_FIELD_API_NAME_MAP,
};
