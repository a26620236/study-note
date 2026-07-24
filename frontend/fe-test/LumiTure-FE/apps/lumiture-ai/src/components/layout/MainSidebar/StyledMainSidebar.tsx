'use client';

import Drawer from '@mui/material/Drawer';
import { styled, type CSSObject, type Theme } from '@mui/material/styles';

import { MAIN_HEADER_HEIGHT, MAIN_SIDEBAR_OPENED_WIDTH } from '@constants';

const openedMixin = (theme: Theme): CSSObject => ({
  width: MAIN_SIDEBAR_OPENED_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  '& > .MuiPaper-root > .MuiList-root': {
    opacity: 1,
    visibility: 'visible',
  },
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: 20,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  '& > .MuiPaper-root > .MuiList-root': {
    opacity: 0,
    visibility: 'hidden',
  },
});

export const StyledMainSidebar = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: MAIN_SIDEBAR_OPENED_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    '& .MuiDrawer-paper': {
      top: `${MAIN_HEADER_HEIGHT}px`,
      height: `calc(100vh - ${MAIN_HEADER_HEIGHT}px)`,
      borderRight: 'none',
      overflow: 'auto',
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
      border: 'unset',
      padding: '16px',
      '& > .MuiList-root': {
        transition: theme.transitions.create(['opacity', 'visibility'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  })
);
