import { InputAdornment, TextField } from '@mui/material';

import { BadgeToggleGroup, Button, HStack, Icon } from '@lumiture-ui';

import { LumiTagStatus } from '@hooks-api';

import { textFieldStyle } from './LumiTagActionGroup';

export function getToggleButtons(
  counts: { all: number; active: number; inactive: number },
  disabled = false
) {
  return [
    {
      key: LumiTagStatus.All,
      value: LumiTagStatus.All,
      children: 'All Tags',
      count: counts.all,
      disabled,
    },
    {
      key: LumiTagStatus.Active,
      value: LumiTagStatus.Active,
      children: 'Active',
      count: counts.active,
      disabled,
    },
    {
      key: LumiTagStatus.Inactive,
      value: LumiTagStatus.Inactive,
      children: 'Inactive',
      count: counts.inactive,
      disabled,
    },
  ];
}

const toggleButtons = getToggleButtons({ all: 0, active: 0, inactive: 0 }, true);

const LABELS = {
  searchPlaceholder: 'Search LumiTag',
  createButton: 'Create LumiTag',
};

export function LumiTagActionGroupSkeleton() {
  return (
    <HStack mt={8} justifyContent="space-between" alignItems="center">
      <BadgeToggleGroup
        toggleGroupProps={{ value: LumiTagStatus.All, exclusive: true }}
        toggleButtons={toggleButtons}
      />
      <HStack gap={2} alignItems="center">
        <TextField
          placeholder={LABELS.searchPlaceholder}
          variant="outlined"
          size="medium"
          sx={textFieldStyle}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Icon name="search" sx={{ color: 'text.hint', fontSize: '20px' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button>{LABELS.createButton}</Button>
      </HStack>
    </HStack>
  );
}
