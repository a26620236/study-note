import type { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

import { HStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import { MAIN_SIDEBAR_CLOSED_WIDTH, MAIN_SIDEBAR_OPENED_WIDTH } from '@constants';
import { useGlobalStore } from '@hooks';

export const BOTTOM_BAR_HEIGHT = 68;

const STYLES = {
  wrapper: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    zIndex: 3,
    width: '100%',
    flexWrap: 'nowrap',
  },
  bottomBar: {
    alignItems: 'center',
    padding: theme.spacing(4, 8),
    width: '100%',
    height: BOTTOM_BAR_HEIGHT,
    backgroundColor: theme.palette.background.page,
    boxShadow: `0px 0px 6px 0px ${alpha(theme.palette.black.main, 0.2)}`,
    flex: 1,
  },
};

export function FixedBottomBarWrapper({ children }: PropsWithChildren) {
  const { isMainSidebarOpen } = useGlobalStore((state) => state.mainSidebar);

  return (
    <HStack sx={STYLES.wrapper}>
      <Box
        sx={{
          height: `${BOTTOM_BAR_HEIGHT}px`,
          width: isMainSidebarOpen
            ? `${MAIN_SIDEBAR_OPENED_WIDTH}px`
            : `${MAIN_SIDEBAR_CLOSED_WIDTH}px`,
          backgroundColor: theme.palette.background.page,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: isMainSidebarOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        }}
      />
      <HStack sx={STYLES.bottomBar}>{children}</HStack>
    </HStack>
  );
}
