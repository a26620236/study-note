import type { ThemeOptions } from '@mui/material';

export const muiDialog: ThemeOptions['components'] = {
  MuiDialog: {
    defaultProps: {
      PaperProps: {
        elevation: 0,
      },
      maxWidth: 'md',
      fullWidth: true,
    },
    styleOverrides: {
      paper: ({ theme }) => ({
        padding: theme.spacing(5, 7.5),
        border: 'unset',
        minWidth: 360,
        width: 640,
      }),
      paperWidthXs: {
        maxWidth: 450,
      },
      paperWidthSm: {
        maxWidth: 655,
      },
      paperWidthMd: {
        maxWidth: 1024,
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        textAlign: 'left',
        padding: theme.spacing(0, 0, 5),
        fontSize: 20,
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        overflow: 'auto',
        color: theme.palette.text.primary,
        padding: theme.spacing(0, 0, 6, 0),
      }),
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        marginLeft: 'auto',
        justifyContent: 'center',
        padding: 0,
      },
    },
  },
};
