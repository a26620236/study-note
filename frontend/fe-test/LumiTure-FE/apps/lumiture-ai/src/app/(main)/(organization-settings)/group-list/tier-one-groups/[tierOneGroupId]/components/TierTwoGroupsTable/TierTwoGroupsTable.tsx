'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';

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
import { ERROR_CODES } from '@constants';
import {
  tierOneUsersQueryKey,
  tierTwoGroupsQueryKey,
  useGetTierTwoGroups,
  usePostCreateTierTwoGroup,
  type EditGroupPayload,
  type TierTwoGroupsInfos,
} from '@hooks-api';

import type { TierOneGroupParams } from '../../../../types/params';
import { ResourceButton } from './ResourceButton';
import { TierTwoGroupActionButtons } from './TierTwoGroupActionButtons';

export const LABELS = {
  description:
    'You can quickly view the Tier 2 group information here, and click on each group to check details such as group members.',
  createGroupFailedInOtherGroups:
    'The following users already exist in other groups. Due to this, the new group cannot be created.',
  createGroupFailedInAnotherOrg:
    'The following users already exist in another organization. Due to this, the new group cannot be created.',
};

interface InvalidEmailsError {
  invalidEmails: string[];
}

export function TierTwoGroupsTable() {
  // Basic hooks
  const router = useRouter();
  const params = useParams<TierOneGroupParams>();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { tierOneGroupId } = params;

  // State management
  const [isOpenInfoDialog, setIsOpenInfoDialog] = useState(false);
  const [isOpenCreateGroup, setIsOpenCreateGroup] = useState(false);
  const [createGroupError, setCreateGroupError] = useState<
    ErrorResponseGenerics<string, InvalidEmailsError>['data'] | undefined
  >(undefined);

  // Group creation polling state
  const [poll, setPoll] = useState(false);

  // API queries
  const { data: tierTwoGroupsResponse } = useGetTierTwoGroups(tierOneGroupId, {
    queryKey: tierTwoGroupsQueryKey(tierOneGroupId),
    refetchInterval: poll ? 3000 : false,
    refetchOnWindowFocus: 'always',
  });

  // Mutations
  const createGroupMutation = usePostCreateTierTwoGroup({ tierOneGroupId });

  // Derived data
  const tierTwoGroups = tierTwoGroupsResponse?.data;
  const formattedTierTwoGroups = useMemo(
    () =>
      tierTwoGroups?.groups.map((group) => ({
        ...group,
        timeCreated: formatUtcToLocalTime(group.timeCreated),
        lastUpdated: formatRelativeTime(group.lastUpdated),
      })) ?? [],
    [tierTwoGroups?.groups]
  );

  const isEmptyGroups = formattedTierTwoGroups.length === 0;
  const canCreateGroup = !!tierTwoGroupsResponse?.data.availableActions.createGroup;
  const invalidEmails = createGroupError?.detail.invalidEmails;
  const isUserInAnotherOrgError = createGroupError?.code === ERROR_CODES.USER_IN_ANOTHER_ORG.key;
  const createGroupFailedDescription = isUserInAnotherOrgError
    ? LABELS.createGroupFailedInAnotherOrg
    : LABELS.createGroupFailedInOtherGroups;
  const isTierTwoGroupsInTab = searchParams.get('tab') === 'tier-2-groups';

  // Group creation polling
  const { startPolling } = usePolling<TierTwoGroupsInfos>({
    data: tierTwoGroups?.groups,
    poll,
    setPoll,
  });

  // Event handlers
  const handleRowClick = (row: TierTwoGroupsInfos) => {
    if (!row.id || row.isOptimizeUpdate) return;
    router.push(
      `/group-list/tier-one-groups/${tierOneGroupId}/tier-two-groups/${row.id}?tab=group-members`
    );
  };

  const handleCreateGroup = async (data: EditGroupPayload) => {
    try {
      await createGroupMutation.mutateAsync(data);
      popSuccessToast({ description: 'Group created successfully.' });
      queryClient.invalidateQueries({ queryKey: tierOneUsersQueryKey(tierOneGroupId) });
      startPolling(); // 開始 polling 等待後端資料更新
      setIsOpenCreateGroup(false);
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
        console.error(axiosError);
      }
    }
  };

  const handleCreateGroupClick = () => {
    setIsOpenCreateGroup((prev) => !prev);
  };

  // Table columns configuration
  const baseColumns: ColumnDef<TierTwoGroupsInfos>[] = useMemo(
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
        size: 120,
        meta: {
          align: 'center',
        },
        cell: ({ row }) => <ResourceButton row={row.original} tierOneGroupId={tierOneGroupId} />,
      },
      { accessorKey: 'lastUpdated', header: 'Last Updated', size: 170, meta: { align: 'center' } },
      { accessorKey: 'creator', header: 'Creator', size: 170, meta: { align: 'left' } },
      { accessorKey: 'timeCreated', header: 'Time Created', size: 170, meta: { align: 'center' } },
    ],
    [tierOneGroupId]
  );

  const columns: ColumnDef<TierTwoGroupsInfos>[] = useMemo(() => {
    const canEditGroup = tierTwoGroupsResponse?.data.availableActions.editGroup;
    return canEditGroup
      ? [
          ...baseColumns,
          {
            accessorKey: 'action',
            header: 'Action',
            size: 100,
            meta: {
              align: 'center',
            },
            cell: ({ row }) => (
              <TierTwoGroupActionButtons group={row.original} tierOneGroupId={tierOneGroupId} />
            ),
          },
        ]
      : baseColumns;
  }, [baseColumns, tierOneGroupId, tierTwoGroupsResponse?.data.availableActions.editGroup]);

  return (
    <>
      <VStack gap={4} mt={4}>
        <HStack justifyContent="space-between">
          <VStack gap={2} justifyContent="center">
            {!isTierTwoGroupsInTab && (
              <Typography variant="h6">{`Tier 2 Group List (${formattedTierTwoGroups.length})`}</Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {LABELS.description}
            </Typography>
          </VStack>
          <HStack alignItems="flex-end">
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
        </HStack>
        {isEmptyGroups ? (
          <EmptyState size="large" type="error" {...CUSTOMIZED_EMPTY_CONTENT.emptyGroup} />
        ) : (
          <VirtualizedTable
            data={formattedTierTwoGroups}
            columns={columns}
            onTableRowClick={handleRowClick}
          />
        )}
      </VStack>
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
