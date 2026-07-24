'use client';

import { useMemo } from 'react';

import { Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { VStack } from '@lumiture-ui';
import { formatUtcToLocalTime } from '@shared/utils';

import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { AzureUsageDisplayStatus, useGetAuthorizationList, type AzureItem } from '@hooks-api';

import { NameCell } from '../NameCell';
import { StatusCell } from '../StatusCell';

const LABELS = {
  title: 'Usage Data',
  header: {
    name: 'Subscription Name / ID',
    status: 'Status',
    updatedAt: 'Last Updated',
    retrievingResourceName: 'Retrieving Resource Name',
  },
  status: {
    [AzureUsageDisplayStatus.Connected]: 'Connected',
    [AzureUsageDisplayStatus.InProgress]: 'In Progress',
    [AzureUsageDisplayStatus.Error]: 'Error',
    [AzureUsageDisplayStatus.ErrorNoStorageReader]: 'Storage Reader Required',
    [AzureUsageDisplayStatus.ErrorNoSubscriptionReader]: 'Subscription Reader Required',
  },
  tooltipText: {
    error:
      'Data cannot be retrieved correctly because the authorization steps are incomplete. Click to check the remaining steps.',
    [AzureUsageDisplayStatus.InProgress]:
      'Azure authorization status data synchronization occurs daily at 0:00 (UTC+0). We recommend checking your status after this time for the updated results.',
  },
};

interface AzureUsageStatusCellProps {
  status: AzureUsageDisplayStatus;
}

function AzureUsageStatusCell({ status }: AzureUsageStatusCellProps) {
  const hasError =
    status === AzureUsageDisplayStatus.Error ||
    status === AzureUsageDisplayStatus.ErrorNoStorageReader ||
    status === AzureUsageDisplayStatus.ErrorNoSubscriptionReader;
  const label = LABELS.status[status];

  const tooltipMap: Partial<Record<AzureUsageDisplayStatus, string>> = {
    [AzureUsageDisplayStatus.InProgress]: LABELS.tooltipText[AzureUsageDisplayStatus.InProgress],
    [AzureUsageDisplayStatus.Error]: LABELS.tooltipText.error,
    [AzureUsageDisplayStatus.ErrorNoStorageReader]: LABELS.tooltipText.error,
    [AzureUsageDisplayStatus.ErrorNoSubscriptionReader]: LABELS.tooltipText.error,
  };
  const tooltipText = tooltipMap[status] ?? '';

  return <StatusCell label={label} hasError={hasError} tooltipText={tooltipText} />;
}

export function AzureUsageDataAuthorizationTable() {
  const { data: authorizationListData } = useGetAuthorizationList();
  const azureUsageList = authorizationListData?.data.azure.usage ?? [];

  const columns: ColumnDef<AzureItem['usage'][number]>[] = useMemo(
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
        cell: ({ row }) => <AzureUsageStatusCell status={row.original.status} />,
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

  if (azureUsageList.length === 0) {
    return null;
  }

  return (
    <VStack sx={{ gap: 6 }}>
      <Typography variant="h6">{LABELS.title}</Typography>
      <VirtualizedTable data={azureUsageList} columns={columns} />
    </VStack>
  );
}
