import { memo, type ChangeEvent } from 'react';

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import { BUDGET_ACTION_CONFIG, type BudgetAction } from '../../constants/budget';

interface BudgetActionRadioGroupProps {
  value: BudgetAction;
  onChange: (action: BudgetAction) => void;
}

const LABELS = {
  groupName: 'budget action',
};

export const BudgetActionRadioGroup = memo(function BudgetActionRadioGroup({
  value,
  onChange,
}: BudgetActionRadioGroupProps) {
  const handleActionChange = (_event: ChangeEvent<HTMLInputElement>, actionValue: string) => {
    const matched = Object.values(BUDGET_ACTION_CONFIG).find(
      (action) => `${action.value}` === actionValue
    );
    if (matched) onChange(matched.value);
  };
  return (
    <FormControl sx={{ display: 'block' }}>
      <RadioGroup row name={LABELS.groupName} value={value} onChange={handleActionChange}>
        {Object.values(BUDGET_ACTION_CONFIG).map((action) => (
          <FormControlLabel
            key={action.value}
            value={action.value}
            control={<Radio />}
            label={action.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
});
