'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import EditIcon from '@mui/icons-material/Edit';
import { Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';
import { getAxiosError, popErrorToast, popSuccessToast } from '@shared/utils';

import EditGroupDialog from '@components/dialog/EditGroupDialog';
import RemoveGroupDialog from '@components/dialog/RemoveGroupDialog';
import { ERROR_CODES, ORG_SETTINGS_PATHS } from '@constants';
import {
  tierOneUsersQueryKey,
  tierTwoGroupsQueryKey,
  tierTwoUsersQueryKey,
  useDeleteTierTwoGroup,
  useGetTierTwoUsers,
  usePatchTierTwoGroup,
  type EditGroupPayload,
} from '@hooks-api';

interface TierTwoGroupHeaderProps {
  tierOneGroupId: string;
  tierTwoGroupId: string;
}

export function TierTwoGroupHeader({ tierOneGroupId, tierTwoGroupId }: TierTwoGroupHeaderProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isOpenRemoveGroupDialog, setIsOpenRemoveGroupDialog] = useState(false);
  const [isOpenEditGroup, setIsOpenEditGroup] = useState(false);

  const { data: tierTwoUsersQuery } = useGetTierTwoUsers(tierOneGroupId, tierTwoGroupId);
  const { availableActions, groupName, orgName, parentGroup } = tierTwoUsersQuery?.data ?? {};
  const removeTierTwoGroupMutation = useDeleteTierTwoGroup();
  const updateGroupMutation = usePatchTierTwoGroup();

  const handleEditGroup = async (data: EditGroupPayload) => {
    try {
      await updateGroupMutation.mutateAsync({
        ...data,
        tierOneGroupId: parseInt(tierOneGroupId),
        tierTwoGroupId: parseInt(tierTwoGroupId),
      });
      queryClient.invalidateQueries({ queryKey: tierTwoGroupsQueryKey(tierOneGroupId) });
      queryClient.invalidateQueries({
        queryKey: tierTwoUsersQueryKey(tierOneGroupId, tierTwoGroupId),
      });
      popSuccessToast({ description: 'Group updated successfully.' });
      setIsOpenEditGroup(false);
    } catch (error) {
      popErrorToast({ description: 'Unable to update group. Please try again later.' });
      console.error(error);
    }
  };

  const handleRemoveGroup = async () => {
    try {
      await removeTierTwoGroupMutation.mutateAsync({
        tierOneGroupId: parseInt(tierOneGroupId),
        tierTwoGroupId: parseInt(tierTwoGroupId),
      });
      queryClient.invalidateQueries({ queryKey: tierOneUsersQueryKey(tierOneGroupId) });
      queryClient.invalidateQueries({ queryKey: tierTwoGroupsQueryKey(tierOneGroupId) });
      popSuccessToast({ description: 'Group removed successfully.' });
      router.push(
        ORG_SETTINGS_PATHS.groupListTierTwo.pathname.replace('[tierOneGroupId]', tierOneGroupId)
      );
    } catch (error) {
      const axiosError = getAxiosError(error);
      const errorCode = axiosError?.code;
      if (errorCode === ERROR_CODES.DELETE_USER_GROUP_CONTAIN_USERS.key) {
        popErrorToast({ description: ERROR_CODES.DELETE_USER_GROUP_CONTAIN_USERS.message });
      } else {
        popErrorToast({ description: 'Unable to remove group. Please try again later.' });
        console.error(axiosError);
      }
    } finally {
      setIsOpenRemoveGroupDialog(false);
    }
  };

  const canEditGroup = availableActions?.editGroup ?? false;
  const canRemoveGroup = availableActions?.removeGroup ?? false;

  return (
    <>
      <VStack gap={1}>
        <Typography variant="caption" color="text.secondary">
          {`${orgName || '--'} / `} {parentGroup?.groupName || '--'}
        </Typography>
        <HStack justifyContent="space-between">
          <Typography variant="h3">{groupName || '--'}</Typography>
          <HStack gap={2}>
            {canEditGroup && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsOpenEditGroup((prev) => !prev)}
                data-testid="edit-group-button"
              >
                <HStack gap={1} alignItems="center">
                  <EditIcon sx={{ fontSize: 16 }} />
                  Edit Group
                </HStack>
              </Button>
            )}
            {canRemoveGroup && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsOpenRemoveGroupDialog((prev) => !prev)}
                data-testid="remove-group-button"
              >
                <HStack gap={1} alignItems="center">
                  <Icon name="delete" sx={{ fontSize: 16 }} />
                  Remove Group
                </HStack>
              </Button>
            )}
          </HStack>
        </HStack>
      </VStack>
      {isOpenEditGroup && (
        <EditGroupDialog
          isOpen={isOpenEditGroup}
          defaultValues={{
            groupName: groupName ?? '--',
          }}
          isPending={updateGroupMutation.isPending}
          handleEditGroup={handleEditGroup}
          handleClose={() => setIsOpenEditGroup(false)}
        />
      )}
      <RemoveGroupDialog
        hasAuth={availableActions?.removeGroup ?? false}
        open={isOpenRemoveGroupDialog}
        groupName={groupName ?? '--'}
        handleClose={() => setIsOpenRemoveGroupDialog(false)}
        handleSubmit={handleRemoveGroup}
        disabled={removeTierTwoGroupMutation.isPending}
        isLoading={removeTierTwoGroupMutation.isPending}
        variant="warning"
      />
    </>
  );
}
