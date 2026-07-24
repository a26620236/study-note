'use client';

import { useMemo, useState } from 'react';

import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { HStack, ToggleGroup, VStack } from '@lumiture-ui';

import { CompletionChip } from '@components/Chip';

import type { RightsizingSettingsFormData } from '../zod/rightsizingSettings.schema';
import { RightsizingVirtualMachineSection } from './RightsizingVirtualMachineSection/RightsizingVirtualMachineSection';

enum CriteriaSettingTypeEnum {
  VirtualMachine = 'VirtualMachine',
}

const LABELS = {
  title: 'Criteria Settings',
  description: 'Rightsizing recommendations are based on the following criteria:',
};

const renderCriteriaSettings = (selectedCriteriaSettingType: CriteriaSettingTypeEnum) => {
  switch (selectedCriteriaSettingType) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    case CriteriaSettingTypeEnum.VirtualMachine:
      return <RightsizingVirtualMachineSection />;
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    default:
      return <RightsizingVirtualMachineSection />;
  }
};

export function RightsizingCriteriaSettings() {
  const theme = useTheme();
  const [selectedCriteriaSettingType, setSelectedCriteriaSettingType] =
    useState<CriteriaSettingTypeEnum>(CriteriaSettingTypeEnum.VirtualMachine);

  const {
    formState: { errors },
  } = useFormContext<RightsizingSettingsFormData>();

  const isCompleted = Object.keys(errors.criteria ?? {}).length === 0;

  const toggleButtons = useMemo(
    () =>
      Object.values(CriteriaSettingTypeEnum).map((type) => ({
        key: type,
        value: type,
        children: (
          <Typography variant="buttonRegular1" sx={{ textTransform: 'none' }}>
            {type}
          </Typography>
        ),
        onChange: (event: React.MouseEvent<HTMLElement>, value: CriteriaSettingTypeEnum) => {
          setSelectedCriteriaSettingType(value);
        },
        sx: {
          '&.MuiToggleButton-root': {
            borderBottom: 'none',
            borderRadius: '6px 6px 0 0',
            borderColor: theme.palette.gray.borderLight,
            padding: '8px 16px',
            color: theme.palette.primary.dark,
          },
        },
      })),
    [theme]
  );

  return (
    <Paper>
      <VStack sx={{ gap: 4 }}>
        <HStack sx={{ gap: 2, alignItems: 'center' }}>
          <Typography variant="h5">{LABELS.title}</Typography>
          <CompletionChip completed={isCompleted} />
        </HStack>
        <Typography variant="bodyMedium" color="text.secondary">
          {LABELS.description}
        </Typography>

        <VStack>
          <ToggleGroup
            toggleGroupProps={{
              value: CriteriaSettingTypeEnum.VirtualMachine,
            }}
            toggleButtons={toggleButtons}
          />
          <Box
            sx={{
              border: `1px solid ${theme.palette.gray.borderLight}`,
              borderRadius: '0 8px 8px 8px',
              p: 4,
            }}
          >
            {renderCriteriaSettings(selectedCriteriaSettingType)}
          </Box>
        </VStack>
      </VStack>
    </Paper>
  );
}
