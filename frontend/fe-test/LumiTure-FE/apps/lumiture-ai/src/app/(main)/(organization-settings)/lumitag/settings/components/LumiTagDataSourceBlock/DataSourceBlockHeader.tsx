'use client';

import { IconButton, SvgIcon, Tooltip, Typography } from '@mui/material';

import { HStack, Icon } from '@lumiture-ui';

import type { PlatformsValue } from '@constants';

import { getPlatformConfig } from '../../utils/getPlatformConfig';

export interface DataSourceBlockHeaderProps {
  valueIndex: number;
  scopeIndex: number;
  platform: PlatformsValue;
  onRemove: () => void;
}

const LABELS = {
  headerPrefix: 'All',
  headerSuffix: 'resources matching ALL conditions below:',
  removeTooltip: 'Remove this Data Resource',
};

export function DataSourceBlockHeader({
  valueIndex,
  scopeIndex,
  platform,
  onRemove,
}: DataSourceBlockHeaderProps) {
  const config = getPlatformConfig(platform);
  return (
    <HStack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <HStack sx={{ gap: 2, alignItems: 'center' }}>
        <Typography variant="body1" color="text.primary">
          {LABELS.headerPrefix}
        </Typography>

        <SvgIcon component={config.icon} inheritViewBox sx={{ fontSize: 18 }} />

        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {config.label}
        </Typography>

        <Typography variant="body1" color="text.primary">
          {LABELS.headerSuffix}
        </Typography>
      </HStack>

      <Tooltip title={LABELS.removeTooltip}>
        <IconButton
          size="small"
          onClick={onRemove}
          data-testid={`remove-data-source-${valueIndex}-${scopeIndex}`}
        >
          <Icon name="close" />
        </IconButton>
      </Tooltip>
    </HStack>
  );
}
