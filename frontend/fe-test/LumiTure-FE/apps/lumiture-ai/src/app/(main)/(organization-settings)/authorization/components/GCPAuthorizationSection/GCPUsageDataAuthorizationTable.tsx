'use client';

import { useMemo } from 'react';

import { Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { VStack } from '@lumiture-ui';
import { formatUtcToLocalTime } from '@shared/utils';

import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { PlatformsValue } from '@constants';
import { GCPUsageDisplayStatus, useGetAuthorizationList, type GCPItem } from '@hooks-api';

import { NameCell } from '../NameCell';
import { StatusCell } from '../StatusCell';

const LABELS = {
  title: 'Usage Data',
  header: {
    name: 'Project Name / ID',
    status: 'Status',
    updatedAt: 'Last Updated',
  },
  status: {
    [GCPUsageDisplayStatus.Connected]: 'Connected',
    [GCPUsageDisplayStatus.Error]: 'Error',
    [GCPUsageDisplayStatus.InProgress]: 'In Progress',
  },
};

interface GCPStatusCellProps {
  status: GCPUsageDisplayStatus;
}

function GCPStatusCell({ status }: GCPStatusCellProps) {
  const hasError = status === GCPUsageDisplayStatus.Error;
  const label = LABELS.status[status];
  return <StatusCell label={label} hasError={hasError} />;
}

export function GCPUsageDataAuthorizationTable() {
  const { data: authorizationListData } = useGetAuthorizationList();
  const gcpAuthorizationList = authorizationListData?.data[PlatformsValue.GCP].usage ?? [];
  const isEmptyAuthorizationList = gcpAuthorizationList.length === 0;

  const columns: ColumnDef<GCPItem['usage'][number]>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: LABELS.header.name,
        cell: ({ row }) => {
          const { scopingProjectName: projectName, scopingProjectId: projectId } = row.original;
          return <NameCell name={projectName} id={projectId} />;
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

  if (isEmptyAuthorizationList) {
    return null;
  }

  return (
    <VStack sx={{ gap: 6 }}>
      <Typography variant="h6">{LABELS.title}</Typography>
      <VirtualizedTable data={gcpAuthorizationList} columns={columns} />
    </VStack>
  );
}
