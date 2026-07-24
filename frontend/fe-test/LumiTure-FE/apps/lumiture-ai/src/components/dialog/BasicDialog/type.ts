import type { DialogVariantType } from '../InfoDialog';

export interface BasicDialogProps {
  open: boolean;
  variant?: DialogVariantType;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  content: React.ReactNode;
  handleClose: () => void;
  leftButtonLabel?: string;
  leftButtonVariant?: 'text' | 'contained' | 'outlined';
  isLoadingLeftButton?: boolean;
  isDisabledLeftButton?: boolean;
  handleLeftButtonAction?: () => void;
  rightButtonLabel: string;
  rightButtonVariant?: 'text' | 'contained' | 'outlined';
  isLoadingRightButton: boolean;
  isDisabledRightButton?: boolean;
  handleRightButtonAction: () => void;
}

export interface ActionButtonsProps
  extends Pick<
    BasicDialogProps,
    | 'leftButtonLabel'
    | 'leftButtonVariant'
    | 'isLoadingLeftButton'
    | 'isDisabledLeftButton'
    | 'handleLeftButtonAction'
    | 'rightButtonLabel'
    | 'rightButtonVariant'
    | 'isLoadingRightButton'
    | 'isDisabledRightButton'
    | 'handleRightButtonAction'
  > {}
