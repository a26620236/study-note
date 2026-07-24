'use client';

import type { SyntheticEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Box } from '@mui/material';

import { HStack, Tabs } from '@lumiture-ui';

import CurrencySelector from '@components/CurrencySelector/CurrencySelector';
import type { PlatformValueWithFOCUS } from '@constants';

import { CostDashboardPlatformContent } from './CostDashboardPlatformContent';
import { platformTabItems } from './CostDashboardPlatformTabsSkeleton';

export function CostDashboardPlatformTabs() {
  const router = useRouter();
  const { platform } = useParams<{ platform: PlatformValueWithFOCUS }>();

  const handleTabChange = (_event: SyntheticEvent, newValue: PlatformValueWithFOCUS) => {
    router.push(`/dashboard/cost/${newValue}`);
  };

  return (
    <Box width="100%" mt={8}>
      <HStack alignItems="center" gap={4}>
        <Box flex={1}>
          <Tabs value={platform} onChange={handleTabChange} tabItems={platformTabItems} />
        </Box>
        <CurrencySelector />
      </HStack>
      <CostDashboardPlatformContent />
    </Box>
  );
}
