'use client';

import { useMemo } from 'react';

import { Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { VStack } from '@lumiture-ui';
import { formatUtcToLocalTime } from '@shared/utils';

import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { PlatformsValue } from '@constants';
import { AWSUsageDisplayStatus, useGetAuthorizationList, type AWSItem } from '@hooks-api';

import { NameCell } from '../NameCell';
import { StatusCell } from '../StatusCell';

const LABELS = {
  title: 'Usage Data',
  header: {
    name: 'Management Account Name / ID',
    status: 'Status',
    updatedAt: 'Last Updated',
  },
  status: {
    [AWSUsageDisplayStatus.Connected]: 'Connected',
    [AWSUsageDisplayStatus.Error]: 'Error',
    [AWSUsageDisplayStatus.InProgress]: 'In Progress',
    [AWSUsageDisplayStatus.DataInitFailed]: 'Data Sync Initialization Failed',
  },
  tooltipText: {
    [AWSUsageDisplayStatus.DataInitFailed]: `Please try integrating again after one day. If the issue persists, carefully verify the IAM Role's trust relationship settings in your AWS account. For further assistance, please contact support@lumiture.ai.`,
  },
};

interface AWSStatusCellProps {
  status: AWSUsageDisplayStatus;
}

function AWSStatusCell({ status }: AWSStatusCellProps) {
  const hasError = status === AWSUsageDisplayStatus.Error;
  const label = LABELS.status[status];
  const isDataInitFailed = status === AWSUsageDisplayStatus.DataInitFailed;

  return (
    <StatusCell
      label={label}
      hasError={hasError}
      tooltipText={isDataInitFailed ? LABELS.tooltipText[AWSUsageDisplayStatus.DataInitFailed] : ''}
    />
  );
}

export function AWSUsageDataAuthorizationTable() {
  const { data: authorizationListData } = useGetAuthorizationList();
  const awsAuthorizationList = authorizationListData?.data[PlatformsValue.AWS].usage ?? [];

  const columns: ColumnDef<AWSItem['usage'][number]>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: LABELS.header.name,
        cell: ({ row }) => {
          const { accountName: projectName, accountId: projectId } = row.original;
          return <NameCell name={projectName} id={projectId} />;
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

  if (awsAuthorizationList.length === 0) {
    return null;
  }

  return (
    <VStack sx={{ gap: 6 }}>
      <Typography variant="h6">{LABELS.title}</Typography>
      <VirtualizedTable data={awsAuthorizationList} columns={columns} />
    </VStack>
  );
}
