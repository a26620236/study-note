import type { PropsWithChildren } from 'react';

import { styled } from '@mui/material';

import { DRAWER_WIDTH } from '@constants';

const MainWrapper = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(100% - ${open ? DRAWER_WIDTH : 0}px)`,
  marginRight: open ? 0 : `-${DRAWER_WIDTH}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

export const MainContentWithDrawer = ({ open, children }: PropsWithChildren<{ open: boolean }>) => (
  <MainWrapper open={open}>{children}</MainWrapper>
);
