'use client';

import { useState } from 'react';

import { Typography } from '@mui/material';

import { Button, DropdownButton, HStack, Icon, ToggleGroup } from '@lumiture-ui';

import { PLATFORM_CONFIG, type PlatformsValue } from '@constants';
import type { PreviewDetailType } from '@hooks-api';

import { ALL_TOGGLE_TYPES, TOGGLE_LABEL_MAP } from '../../constants/lumiTagPreviewResourceDialog';

interface PlatformIconProps {
  platform: PlatformsValue;
}

function PlatformIcon({ platform }: PlatformIconProps) {
  const Icon = PLATFORM_CONFIG[platform].icon;
  return <Icon sx={{ width: 24, height: 24 }} />;
}

interface PlatformSelectorButtonProps {
  platform: PlatformsValue;
  isOpen: boolean;
}

function PlatformSelectorButton({ platform, isOpen }: PlatformSelectorButtonProps) {
  return (
    <Button variant="outlined" sx={{ minWidth: 160 }}>
      <HStack justifyContent="space-between">
        <HStack gap={2} alignItems="center">
          <PlatformIcon platform={platform} />
          <Typography variant="buttonRegular1">{PLATFORM_CONFIG[platform].label}</Typography>
        </HStack>
        <Icon name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'} />
      </HStack>
    </Button>
  );
}

interface LumiTagResourceDialogToolbarProps {
  availablePlatforms: PlatformsValue[];
  selectedPlatform: PlatformsValue;
  onPlatformChange: (platform: PlatformsValue) => void;
  selectedToggleType: PreviewDetailType;
  onToggleTypeChange: (tabType: PreviewDetailType) => void;
  setSearchText: (searchText: string) => void;
}

export function LumiTagResourceDialogToolbar({
  availablePlatforms,
  selectedPlatform,
  onPlatformChange,
  selectedToggleType,
  onToggleTypeChange,
  setSearchText,
}: LumiTagResourceDialogToolbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePlatformChange = (platform: PlatformsValue) => {
    onPlatformChange(platform);
    setIsDropdownOpen(false);
  };

  const handleToggleTypeChange = (tabType: PreviewDetailType | null) => {
    if (tabType === null) return;
    onToggleTypeChange(tabType);
    setSearchText('');
  };

  return (
    <HStack sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <DropdownButton
        isOpen={isDropdownOpen}
        handleOpen={() => setIsDropdownOpen(true)}
        handleClose={() => setIsDropdownOpen(false)}
        placement="bottom-start"
        button={<PlatformSelectorButton platform={selectedPlatform} isOpen={isDropdownOpen} />}
        list={availablePlatforms.map((platform) => {
          const PlatformIcon = PLATFORM_CONFIG[platform].icon;
          return {
            label: PLATFORM_CONFIG[platform].label,
            value: platform,
            icon: <PlatformIcon sx={{ width: 16, height: 16 }} />,
            selected: platform === selectedPlatform,
            onClick: (value: PlatformsValue) => handlePlatformChange(value),
          };
        })}
      />
      <ToggleGroup
        toggleGroupProps={{
          value: selectedToggleType,
          exclusive: true,
          onChange: (_event, value: PreviewDetailType | null) => handleToggleTypeChange(value),
        }}
        toggleButtons={ALL_TOGGLE_TYPES.map((tabType) => ({
          key: tabType,
          value: tabType,
          children: TOGGLE_LABEL_MAP[selectedPlatform][tabType],
        }))}
      />
    </HStack>
  );
}
