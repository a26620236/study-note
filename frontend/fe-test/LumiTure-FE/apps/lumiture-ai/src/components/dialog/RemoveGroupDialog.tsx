import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Button } from '@lumiture-ui';

import { DIALOG_TYPES, type DialogVariantType } from './InfoDialog';

const TEST_PREFIX = 'remove-group-dialog';

interface RemoveGroupDialogProps {
  hasAuth: boolean;
  open: boolean;
  groupName: string;
  handleClose: () => void;
  handleSubmit: () => void;
  variant: DialogVariantType;
  disabled?: boolean;
  isLoading?: boolean;
}

const RemoveGroupDialog = ({
  hasAuth,
  open,
  groupName,
  handleClose,
  handleSubmit,
  variant,
  disabled,
  isLoading,
}: RemoveGroupDialogProps) => {
  const REMOVE_DIALOG_WORDING = {
    TITLE: hasAuth ? 'Remove Group' : 'Group Deletion Not Allowed',
    DESC_COMP: hasAuth ? (
      <Typography>
        Are you sure you want to remove this group:{' '}
        <Typography component="span" color="primary">
          {groupName}
        </Typography>
        ?
      </Typography>
    ) : (
      <Typography>
        To delete this group, you must first remove all members from this group and any of its
        subgroups.
      </Typography>
    ),
    CONFIRM: hasAuth ? 'Remove Group' : 'Got it',
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Stack direction="row" alignItems="center">
        {DIALOG_TYPES[variant].icon}
        <Typography variant="h4" sx={{ ml: 2 }}>
          {REMOVE_DIALOG_WORDING.TITLE}
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

      <DialogContent sx={{ py: 8 }}>{REMOVE_DIALOG_WORDING.DESC_COMP}</DialogContent>
      <DialogActions>
        {hasAuth && (
          <Button
            variant="borderless"
            onClick={handleClose}
            data-testid={`${TEST_PREFIX}-cancel-button`}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={hasAuth ? handleSubmit : handleClose}
          disabled={disabled}
          isLoading={isLoading}
          data-testid={`${TEST_PREFIX}-submit-button`}
        >
          {REMOVE_DIALOG_WORDING.CONFIRM}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveGroupDialog;
