import { useState } from 'react';

import type { SxProps } from '@mui/material';
import { useSession } from 'next-auth/react';

import { DropdownButton } from '@lumiture-ui';

import SelectInput from '@components/CurrencySelector/SelectInput';
import { Currency, currencyOptions, type CurrencyCode } from '@constants';
import { usePatchUserProfile } from '@hooks-api';

export interface CurrencySelectorProps {
  disabled?: boolean;
  reloadOnChange?: boolean;
  sx?: SxProps;
}
const CurrencySelector = ({
  disabled = false,
  reloadOnChange = true,
  sx,
}: CurrencySelectorProps) => {
  const { status, data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const currency = session?.user.currency ?? Currency.USD;
  const userId = session?.user.userId;
  const patchUserProfileMutation = usePatchUserProfile(userId, {
    onSuccess: async (_response, variables) => {
      if (session) await update(variables);
      if (reloadOnChange) window.location.reload();
    },
    onError: () => {
      console.error('Failed to change currency');
    },
  });

  const handleChange = (selectedCurrency: CurrencyCode) => {
    if (!userId) return;
    patchUserProfileMutation.mutate({ currency: selectedCurrency });
  };

  const formattedCurrency = currencyOptions;

  const currencyMenuItems = formattedCurrency.map((_currency) => ({
    label: `${_currency.label} (${_currency.value})`,
    value: _currency.value,
    onClick: () => handleChange(_currency.value),
    selected: _currency.value === currency,
  }));

  const isDisabled = disabled || status !== 'authenticated';

  return (
    <DropdownButton
      disabled={isDisabled}
      isOpen={isOpen}
      handleOpen={() => setIsOpen(true)}
      handleClose={() => setIsOpen(false)}
      button={<SelectInput disabled={isDisabled} isOpen={isOpen} currency={currency} />}
      list={currencyMenuItems}
      sx={sx}
    />
  );
};

export default CurrencySelector;
