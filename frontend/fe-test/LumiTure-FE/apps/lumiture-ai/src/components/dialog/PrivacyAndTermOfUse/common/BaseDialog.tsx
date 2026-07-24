import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';

import { Button, Icon } from '@lumiture-ui';

interface BaseDialogProps {
  title: string;
  updateAt: string;
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

const BaseDialog = ({ title, updateAt, children, onClose, isOpen }: BaseDialogProps) => {
  const date = format(new Date(updateAt), 'MMMM d, yyyy');
  return (
    <Dialog open={isOpen} slotProps={{ paper: { sx: { minWidth: 700, px: 6, py: 4 } } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4">{title}</Typography>
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
      <DialogContent>
        <Typography
          sx={{ display: 'block', whiteSpace: 'pre-line', mb: 6 }}
          color="text.secondary"
          variant="caption"
          align="right"
        >{`LumiTure.ai Powered by CloudMile Inc.\nLast updated ${date}. Replaces all prior versions.`}</Typography>
        <Stack sx={{ height: 510, overflow: 'auto' }}>{children}</Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BaseDialog;
