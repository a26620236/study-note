'use client';

import { Paper, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { HStack, VStack } from '@lumiture-ui';

import { CompletionChip } from '@components/Chip';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';
import { ImpactSettings } from './ImpactSettings';
import { TrackingConfiguration } from './TrackingConfiguration';

const LABELS = {
  title: 'Advanced Settings',
};

export function RightsizingAdvancedSettings() {
  const {
    formState: { errors },
  } = useFormContext<RightsizingSettingsFormData>();

  const isCompleted = Object.keys(errors.advance ?? {}).length === 0;

  return (
    <Paper>
      <VStack sx={{ gap: 4 }}>
        <HStack sx={{ gap: 2, alignItems: 'center' }}>
          <Typography variant="h5">{LABELS.title}</Typography>
          <CompletionChip completed={isCompleted} />
        </HStack>
        <TrackingConfiguration />
        <ImpactSettings />
      </VStack>
    </Paper>
  );
}
