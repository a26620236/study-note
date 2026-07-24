import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@lumiture-ui';
import { popErrorToast, popSuccessToast } from '@shared/utils';

import { adminUsersQueryKey, tierOneUsersQueryKey, useDeleteUser } from '@hooks-api';

import { DIALOG_TYPES, type DialogVariantType } from './InfoDialog';

const TEST_PREFIX = 'remove-user-dialog';

interface RemoveUserDialogProps {
  open: boolean;
  isAdminGroup: boolean;
  userId: string;
  userName: string;
  userGroupId: string;
  handleClose: () => void;
  variant: DialogVariantType;
}

const RemoveUserDialog = ({
  open,
  isAdminGroup,
  userId,
  userName,
  userGroupId,
  handleClose,
  variant,
}: RemoveUserDialogProps) => {
  const queryClient = useQueryClient();
  const removeUserMutation = useDeleteUser();

  const handleSubmit = async () => {
    try {
      await removeUserMutation.mutateAsync({ userGroups: [{ userId, groupId: userGroupId }] });
      queryClient.invalidateQueries({
        queryKey: isAdminGroup ? adminUsersQueryKey() : tierOneUsersQueryKey(userGroupId),
      });
      popSuccessToast({ description: `${isAdminGroup ? 'Admin' : 'User'} removed successfully.` });
      handleClose();
    } catch (error) {
      popErrorToast({
        description: `Unable to remove ${isAdminGroup ? 'admin' : 'user'}. Please try again later.`,
      });
      console.error(error);
    }
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <Stack direction="row" alignItems="center">
        {DIALOG_TYPES[variant].icon}
        <Typography variant="h4" sx={{ ml: 2 }}>
          {`Remove ${isAdminGroup ? 'Admin' : 'User'}`}
        </Typography>
        <IconButton
          aria-label="close"
          color="secondary"
          onClick={handleClose}
          sx={{ ml: 'auto' }}
          data-testid={`${TEST_PREFIX}-close-button`}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent sx={{ py: 8 }}>
        <Typography>
          Are you sure you want to remove:{' '}
          <Typography component="span" sx={{ color: 'primary.main' }}>
            {userName}
          </Typography>
          ?
          <br />
          This action is irreversible. Data belonging to the member will also be cleared.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button
          variant="borderless"
          onClick={handleClose}
          data-testid={`${TEST_PREFIX}-cancel-button`}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          isLoading={removeUserMutation.isPending}
          data-testid={`${TEST_PREFIX}-submit-button`}
        >
          {`Remove ${isAdminGroup ? 'Admin' : 'User'}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveUserDialog;
