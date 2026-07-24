import type { ThemeOptions } from '@mui/material';

export const muiSelect: ThemeOptions['components'] = {
  MuiSelect: {
    defaultProps: {
      MenuProps: {
        PaperProps: {
          sx: {
            px: 2,
            py: 0,
            borderRadius: '6px',
            boxShadow: '0px 0px 10px rgba(137, 174, 255, 0.2)',
            border: 'none',
          },
        },
      },
    },
    styleOverrides: {
      root: () => ({
        borderRadius: '5px',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'transparent !important',
        },
        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
        },
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
        },
        '&.Mui-disabled': {
          outline: 'none',
          '& fieldset': {
            border: 'none',
          },
        },
      }),
      select: ({ theme }) => ({
        paddingLeft: theme.spacing(2),
      }),
    },
  },
};
