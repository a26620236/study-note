import { Typography } from '@mui/material';

import { HStack } from '@lumiture-ui';

import { ADJUSTMENT_SECTION_LABELS } from '../FilterPanel/AdjustmentSection';
import { CREDITS_LABELS } from '../FilterPanel/CreditsFilter';
import { FOCUSCreditFilter } from './FOCUSCreditFilter';

export function FOCUSAdjustmentSection() {
  return (
    <>
      <HStack gap={1} alignItems="center">
        <Typography variant="bodyBold">{ADJUSTMENT_SECTION_LABELS.title}</Typography>
      </HStack>
      <FOCUSCreditFilter />
      <Typography variant="caption" color="text.secondary">
        {CREDITS_LABELS.creditsTooltip}
      </Typography>
    </>
  );
}
