import type { ReactNode } from 'react';

import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { Stack, Tooltip, Typography } from '@mui/material';

interface TableHeaderProps {
  label: string;
  tooltip?: string | ReactNode;
}

export default function TableHeader({ label, tooltip }: TableHeaderProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ gap: 1, whiteSpace: 'nowrap' }}>
      <Typography variant="bodyBold">{label}</Typography>
      {tooltip && (
        <Tooltip
          title={
            typeof tooltip === 'string' ? (
              <Typography variant="body1">{tooltip}</Typography>
            ) : (
              tooltip
            )
          }
        >
          <InfoRoundedIcon name="info" sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Tooltip>
      )}
    </Stack>
  );
}
