import type { ThemeOptions } from '@mui/material';

export const muiIconButton: ThemeOptions['components'] = {
  MuiIconButton: {
    defaultProps: {
      disableRipple: true,
      color: 'primary',
      size: 'small',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        '&.Mui-disabled': {
          color: theme.palette.grey[500],
        },
        '&.MuiIconButton-sizeExSmall': {
          height: 20,
          width: 20,
          '& > .MuiIcon-root': {
            fontSize: 16,
          },
        },
        '&.MuiIconButton-sizeSmall': {
          height: 24,
          width: 24,
          '& > .MuiIcon-root': {
            fontSize: 20,
          },
        },
        '&.MuiIconButton-sizeMedium': {
          height: 30,
          width: 30,
          '& > .MuiIcon-root': {
            fontSize: 24,
          },
        },
        '&.MuiIconButton-sizeLarge': {
          height: 40,
          width: 40,
          '& > .MuiIcon-root': {
            fontSize: 30,
          },
        },
        '&.MuiIconButton-colorSecondary': {
          svg: { color: `${theme.palette.text.secondary} !important` },
          '&:hover': { backgroundColor: theme.palette.gray.hover },
        },
      }),
    },
  },
};
