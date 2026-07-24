'use client';

import { useMemo, useRef } from 'react';

import { Box, CircularProgress } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { HStack, VStack } from '@lumiture-ui';
import { formatUtcToLocalTime } from '@shared/utils';
import { useTableInfiniteScroll } from '@shared/hooks';

import EmptyState from '@components/EmptyState/EmptyState';
import { SingleLineCell } from '@components/table/SingleLineCell';
import TableSkeleton from '@components/table/TableSkeleton';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { DOMAIN_TYPE_LABELS, useGetUserActivityList, type UserActivityItem } from '@hooks-api';

import { useUserActivityStore } from '../../hooks/useUserActivityStore';

export function UserActivityTable() {
  const { selectedUsers, filters } = useUserActivityStore();
  const payload = {
    ...filters,
    emails: selectedUsers.flatMap((group) => group.values),
  };

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
    useGetUserActivityList(payload);

  const flatItems: UserActivityItem[] = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const tableWrapperRef = useRef<HTMLDivElement>(null);

  useTableInfiniteScroll({
    ref: tableWrapperRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const columns = useMemo(
    (): ColumnDef<UserActivityItem>[] => [
      {
        id: 'email',
        header: 'Email',
        meta: { align: 'left' },
        size: 250,
        cell: ({ row }) => <SingleLineCell text={row.original.email} searchText={filters.search} />,
      },
      {
        id: 'domainType',
        header: 'Activity Type',
        meta: { align: 'left' },
        size: 150,
        cell: ({ row }) => {
          const { domainType } = row.original;
          return (
            <SingleLineCell text={DOMAIN_TYPE_LABELS[domainType]} searchText={filters.search} />
          );
        },
      },
      {
        id: 'description',
        header: 'Description',
        meta: { align: 'left' },
        size: 250,
        cell: ({ row }) => (
          <SingleLineCell text={row.original.description} searchText={filters.search} />
        ),
      },
      {
        id: 'country',
        header: 'Country',
        accessorKey: 'country',
        meta: { align: 'left' },
        size: 130,
        cell: ({ row }) => (
          <SingleLineCell text={row.original.country} searchText={filters.search} />
        ),
      },
      {
        id: 'ipAddress',
        header: 'IP Address',
        accessorKey: 'ipAddress',
        meta: { align: 'left' },
        size: 150,
        cell: ({ row }) => (
          <SingleLineCell text={row.original.ipAddress} searchText={filters.search} />
        ),
      },
      {
        id: 'createdAt',
        header: 'Timestamp',
        meta: { align: 'left' },
        size: 150,
        cell: ({ row }) => formatUtcToLocalTime(row.original.createdAt, 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
    [filters.search]
  );

  if (isLoading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  if (flatItems.length === 0) {
    return <EmptyState type="emptyTable" />;
  }

  return (
    <VStack gap={1}>
      <Box ref={tableWrapperRef}>
        <VirtualizedTable data={flatItems} columns={columns} getRowId={(row) => String(row.id)} />
      </Box>
      {isFetchingNextPage && (
        <HStack gap={1} justifyContent="center" sx={{ py: 2 }}>
          <CircularProgress size={24} />
        </HStack>
      )}
    </VStack>
  );
}
