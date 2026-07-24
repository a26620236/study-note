import { NodeEnvName } from '@constants';

export const GCP_SERVICE_ACCOUNT = {
  [NodeEnvName.Dev]: 'lumiture-client@tw-rd-app-finops-dev.iam.gserviceaccount.com',
  [NodeEnvName.Staging]: 'lumiture-client@tw-rd-app-finops-dev.iam.gserviceaccount.com',
  [NodeEnvName.Prod]: 'lumiture-client@tw-rd-app-finops-prod.iam.gserviceaccount.com',
} as const;

export enum BillingIntegrationStep {
  Guide,
  Authentication,
}

export enum AzureBillingIntegrationStep {
  Guide,
  Authentication,
  SetUpDataAccessStep1,
  SetUpDataAccessStep2,
}
