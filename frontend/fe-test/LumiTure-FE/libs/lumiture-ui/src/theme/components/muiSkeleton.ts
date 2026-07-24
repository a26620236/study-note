import type { ThemeOptions } from '@mui/material';

export const muiSkeleton: ThemeOptions['components'] = {
  MuiSkeleton: {
    styleOverrides: {
      root: ({ theme }) => ({
        transform: 'scale(1)',
        backgroundColor: theme.palette.gray.borderLight,
      }),
    },
  },
};
