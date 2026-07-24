'use client';

import { forwardRef, type MouseEvent } from 'react';

import {
  Box,
  Button as MuiButton,
  Tooltip,
  type ButtonProps as MuiButtonProps,
  type TooltipProps,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export type ButtonProps = MuiButtonProps & {
  isSelected?: boolean;
  isLoading?: boolean;
  tooltipProps?: Omit<TooltipProps, 'children'>;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'contained',
    size = 'medium',
    disabled = false,
    isLoading = false,
    onClick,
    tooltipProps,
    startIcon,
    endIcon,
    ...rest
  },
  ref
) {
  const handleLoadingClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;
    if (isLoading) return;
    onClick(event);
  };

  const ButtonElement = (
    <MuiButton
      ref={ref}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={handleLoadingClick}
      startIcon={!isLoading && startIcon}
      endIcon={!isLoading && endIcon}
      {...rest}
    >
      {isLoading ? <CircularProgress size={14} disableShrink /> : children}
    </MuiButton>
  );

  return tooltipProps ? (
    <Tooltip {...tooltipProps}>
      <Box>{ButtonElement}</Box>
    </Tooltip>
  ) : (
    ButtonElement
  );
});
