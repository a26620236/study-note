'use client';

import { useMemo } from 'react';

import { Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { VStack } from '@lumiture-ui';
import { formatUtcToLocalTime } from '@shared/utils';

import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { PlatformsValue } from '@constants';
import { AWSBillingDisplayStatus, useGetAuthorizationList, type AWSItem } from '@hooks-api';

import { NameCell } from '../NameCell';
import { StatusCell } from '../StatusCell';

const LABELS = {
  title: 'Management Account',
  header: {
    name: 'Management Account Name / ID',
    status: 'Status',
    updatedAt: 'Last Updated',
  },
  status: {
    [AWSBillingDisplayStatus.Connected]: 'Connected',
    [AWSBillingDisplayStatus.Error]: 'Error',
    [AWSBillingDisplayStatus.InProgress]: 'In Progress',
  },
};

interface AWSStatusCellProps {
  status: AWSBillingDisplayStatus;
}

function AWSStatusCell({ status }: AWSStatusCellProps) {
  const hasError = status === AWSBillingDisplayStatus.Error;
  const label = LABELS.status[status];
  return <StatusCell label={label} hasError={hasError} />;
}

export function AWSBillingDataAuthorizationTable() {
  const { data: authorizationListData } = useGetAuthorizationList();
  const awsAuthorizationList = authorizationListData?.data[PlatformsValue.AWS].billing ?? [];

  const columns: ColumnDef<AWSItem['billing'][number]>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: LABELS.header.name,
        cell: ({ row }) => {
          const { accountName, accountId } = row.original;
          return <NameCell name={accountName} id={accountId} />;
        },
        meta: { align: 'left' },
        size: 300,
      },
      {
        accessorKey: 'status',
        header: LABELS.header.status,
        cell: ({ row }) => <AWSStatusCell status={row.original.status} />,
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
      <VirtualizedTable data={awsAuthorizationList} columns={columns} />
    </VStack>
  );
}
