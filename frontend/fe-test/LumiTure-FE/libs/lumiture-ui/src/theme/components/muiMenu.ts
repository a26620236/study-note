import type { ThemeOptions } from '@mui/material';

export const muiMenu: ThemeOptions['components'] = {
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        padding: theme.spacing(2.5),
        borderRadius: 6,
        boxShadow: '0 2px 14px 0 rgba(137, 174, 255, 0.2)',
      }),
    },
  },
  MuiMenuItem: {
    defaultProps: {
      dense: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        height: 40,
        padding: theme.spacing(5, 2),
        fontSize: 14,
        svg: { width: 24, height: 24 },
        '&:hover': {
          borderRadius: 4,
          backgroundColor: theme.palette.gray.hover,
          cursor: 'pointer',
        },
        '&.Mui-selected': {
          backgroundColor: `${theme.palette.gray.selected} !important`,
          borderRadius: 4,
          '&:hover': {
            backgroundColor: theme.palette.gray.selected,
          },
        },
      }),
    },
  },
};
