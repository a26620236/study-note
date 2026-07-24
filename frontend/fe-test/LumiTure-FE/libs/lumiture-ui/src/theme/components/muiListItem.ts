import type { ThemeOptions } from '@mui/material';

export const muiListItem: ThemeOptions['components'] = {
  MuiListItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        height: 40,
        padding: theme.spacing(5, 2),
        fontSize: 14,
        '&:hover': {
          borderRadius: 5,
          backgroundColor: theme.palette.gray.hover,
          cursor: 'pointer',
        },
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.light10,
          borderRadius: 5,
          '&:hover': {
            backgroundColor: theme.palette.primary.light10,
          },
        },
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: 'unset',
        padding: theme.spacing(2),
        svg: {
          minWidth: 'unset',
          fontSize: 16,
        },
      }),
    },
  },
};
