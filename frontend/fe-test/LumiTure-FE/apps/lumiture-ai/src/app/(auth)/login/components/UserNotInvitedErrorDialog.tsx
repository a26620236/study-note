import Image from 'next/image';

import { Box, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';

import { Button } from '@lumiture-ui';

export interface UserNotInvitedErrorDialogProps {
  open: boolean;
  onClose: () => void;
}

const LABELS = {
  title: 'One Last Step to Unlock LumiTure.ai',
  descriptionLine1: "It looks like you haven't been invited to a team yet.",
  descriptionLine2: 'Please reach out to your organization admin to get access.',
  button: 'Got it',
};

const DIALOG_STYLES = {
  wrapper: {
    '& .MuiDialog-paper': {
      width: 600,
      px: 8,
      py: 6,
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '40px',
  },
  content: {
    mt: '15px',
    mb: '40px',
    textAlign: 'center',
    p: 0,
  },
  actions: {
    margin: '0 auto',
  },
};

export default function UserNotInvitedErrorDialog({
  open,
  onClose,
}: UserNotInvitedErrorDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} sx={DIALOG_STYLES.wrapper}>
      <Box sx={DIALOG_STYLES.header}>
        <Typography variant="h4">{LABELS.title}</Typography>

        <Image
          src="/images/sso-setup-illustration.svg"
          alt="user not invited"
          width={200}
          height={200}
        />
      </Box>

      <DialogContent sx={DIALOG_STYLES.content}>
        <Typography variant="body1" color="text.primary">
          {LABELS.descriptionLine1}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {LABELS.descriptionLine2}
        </Typography>
      </DialogContent>

      <DialogActions sx={DIALOG_STYLES.actions}>
        <Button variant="contained" onClick={onClose} data-testid="not-invited-dialog-got-it-btn">
          {LABELS.button}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
