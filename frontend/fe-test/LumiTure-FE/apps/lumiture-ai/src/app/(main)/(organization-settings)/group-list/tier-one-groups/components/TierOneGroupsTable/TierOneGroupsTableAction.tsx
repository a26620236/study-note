'use client';

import { useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useQueryClient } from '@tanstack/react-query';

import { HStack, Icon } from '@lumiture-ui';
import { getAxiosError, popErrorToast, popSuccessToast } from '@shared/utils';

import EditGroupDialog from '@components/dialog/EditGroupDialog';
import RemoveGroupDialog from '@components/dialog/RemoveGroupDialog';
import { ERROR_CODES, ORG_SETTINGS_PATHS } from '@constants';
import {
  tierOneGroupsQueryKey,
  useDeleteTierOneGroup,
  usePatchTierOneGroup,
  type EditGroupPayload,
  type TierOneGroupsInfos,
} from '@hooks-api';

interface TierOneGroupsTableActionProps {
  row: TierOneGroupsInfos;
}

export function TierOneGroupsTableAction({ row }: TierOneGroupsTableActionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const canRemoveGroup = row.action?.remove;
  const tierOneGroupId = row.id;

  const [isOpenEditGroup, setIsOpenEditGroup] = useState(false);
  const [isOpenRemoveGroupDialog, setIsOpenRemoveGroupDialog] = useState(false);

  const updateGroupMutation = usePatchTierOneGroup();

  const removeTierOneGroupMutation = useDeleteTierOneGroup();

  const handleEditGroup = async (data: EditGroupPayload) => {
    try {
      await updateGroupMutation.mutateAsync({ ...data, tierOneGroupId });
      queryClient.invalidateQueries({ queryKey: tierOneGroupsQueryKey });
      popSuccessToast({ description: 'Group updated successfully.' });
      setIsOpenEditGroup(false);
    } catch (error) {
      popErrorToast({ description: 'Unable to update group. Please try again later.' });
      console.error(error);
    }
  };

  const handleRemoveGroup = async () => {
    if (!row.id) return;
    try {
      await removeTierOneGroupMutation.mutateAsync({ tierOneGroupId: row.id });
      queryClient.invalidateQueries({ queryKey: tierOneGroupsQueryKey });
      popSuccessToast({ description: 'Group removed successfully.' });
      router.push(ORG_SETTINGS_PATHS.groupListTierOne.pathname);
    } catch (error) {
      const axiosError = getAxiosError(error);
      const errorCode = axiosError?.code;
      if (errorCode === ERROR_CODES.DELETE_USER_GROUP_CONTAIN_USERS.key) {
        popErrorToast({ description: ERROR_CODES.DELETE_USER_GROUP_CONTAIN_USERS.message });
      } else {
        popErrorToast({ description: 'Unable to remove group. Please try again later.' });
        console.error(error);
      }
    }
    setIsOpenRemoveGroupDialog(false);
  };

  // 為了確保不冒泡，使用一個容器 Box 來阻止事件
  const handleContainerClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Box onClick={handleContainerClick}>
      <HStack gap={2}>
        <IconButton
          color="primary"
          disabled={row.isOptimizeUpdate}
          data-testid="edit-group-button"
          onClick={() => {
            setIsOpenEditGroup(true);
          }}
        >
          <EditIcon sx={{ fontSize: 20 }} />
        </IconButton>
        {canRemoveGroup && (
          <IconButton
            color="primary"
            disabled={row.isOptimizeUpdate}
            data-testid="remove-group-button"
            onClick={() => {
              setIsOpenRemoveGroupDialog(true);
            }}
          >
            <Icon name="delete" />
          </IconButton>
        )}
      </HStack>
      {isOpenEditGroup && (
        <EditGroupDialog
          isOpen={isOpenEditGroup}
          defaultValues={row}
          isPending={updateGroupMutation.isPending}
          handleEditGroup={handleEditGroup}
          handleClose={() => setIsOpenEditGroup(false)}
        />
      )}
      {isOpenRemoveGroupDialog && (
        <RemoveGroupDialog
          hasAuth={row.action?.remove ?? false}
          open={isOpenRemoveGroupDialog}
          groupName={row.groupName || '--'}
          handleClose={() => setIsOpenRemoveGroupDialog(false)}
          handleSubmit={handleRemoveGroup}
          disabled={removeTierOneGroupMutation.isPending}
          isLoading={removeTierOneGroupMutation.isPending}
          variant="warning"
        />
      )}
    </Box>
  );
}
