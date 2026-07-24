'use client';

import { useState } from 'react';

import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';

import { Icon } from '@lumiture-ui';
import { removeLocalStorageItem } from '@shared/utils';

import { SelectUserRoleDialog } from '@components/dialog';
import PlanBanner from '@components/layout/AccountIconMenu/PlanBanner';
import { Role } from '@constants';
import { aiQuotaQueryKey, userGroupsQueryKey } from '@hooks-api';

import { AccountMenuItem, AccountMenuItemWrap } from './AccountMenuItem';
import { AiQuotaSection } from './AiQuotaSection';
import UserRoleChip from './UserRoleChip';

export function AccountIconMenu() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const fullName =
    session?.user.firstName && session.user.lastName
      ? `${session.user.firstName} ${session.user.lastName}`
      : '--';
  const [accountIconMenuTrigger, setAccountIconMenuTrigger] = useState<null | HTMLElement>(null);
  const [openUserRoleDialog, setOpenUserRoleDialog] = useState(false);
  const handleOpenAccountIconMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAccountIconMenuTrigger(event.currentTarget);
    queryClient.invalidateQueries({ queryKey: aiQuotaQueryKey() });
  };
  const handleCloseAccountIconMenu = () => {
    setAccountIconMenuTrigger(null);
  };
  const handleSignOut = () => {
    removeLocalStorageItem('userInfo');
    signOut();
  };
  const handleViewAsAnotherRole = () => {
    queryClient.invalidateQueries({ queryKey: userGroupsQueryKey });
    setAccountIconMenuTrigger(null);
    setOpenUserRoleDialog(true);
  };
  const shouldShowUserRoleChip = Boolean(
    session?.user.group?.character && session.user.group.groupName
  );

  return (
    <>
      <IconButton size="medium" onClick={handleOpenAccountIconMenu}>
        <AccountCircle sx={{ color: 'common.white' }} />
      </IconButton>
      <Menu
        id="account-icon-menu"
        anchorEl={accountIconMenuTrigger}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        open={Boolean(accountIconMenuTrigger)}
        onClose={handleCloseAccountIconMenu}
        sx={{ mt: 8 }}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              p: 0,
              backgroundColor: 'primary.dark',
              color: 'common.white',
            },
          },
          list: {
            sx: { p: 0 },
          },
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <PlanBanner />
        {/* user info */}
        <Stack sx={{ px: 6, py: 4 }}>
          <Typography noWrap sx={{ fontSize: 16 }}>
            {fullName}
          </Typography>
          <Typography variant="caption" noWrap sx={{ mb: 2 }}>
            {session?.user.email || '--'}
          </Typography>
          {shouldShowUserRoleChip && (
            <UserRoleChip
              role={session?.user.group?.character ?? Role.MEMBER}
              groupName={session?.user.group?.groupName ?? ''}
            />
          )}
        </Stack>
        <AiQuotaSection />
        <AccountMenuItemWrap>
          <AccountMenuItem
            label="View as Another Role"
            icon={<Icon name="sync_alt" />}
            onClick={handleViewAsAnotherRole}
          />
        </AccountMenuItemWrap>
        <AccountMenuItemWrap>
          <AccountMenuItem label="Log out" icon={<Icon name="logout" />} onClick={handleSignOut} />
        </AccountMenuItemWrap>
      </Menu>
      {openUserRoleDialog && (
        <SelectUserRoleDialog
          open={openUserRoleDialog}
          onClose={() => setOpenUserRoleDialog(false)}
          onSubmitSuccess={() => {
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
