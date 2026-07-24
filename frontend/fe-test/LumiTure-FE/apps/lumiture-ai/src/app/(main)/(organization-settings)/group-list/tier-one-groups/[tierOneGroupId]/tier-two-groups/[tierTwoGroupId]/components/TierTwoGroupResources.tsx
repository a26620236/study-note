'use client';

import { Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

import { PlatformResourcesProvider } from '@app/(main)/(organization-settings)/group-list/components/PlatformResourcesProvider';
import { ResourcesTableWithTabs } from '@app/(main)/(organization-settings)/group-list/components/ResourcesTableWithTabs';

export const LABELS = {
  description: 'You can assign cloud resources to this group here.',
};

export function TierTwoGroupResources() {
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
