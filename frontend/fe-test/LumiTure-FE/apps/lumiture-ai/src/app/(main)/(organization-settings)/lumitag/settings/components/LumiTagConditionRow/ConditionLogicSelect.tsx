'use client';

import { useController } from 'react-hook-form';

import { SingleSelect, type SingleSelectChangeEvent } from '@lumiture-ui';

import { Logic } from '@hooks-api';

import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';

const LOGIC_OPTIONS = [
  { value: Logic.And, label: 'AND' },
  { value: Logic.Or, label: 'OR' },
];

export interface ConditionLogicSelectProps {
  valueIndex: number;
  scopeIndex: number;
  conditionIndex: number;
}

export function ConditionLogicSelect({
  valueIndex,
  scopeIndex,
  conditionIndex,
}: ConditionLogicSelectProps) {
  const conditionPath =
    `values.${valueIndex}.scopes.${scopeIndex}.conditions.${conditionIndex}` as const;
  const { field } = useController<LumiTagFormData, `${typeof conditionPath}.logic`>({
    name: `${conditionPath}.logic` as const,
  });

  const handleChange = (event: SingleSelectChangeEvent<string>) => {
    if (event.value === null) return;
    field.onChange(event.value);
  };

  return (
    <SingleSelect
      configKey={`logic-${valueIndex}-${scopeIndex}-${conditionIndex}`}
      value={field.value}
      options={LOGIC_OPTIONS.map((option) => ({ id: option.value, name: option.label }))}
      onChange={handleChange}
      sx={{ width: 72, flexShrink: 0 }}
      data-testid={`condition-logic-${valueIndex}-${scopeIndex}-${conditionIndex}`}
    />
  );
}
