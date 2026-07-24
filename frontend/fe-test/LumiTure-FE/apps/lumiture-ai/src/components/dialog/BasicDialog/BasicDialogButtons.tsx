import DialogActions from '@mui/material/DialogActions';

import { Button } from '@lumiture-ui';

import type { ActionButtonsProps } from './type';

const BasicDialogButtons = ({
  leftButtonLabel,
  leftButtonVariant,
  isLoadingLeftButton,
  isDisabledLeftButton,
  handleLeftButtonAction,
  rightButtonLabel,
  rightButtonVariant,
  isLoadingRightButton,
  isDisabledRightButton,
  handleRightButtonAction,
}: ActionButtonsProps) => (
  <DialogActions>
    {handleLeftButtonAction && (
      <Button
        variant={leftButtonVariant}
        onClick={handleLeftButtonAction}
        disabled={isDisabledLeftButton || isLoadingLeftButton}
        isLoading={isLoadingLeftButton}
      >
        {leftButtonLabel}
      </Button>
    )}
    <Button
      variant={rightButtonVariant}
      onClick={handleRightButtonAction}
      disabled={isDisabledRightButton || isLoadingRightButton}
      isLoading={isLoadingRightButton}
    >
      {rightButtonLabel}
    </Button>
  </DialogActions>
);

export default BasicDialogButtons;
