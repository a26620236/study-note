import type { ReactNode } from 'react';

import Box from '@mui/material/Box';

import { DRAWER_WIDTH, MAIN_HEADER_HEIGHT } from '@constants';

interface LayoutDrawerProps {
  children: ReactNode;
  isDrawerOpen: boolean;
}

export const LayoutDrawer = ({ children, isDrawerOpen }: LayoutDrawerProps) => (
  <Box
    sx={{
      overflowY: 'scroll',
      transform: isDrawerOpen ? 'unset' : `translateX(${DRAWER_WIDTH}px)`,
      transition: 'all 0.3s ease-in-out',
      width: isDrawerOpen ? DRAWER_WIDTH : 0,
      overflowX: 'hidden',
      height: `calc(100vh - ${MAIN_HEADER_HEIGHT}px)`,
      mt: `${MAIN_HEADER_HEIGHT}px`,
      boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.20)',
      flexShrink: 0,
      opacity: isDrawerOpen ? 1 : 0,
    }}
  >
    {children}
  </Box>
);
