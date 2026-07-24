'use client';

import { useMemo } from 'react';

import { Toolbar, Typography } from '@mui/material';

import { Button, HStack, Icon, ToggleGroup } from '@lumiture-ui';

import { StatusChip } from '@components/Chip';

import { AnomalyToggleCategory, Sensitivity } from '../constants';

const LABELS = {
  title: 'Alert List',
  button: 'Alert Settings',
  status: {
    getEnabledLabel: (sensitivity: string) => `Detection Enabled  (Sensitivity: ${sensitivity})`,
    disabled: 'Detection Disabled',
  },
  sensitivity: {
    [Sensitivity.Low]: 'Low',
    [Sensitivity.Medium]: 'Medium',
    [Sensitivity.High]: 'High',
  },
};

const TOOLBAR_STYLES = {
  '&.MuiToolbar-root': {
    minHeight: 'unset',
    padding: 0,
  },
};

interface AnomalyToolbarProps {
  sensitivity?: string;
  canEditSettings: boolean;
  onSettingsClick: () => void;
  hasAnomaly: boolean;
  category: AnomalyToggleCategory;
  setCategory: (category: AnomalyToggleCategory) => void;
}

export function AnomalyToolbar({
  sensitivity,
  canEditSettings,
  onSettingsClick,
  hasAnomaly,
  category,
  setCategory,
}: AnomalyToolbarProps) {
  const toggleButtons = useMemo(
    () => [
      {
        value: 'all',
        children: (
          <Typography variant="button" sx={{ textTransform: 'none' }}>
            All
          </Typography>
        ),
        onClick: () => setCategory(AnomalyToggleCategory.All),
      },
      {
        value: 'pinned',
        children: <Icon name="keep" sx={{ fontSize: '20px' }} />,
        onClick: () => setCategory(AnomalyToggleCategory.Pinned),
      },
    ],
    [setCategory]
  );

  return (
    <Toolbar sx={TOOLBAR_STYLES}>
      {hasAnomaly && <Typography variant="h5">{LABELS.title}</Typography>}
      <HStack alignItems="center" gap={4} sx={{ ml: 'auto' }}>
        {canEditSettings && (
          <Button
            variant="link"
            size="medium"
            startIcon={<Icon name="settings" />}
            onClick={onSettingsClick}
            sx={{
              '&.MuiButtonBase-root': { padding: '0' },
            }}
          >
            <Typography variant="bodyBold">{LABELS.button}</Typography>
          </Button>
        )}
        <StatusChip
          status={sensitivity ? 'new' : 'closed'}
          label={sensitivity ? LABELS.status.getEnabledLabel(sensitivity) : LABELS.status.disabled}
          variant="filled"
        />
        <ToggleGroup
          toggleGroupProps={{
            value: category,
          }}
          toggleButtons={toggleButtons}
        />
      </HStack>
    </Toolbar>
  );
}
