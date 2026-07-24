'use client';

import { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useQueryClient } from '@tanstack/react-query';

import { HStack, Icon } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import RemoveUserDialog from '@components/dialog/RemoveUserDialog';
import UpdateUserDialog from '@components/dialog/UpdateUserDialog';
import {
  tierOneUsersQueryKey,
  usePatchTierOneUser,
  type UpdateUserPayload,
  type UsersInfos,
} from '@hooks-api';

interface UserActionButtonsProps {
  user: UsersInfos;
  tierOneGroupId: string;
  roleOptions: string[];
}

export function UserActionButtons({ user, tierOneGroupId, roleOptions }: UserActionButtonsProps) {
  const queryClient = useQueryClient();
  const [isOpenRemoveUserDialog, setIsOpenRemoveUserDialog] = useState(false);
  const [isOpenUpdateUserDialog, setIsOpenUpdateUserDialog] = useState(false);

  const canEditUser = user.action.edit;
  const canRemoveUser = user.action.remove;

  const updateUserMutation = usePatchTierOneUser(tierOneGroupId);

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpenUpdateUserDialog(true);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpenRemoveUserDialog(true);
  };

  const updateUserSubmitHandler = async (data: UpdateUserPayload) => {
    try {
      await updateUserMutation.mutateAsync(data);
      queryClient.invalidateQueries({
        queryKey: tierOneUsersQueryKey(tierOneGroupId),
      });
      popSuccessToast({ description: 'User updated successfully.' });
      setIsOpenUpdateUserDialog(false);
    } catch (error) {
      popErrorToast({ description: 'Unable to update user. Please try again later.' });
      console.error(error);
    }
  };

  return (
    <>
      <HStack gap={2}>
        {canEditUser && (
          <IconButton
            disabled={!user.action.edit}
            color="primary"
            onClick={handleEditClick}
            data-testid="edit-user-button"
          >
            <EditIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
        {canRemoveUser && (
          <IconButton
            disabled={!user.action.remove}
            color="primary"
            onClick={handleDeleteClick}
            data-testid="delete-user-button"
          >
            <Icon name="delete" />
          </IconButton>
        )}
      </HStack>

      <RemoveUserDialog
        open={isOpenRemoveUserDialog}
        userId={user.userId}
        userName={user.userName === ' ' ? '--' : user.userName}
        userGroupId={tierOneGroupId}
        isAdminGroup={false}
        variant="warning"
        handleClose={() => setIsOpenRemoveUserDialog(false)}
      />

      <UpdateUserDialog
        open={isOpenUpdateUserDialog}
        userId={user.userId}
        userName={user.userName === ' ' ? '--' : user.userName}
        userRole={user.role}
        variant="warning"
        isSubmitDisabled={updateUserMutation.isPending}
        isPending={updateUserMutation.isPending}
        handleUpdateUser={updateUserSubmitHandler}
        handleClose={() => setIsOpenUpdateUserDialog(false)}
        roleOptions={roleOptions}
      />
    </>
  );
}
