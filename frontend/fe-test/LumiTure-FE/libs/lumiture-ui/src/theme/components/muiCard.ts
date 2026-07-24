import type { ThemeOptions } from '@mui/material';

export const muiCard: ThemeOptions['components'] = {
  MuiCardHeader: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(2.5, 5),
        borderBottom: `1px solid ${theme.palette.gray.border}`,
      }),
    },
  },

  MuiCard: {
    defaultProps: {
      variant: 'outlined',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 0,
        margin: 0,
        border: `1px solid ${theme.palette.gray.borderLight}`,
      }),
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(5, 5),
      }),
    },
  },
};
