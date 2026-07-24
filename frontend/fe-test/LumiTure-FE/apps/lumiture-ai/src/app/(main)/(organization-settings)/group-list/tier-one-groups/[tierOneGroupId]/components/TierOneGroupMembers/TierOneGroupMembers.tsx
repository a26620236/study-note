'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';

import { HStack, VStack } from '@lumiture-ui';

import { CUSTOMIZED_EMPTY_CONTENT } from '@components/EmptyState/constants';
import EmptyState from '@components/EmptyState/EmptyState';
import EllipsisTooltipCell from '@components/table/EllipsisTooltipCell';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { useGetTierOneUsers, type UsersInfos } from '@hooks-api';

import type { TierOneGroupParams } from '../../../../types/params';
import { formatGroupMembers } from '../../utils/formattedGroupMember';
import { InviteUserSection } from './InviteUserSection';
import { UserActionButtons } from './UserActionButtons';

export const LABELS = {
  description:
    'You can explore the details of this group here, including members, resources, and subgroups belonging to this group.',
};

export function TierOneGroupMembers() {
  const params = useParams<TierOneGroupParams>();
  const { tierOneGroupId } = params;

  // API queries
  const { data: tierOneUsersQuery } = useGetTierOneUsers(tierOneGroupId);

  // Derived data
  const formattedUsers = useMemo(
    () => formatGroupMembers(tierOneUsersQuery?.data.users),
    [tierOneUsersQuery?.data.users]
  );

  const isEmptyUsers = formattedUsers.length === 0;

  // Table columns configuration
  const baseColumns: ColumnDef<UsersInfos>[] = useMemo(
    () => [
      {
        accessorKey: 'userName',
        header: 'User Name',
        size: 230,
        meta: {
          align: 'left',
        },
        cell: ({ row }) => (
          <EllipsisTooltipCell text={row.original.userName} tooltipText={row.original.userName} />
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 170,
        meta: {
          align: 'left',
        },
        cell: ({ row }) => (
          <EllipsisTooltipCell text={row.original.email} tooltipText={row.original.email} />
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 170,
        meta: {
          align: 'center',
        },
        cell: ({ row }) => {
          const role = row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1);
          return role;
        },
      },
      {
        accessorKey: 'activeStatus',
        header: 'Active Status',
        size: 170,
        meta: {
          align: 'center',
        },
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        size: 120,
        meta: {
          align: 'center',
        },
      },
    ],
    []
  );

  const hasEditAction = tierOneUsersQuery?.data.availableActions.editUser;
  const hasRemoveAction = tierOneUsersQuery?.data.availableActions.removeUser;
  const columns: ColumnDef<UsersInfos>[] =
    hasEditAction || hasRemoveAction
      ? [
          ...baseColumns,
          {
            accessorKey: 'action',
            header: 'Action',
            size: 120,
            meta: { align: 'center' },
            cell: ({ row }) => (
              <UserActionButtons
                user={row.original}
                tierOneGroupId={tierOneGroupId}
                roleOptions={tierOneUsersQuery.data.availableActions.inviteRoleOptions ?? []}
              />
            ),
          },
        ]
      : baseColumns;

  return (
    <VStack mt={4} gap={4}>
      <HStack justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          {LABELS.description}
        </Typography>
        <InviteUserSection
          tierOneGroupId={tierOneGroupId}
          canInviteUser={!!tierOneUsersQuery?.data.availableActions.inviteUser}
          roleOptions={tierOneUsersQuery?.data.availableActions.inviteRoleOptions ?? []}
        />
      </HStack>
      {isEmptyUsers ? (
        <EmptyState size="small" type="error" {...CUSTOMIZED_EMPTY_CONTENT.emptyUser} />
      ) : (
        <VirtualizedTable data={formattedUsers} columns={columns} />
      )}
    </VStack>
  );
}
