import { PlatformsValue } from '@constants';
import { PreviewDetailType } from '@hooks-api';

export const TOGGLE_LABEL_MAP: Record<PlatformsValue, Record<PreviewDetailType, string>> = {
  [PlatformsValue.GCP]: {
    [PreviewDetailType.BillingAccount]: 'Billing Account',
    [PreviewDetailType.Project]: 'Project',
    [PreviewDetailType.Service]: 'Service',
    [PreviewDetailType.Resource]: 'Resource',
  },
  [PlatformsValue.AWS]: {
    [PreviewDetailType.BillingAccount]: 'Payer Account',
    [PreviewDetailType.Project]: 'Account',
    [PreviewDetailType.Service]: 'Service',
    [PreviewDetailType.Resource]: 'Resource',
  },
  [PlatformsValue.AZURE]: {
    [PreviewDetailType.BillingAccount]: 'Billing Account',
    [PreviewDetailType.Project]: 'Resource Group',
    [PreviewDetailType.Service]: 'Service',
    [PreviewDetailType.Resource]: 'Resource',
  },
} as const;

export const ALL_TOGGLE_TYPES: PreviewDetailType[] = [
  PreviewDetailType.BillingAccount,
  PreviewDetailType.Project,
  PreviewDetailType.Service,
  PreviewDetailType.Resource,
];
