import type { ThemeOptions } from '@mui/material';

export const muiStep: ThemeOptions['components'] = {
  MuiStep: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(0),
      }),
    },
  },
  MuiStepConnector: {
    styleOverrides: {
      root: ({ theme }) => ({
        // 讓 line 對齊 step icon
        top: 20 / 2 - 1,
        margin: theme.spacing(0, 2.5),
        '&.Mui-completed': {
          '& .MuiStepConnector-line': {
            backgroundColor: theme.palette.primary.main,
          },
        },
        '&.Mui-active': {
          '& .MuiStepConnector-line': {
            backgroundColor: theme.palette.primary.main,
          },
        },
        // 當前 active 步驟的下一條線的樣式
        '&.Mui-active + .MuiStep-root + .MuiStepConnector-root': {
          '& .MuiStepConnector-line': {
            backgroundColor: theme.palette.primary.main,
          },
        },
      }),
      line: ({ theme }) => ({
        borderRadius: 2,
        backgroundColor: theme.palette.gray.border,
        border: 'unset',
      }),
      horizontal: () => ({
        '& .MuiStepConnector-line': {
          minWidth: 50,
          width: '100%',
          height: 2,
        },
      }),
      vertical: () => ({
        '& .MuiStepConnector-line': {
          width: 2,
          minHeight: 30,
          height: '100%',
        },
      }),
    },
  },
  MuiStepLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        gap: theme.spacing(2.5),
      }),
      label: ({ theme }) => ({
        ...theme.typography.bodyBold,
        color: theme.palette.text.hint,
        '&.Mui-completed': {
          ...theme.typography.bodyBold,
          color: theme.palette.primary.main,
        },
        '&.Mui-active': {
          ...theme.typography.bodyBold,
          color: theme.palette.primary.main,
        },
        '&.MuiStepLabel-alternativeLabel': {
          marginTop: 0,
        },
      }),
      iconContainer: () => ({
        paddingRight: 0,
      }),
      vertical: () => ({
        '& + .MuiStepContent-root': {
          // 讓 line 對齊 step icon
          marginLeft: 20 / 2,
          // 讓 content 對齊 step label，gap = 10px
          paddingLeft: 20 / 2 + 10,
        },
      }),
    },
  },
  MuiStepContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        position: 'relative',
        marginBottom: -1,
        border: 'unset',
        '&:before': {
          content: '""',
          position: 'absolute',
          left: 0,
          width: 2,
          height: '100%',
          backgroundColor: theme.palette.primary.main,
          borderRadius: 2,
        },
      }),
    },
  },
  MuiStepIcon: {
    styleOverrides: {
      root: () => ({
        fontSize: 20,
      }),
    },
  },
};
