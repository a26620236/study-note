import type { ThemeOptions } from '@mui/material';

export const muiButtonGroup: ThemeOptions['components'] = {
  MuiButtonGroup: {
    defaultProps: {
      disableRipple: true,
      size: 'medium',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        button: {
          ...theme.typography.body1,
          color: theme.palette.text.secondary,
          borderColor: `${theme.palette.grey[300]} !important`,
          '&:hover': { borderColor: theme.palette.grey[300] },
          '&.Mui-disabled': { borderColor: theme.palette.grey[300] },
          '& svg': {
            color: theme.palette.text.secondary,
          },
        },
      }),
    },
  },
};
