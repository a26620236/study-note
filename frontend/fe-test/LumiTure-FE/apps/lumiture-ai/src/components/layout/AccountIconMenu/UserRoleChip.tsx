import React from 'react';

import type { MaterialSymbol } from 'material-symbols';

import { Icon, SquareChip } from '@lumiture-ui';

import { Role } from '@constants';

interface UserRoleChipProps {
  role: Role;
  groupName: string;
}

const LABELS = {
  [Role.MEMBER]: 'Member',
  [Role.MANAGER]: 'Manager',
  [Role.ADMIN]: 'Admin',
  [Role.OWNER]: 'Owner',
};

const ROLE_ICON_MAP: Record<Role, MaterialSymbol> = {
  [Role.MEMBER]: 'account_circle',
  [Role.MANAGER]: 'supervised_user_circle',
  [Role.ADMIN]: 'admin_panel_settings',
  [Role.OWNER]: 'admin_panel_settings',
};

export default function UserRoleChip({ role, groupName }: UserRoleChipProps) {
  const label = (() => {
    if (role === Role.OWNER || role === Role.ADMIN) {
      return LABELS[Role.ADMIN];
    }
    return `${LABELS[role]} - ${groupName}`;
  })();

  return (
    <SquareChip
      icon={<Icon name={ROLE_ICON_MAP[role]} sx={{ fontSize: 16 }} />}
      label={label}
      color="primary"
      variant="filled"
      size="ex-small"
      sx={{
        width: 'fit-content',
        maxWidth: '100%',
        gap: '1px',
      }}
      clickable={false}
    />
  );
}
