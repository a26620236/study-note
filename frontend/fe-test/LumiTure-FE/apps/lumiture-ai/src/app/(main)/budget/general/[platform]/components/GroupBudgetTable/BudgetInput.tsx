import { memo, useCallback, type ChangeEvent } from 'react';

import { InputAdornment, InputBase, Tooltip, type InputBaseProps } from '@mui/material';
import { isNil } from 'lodash-es';

import { VStack } from '@lumiture-ui';

import { validateMaxBudget } from '../../utils/budgetCalc';
import { formatBudgetDisplay } from '../../utils/budgetFormat';

interface NormalizedBudgetInput {
  shouldUpdate: boolean;
  value: number | null;
}

// cell 輸入正規化：空字串→null（unlimited）、僅接受數字、夾上限
const normalizeBudgetInput = (rawValue: string): NormalizedBudgetInput => {
  if (rawValue === '') return { shouldUpdate: true, value: null };
  if (!/^\d*$/u.test(rawValue)) return { shouldUpdate: false, value: null };
  return { shouldUpdate: true, value: validateMaxBudget(rawValue) };
};

interface BudgetInputProps extends InputBaseProps {
  value: string | number | null;
  onChange: (...event: unknown[]) => void;
}

const LABELS = {
  unlimited: 'Budget not set (Unlimited)',
  currencyPrefix: '$',
};

export const PreviewBudget = ({ value }: { value: BudgetInputProps['value'] }) => {
  const isUnlimited = isNil(value) || value === '';
  return (
    <Tooltip title={isUnlimited && LABELS.unlimited} placement="top">
      <VStack sx={{ textAlign: 'right', flex: 1 }}>{formatBudgetDisplay(value)}</VStack>
    </Tooltip>
  );
};

export const BudgetInput = memo(function BudgetInput({
  value,
  onChange,
  inputRef,
  disabled,
  ...others
}: BudgetInputProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { shouldUpdate, value } = normalizeBudgetInput(event.target.value);

      if (shouldUpdate) {
        onChange(value);
      }
    },
    [onChange]
  );

  if (disabled) {
    return <PreviewBudget value={value} />;
  }

  return (
    <InputBase
      {...others}
      disableInjectingGlobalStyles
      startAdornment={<InputAdornment position="start">{LABELS.currencyPrefix}</InputAdornment>}
      inputProps={{
        inputMode: 'numeric',
      }}
      inputRef={inputRef}
      value={value ?? ''}
      onChange={handleChange}
    />
  );
});
