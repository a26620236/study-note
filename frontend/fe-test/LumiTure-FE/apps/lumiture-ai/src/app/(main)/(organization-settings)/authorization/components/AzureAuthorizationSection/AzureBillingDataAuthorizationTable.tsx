'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { VStack } from '@lumiture-ui';
import { formatUtcToLocalTime } from '@shared/utils';

import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { ORG_SETTINGS_PATHS, PlatformsValue } from '@constants';
import { AzureBillingDisplayStatus, useGetAuthorizationList, type AzureItem } from '@hooks-api';

import { NameCell } from '../NameCell';
import { StatusCell } from '../StatusCell';

const LABELS = {
  title: 'Billing Account',
  header: {
    name: 'Subscription Name / ID',
    status: 'Status',
    updatedAt: 'Last Updated',
    retrievingResourceName: 'Retrieving Resource Name',
  },
  status: {
    [AzureBillingDisplayStatus.Connected]: 'Connected',
    [AzureBillingDisplayStatus.InProgress]: 'In Progress',
    [AzureBillingDisplayStatus.Error]: 'Error',
    [AzureBillingDisplayStatus.ErrorNoSubscriptionReader]: 'Subscription Reader Required',
  },
  tooltipText: {
    [AzureBillingDisplayStatus.ErrorNoSubscriptionReader]:
      'Data cannot be retrieved correctly because the authorization steps are incomplete. Click to check the remaining steps.',
    [AzureBillingDisplayStatus.InProgress]:
      'Azure authorization status data synchronization occurs daily at 0:00 (UTC+0). We recommend checking your status after this time for the updated results.',
  },
};

interface StatusCellProps {
  status: AzureBillingDisplayStatus;
}

export function AzureStatusCell({ status }: StatusCellProps) {
  const hasError =
    status === AzureBillingDisplayStatus.Error ||
    status === AzureBillingDisplayStatus.ErrorNoSubscriptionReader;
  const label = LABELS.status[status];

  const tooltipText = (() => {
    switch (status) {
      case AzureBillingDisplayStatus.ErrorNoSubscriptionReader:
        return LABELS.tooltipText[AzureBillingDisplayStatus.ErrorNoSubscriptionReader];
      case AzureBillingDisplayStatus.InProgress:
        return LABELS.tooltipText[AzureBillingDisplayStatus.InProgress];
      default:
        return '';
    }
  })();

  return <StatusCell label={label} hasError={hasError} tooltipText={tooltipText} />;
}

export function AzureBillingDataAuthorizationTable() {
  const { data: authorizationListData } = useGetAuthorizationList();
  const azureAuthorizationList = authorizationListData?.data.azure.billing ?? [];
  const router = useRouter();

  const handleTableRowClick = (row: AzureItem['billing'][number]) => {
    const { status } = row;

    if (status === AzureBillingDisplayStatus.ErrorNoSubscriptionReader) {
      router.push(
        `${ORG_SETTINGS_PATHS.billingDataIntegration.pathname.replace(
          '[platform]',
          PlatformsValue.AZURE
        )}?step=2`
      );
    }
  };

  const columns: ColumnDef<AzureItem['billing'][number]>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: LABELS.header.name,
        cell: ({ row }) => {
          const { subscriptionName, subscriptionId } = row.original;
          return (
            <NameCell
              name={subscriptionName || LABELS.header.retrievingResourceName}
              id={subscriptionId}
            />
          );
        },
        meta: { align: 'left' },
        size: 300,
      },
      {
        accessorKey: 'status',
        header: LABELS.header.status,
        cell: ({ row }) => <AzureStatusCell status={row.original.status} />,
        meta: { align: 'left' },
        size: 124,
      },
      {
        accessorKey: 'updatedAt',
        header: LABELS.header.updatedAt,
        cell: ({ row }) => (
          <Typography variant="buttonRegular1">
            {formatUtcToLocalTime(row.original.updatedAt)}
          </Typography>
        ),
        meta: { align: 'left' },
        size: 118,
      },
    ],
    []
  );

  return (
    <VStack sx={{ gap: 6 }}>
      <Typography variant="h6">{LABELS.title}</Typography>
      <VirtualizedTable
        data={azureAuthorizationList}
        columns={columns}
        onTableRowClick={handleTableRowClick}
      />
    </VStack>
  );
}
