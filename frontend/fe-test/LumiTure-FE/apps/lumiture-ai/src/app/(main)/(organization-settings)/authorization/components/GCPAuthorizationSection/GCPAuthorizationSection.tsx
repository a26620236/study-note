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
import { GCPBillingDataAuthorizationTable } from './GCPBillingDataAuthorizationTable';
import { GCPUsageDataAuthorizationTable } from './GCPUsageDataAuthorizationTable';

const LABELS = {
  buttonLabel: 'Add Authorization',
  title: 'Google Cloud',
  dropdown: {
    billingData: 'billing data',
    usageData: 'usage data',
  },
  tooltipText: {
    usageData:
      'To authorize the Scoping Project, you must first complete the authorization for its parent Billing Account.',
  },
};

export function GCPAuthorizationSection() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: authorizationListData } = useGetAuthorizationList();
  const gcpBillingList = authorizationListData?.data[PlatformsValue.GCP].billing ?? [];
  const gcpUsageList = authorizationListData?.data[PlatformsValue.GCP].usage ?? [];

  const isEmptyAuthorizationList = gcpBillingList.length === 0 && gcpUsageList.length === 0;

  const PlatformIcon = PLATFORM_CONFIG[PlatformsValue.GCP].icon;

  const usageDataDisabledReason = getUsageDataDisabledReason(
    gcpBillingList.length,
    gcpUsageList.length
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
            platform={PlatformsValue.GCP}
          />
        </HStack>
      </HStack>
      {isEmptyAuthorizationList ? (
        <AuthorizationListEmptyState />
      ) : (
        <Paper>
          <VStack sx={{ gap: 6 }}>
            {/* Billing Data */}
            <GCPBillingDataAuthorizationTable />
            {/* Usage Data */}
            <GCPUsageDataAuthorizationTable />
          </VStack>
        </Paper>
      )}
    </VStack>
  );
}
