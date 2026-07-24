import type { ThemeOptions } from '@mui/material';

export const muiContainer: ThemeOptions['components'] = {
  MuiContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(0, 10),
      }),
    },
  },
};
