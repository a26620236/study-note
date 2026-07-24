'use client';

import { Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

import { PlatformResourcesProvider } from '../../../components/PlatformResourcesProvider';
import { ResourcesTableWithTabs } from '../../../components/ResourcesTableWithTabs';

export const LABELS = {
  description: 'You can assign cloud resources to this group here.',
};

export function TierOneGroupResources() {
  return (
    <PlatformResourcesProvider>
      <VStack gap={4} mt={4}>
        <HStack justifyContent="space-between" alignItems="center" height={36}>
          <Typography variant="caption" color="text.secondary">
            {LABELS.description}
          </Typography>
        </HStack>
        <ResourcesTableWithTabs />
      </VStack>
    </PlatformResourcesProvider>
  );
}
