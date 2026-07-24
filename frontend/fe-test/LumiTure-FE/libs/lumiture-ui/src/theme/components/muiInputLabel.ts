import type { ThemeOptions } from '@mui/material';

export const muiInputLabel: ThemeOptions['components'] = {
  MuiInputLabel: {
    styleOverrides: {
      root: ({ ownerState, theme }) => ({
        position: 'relative',
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
        fontWeight: 700,
        color: theme.palette.primary.main,
        transform: 'inherit',
        '&.Mui-error': {
          color: theme.palette.primary.main,
        },
        '& .MuiInputLabel-asterisk': {
          color: theme.palette.error.main,
        },
        ...(ownerState.size === 'small' && {
          fontSize: 12,
        }),
        ...(ownerState.size === 'medium' && {
          fontSize: 14,
        }),
      }),
    },
  },
};
