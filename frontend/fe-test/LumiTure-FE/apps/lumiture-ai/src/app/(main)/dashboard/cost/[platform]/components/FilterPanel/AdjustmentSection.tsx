import { Typography } from '@mui/material';

import { HStack } from '@lumiture-ui';

import { CreditsFilter } from './CreditsFilter';

export const ADJUSTMENT_SECTION_LABELS = {
  title: 'Adjustment',
};

export function AdjustmentSection() {
  return (
    <>
      <HStack gap={1} alignItems="center">
        <Typography variant="bodyBold">{ADJUSTMENT_SECTION_LABELS.title}</Typography>
      </HStack>
      <CreditsFilter />
    </>
  );
}
