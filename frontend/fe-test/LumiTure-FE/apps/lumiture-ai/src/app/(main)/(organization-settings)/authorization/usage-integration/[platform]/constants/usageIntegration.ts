export enum GcpUsageIntegrationSteps {
  GUIDE = 'GUIDE',
  AUTHENTICATION = 'AUTHENTICATION',
}

export enum GcpUsageIntegrationErrorTypes {
  InsufficientPermissions = 'INSUFFICIENT_PERMISSIONS',
  ServiceAccountPermissionDenied = 'SERVICE_ACCOUNT_PERMISSION_DENIED',
  ScopingProjectAlreadyExists = 'SCOPING_PROJECT_ALREADY_EXISTS',
}

export enum AwsUsageIntegrationSteps {
  GUIDE = 'GUIDE',
  AUTHENTICATION = 'AUTHENTICATION',
}

export enum AwsUsageIntegrationError {
  PolicyMismatch = 'POLICY_MISMATCH',
  ParameterMismatch = 'PARAMETER_MISMATCH',
  StacksetDeploymentFailed = 'STACKSET_DEPLOYMENT_FAILED',
}

export enum AwsUsageIntegrationFieldErrorType {
  AccountIdInvalid = 'ACCOUNT_ID_INVALID',
  ExternalIdInvalid = 'EXTERNAL_ID_INVALID',
  StacksetNameDuplicate = 'STACKSET_NAME_DUPLICATE',
}

export interface AwsUsageIntegrationFieldError {
  accountId?: [AwsUsageIntegrationFieldErrorType.AccountIdInvalid];
  externalId?: [AwsUsageIntegrationFieldErrorType.ExternalIdInvalid];
  stacksetNameDuplicate?: [AwsUsageIntegrationFieldErrorType.StacksetNameDuplicate];
}

export enum AwsUsageIntegrationErrorCode {
  BadRequest = 'BAD_REQUEST',
  Conflict = 'CONFLICT',
}
