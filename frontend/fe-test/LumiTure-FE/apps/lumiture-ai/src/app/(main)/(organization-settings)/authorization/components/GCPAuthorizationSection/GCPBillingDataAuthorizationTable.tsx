'use client';

import { useMemo } from 'react';

import { Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { VStack } from '@lumiture-ui';
import { formatUtcToLocalTime } from '@shared/utils';

import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { PlatformsValue } from '@constants';
import { GCPBillingDisplayStatus, useGetAuthorizationList, type GCPItem } from '@hooks-api';

import { NameCell } from '../NameCell';
import { StatusCell } from '../StatusCell';

const LABELS = {
  title: 'Billing Account',
  header: {
    name: 'Billing Account Name / ID',
    status: 'Status',
    updatedAt: 'Last Updated',
  },
  status: {
    [GCPBillingDisplayStatus.Connected]: 'Connected',
    [GCPBillingDisplayStatus.Error]: 'Error',
    [GCPBillingDisplayStatus.InProgress]: 'In Progress',
  },
};

interface GCPStatusCellProps {
  status: GCPBillingDisplayStatus;
}

function GCPStatusCell({ status }: GCPStatusCellProps) {
  const hasError = status === GCPBillingDisplayStatus.Error;
  const label = LABELS.status[status];
  return <StatusCell label={label} hasError={hasError} />;
}

export function GCPBillingDataAuthorizationTable() {
  const { data: authorizationListData } = useGetAuthorizationList();
  const gcpAuthorizationList = authorizationListData?.data[PlatformsValue.GCP].billing ?? [];

  const columns: ColumnDef<GCPItem['billing'][number]>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: LABELS.header.name,
        cell: ({ row }) => {
          const { billingAccountName, billingAccountId } = row.original;
          return <NameCell name={billingAccountName} id={billingAccountId} />;
        },
        meta: { align: 'left' },
        size: 300,
      },
      {
        accessorKey: 'status',
        header: LABELS.header.status,
        cell: ({ row }) => <GCPStatusCell status={row.original.status} />,
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
      <VirtualizedTable data={gcpAuthorizationList} columns={columns} />
    </VStack>
  );
}
