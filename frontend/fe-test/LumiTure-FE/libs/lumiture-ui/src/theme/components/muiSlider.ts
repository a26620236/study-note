import type { ThemeOptions } from '@mui/material';

export const muiSlider: ThemeOptions['components'] = {
  MuiSlider: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.primary.main,
        height: 4,
        '& .MuiSlider-track': {
          border: 'none',
        },
        '& .MuiSlider-thumb': {
          height: 20,
          width: 20,
          backgroundColor: '#FFFFFF',
          border: '3px solid currentColor',
          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
          },
          '&:before': {
            display: 'none',
          },
        },
        '& .Mui-disabled.MuiSlider-thumb': {
          backgroundColor: theme.palette.gray.disableLight,
          fontSize: 12,
        },
        '& .MuiSlider-markLabel': {
          color: theme.palette.text.hint,
        },
        '& .MuiSlider-valueLabel': {
          background: 'rgba(0, 9, 16, 0.8)',
          fontSize: 8,
        },
      }),
    },
  },
};
