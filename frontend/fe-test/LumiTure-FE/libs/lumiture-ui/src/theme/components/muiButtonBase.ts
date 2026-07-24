import type { ThemeOptions } from '@mui/material';

export const muiButtonBase: ThemeOptions['components'] = {
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
  },
};
