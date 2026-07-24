import type { ChangeEvent } from 'react';

import { FormControlLabel, Switch, type SxProps } from '@mui/material';

import { HStack } from '@lumiture-ui';

import CurrencySelector from '@components/CurrencySelector/CurrencySelector';

interface DisplayConvertedAmountProps {
  showCurrencySelector: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps;
}

const LABELS = {
  displayConvertedOn: 'Display converted amounts in',
  displayConvertedOff: 'Display converted amounts in other currency',
};

export const DisplayConvertedAmount = ({
  showCurrencySelector,
  onChange,
  sx,
}: DisplayConvertedAmountProps) => (
  <HStack alignItems="center" flexWrap="nowrap" sx={{ minHeight: 32, ...sx }}>
    <FormControlLabel
      control={<Switch checked={showCurrencySelector} onChange={onChange} />}
      label={showCurrencySelector ? LABELS.displayConvertedOn : LABELS.displayConvertedOff}
      sx={{ gap: 2.5, mr: 0 }}
    />

    {showCurrencySelector && <CurrencySelector reloadOnChange={false} sx={{ mr: 'auto' }} />}
  </HStack>
);
