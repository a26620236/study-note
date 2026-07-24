import type { ThemeOptions } from '@mui/material';

export const muiAutocomplete: ThemeOptions['components'] = {
  MuiAutocomplete: {
    styleOverrides: {
      listbox: ({ theme }) => ({
        paddingTop: 0,
        paddingBottom: 0,
        '& .MuiAutocomplete-option': {
          borderRadius: '6px',
          padding: theme.spacing(2.5),
          alignItems: 'flex-start',
          '&.Mui-focused': {
            backgroundColor: theme.palette.gray.selected,
          },
        },
      }),
      paper: ({ theme }) => ({
        padding: theme.spacing(2),
        borderRadius: 6,
        boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.20)',
        border: 'none',
      }),
      tag: ({ theme }) => ({
        margin: theme.spacing(1),
      }),
      clearIndicator: ({ theme }) => ({
        '&.MuiIconButton-sizeSmall>.MuiIcon-root': {
          color: theme.palette.gray.border,
          fontSize: 16,
        },
      }),
      inputRoot: ({ theme }) => ({
        padding: theme.spacing(1, 0, 1, 1),
      }),
      input: ({ theme }) => ({
        marginLeft: theme.spacing(1),
      }),
    },
  },
};
