import type { ThemeOptions } from '@mui/material';

export const muiToolbar: ThemeOptions['components'] = {
  MuiToolbar: {
    styleOverrides: {
      gutters: {
        '@media (min-width: 600px)': {
          paddingLeft: 20,
          paddingRight: 20,
        },
      },
    },
  },
};
