import type { ThemeOptions } from '@mui/material';

export const muiTextField: ThemeOptions['components'] = {
  MuiTextField: {
    defaultProps: {
      slotProps: { inputLabel: { shrink: true } },
    },
  },
};
