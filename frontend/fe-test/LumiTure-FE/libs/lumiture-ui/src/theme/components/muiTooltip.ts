import type { ThemeOptions } from '@mui/material';

export const muiTooltip: ThemeOptions['components'] = {
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        whiteSpace: 'pre-line',
        maxWidth: 400,
        fontSize: 14,
        lineHeight: '24.5px',
        backgroundColor: '#000910CC',
        '&:empty': { display: 'none' },
        padding: '8px 16px',
      },
      popper: {
        zIndex: '5000 !important',
      },
    },
    defaultProps: {
      disableInteractive: true,
      enterTouchDelay: 0,
    },
  },
};
