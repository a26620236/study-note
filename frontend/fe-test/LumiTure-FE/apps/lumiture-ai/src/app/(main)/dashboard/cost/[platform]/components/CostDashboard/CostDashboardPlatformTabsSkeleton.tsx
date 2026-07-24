'use client';

import { useParams } from 'next/navigation';

import { Box } from '@mui/material';

import { HStack, Markdown, Tabs } from '@lumiture-ui';
import { AWSIcon, AzureIcon, FOCUSIcon, GoogleIcon } from '@lumiture-ui/SvgIcon';

import CurrencySelector from '@components/CurrencySelector/CurrencySelector';
import { AWS, AZURE, CrossCloudValue, FOCUS, GCP, PlatformsValue } from '@constants';

import { CostDashboardPlatformContentSkeleton } from './CostDashboardPlatformContentSkeleton';

export const FOCUS_LABEL_TOOLTIP_TEXT =
  'Powered by the <b>FOCUS</b> framework <b>(FinOps Open Cost & Usage Specification)</b>, an open standard that unifies cost data across cloud providers to simplify FinOps. We normalize multi-cloud data into standardized categories.';

export const platformTabItems = [
  {
    value: CrossCloudValue.FOCUS,
    label: FOCUS.label,
    tabProps: {
      icon: <FOCUSIcon sx={{ width: 16, height: 16 }} />,
      iconPosition: 'start' as const,
    },
    tooltipText: <Markdown>{FOCUS_LABEL_TOOLTIP_TEXT}</Markdown>,
  },
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

export function CostDashboardPlatformTabsSkeleton() {
  const { platform } = useParams<{ platform: PlatformsValue }>();

  return (
    <Box width="100%" mt={8}>
      <HStack alignItems="center" gap={4}>
        <Box flex={1}>
          <Tabs value={platform} tabItems={platformTabItems} />
        </Box>
        <CurrencySelector disabled={true} />
      </HStack>
      <CostDashboardPlatformContentSkeleton />
    </Box>
  );
}
