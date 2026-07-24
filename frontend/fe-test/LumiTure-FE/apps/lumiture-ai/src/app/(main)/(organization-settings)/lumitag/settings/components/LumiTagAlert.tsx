'use client';

import { Paper, Typography } from '@mui/material';

import { HStack, Icon } from '@lumiture-ui';

import { LumiTagStatus } from '@hooks-api';

interface LumiTagAlertProps {
  status: LumiTagStatus.Active | LumiTagStatus.Inactive;
}

const LABELS = {
  [LumiTagStatus.Active]:
    'This tag is currently active and applied to cost reports. Saving as inactive will remove it from all reports until re-applied.',
  [LumiTagStatus.Inactive]:
    'This tag is currently inactive and hidden from reports. Apply it to include this logic in all spend reports and dashboards.',
};

const STYLE_CONFIG = {
  [LumiTagStatus.Active]: {
    iconName: 'check_circle',
    iconColor: 'success.main',
  },
  [LumiTagStatus.Inactive]: {
    iconName: 'warning',
    iconColor: 'warning.main',
  },
} as const;

export function LumiTagAlert({ status }: LumiTagAlertProps) {
  const { iconName, iconColor } = STYLE_CONFIG[status];

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        p: '8px 16px',
        borderRadius: 1,
        overflow: 'hidden',
        mt: 5,
        '::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: iconColor,
        },
      }}
      data-testid="lumiTag-alert"
    >
      <HStack alignItems="center" gap={2}>
        <Icon name={iconName} sx={{ color: iconColor, fontSize: 24 }} />
        <Typography variant="body2" color="text.primary">
          {LABELS[status]}
        </Typography>
      </HStack>
    </Paper>
  );
}
