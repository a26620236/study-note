import type { ThemeOptions } from '@mui/material';

export const muiFormHelperText: ThemeOptions['components'] = {
  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 0,
        marginTop: theme.spacing(1),
        '&.Mui-error': {
          color: theme.palette.error.main,
        },
      }),
    },
  },
};
