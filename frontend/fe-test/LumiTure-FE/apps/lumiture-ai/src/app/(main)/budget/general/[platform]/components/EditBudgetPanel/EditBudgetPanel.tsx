import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { Button, HStack, SingleSelect, VStack } from '@lumiture-ui';
import { nFormatter, popSuccessToast } from '@shared/utils';

import {
  ALLOCATE_TYPE_OPTIONS,
  AllocateType,
  BUDGET_ACTION_CONFIG,
  BudgetAction,
  MONTHS,
} from '../../constants/budget';
import type { EditingBudget } from '../../types/budgetSettings';
import { createEditBudgetSchema, type EditBudgetSchema } from '../../zod/editBudget.schema';
import { BudgetActionRadioGroup } from './BudgetActionRadioGroup';

const getMinAmount = ({
  currentAction,
  selectedGroups,
  allocateType,
}: {
  currentAction: BudgetAction;
  selectedGroups: number;
  allocateType: AllocateType;
}) => {
  if (currentAction === BudgetAction.FILL) return 0;
  // Allocate / Rebalance 會把金額平均分到 12 個月並無條件捨去，每組金額需 ≥ 12 才不會被捨成 0
  if (allocateType === AllocateType.EqualAmount) return MONTHS;
  return MONTHS * selectedGroups;
};

const FORM_INPUTS = {
  AMOUNT: 'amount',
} as const;

const DEFAULT_VALUES = {
  [FORM_INPUTS.AMOUNT]: null,
} as const;

const LABELS = {
  amountLabel: 'amount',
  amountError: (minAmount: string) =>
    `The current amount must exceed ${minAmount} to be allocated successfully.`,
  amountPrefix: '$',
};

interface EditBudgetPanelProps {
  onConfirm: (data: EditingBudget) => void;
  selectedGroups?: number;
}

export const EditBudgetPanel = ({ onConfirm, selectedGroups = 1 }: EditBudgetPanelProps) => {
  const [currentAction, setCurrentAction] = useState<BudgetAction>(BudgetAction.ALLOCATE);
  const [allocateType, setAllocateType] = useState<AllocateType>(AllocateType.EqualAmount);

  const isAllocateTypeChanged = useRef(true);

  const currentConfig = BUDGET_ACTION_CONFIG[currentAction];
  const isBulkAllocateMode = selectedGroups > 1 && currentAction === BudgetAction.ALLOCATE;

  const minAmount = getMinAmount({ currentAction, selectedGroups, allocateType });
  const minAmountStr = nFormatter({ num: minAmount, prefix: LABELS.amountPrefix });

  const allocateTypeOptions = ALLOCATE_TYPE_OPTIONS.map((option) => ({
    id: option.value,
    name: option.label,
  }));

  const formSchema = createEditBudgetSchema(currentAction, minAmount);

  type FormValues = EditBudgetSchema;

  const {
    control,
    reset,
    getValues,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const isEnableConfirmButton = () => {
    if (currentAction === BudgetAction.REBALANCE) return true;
    if (Object.keys(errors).length > 0) return false;
    if (!getValues(FORM_INPUTS.AMOUNT)) return false;
    return true;
  };

  const handleActionChange = useCallback((action: BudgetAction) => {
    setCurrentAction(action);
  }, []);

  const handleAllocateTypeChange = (value: AllocateType) => {
    setAllocateType(value);
    isAllocateTypeChanged.current = true;
  };

  const handleAmountChange = (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (...event: unknown[]) => void
  ) => {
    const inputValue = event.target.value;
    // only allow number input
    if (/^\d*$/u.test(inputValue)) {
      const value = inputValue === '' ? null : +inputValue;
      onChange(value);
      trigger(FORM_INPUTS.AMOUNT);
    }
  };

  const handleConfirmClick = (data: FormValues) => {
    onConfirm({
      action: currentAction,
      amount: data[FORM_INPUTS.AMOUNT] || null,
      allocateType: isBulkAllocateMode ? allocateType : null,
    });
    popSuccessToast({ description: 'Successfully applied.' });
  };

  useEffect(() => {
    reset();
    setAllocateType(AllocateType.EqualAmount);
    isAllocateTypeChanged.current = false;
  }, [currentAction, reset]);

  useEffect(() => {
    if (isAllocateTypeChanged.current) {
      trigger(FORM_INPUTS.AMOUNT);
    }
  }, [allocateType, trigger]);

  return (
    <Paper sx={{ width: 480, p: 4 }} component="form" onSubmit={handleSubmit(handleConfirmClick)}>
      <VStack gap={4}>
        <BudgetActionRadioGroup value={currentAction} onChange={handleActionChange} />
        {currentAction !== BudgetAction.REBALANCE && (
          <HStack alignItems="end" gap={2.5} sx={{ mt: -2 }}>
            {/* amount input */}
            <Controller
              name={FORM_INPUTS.AMOUNT}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  autoFocus
                  size="small"
                  label={LABELS.amountLabel}
                  id={FORM_INPUTS.AMOUNT}
                  sx={{ width: 160 }}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleAmountChange(event, field.onChange)
                  }
                  value={field.value || ''}
                  error={fieldState.invalid}
                  slotProps={{
                    input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                    inputLabel: {
                      style: { textTransform: 'capitalize' },
                    },
                  }}
                />
              )}
            />
            {/* allocate type select */}
            {isBulkAllocateMode && (
              <SingleSelect
                configKey="allocateType"
                value={allocateType}
                options={allocateTypeOptions}
                onChange={({ value }) => {
                  const matched = ALLOCATE_TYPE_OPTIONS.find(
                    (option) => `${option.value}` === `${value}`
                  );
                  if (matched) handleAllocateTypeChange(matched.value);
                }}
              />
            )}
          </HStack>
        )}
        {/* error msg */}
        {Object.keys(errors).length > 0 && (
          <Typography variant="caption" color="error" sx={{ mt: -2.5 }}>
            {LABELS.amountError(minAmountStr)}
          </Typography>
        )}
        {/* desc */}
        <Typography variant="caption" color="text.secondary">
          {currentConfig.desc}
        </Typography>
        <Button type="submit" sx={{ mt: 'auto', ml: 'auto' }} disabled={!isEnableConfirmButton()}>
          {currentConfig.buttonText}
        </Button>
      </VStack>
    </Paper>
  );
};
