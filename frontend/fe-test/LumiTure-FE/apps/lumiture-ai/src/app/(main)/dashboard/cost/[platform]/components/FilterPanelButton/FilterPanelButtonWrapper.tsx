import type { PropsWithChildren } from 'react';

import { alpha } from '@mui/material';

import { HStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import { DRAWER_WIDTH } from '@constants';

export function FilterPanelButtonWrapper({ children }: PropsWithChildren) {
  return (
    <HStack
      justifyContent="flex-end"
      sx={{
        py: 4,
        px: 4,
        position: 'fixed',
        width: `${DRAWER_WIDTH}px`,
        bottom: 0,
        backgroundColor: 'background.paper',
        boxShadow: `0px -2px 4px ${alpha(theme.palette.black.main, 0.1)}`,
        zIndex: theme.zIndex.drawer,
      }}
    >
      {children}
    </HStack>
  );
}
