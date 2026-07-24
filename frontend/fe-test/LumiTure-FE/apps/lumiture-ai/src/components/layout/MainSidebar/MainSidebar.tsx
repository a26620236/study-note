'use client';

import { useState } from 'react';

import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Box, { type BoxProps } from '@mui/material/Box';
import List from '@mui/material/List';

import { theme } from '@lumiture-ui/theme';

import MainSidebarListItem from '@components/layout/MainSidebar/MainSidebarListItem';
import { StyledMainSidebar } from '@components/layout/MainSidebar/StyledMainSidebar';
import { StyledToggleButton } from '@components/layout/MainSidebar/StyledToggleButton';
import {
  MAIN_HEADER_HEIGHT,
  MAIN_PATHS,
  MAIN_SIDEBAR_CLOSED_WIDTH,
  MAIN_SIDEBAR_OPENED_WIDTH,
} from '@constants';
import { useGlobalStore } from '@hooks';
import { useGetSidebar } from '@hooks-api';

export const sidebarLayoutStyle: BoxProps = {
  position: 'sticky',
  top: `${MAIN_HEADER_HEIGHT}px`,
  left: 0,
  height: `calc(100vh - ${MAIN_HEADER_HEIGHT}px)`,
  zIndex: theme.zIndex.appBar + 1,
};

export function MainSidebar() {
  const [showToggleButton, setShowToggleButton] = useState(false);
  const { isMainSidebarOpen, handleMainSidebarToggle } = useGlobalStore(
    (state) => state.mainSidebar
  );

  const { data: sidebarQuery } = useGetSidebar();
  const sidebarData = sidebarQuery?.data;

  const hasSidebarSchema = Boolean(sidebarData?.schema && sidebarData.schema.length > 0);
  const formattedSidebarSchema =
    hasSidebarSchema && sidebarData
      ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        sidebarData.schema.filter((item) => MAIN_PATHS[item.key])
      : [];

  return (
    <Box
      component="aside"
      onMouseEnter={() => setShowToggleButton(true)}
      onMouseLeave={() => setShowToggleButton(false)}
      sx={sidebarLayoutStyle}
    >
      <Box
        sx={{
          position: 'fixed',
          top: `${MAIN_HEADER_HEIGHT}px`,
          left: 0,
          bottom: 0,
          width: isMainSidebarOpen ? MAIN_SIDEBAR_OPENED_WIDTH : MAIN_SIDEBAR_CLOSED_WIDTH,
          bgcolor: 'primary.dark',
          zIndex: theme.zIndex.appBar,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: isMainSidebarOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        }}
      />
      <Box sx={{ position: 'relative', height: '100%' }}>
        <StyledToggleButton
          size="medium"
          onClick={handleMainSidebarToggle}
          isShow={showToggleButton}
        >
          {isMainSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </StyledToggleButton>
      </Box>
      <StyledMainSidebar variant="permanent" open={isMainSidebarOpen}>
        {/* Success View */}
        {hasSidebarSchema && (
          <List component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {formattedSidebarSchema.map((item) => (
              <MainSidebarListItem key={item.uuid} item={item} />
            ))}
          </List>
        )}
      </StyledMainSidebar>
    </Box>
  );
}
