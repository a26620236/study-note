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
import { useGetTierTwoUsers, type UsersInfos } from '@hooks-api';

import type { TierOneAndTwoGroupParams } from '../../../../../../types/params';
import { formatGroupMembers } from '../../../../utils/formattedGroupMember';
import { InviteUserSection } from './InviteUserSection';
import { UserActionButtons } from './UserActionButtons';

export const LABELS = {
  description:
    'You can explore the details of this group here, including members, resources, and subgroups belonging to this group.',
};

export function TierTwoGroupMembers() {
  const params = useParams<TierOneAndTwoGroupParams>();
  const { tierOneGroupId, tierTwoGroupId } = params;

  // API queries
  const { data: tierTwoUsersQuery } = useGetTierTwoUsers(tierOneGroupId, tierTwoGroupId);

  // Derived data
  const formattedUsers = useMemo(
    () => formatGroupMembers(tierTwoUsersQuery?.data.users),
    [tierTwoUsersQuery?.data.users]
  );

  const isEmptyUsers = tierTwoUsersQuery?.success && formattedUsers.length === 0;
  const canInviteUser = !!tierTwoUsersQuery?.data.availableActions.inviteUser;
  const roleOptions = useMemo(
    () => tierTwoUsersQuery?.data.availableActions.inviteRoleOptions ?? [],
    [tierTwoUsersQuery?.data.availableActions.inviteRoleOptions]
  );

  // Table columns configuration
  const baseColumns: ColumnDef<UsersInfos>[] = useMemo(
    () => [
      {
        accessorKey: 'userName',
        header: 'User Name',
        size: 230,
        meta: { align: 'left' },
        cell: ({ row }) => (
          <EllipsisTooltipCell text={row.original.userName} tooltipText={row.original.userName} />
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 170,
        meta: { align: 'left' },
        cell: ({ row }) => (
          <EllipsisTooltipCell text={row.original.email} tooltipText={row.original.email} />
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 170,
        meta: { align: 'center' },
        cell: ({ row }) => {
          const role = row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1);
          return role;
        },
      },
      {
        accessorKey: 'activeStatus',
        header: 'Active Status',
        size: 170,
        meta: { align: 'center' },
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        size: 120,
        meta: { align: 'center' },
      },
    ],
    []
  );

  const columns: ColumnDef<UsersInfos>[] = useMemo(() => {
    const hasEditAction = tierTwoUsersQuery?.data.availableActions.editUser;
    const hasRemoveAction = tierTwoUsersQuery?.data.availableActions.removeUser;
    return hasEditAction || hasRemoveAction
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
                tierTwoGroupId={tierTwoGroupId}
                roleOptions={roleOptions}
              />
            ),
          },
        ]
      : baseColumns;
  }, [
    baseColumns,
    tierOneGroupId,
    tierTwoGroupId,
    tierTwoUsersQuery?.data.availableActions.editUser,
    tierTwoUsersQuery?.data.availableActions.removeUser,
    roleOptions,
  ]);

  return (
    <VStack mt={4} gap={4}>
      <HStack justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          {LABELS.description}
        </Typography>
        <InviteUserSection
          tierOneGroupId={tierOneGroupId}
          tierTwoGroupId={tierTwoGroupId}
          canInviteUser={canInviteUser}
          roleOptions={roleOptions}
        />
      </HStack>
      {isEmptyUsers ? (
        <EmptyState size="large" type="error" {...CUSTOMIZED_EMPTY_CONTENT.emptyUser} />
      ) : (
        <VirtualizedTable data={formattedUsers} columns={columns} />
      )}
    </VStack>
  );
}
