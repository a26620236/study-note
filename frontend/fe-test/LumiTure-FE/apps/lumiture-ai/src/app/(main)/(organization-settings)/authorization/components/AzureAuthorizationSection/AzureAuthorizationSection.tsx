'use client';

import { useState } from 'react';

import { Paper, Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

import { PLATFORM_CONFIG, PlatformsValue } from '@constants';
import { useGetAuthorizationList } from '@hooks-api';

import { getUsageDataDisabledReason } from '../../utils/getUsageDataDisabledReason';
import { AddAuthorizationDropdownButton } from '../AddAuthorizationDropdownButton';
import { AuthorizationListEmptyState } from '../AuthorizationListEmptyState';
import { SyncStatusIcon } from '../SyncStatusIcon';
import { AzureBillingDataAuthorizationTable } from './AzureBillingDataAuthorizationTable';
import { AzureUsageDataAuthorizationTable } from './AzureUsageDataAuthorizationTable';

const LABELS = {
  title: 'Azure',
};

export function AzureAuthorizationSection() {
  const [isOpen, setIsOpen] = useState(false);
  const PlatformIcon = PLATFORM_CONFIG.azure.icon;

  const { data: authorizationListData } = useGetAuthorizationList();
  const azureBillingList = authorizationListData?.data.azure.billing ?? [];
  const azureUsageList = authorizationListData?.data.azure.usage ?? [];

  const isEmptyAuthorizationList = azureBillingList.length === 0 && azureUsageList.length === 0;
  const usageDataDisabledReason = getUsageDataDisabledReason(
    azureBillingList.length,
    azureUsageList.length
  );

  return (
    <VStack sx={{ gap: 2 }}>
      <HStack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <HStack sx={{ alignItems: 'center', gap: 2 }}>
          <PlatformIcon />
          <Typography variant="h5">{LABELS.title}</Typography>
        </HStack>
        <HStack sx={{ gap: 2 }}>
          <SyncStatusIcon />
          <AddAuthorizationDropdownButton
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            usageDataDisabledReason={usageDataDisabledReason}
            platform={PlatformsValue.AZURE}
          />
        </HStack>
      </HStack>
      {isEmptyAuthorizationList ? (
        <AuthorizationListEmptyState />
      ) : (
        <Paper>
          <VStack sx={{ gap: 6 }}>
            {/* Billing Data */}
            <AzureBillingDataAuthorizationTable />
            {/* Usage Data */}
            <AzureUsageDataAuthorizationTable />
          </VStack>
        </Paper>
      )}
    </VStack>
  );
}
