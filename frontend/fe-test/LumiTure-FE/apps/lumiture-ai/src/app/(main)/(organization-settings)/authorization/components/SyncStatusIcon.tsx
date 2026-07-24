'use client';

import { IconButton, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { Icon } from '@lumiture-ui';

import { authorizationListQueryKey } from '@hooks-api';

interface SyncStatusIconProps {
  disabled?: boolean;
}

export function SyncStatusIcon({ disabled }: SyncStatusIconProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const handleSyncClick = () => {
    queryClient.invalidateQueries({ queryKey: authorizationListQueryKey });
  };

  return (
    <IconButton
      disabled={disabled}
      sx={{
        '&.MuiButtonBase-root': {
          width: 'fit-content',
          height: 'fit-content',
          border: `1px solid ${disabled ? theme.palette.grey[500] : theme.palette.primary.main}`,
          borderRadius: '5px',
        },
      }}
      color="primary"
      onClick={handleSyncClick}
    >
      <Icon name="sync" sx={{ '&&&.MuiIcon-root': { fontSize: '24px' } }} />
    </IconButton>
  );
}
