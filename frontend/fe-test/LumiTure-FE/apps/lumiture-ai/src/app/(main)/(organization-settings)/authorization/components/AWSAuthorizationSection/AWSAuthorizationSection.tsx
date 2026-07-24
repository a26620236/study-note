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
import { AWSBillingDataAuthorizationTable } from './AWSBillingDataAuthorizationTable';
import { AWSUsageDataAuthorizationTable } from './AWSUsageDataAuthorizationTable';

const LABELS = {
  buttonLabel: 'Add Authorization',
  title: 'AWS',
};

export function AWSAuthorizationSection() {
  const [isOpen, setIsOpen] = useState(false);
  const PlatformIcon = PLATFORM_CONFIG[PlatformsValue.AWS].icon;

  const { data: authorizationListData } = useGetAuthorizationList();
  const awsBillingList = authorizationListData?.data[PlatformsValue.AWS].billing ?? [];
  const awsUsageList = authorizationListData?.data[PlatformsValue.AWS].usage ?? [];

  const isEmptyAuthorizationList = awsBillingList.length === 0;
  const usageDataDisabledReason = getUsageDataDisabledReason(
    awsBillingList.length,
    awsUsageList.length
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
            platform={PlatformsValue.AWS}
          />
        </HStack>
      </HStack>
      {isEmptyAuthorizationList ? (
        <AuthorizationListEmptyState />
      ) : (
        <Paper>
          <VStack sx={{ gap: 6 }}>
            {/* Billing Data */}
            <AWSBillingDataAuthorizationTable />
            {/* Usage Data */}
            <AWSUsageDataAuthorizationTable />
          </VStack>
        </Paper>
      )}
    </VStack>
  );
}
