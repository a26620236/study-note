import Card from '@mui/material/Card';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Button, Icon } from '@lumiture-ui';

type RemoveDialogProps = DialogProps & {
  count: number;
  onClose: () => void;
  onConFirm: () => void;
};

export function RemoveDialog({
  open,
  count,
  onClose,
  onConFirm,
  children,
  ...others
}: RemoveDialogProps) {
  return (
    <Dialog
      open={open}
      slotProps={{ paper: { sx: { gap: '30px', minWidth: 660, px: 8, py: 6 } } }}
      {...others}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', p: 0 }}>
        <Stack direction="row" alignItems="center" sx={{ gap: 4 }}>
          <Icon name="error" sx={{ color: 'error.main' }} />
          <Typography variant="h4">Remove {count} Customized Budget(s)</Typography>
        </Stack>
        <IconButton
          size="medium"
          aria-label="close"
          color="secondary"
          onClick={onClose}
          sx={{ ml: 'auto' }}
        >
          <Icon name="close" sx={{ color: 'text.secondary' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Typography sx={{ mb: '30px' }}>
          Are you sure you want to remove the selected budget(s)? This action is irreversible.
        </Typography>
        <Card sx={{ maxHeight: 600, overflow: 'auto', p: 2, borderRadius: '5px' }}>{children}</Card>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConFirm} sx={{ textTransform: 'none' }}>
          Remove budget(s)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
