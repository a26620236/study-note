import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Button, HStack, Icon } from '@lumiture-ui';

interface UnsavedChangesDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const LABELS = {
  cancel: 'Cancel',
  discardChanges: 'Discard Changes',
};

export default function UnsavedChangesDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog onClose={onClose} open={open}>
      <HStack alignItems="center">
        <HStack gap={4} alignItems="center">
          <Icon name="error" sx={{ color: 'error.main' }} />
          <Typography variant="h4">{title}</Typography>
        </HStack>
        <IconButton aria-label="close" size="large" onClick={onClose} sx={{ ml: 'auto' }}>
          <Icon name="close" sx={{ color: 'text.secondary' }} />
        </IconButton>
      </HStack>
      <DialogContent sx={{ py: 8, pl: 10 }}>
        <Typography variant="body1">{description}</Typography>
      </DialogContent>
      <DialogActions>
        <HStack gap={4} alignItems="center">
          <Button variant="outlined" onClick={onClose}>
            {LABELS.cancel}
          </Button>
          <Button onClick={onConfirm}>{LABELS.discardChanges}</Button>
        </HStack>
      </DialogActions>
    </Dialog>
  );
}
