import type { ThemeOptions } from '@mui/material';

export const muiRadio: ThemeOptions['components'] = {
  MuiRadio: {
    defaultProps: {
      disableRipple: true,
      size: 'small',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.primary.main,
      }),
    },
  },
};
