'use client';

import {
  ToggleButton,
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from '@mui/material';

import { theme } from '../theme';

export interface ToggleGroupProps {
  toggleGroupProps: ToggleButtonGroupProps;
  toggleButtons: ToggleButtonProps[];
}

const BASIC_STYLES = {
  TOGGLE_BUTTON_GROUP: {
    '&.MuiToggleButtonGroup-root': {
      backgroundColor: theme.palette.white.main,
      width: 'fit-content',
      height: 'fit-content',
    },
  },
  TOGGLE_BUTTON: {
    '&.MuiToggleButton-root': {
      color: theme.palette.text.secondary,
      borderColor: theme.palette.gray.border,
      padding: '0 16px',
      minHeight: '36px',
      textTransform: 'capitalize',
    },
    '&.MuiToggleButton-root.Mui-disabled': {
      color: theme.palette.text.hint,
      borderColor: theme.palette.gray.border,
    },
    '&.MuiToggleButton-root.Mui-selected': {
      backgroundColor: theme.palette.primary.light20,
      color: theme.palette.primary.dark,
    },
    '&.MuiToggleButton-root:not(.Mui-selected)': {
      '&:hover': {
        backgroundColor: theme.palette.gray.hover,
      },
      '&:active': {
        backgroundColor: theme.palette.gray.selected,
      },
    },
  },
};

export function ToggleGroup({ toggleGroupProps, toggleButtons }: ToggleGroupProps) {
  const { sx: toggleButtonGroupSx, ...restToggleGroupProps } = toggleGroupProps;
  return (
    <ToggleButtonGroup
      {...restToggleGroupProps}
      sx={{
        ...BASIC_STYLES.TOGGLE_BUTTON_GROUP,
        ...toggleButtonGroupSx,
      }}
    >
      {toggleButtons.map(({ sx: toggleButtonSx, key, children, ...restToggleButtonProps }) => (
        <ToggleButton
          {...restToggleButtonProps}
          key={key}
          sx={{
            ...BASIC_STYLES.TOGGLE_BUTTON,
            ...toggleButtonSx,
          }}
        >
          {children}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
