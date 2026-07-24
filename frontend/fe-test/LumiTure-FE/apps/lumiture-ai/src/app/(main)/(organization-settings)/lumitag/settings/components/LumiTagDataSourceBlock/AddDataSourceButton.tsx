'use client';

import { Button, DropdownButton, HStack, Icon } from '@lumiture-ui';

import type { PlatformsValue } from '@constants';

import { getPlatformConfig } from '../../utils/getPlatformConfig';

const LABELS = {
  addDataSource: 'Add Data Source',
  noAvailablePlatforms: 'All data sources added',
};

export interface AddDataSourceButtonProps {
  availablePlatforms: PlatformsValue[];
  valueIndex: number;
  onSelect: (platform: PlatformsValue) => void;
}

export function AddDataSourceButton({
  availablePlatforms,
  valueIndex,
  onSelect,
}: AddDataSourceButtonProps) {
  const isDisabled = availablePlatforms.length === 0;

  return (
    <HStack sx={{ justifyContent: 'flex-start', alignItems: 'center', gap: 3 }}>
      <DropdownButton
        disabled={isDisabled}
        placement="bottom-start"
        popperProps={{ sx: { width: 250 } }}
        button={
          <Button
            variant="outlined"
            size="medium"
            startIcon={<Icon name="add" />}
            disabled={isDisabled}
            tooltipProps={
              isDisabled ? { title: LABELS.noAvailablePlatforms, placement: 'top' } : undefined
            }
            data-testid={`add-data-source-${valueIndex}`}
          >
            {LABELS.addDataSource}
          </Button>
        }
        list={availablePlatforms.map((platform) => ({
          label: getPlatformConfig(platform).label,
          value: platform,
          onClick: onSelect,
          dataTestId: `add-platform-${platform}`,
        }))}
      />
    </HStack>
  );
}
