'use client';

import { Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { AccountIconMenu } from '@components/layout/AccountIconMenu/AccountIconMenu';
import Logo from '@components/Logo';

export default function MainHeader() {
  return (
    <AppBar position="fixed" sx={{ bgcolor: 'primary.dark' }}>
      <Toolbar sx={{ columnGap: 2, justifyContent: 'space-between' }}>
        <Logo isColored={false} width={216} height={28} />
        <Stack direction="row">
          {/* <NotificationIconMenu /> */}
          <AccountIconMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
