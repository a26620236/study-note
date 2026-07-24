'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Typography } from '@mui/material';
import { sendGAEvent } from '@next/third-parties/google';
import type { ColumnDef } from '@tanstack/react-table';
import { useSession } from 'next-auth/react';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';
import type { ErrorResponseGenerics } from '@shared/types';
import {
  formatRelativeTime,
  formatUtcToLocalTime,
  getAxiosError,
  popErrorToast,
  popSuccessToast,
} from '@shared/utils';
import { usePolling } from '@shared/hooks';

import CreateGroupDialog from '@components/dialog/EditGroupDialog';
import InfoDialog from '@components/dialog/InfoDialog';
import { CUSTOMIZED_EMPTY_CONTENT } from '@components/EmptyState/constants';
import EmptyState from '@components/EmptyState/EmptyState';
import EllipsisTooltipCell from '@components/table/EllipsisTooltipCell';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { ERROR_CODES, EVENT_GROUP_LIST } from '@constants';
import {
  tierOneGroupsQueryKey,
  useGetTierOneGroups,
  usePostTierOneGroup,
  type EditGroupPayload as CreateGroupPayload,
  type TierOneGroupsInfos,
} from '@hooks-api';

import { ResourceButton } from './ResourceButton';
import { TierOneGroupsTableAction } from './TierOneGroupsTableAction';
import { TierTwoGroupsButton } from './TierTwoGroupsButton';

export const LABELS = {
  description:
    'You can quickly view the Tier 1 group information here, and click on each group to check details such as group members.',
  createGroupFailedInOtherGroups:
    'The following users already exist in other groups. Due to this, the new group cannot be created.',
  createGroupFailedInAnotherOrg:
    'The following users already exist in another organization. Due to this, the new group cannot be created.',
};

interface InvalidEmailsError {
  invalidEmails: string[];
}

export function TierOneGroupsTable() {
  // Basic hooks
  const router = useRouter();
  const { data } = useSession();
  const { user } = data ?? {};

  // State management
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [isOpenCreateGroup, setIsOpenCreateGroup] = useState(false);
  const [createGroupError, setCreateGroupError] = useState<
    ErrorResponseGenerics<string, InvalidEmailsError>['data'] | undefined
  >(undefined);

  // Memoized values
  const eventTrackingIdentity = useMemo(
    () => ({
      role: user?.group?.character,
      depth: user?.group?.depth,
    }),
    [user]
  );

  // Group creation polling state
  const [poll, setPoll] = useState(false);

  // API queries
  const { data: tierOneGroupsApiResponse } = useGetTierOneGroups({
    queryKey: tierOneGroupsQueryKey,
    refetchInterval: poll ? 3000 : false,
    refetchOnWindowFocus: 'always',
  });

  // Derived data
  const tierOneGroups = tierOneGroupsApiResponse?.data;

  // Group creation polling
  const { startPolling } = usePolling<TierOneGroupsInfos>({
    data: tierOneGroups?.groups,
    poll,
    setPoll,
  });

  // Mutations
  const createGroupMutation = usePostTierOneGroup();

  const formattedGroups = useMemo(
    () =>
      tierOneGroups?.groups.map((group) => ({
        ...group,
        timeCreated: formatUtcToLocalTime(group.timeCreated),
        lastUpdated: formatRelativeTime(group.lastUpdated),
      })) ?? [],
    [tierOneGroups?.groups]
  );

  const isEmptyGroups = formattedGroups.length === 0;
  const canCreateGroup = !!tierOneGroups?.availableActions.createGroup;
  const canEditGroup = tierOneGroups?.availableActions.editGroup;
  const invalidEmails = createGroupError?.detail.invalidEmails;
  const isUserInAnotherOrgError = createGroupError?.code === ERROR_CODES.USER_IN_ANOTHER_ORG.key;
  const createGroupFailedDescription = isUserInAnotherOrgError
    ? LABELS.createGroupFailedInAnotherOrg
    : LABELS.createGroupFailedInOtherGroups;

  // Event handlers
  const handleRowClick = (row: TierOneGroupsInfos) => {
    if (!row.id || row.isOptimizeUpdate) return;
    router.push(`/group-list/tier-one-groups/${row.id}?tab=group-members`);
  };

  const handleCreateGroup = async (data: CreateGroupPayload) => {
    try {
      await createGroupMutation.mutateAsync(data);
      sendGAEvent('event', EVENT_GROUP_LIST.CLICK_SAVE_CREATED_GROUP, eventTrackingIdentity);
      setIsOpenCreateGroup(false);
      popSuccessToast({ description: 'Group created successfully.' });
      startPolling();
    } catch (error) {
      const axiosError = getAxiosError<string, InvalidEmailsError>(error);
      const errorCode = axiosError?.code;
      if (
        errorCode === ERROR_CODES.USER_ALREADY_IN_GROUP.key ||
        errorCode === ERROR_CODES.USER_IN_ANOTHER_ORG.key
      ) {
        setCreateGroupError(axiosError);
        setIsOpenInfoDialog(true);
      } else {
        popErrorToast({ description: 'Unable to create group. Please try again later.' });
        console.error(error);
      }
    }
  };

  const handleCreateGroupClick = () => {
    sendGAEvent('event', EVENT_GROUP_LIST.CLICK_CREATE_GROUP, eventTrackingIdentity);
    setIsOpenCreateGroup((prev) => !prev);
  };

  // Table columns configuration
  const baseColumns: ColumnDef<TierOneGroupsInfos>[] = useMemo(
    () => [
      {
        accessorKey: 'groupName',
        header: 'Group Name',
        size: 175,
        meta: {
          align: 'left',
        },
        cell: ({ row }) => (
          <EllipsisTooltipCell text={row.original.groupName} tooltipText={row.original.groupName} />
        ),
      },
      {
        accessorKey: 'resource',
        header: 'Resource',
        size: 140,
        meta: {
          align: 'left',
        },
        cell: ({ row }) => (
          <ResourceButton row={row.original} eventTrackingIdentity={eventTrackingIdentity} />
        ),
      },
      {
        accessorKey: 'tier2Group',
        header: 'Tier 2 Group',
        size: 140,
        meta: {
          align: 'left',
        },
        cell: ({ row }) => (
          <TierTwoGroupsButton row={row.original} eventTrackingIdentity={eventTrackingIdentity} />
        ),
      },
      {
        accessorKey: 'lastUpdated',
        header: 'Last Updated',
        size: 140,
        meta: {
          align: 'left',
        },
      },
      {
        accessorKey: 'creator',
        header: 'Creator',
        size: 175,
        meta: {
          align: 'left',
        },
      },
      {
        accessorKey: 'timeCreated',
        header: 'Time Created',
        size: 140,
        meta: {
          align: 'left',
        },
      },
    ],
    [eventTrackingIdentity]
  );

  const columns: ColumnDef<TierOneGroupsInfos>[] = canEditGroup
    ? [
        ...baseColumns,
        {
          accessorKey: 'action',
          header: 'Action',
          size: 100,
          meta: {
            align: 'center',
          },
          cell: ({ row }) => <TierOneGroupsTableAction row={row.original} />,
        },
      ]
    : baseColumns;

  return (
    <>
      <HStack justifyContent="space-between" alignItems="flex-end">
        <VStack gap={2}>
          <Typography variant="h6">{`Tier 1 Group List (${formattedGroups.length})`}</Typography>
          <Typography variant="caption">{LABELS.description}</Typography>
        </VStack>
        {canCreateGroup && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon name="add" />}
            onClick={handleCreateGroupClick}
            data-testid="create-group-button"
          >
            create group
          </Button>
        )}
      </HStack>
      {isEmptyGroups ? (
        <EmptyState size="small" type="error" {...CUSTOMIZED_EMPTY_CONTENT.emptyGroup} />
      ) : (
        <VirtualizedTable
          data={formattedGroups}
          columns={columns}
          onTableRowClick={handleRowClick}
        />
      )}
      {isOpenCreateGroup && (
        <CreateGroupDialog
          isOpen={isOpenCreateGroup}
          defaultValues={null}
          isPending={createGroupMutation.isPending}
          handleEditGroup={handleCreateGroup}
          handleClose={() => setIsOpenCreateGroup(false)}
        />
      )}
      <InfoDialog
        open={isOpenInfoDialog}
        variant="warning"
        title="Group Created Failed"
        handleClose={() => setIsOpenInfoDialog(false)}
        content={
          <>
            <span>{createGroupFailedDescription}</span>
            <ul>
              {invalidEmails?.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </>
        }
      />
    </>
  );
}
