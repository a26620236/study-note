import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { DIALOG_TYPES } from '@components/dialog/InfoDialog';

import BasicDialogButtons from './BasicDialogButtons';
import type { BasicDialogProps } from './type';

const dialogStyles = {
  '& .MuiDialog-paper': {
    m: 0,
    px: 2,
    py: 3,
    minWidth: 600,
  },
};
const boxStyles = {
  px: 2,
  py: 0,
  display: 'flex',
  alignItems: 'center',
};
const titleStyles = {
  height: 32,
  fontWeight: 'bold',
};
const closeButtonStyles = {
  position: 'absolute',
  right: 32,
};
const contentStyles = {
  px: 2,
  py: 4,
};

// TODO: 可以跟 InfoDialog 合併，也可將其他簡易的 RemoveDialog 合併
const BasicDialog = ({
  open,
  variant,
  title,
  subtitle,
  content,
  handleClose,
  leftButtonLabel = 'Cancel',
  leftButtonVariant = 'text',
  isLoadingLeftButton,
  isDisabledLeftButton,
  handleLeftButtonAction,
  rightButtonLabel,
  rightButtonVariant = 'contained',
  isLoadingRightButton,
  isDisabledRightButton,
  handleRightButtonAction,
}: BasicDialogProps) => (
  <Dialog onClose={handleClose} open={open} sx={dialogStyles}>
    <Box sx={boxStyles}>
      {variant && DIALOG_TYPES[variant].icon}
      <Typography variant="h6" sx={{ ...titleStyles, ml: variant ? 1 : 0 }}>
        {title}
      </Typography>
      <IconButton aria-label="close" color="secondary" onClick={handleClose} sx={closeButtonStyles}>
        <CloseIcon />
      </IconButton>
    </Box>
    {subtitle && (
      <Box sx={{ ...boxStyles, pt: 3, pb: 0 }}>
        <Typography variant="body2">{subtitle}</Typography>
      </Box>
    )}
    <DialogContent sx={contentStyles}>{content}</DialogContent>
    <BasicDialogButtons
      leftButtonLabel={leftButtonLabel}
      leftButtonVariant={leftButtonVariant}
      isLoadingLeftButton={isLoadingLeftButton}
      isDisabledLeftButton={isDisabledLeftButton}
      handleLeftButtonAction={handleLeftButtonAction}
      rightButtonLabel={rightButtonLabel}
      rightButtonVariant={rightButtonVariant}
      isLoadingRightButton={isLoadingRightButton}
      isDisabledRightButton={isDisabledRightButton}
      handleRightButtonAction={handleRightButtonAction}
    />
  </Dialog>
);

export default BasicDialog;
