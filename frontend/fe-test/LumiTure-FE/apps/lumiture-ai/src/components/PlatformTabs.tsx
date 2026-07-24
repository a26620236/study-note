'use client';

import type { SyntheticEvent } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { PLATFORM_CONFIG, type PlatformsValue } from '@constants';

interface PlatformTabProps {
  currentValue: PlatformsValue;
  platformValues: PlatformsValue[];
  onChange?: (platformVal: PlatformsValue) => void;
}

const PlatformTabs = ({ currentValue, platformValues, onChange }: PlatformTabProps) => {
  const handleChange = (_event: SyntheticEvent, newValue: PlatformsValue) => {
    if (!onChange) return;
    onChange(newValue);
  };

  return (
    <Box sx={{ flex: 1, borderBottom: 2, borderColor: 'gray.borderLight' }}>
      <Tabs
        value={currentValue}
        onChange={handleChange}
        sx={{
          gap: 5,
          minHeight: '32px',
          '& .MuiTabs-list': {
            gap: '32px',
            pb: '8px',
          },
        }}
        slotProps={{
          indicator: {
            sx: {
              borderRadius: '10px',
              height: '4px',
            },
          },
        }}
      >
        {platformValues.map((_platformVal) => {
          const platformConfig = PLATFORM_CONFIG[_platformVal];
          const Icon = platformConfig.icon;
          return (
            <Tab
              key={_platformVal}
              iconPosition="start"
              label={platformConfig.label}
              value={platformConfig.value}
              icon={<Icon />}
              sx={{
                '&.MuiTab-root': {
                  textTransform: 'none',
                  paddingBottom: '4px',
                  minHeight: '32px',
                  padding: 0,
                  minWidth: 'unset',
                },
                '&.Mui-selected': {
                  fontWeight: 700,
                },
              }}
            />
          );
        })}
      </Tabs>
    </Box>
  );
};

export default PlatformTabs;
