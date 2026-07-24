import { alpha, type ThemeOptions } from '@mui/material';

export const muiAppBar: ThemeOptions['components'] = {
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 0,
        border: 'none',
        boxShadow: `0px 0px 6px ${alpha(theme.palette.black.main, 0.2)}`,
      }),
      colorPrimary: ({ theme }) => ({
        backgroundColor: theme.palette.white.main,
      }),
    },
  },
};
