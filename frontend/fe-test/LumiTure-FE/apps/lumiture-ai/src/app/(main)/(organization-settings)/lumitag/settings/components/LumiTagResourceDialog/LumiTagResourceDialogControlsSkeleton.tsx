'use client';

import { Box, InputAdornment, Skeleton } from '@mui/material';

import { Button, DropdownButton, HStack, Icon, Input, ToggleGroup, VStack } from '@lumiture-ui';

import { PLATFORM_CONFIG, PlatformsValue } from '@constants';

import { ALL_TOGGLE_TYPES, TOGGLE_LABEL_MAP } from '../../constants/lumiTagPreviewResourceDialog';

const DEFAULT_PLATFORM = PlatformsValue.GCP;

export function LumiTagResourceDialogControlsSkeleton() {
  const PlatformIcon = PLATFORM_CONFIG[DEFAULT_PLATFORM].icon;

  return (
    <HStack justifyContent="space-between" alignItems="flex-start">
      <HStack sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <DropdownButton
          isOpen={false}
          handleOpen={() => undefined}
          handleClose={() => undefined}
          placement="bottom-start"
          button={
            <Button variant="outlined" sx={{ minWidth: 160 }} disabled>
              <HStack gap={2} alignItems="center">
                <PlatformIcon sx={{ width: 16, height: 16 }} />
                {PLATFORM_CONFIG[DEFAULT_PLATFORM].label}
                <Icon name="arrow_drop_down" />
              </HStack>
            </Button>
          }
          list={[]}
        />
        <ToggleGroup
          toggleGroupProps={{
            exclusive: true,
            disabled: true,
          }}
          toggleButtons={ALL_TOGGLE_TYPES.map((tabType) => ({
            key: tabType,
            value: tabType,
            children: TOGGLE_LABEL_MAP[DEFAULT_PLATFORM][tabType],
          }))}
        />
      </HStack>
      <VStack gap={2} alignItems="flex-end">
        <Input
          placeholder="Search"
          size="small"
          disabled
          sx={{ width: 228 }}
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
        <Box py="3px">
          <Skeleton variant="rounded" width={200} height={12} />
        </Box>
      </VStack>
    </HStack>
  );
}
