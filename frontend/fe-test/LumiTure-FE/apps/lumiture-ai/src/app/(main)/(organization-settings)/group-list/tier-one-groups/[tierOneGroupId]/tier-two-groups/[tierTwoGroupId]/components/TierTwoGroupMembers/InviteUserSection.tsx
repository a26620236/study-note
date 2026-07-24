'use client';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { Button, HStack, Icon } from '@lumiture-ui';
import type { ErrorResponseGenerics } from '@shared/types';
import { getAxiosError, popErrorToast, popSuccessToast } from '@shared/utils';

import InfoDialog from '@components/dialog/InfoDialog';
import InviteUserDialog from '@components/dialog/InviteUserDialog';
import { ERROR_CODES } from '@constants';
import { tierTwoUsersQueryKey, usePostTierTwoUser, type InviteUserPayload } from '@hooks-api';

interface InvalidEmailsError {
  invalidEmails: string[];
}

interface InviteUserSectionProps {
  tierOneGroupId: string;
  tierTwoGroupId: string;
  canInviteUser: boolean;
  roleOptions: string[];
}

const LABELS = {
  inviteFailedInThisGroup: 'The following users are already in this group.',
  inviteFailedInAnotherOrg: 'The following users already exist in another organization.',
};

export function InviteUserSection({
  tierOneGroupId,
  tierTwoGroupId,
  canInviteUser,
  roleOptions,
}: InviteUserSectionProps) {
  const queryClient = useQueryClient();

  // State management
  const [isOpenInviteUserDialog, setIsOpenInviteUserDialog] = useState(false);
  const [isOpenInviteUserFailedInfoDialog, setIsOpenInviteUserFailedInfoDialog] = useState(false);
  const [inviteTierTwoUserError, setInviteTierTwoUserError] = useState<
    ErrorResponseGenerics<string, InvalidEmailsError>['data'] | undefined
  >(undefined);

  // Mutations
  const inviteTierTwoUserMutation = usePostTierTwoUser(tierOneGroupId, tierTwoGroupId);

  // Derived data
  const invalidEmails = inviteTierTwoUserError?.detail.invalidEmails ?? [];
  const isUserInAnotherOrgError =
    inviteTierTwoUserError?.code === ERROR_CODES.USER_IN_ANOTHER_ORG.key;
  const inviteFailedDescription = isUserInAnotherOrgError
    ? LABELS.inviteFailedInAnotherOrg
    : LABELS.inviteFailedInThisGroup;

  // Event handlers
  const handleInviteUserClick = () => {
    setIsOpenInviteUserDialog((prev) => !prev);
  };

  const inviteUserSubmitHandler = async (data: InviteUserPayload) => {
    try {
      await inviteTierTwoUserMutation.mutateAsync(data);
      queryClient.invalidateQueries({
        queryKey: tierTwoUsersQueryKey(tierOneGroupId, tierTwoGroupId),
      });
      popSuccessToast({ description: 'User invited successfully.' });
      setIsOpenInviteUserDialog(false);
    } catch (error) {
      const axiosError = getAxiosError<string, InvalidEmailsError>(error);
      if (
        axiosError?.code === ERROR_CODES.USER_ALREADY_IN_GROUP.key ||
        axiosError?.code === ERROR_CODES.USER_IN_ANOTHER_ORG.key
      ) {
        setInviteTierTwoUserError(axiosError);
        setIsOpenInviteUserFailedInfoDialog(true);
      } else {
        popErrorToast({ description: 'Unable to invite user. Please try again later.' });
        console.error(axiosError);
      }
    }
  };

  if (!canInviteUser) return null;

  return (
    <>
      <HStack justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon name="add" />}
          onClick={handleInviteUserClick}
          data-testid="invite-user-button"
        >
          Invite User
        </Button>
      </HStack>

      <InviteUserDialog
        open={isOpenInviteUserDialog}
        isSubmitDisabled={inviteTierTwoUserMutation.isPending}
        isPending={inviteTierTwoUserMutation.isPending}
        tierOneGroupId={tierOneGroupId}
        tierTwoGroupId={tierTwoGroupId}
        handleInviteUser={inviteUserSubmitHandler}
        handleClose={() => setIsOpenInviteUserDialog(false)}
        roleOptions={roleOptions}
      />

      {isOpenInviteUserFailedInfoDialog && (
        <InfoDialog
          open
          variant="warning"
          title="User invitation failed"
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
}
