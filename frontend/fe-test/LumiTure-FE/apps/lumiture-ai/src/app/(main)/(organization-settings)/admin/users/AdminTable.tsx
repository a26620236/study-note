'use client';

import { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { sendGAEvent } from '@next/third-parties/google';
import { useQueryClient } from '@tanstack/react-query';

import { Button, Icon } from '@lumiture-ui';
import { formatUtcToLocalTime, popErrorToast, popSuccessToast } from '@shared/utils';

import InfoDialog from '@components/dialog/InfoDialog';
import InviteUserDialog from '@components/dialog/InviteUserDialog';
import RemoveUserDialog from '@components/dialog/RemoveUserDialog';
import { CUSTOMIZED_EMPTY_CONTENT } from '@components/EmptyState/constants';
import EmptyState from '@components/EmptyState/EmptyState';
import BasicTable, { type Column } from '@components/table/BasicTable';
import { ERROR_CODES, EVENT } from '@constants';
import {
  adminUsersQueryKey,
  useGetAdminUsers,
  usePostInviteAdminUser,
  type InviteUserPayload,
  type PostInviteAdminUserErrorResponse,
  type UsersInfos,
} from '@hooks-api';

const LABELS = {
  inviteSuccess: 'Admin invited successfully.',
  inviteError: 'Unable to invite admin. Please try again later.',
  inviteFailedInAnotherOrg:
    'The following users already exist in another organization. Please remove them from the invitation list to successfully complete the invitation process.',
  inviteFailedInOtherGroups:
    'The following users already exist in other groups. Please remove them from the invitation list to successfully complete the invitation process.',
};

export const AdminTable = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [isOpenInviteUserDialog, setIsOpenInviteUserDialog] = useState(false);
  const [isOpenRemoveUserDialog, setIsOpenRemoveUserDialog] = useState(false);
  const [inviteAdminUserError, setInviteAdminUserError] = useState<
    PostInviteAdminUserErrorResponse['data'] | undefined
  >(undefined);
  const [isOpenInviteUserFailedInfoDialog, setIsOpenInviteUserFailedInfoDialog] = useState(false);
  const invalidEmails = inviteAdminUserError?.detail.invalidEmails ?? [];
  const isUserInAnotherOrgError =
    inviteAdminUserError?.code === ERROR_CODES.USER_IN_ANOTHER_ORG.key;
  const inviteFailedDescription = isUserInAnotherOrgError
    ? LABELS.inviteFailedInAnotherOrg
    : LABELS.inviteFailedInOtherGroups;
  const [selectedUser, setSelectedUser] = useState<UsersInfos>();

  const inviteAdminUserMutation = usePostInviteAdminUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKey() });
      popSuccessToast({ description: LABELS.inviteSuccess });
      setIsOpenInviteUserDialog(false);
    },
    onError: (error) => {
      const errorData = error.response?.data.data;
      if (
        errorData?.code === ERROR_CODES.USER_ALREADY_IN_GROUP.key ||
        errorData?.code === ERROR_CODES.USER_IN_ANOTHER_ORG.key
      ) {
        setInviteAdminUserError(errorData);
        setIsOpenInviteUserFailedInfoDialog(true);
      } else {
        popErrorToast({ description: LABELS.inviteError });
        console.error(error);
      }
    },
  });
  const adminUsersQuery = useGetAdminUsers();

  const formattedRole = (role: string) => {
    // 目前平台是 cloudmile 幫客戶處理後再交由客戶使用，故 owner 會是 cloudmile 的人員
    // 在我們實作 owner 轉移的功能前，為避免客戶覺得奇怪，先 workaround，讓 role = 'owner' 也顯示 admin。
    if (role === 'owner') {
      return 'Admin';
    }
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formattedAdminUsers: UsersInfos[] =
    adminUsersQuery.data?.data.users.map((user) => ({
      ...user,
      role: user.role ? formattedRole(user.role) : '',
      activeStatus: user.activeStatus ? 'Active' : 'Inactive',
      lastLogin: formatUtcToLocalTime(user.lastLogin ?? ''),
    })) ?? [];
  const isEmptyAdminUsers = adminUsersQuery.isSuccess && formattedAdminUsers.length === 0;

  const inviteAdminUserSubmitHandler = async (data: InviteUserPayload) => {
    await inviteAdminUserMutation.mutateAsync(data);
  };

  const actionButtons = (row: UsersInfos) => (
    <IconButton
      color="primary"
      disabled={!row.action.remove}
      onClick={() => {
        setSelectedUser(row);
        setIsOpenRemoveUserDialog(true);
      }}
    >
      <DeleteIcon />
    </IconButton>
  );

  const columns: readonly Column<UsersInfos>[] = [
    { key: 'userName', label: 'User Name', minWidth: 230 },
    { key: 'email', label: 'Email', minWidth: 230 },
    { key: 'role', label: 'Role', minWidth: 100 },
    { key: 'activeStatus', label: 'Active Status', minWidth: 100 },
    { key: 'lastLogin', label: 'Last Login', minWidth: 100 },
    {
      key: 'action',
      label: 'Action',
      minWidth: 60,
      align: 'center',
      customizedCell: actionButtons,
    },
  ];

  return (
    <>
      <Grid container justifyContent="flex-end">
        {adminUsersQuery.data?.data.availableActions.inviteAdmin && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: theme.spacing(2) }}
            startIcon={<Icon name="add" />}
            onClick={() => {
              sendGAEvent('event', EVENT.INVITE_ADMIN);
              setIsOpenInviteUserDialog(true);
            }}
          >
            Invite Admin
          </Button>
        )}
      </Grid>
      {isEmptyAdminUsers ? (
        <EmptyState size="large" type="error" {...CUSTOMIZED_EMPTY_CONTENT.emptyAdmin} />
      ) : (
        <BasicTable<UsersInfos>
          isLoading={adminUsersQuery.isLoading}
          rows={formattedAdminUsers}
          columns={columns}
        />
      )}
      <InviteUserDialog
        isAdminGroup
        open={isOpenInviteUserDialog}
        isSubmitDisabled={inviteAdminUserMutation.isPending}
        isPending={inviteAdminUserMutation.isPending}
        handleInviteUser={inviteAdminUserSubmitHandler}
        handleClose={() => {
          setIsOpenInviteUserDialog(false);
        }}
        roleOptions={adminUsersQuery.data?.data.availableActions.inviteRoleOptions ?? []}
      />
      <RemoveUserDialog
        open={isOpenRemoveUserDialog}
        userId={selectedUser?.userId || ''}
        userName={selectedUser?.userName || '--'}
        userGroupId={adminUsersQuery.data?.data.groupId || ''}
        isAdminGroup
        variant="warning"
        handleClose={() => {
          setIsOpenRemoveUserDialog(false);
        }}
      />
      {isOpenInviteUserFailedInfoDialog && (
        <InfoDialog
          open
          variant="warning"
          title="Unable to Invite Users"
          handleClose={() => setIsOpenInviteUserFailedInfoDialog(false)}
          content={
            <>
              <span>{inviteFailedDescription}</span>
              <ul>
                {invalidEmails.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </>
          }
        />
      )}
    </>
  );
};
