import type { ReactNode } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, IconButton, Stack, Typography } from '@mui/material';

import { Button, Icon } from '@lumiture-ui';

interface InfoDialogProps {
  open: boolean;
  handleClose: () => void;
  variant: DialogVariantType;
  title: string;
  content: React.ReactNode;
}

export type DialogVariantType = 'info' | 'warning' | 'error';

export const DIALOG_TYPES: Record<
  DialogVariantType,
  { value: DialogVariantType; icon: ReactNode }
> = {
  info: {
    value: 'info',
    icon: <Icon name="check_circle" sx={{ opacity: 0.56, fontSize: '30px' }} />,
  },
  warning: {
    value: 'warning',
    icon: <Icon name="warning" sx={{ opacity: 0.56, fontSize: '30px' }} />,
  },
  error: {
    value: 'error',
    icon: <Icon name="error" sx={{ opacity: 0.56, fontSize: '30px' }} />,
  },
};

const InfoDialog = ({ open, handleClose, variant, title, content }: InfoDialogProps) => (
  <Dialog onClose={handleClose} open={open}>
    <Stack direction="row" alignItems="center">
      {DIALOG_TYPES[variant].icon}
      <Typography variant="h4" sx={{ ml: '15px' }}>
        {title}
      </Typography>
      <IconButton aria-label="close" color="secondary" onClick={handleClose} sx={{ ml: 'auto' }}>
        <CloseIcon />
      </IconButton>
    </Stack>
    <DialogContent sx={{ py: 8 }}>{content}</DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Got It</Button>
    </DialogActions>
  </Dialog>
);

export default InfoDialog;
