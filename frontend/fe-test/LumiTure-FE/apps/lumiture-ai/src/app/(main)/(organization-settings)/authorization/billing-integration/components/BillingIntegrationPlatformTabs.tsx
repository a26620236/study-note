'use client';

import type { SyntheticEvent } from 'react';
import { redirect, useParams, useRouter } from 'next/navigation';

import { sendGAEvent } from '@next/third-parties/google';

import { Tabs } from '@lumiture-ui';
import { AWSIcon, AzureIcon, GoogleIcon } from '@lumiture-ui/SvgIcon';

import {
  AWS,
  AZURE,
  EVENT_RESOURCE_LIST,
  GCP,
  ORG_SETTINGS_PATHS,
  PlatformsValue,
} from '@constants';
import { isValidPlatform } from '@utils';

const platformTabItems = [
  {
    value: PlatformsValue.GCP,
    label: GCP.label,
    tabProps: {
      icon: <GoogleIcon sx={{ width: 16, height: 16 }} />,
      iconPosition: 'start' as const,
    },
  },
  {
    value: PlatformsValue.AWS,
    label: AWS.label,
    tabProps: {
      icon: <AWSIcon sx={{ width: 16, height: 16 }} />,
      iconPosition: 'start' as const,
    },
  },
  {
    value: PlatformsValue.AZURE,
    label: AZURE.label,
    tabProps: {
      icon: <AzureIcon sx={{ width: 16, height: 16 }} />,
      iconPosition: 'start' as const,
    },
  },
];

export function BillingIntegrationPlatformTabs() {
  const router = useRouter();
  const { platform } = useParams<{ platform: PlatformsValue }>();

  if (!isValidPlatform(platform)) {
    redirect(
      ORG_SETTINGS_PATHS.billingDataIntegration.pathname.replace('[platform]', PlatformsValue.GCP)
    );
  }

  const handleTabChange = (_event: SyntheticEvent, platformVal: PlatformsValue) => {
    sendGAEvent('event', EVENT_RESOURCE_LIST.CLICK_PLATFORM_TAB, {
      platform: platformVal,
    });
    router.push(
      ORG_SETTINGS_PATHS.billingDataIntegration.pathname.replace('[platform]', platformVal)
    );
  };

  return <Tabs value={platform} onChange={handleTabChange} tabItems={platformTabItems} />;
}
