import { alpha, type ThemeOptions } from '@mui/material';

export const muiPaper: ThemeOptions['components'] = {
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(8),
      }),
      outlined: ({ theme }) => ({
        border: `1px solid ${theme.palette.gray.borderLight}`,
      }),
      rounded: {
        borderRadius: 10,
      },
      elevation0: ({ theme }) => ({
        padding: theme.spacing(6),
        boxShadow: `0px 0px 20px 0px ${alpha(theme.palette.black.main, 0.1)}`,
      }),
      elevation1: {
        boxShadow: '0 2px 14px 0 rgba(137, 174, 255, 0.2)', // TODO: 需要調整，color不在定義的裡面
      },
    },
    defaultProps: {
      elevation: 0,
    },
  },
};
