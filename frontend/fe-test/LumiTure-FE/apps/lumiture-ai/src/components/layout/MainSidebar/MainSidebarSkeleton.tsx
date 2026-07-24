'use client';

import { Box, Skeleton, type SkeletonProps } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { HStack, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import { sidebarLayoutStyle } from './MainSidebar';
import { StyledMainSidebar } from './StyledMainSidebar';

const boxStyle = {
  padding: 2,
};

const skeletonProps: SkeletonProps = {
  variant: 'rectangular',
  height: 24,
  width: '200px',
  sx: {
    borderRadius: '4px',
    animation: 'wave',
    backgroundColor: alpha(theme.palette.white.main, 0.5),
  },
};

const SkeletonBox = () => (
  <HStack {...boxStyle} justifyContent="center" alignItems="center">
    <Skeleton {...skeletonProps} />
  </HStack>
);

export function MainSidebarSkeleton() {
  return (
    <Box component="aside" sx={sidebarLayoutStyle}>
      <StyledMainSidebar variant="permanent" open={true}>
        <VStack gap={2} pt={2} pb={2}>
          <SkeletonBox />
          <SkeletonBox />
          <SkeletonBox />
          <SkeletonBox />
          <SkeletonBox />
        </VStack>
      </StyledMainSidebar>
    </Box>
  );
}
