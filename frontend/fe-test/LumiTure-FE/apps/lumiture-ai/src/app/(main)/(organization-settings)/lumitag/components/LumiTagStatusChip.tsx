import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { LumiTagStatus } from '@hooks-api';

interface LumiTagStatusChipProps {
  status: LumiTagStatus.Active | LumiTagStatus.Inactive;
}

export function LumiTagStatusChip({ status }: LumiTagStatusChipProps) {
  const { palette } = useTheme();

  const STATUS_CONFIG = {
    [LumiTagStatus.Active]: {
      label: 'Active',
      color: palette.success.main,
      borderColor: palette.success.main,
      backgroundColor: palette.success.bg,
    },
    [LumiTagStatus.Inactive]: {
      label: 'Inactive',
      color: palette.colorKit.dark[11],
      borderColor: palette.gray.borderDark,
      backgroundColor: palette.gray.disableLight,
    },
  } as const;

  const config = STATUS_CONFIG[status];

  return (
    <Typography
      variant="buttonRegular0"
      sx={{
        padding: '4px',
        border: '1px solid',
        borderColor: config.borderColor,
        borderRadius: '4px',
        color: config.color,
        backgroundColor: config.backgroundColor,
      }}
    >
      {config.label}
    </Typography>
  );
}
