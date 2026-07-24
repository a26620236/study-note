'use client';

import { useState, type MouseEvent } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useQueryClient } from '@tanstack/react-query';

import { HStack, Icon } from '@lumiture-ui';
import { getAxiosError, popErrorToast, popSuccessToast } from '@shared/utils';

import EditGroupDialog from '@components/dialog/EditGroupDialog';
import RemoveGroupDialog from '@components/dialog/RemoveGroupDialog';
import { ERROR_CODES } from '@constants';
import {
  tierOneUsersQueryKey,
  tierTwoGroupsQueryKey,
  useDeleteTierTwoGroup,
  usePatchTierTwoGroup,
  type EditGroupPayload,
  type TierTwoGroupsInfos,
} from '@hooks-api';

interface TierTwoGroupActionButtonsProps {
  group: TierTwoGroupsInfos;
  tierOneGroupId: string;
}

export function TierTwoGroupActionButtons({
  group,
  tierOneGroupId,
}: TierTwoGroupActionButtonsProps) {
  const queryClient = useQueryClient();

  // State management
  const [isOpenEditGroup, setIsOpenEditGroup] = useState(false);
  const [isOpenRemoveGroupDialog, setIsOpenRemoveGroupDialog] = useState(false);

  const canEditGroup = group.action?.edit;
  const canRemoveGroup = group.action?.remove;

  // Mutations
  const removeTierTwoGroupMutation = useDeleteTierTwoGroup();
  const updateGroupMutation = usePatchTierTwoGroup();

  // Event handlers
  const handleEditClick = (event: MouseEvent) => {
    event.stopPropagation();
    setIsOpenEditGroup(true);
  };

  const handleDeleteClick = (event: MouseEvent) => {
    event.stopPropagation();
    setIsOpenRemoveGroupDialog(true);
  };

  const handleEditGroup = async (data: EditGroupPayload) => {
    try {
      const tierTwoGroupId = group.id;
      await updateGroupMutation.mutateAsync({
        ...data,
        tierOneGroupId: parseInt(tierOneGroupId),
        tierTwoGroupId,
      });
      queryClient.invalidateQueries({ queryKey: tierTwoGroupsQueryKey(tierOneGroupId) });
      popSuccessToast({ description: 'Group updated successfully.' });
      setIsOpenEditGroup(false);
    } catch (error) {
      popErrorToast({ description: 'Unable to update group. Please try again later.' });
      console.error(error);
    }
  };

  const handleRemoveGroup = async () => {
    if (!group.id) return;
    try {
      await removeTierTwoGroupMutation.mutateAsync({
        tierOneGroupId: parseInt(tierOneGroupId),
        tierTwoGroupId: group.id,
      });
      queryClient.invalidateQueries({ queryKey: tierOneUsersQueryKey(tierOneGroupId) });
      queryClient.invalidateQueries({ queryKey: tierTwoGroupsQueryKey(tierOneGroupId) });
      popSuccessToast({ description: 'Group removed successfully.' });
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

  const handleContainerClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Box onClick={handleContainerClick}>
      <HStack gap={2}>
        {canEditGroup && (
          <IconButton
            color="primary"
            disabled={group.isOptimizeUpdate}
            onClick={handleEditClick}
            data-testid="edit-group-button"
          >
            <EditIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
        {canRemoveGroup && (
          <IconButton
            color="primary"
            disabled={group.isOptimizeUpdate}
            onClick={handleDeleteClick}
            data-testid="remove-group-button"
          >
            <Icon name="delete" />
          </IconButton>
        )}
      </HStack>

      {isOpenEditGroup && (
        <EditGroupDialog
          isOpen={isOpenEditGroup}
          defaultValues={group}
          isPending={updateGroupMutation.isPending}
          handleEditGroup={handleEditGroup}
          handleClose={() => setIsOpenEditGroup(false)}
        />
      )}

      <RemoveGroupDialog
        hasAuth={group.action?.remove ?? false}
        open={isOpenRemoveGroupDialog}
        groupName={group.groupName || '--'}
        handleClose={() => setIsOpenRemoveGroupDialog(false)}
        handleSubmit={handleRemoveGroup}
        disabled={removeTierTwoGroupMutation.isPending}
        isLoading={removeTierTwoGroupMutation.isPending}
        variant="warning"
      />
    </Box>
  );
}
