import type { ThemeOptions } from '@mui/material';

export const muiLink: ThemeOptions['components'] = {
  MuiLink: {
    defaultProps: {
      underline: 'none',
      color: 'inherit',
    },
  },
};
