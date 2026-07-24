import type { PlatformsValue } from '@constants';

export interface GetAzureSubscriberEndpointResponse {
  url: string;
}

export interface GetAwsExternalIdResponse {
  externalId: string;
}

export interface GCPBillingIntegration {
  billingAccountId: string;
  detailedUsageCost: {
    projectId: string;
    datasetId: string;
  };
  pricing: {
    projectId: string;
    datasetId: string;
  };
}

export interface AWSBillingIntegration {
  accountId: string;
  roleArn: string;
  policyArn: string;
  externalId: string;
}

export enum AWSBillingPermissionCheckStatus {
  PermissionDenied = 'PERMISSION_DENIED',
  PolicyNotAttachedError = 'POLICY_NOT_ATTACHED_ERROR',
  PolicyConfigurationError = 'POLICY_CONFIGURATION_ERROR',
  CurLimitError = 'CUR_LIMIT_ERROR', // Quota Exceeded
  FocusLimitError = 'FOCUS_LIMIT_ERROR', // Quota Exceeded
  UnknownError = 'UNKNOWN_ERROR',
}

// Integration error codes (used during AWS billing integration process)
export enum AWSBillingIntegrationStatus {
  AssumeRoleFailed = 'ASSUME_ROLE_FAILED',
  CurCreateBillingExportFailed = 'CUR_CREATE_BILLING_EXPORT_FAILED', // Quota Exceeded
  FocusCreateBillingExportFailed = 'FOCUS_CREATE_BILLING_EXPORT_FAILED', // Quota Exceeded
  CurUpdateLambdaRolePermissionFailed = 'CUR_UPDATE_LAMBDA_ROLE_PERMISSION_FAILED',
  FocusUpdateLambdaRolePermissionFailed = 'FOCUS_UPDATE_LAMBDA_ROLE_PERMISSION_FAILED',
  CurUpdateLambdaS3TriggerPermissionFailed = 'CUR_UPDATE_LAMBDA_S3_TRIGGER_PERMISSION_FAILED',
  FocusUpdateLambdaS3TriggerPermissionFailed = 'FOCUS_UPDATE_LAMBDA_S3_TRIGGER_PERMISSION_FAILED',
}

// Authorization display status (used in authorization list display)
export enum GCPBillingDisplayStatus {
  Connected = 'CONNECTED',
  Error = 'ERROR',
  InProgress = 'IN_PROGRESS',
}

export enum AWSBillingDisplayStatus {
  Connected = 'CONNECTED',
  Error = 'ERROR',
  InProgress = 'IN_PROGRESS',
}

export enum AzureBillingDisplayStatus {
  Connected = 'CONNECTED',
  Error = 'ERROR',
  InProgress = 'IN_PROGRESS',
  ErrorNoSubscriptionReader = 'ERROR_NO_SUBSCRIPTION_READER',
}

export enum GCPUsageDisplayStatus {
  Connected = 'CONNECTED',
  Error = 'ERROR',
  InProgress = 'IN_PROGRESS',
}

export enum AWSUsageDisplayStatus {
  Connected = 'CONNECTED',
  Error = 'ERROR',
  InProgress = 'IN_PROGRESS',
  DataInitFailed = 'DATA_INIT_FAILED',
}

export enum AzureUsageDisplayStatus {
  Connected = 'CONNECTED',
  Error = 'ERROR',
  InProgress = 'IN_PROGRESS',
  ErrorNoStorageReader = 'ERROR_NO_STORAGE_READER',
  ErrorNoSubscriptionReader = 'ERROR_NO_SUBSCRIPTION_READER',
}

interface BasicPlatformItem {
  updatedAt: string;
}

export interface GCPItem {
  billing: (BasicPlatformItem & {
    status: GCPBillingDisplayStatus;
    billingAccountName: string;
    billingAccountId: string | number;
  })[];
  usage: (BasicPlatformItem & {
    status: GCPUsageDisplayStatus;
    scopingProjectId: string | number;
    scopingProjectName: string;
  })[];
}

export interface AWSItem {
  billing: (BasicPlatformItem & {
    status: AWSBillingDisplayStatus;
    accountName: string;
    accountId: string | number;
  })[];
  usage: (BasicPlatformItem & {
    status: AWSUsageDisplayStatus;
    accountName: string;
    accountId: string | number;
  })[];
}

export interface AzureItem {
  billing: (BasicPlatformItem & {
    status: AzureBillingDisplayStatus;
    subscriptionName: string;
    subscriptionId: string;
  })[];
  usage: (BasicPlatformItem & {
    status: AzureUsageDisplayStatus;
    subscriptionName: string;
    subscriptionId: string;
  })[];
}

export interface AzureUsageCustomRoleProperties {
  roleName: string;
  description: string;
  assignableScopes: string[];
  permissions: {
    actions: string[];
    notActions: string[];
    dataActions: string[];
    notDataActions: string[];
  }[];
}

export interface AzureUsageCustomRole {
  properties: AzureUsageCustomRoleProperties;
}

export interface AuthorizationList {
  [PlatformsValue.GCP]: GCPItem;
  [PlatformsValue.AWS]: AWSItem;
  [PlatformsValue.AZURE]: AzureItem;
}
