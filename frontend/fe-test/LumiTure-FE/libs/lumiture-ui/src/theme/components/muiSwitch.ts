import type { ThemeOptions } from '@mui/material';

export const muiSwitch: ThemeOptions['components'] = {
  MuiSwitch: {
    defaultProps: {
      color: 'primary',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.primary.main,
      }),
    },
  },
};
