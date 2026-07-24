import { palette } from '@lumiture-ui/theme';
import { AWSIcon, AzureIcon, FOCUSIcon, GoogleIcon } from '@lumiture-ui/SvgIcon';

export enum PlatformsValue {
  GCP = 'gcp',
  AWS = 'aws',
  AZURE = 'azure',
}

export enum CrossCloudValue {
  FOCUS = 'focus',
}

export const GCP = {
  label: 'Google Cloud',
  abbr: 'GCP',
  value: PlatformsValue.GCP,
  icon: GoogleIcon,
  color: '#86CBFC',
} as const;

export const AWS = {
  label: 'AWS',
  abbr: 'AWS',
  value: PlatformsValue.AWS,
  icon: AWSIcon,
  color: palette.colorKit.main[6],
} as const;

export const AZURE = {
  label: 'Azure',
  abbr: 'AZURE',
  value: PlatformsValue.AZURE,
  icon: AzureIcon,
  color: palette.colorKit.dark[2],
} as const;

export const FOCUS = {
  label: 'Cross Cloud',
  abbr: 'FOCUS',
  value: 'focus',
  icon: FOCUSIcon,
} as const;

export const PLATFORM_CONFIG = {
  [PlatformsValue.GCP]: GCP,
  [PlatformsValue.AWS]: AWS,
  [PlatformsValue.AZURE]: AZURE,
} as const;

// Platform config with FOCUS
export const PLATFORM_CONFIG_WITH_FOCUS = {
  [CrossCloudValue.FOCUS]: FOCUS,
  ...PLATFORM_CONFIG,
} as const;

export type PlatformValueWithFOCUS = PlatformsValue | CrossCloudValue;
