import type { ThemeOptions } from '@mui/material';

export const muiCheckbox: ThemeOptions['components'] = {
  MuiCheckbox: {
    defaultProps: {
      color: 'primary',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: 'unset',
          color: theme.palette.primary.light,
        },
        '&:active': {
          color: theme.palette.primary.dark,
        },
        '& .MuiSvgIcon-root': {
          width: 18,
          height: 18,
        },
      }),
    },
  },
};
