import { Stack, Tooltip, Typography, type TypographyProps } from '@mui/material';

import { PLATFORM_CONFIG, type PlatformsValue } from '@constants';

interface ResourceCellProps {
  resourceName: string;
  resourceId: string;
  platform: PlatformsValue;
  resourceNameVariant?: TypographyProps['variant'];
}

// ResourceCell - 顯示資源名稱、ID 和平台圖示的表格單元格元件
export default function ResourceCell({
  resourceName,
  resourceId,
  platform,
  resourceNameVariant = 'body2',
}: ResourceCellProps) {
  const platformConfig = PLATFORM_CONFIG[platform];

  return (
    <Stack direction="row" alignItems="center" sx={{ gap: 2, minWidth: 0 }}>
      <Tooltip title={`${resourceName} (${resourceId})`}>
        <Stack direction="row" sx={{ gap: 2, minWidth: 0 }} alignItems="center">
          {platformConfig.icon({ sx: { fontSize: 20, flexShrink: 0 } })}
          <Typography
            variant={resourceNameVariant}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'inline',
            }}
          >
            {resourceName}
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {` (${resourceId})`}
            </Typography>
          </Typography>
        </Stack>
      </Tooltip>
    </Stack>
  );
}
