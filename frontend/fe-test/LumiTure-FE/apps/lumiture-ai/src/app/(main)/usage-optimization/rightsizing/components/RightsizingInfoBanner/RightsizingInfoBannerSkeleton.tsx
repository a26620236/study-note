'use client';

import { Button, HStack, Icon } from '@lumiture-ui';

import CurrencySelector from '@components/CurrencySelector/CurrencySelector';

import { RightsizingInfoBannerDescription } from './RightsizingInfoBannerDescription';

const LABELS = {
  button: 'Scope Settings',
};

export function RightsizingInfoBannerSkeleton() {
  return (
    <HStack alignItems="center" justifyContent="space-between" flexWrap="nowrap" mt={2}>
      <RightsizingInfoBannerDescription />
      <HStack gap={2} alignItems="center" flexWrap="nowrap">
        <CurrencySelector />
        <Button startIcon={<Icon name="settings" />} disabled>
          {LABELS.button}
        </Button>
      </HStack>
    </HStack>
  );
}
