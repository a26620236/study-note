'use client';

import type { PropsWithChildren, ReactNode } from 'react';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { theme } from '@lumiture-ui/theme';

import UnsavedChangesDialog from '@components/dialog/UnsavedChangesDialog';
import { MAIN_HEADER_HEIGHT } from '@constants';
import { useGlobalStore } from '@hooks';

import MainFooter from '../MainFooter';
import MainHeader from '../MainHeader';

export const MAIN_PAGE_CONTAINER = 'main-page-container';

interface MainLayoutFrameProps {
  sidebar?: ReactNode;
  drawer?: ReactNode;
}

const PAGE_CONTAINER_BASIC_STYLES = {
  position: 'relative',
  padding: theme.spacing(8, 8, 4),
  overflowY: 'auto',
  backgroundColor: theme.palette.background.page,
  display: 'flex',
  flexDirection: 'column',
  height: `calc(100vh - ${MAIN_HEADER_HEIGHT}px)`,
  width: '100%',
};

const LABELS = {
  title: 'Confirmation',
  description: 'Unsaved changes will be lost. Are you sure you want to leave?',
  cancel: 'cancel',
  discardChanges: 'discard changes',
};

function PageContainer({ children }: PropsWithChildren) {
  return (
    <Box
      className={MAIN_PAGE_CONTAINER}
      data-gtm={MAIN_PAGE_CONTAINER}
      sx={PAGE_CONTAINER_BASIC_STYLES}
    >
      {children}
    </Box>
  );
}

export function MainLayoutFrame({ sidebar, children }: PropsWithChildren<MainLayoutFrameProps>) {
  const { isDialogOpen, onCloseDialog, onConfirmNavigation } = useGlobalStore(
    (state) => state.unsavedChange
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <MainHeader />
      {sidebar}
      <Box component="main" sx={{ minWidth: 700, flexGrow: 1, width: '100%' }}>
        <Toolbar />
        <PageContainer>
          {children}
          <MainFooter />
        </PageContainer>
      </Box>
      <UnsavedChangesDialog
        open={isDialogOpen}
        onClose={onCloseDialog}
        onConfirm={onConfirmNavigation}
        title={LABELS.title}
        description={LABELS.description}
      />
    </Box>
  );
}
