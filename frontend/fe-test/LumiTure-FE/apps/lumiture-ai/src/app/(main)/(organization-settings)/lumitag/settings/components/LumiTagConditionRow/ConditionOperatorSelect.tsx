'use client';

import { useController, useFormContext } from 'react-hook-form';

import { SingleSelect, type SingleSelectChangeEvent } from '@lumiture-ui';

import { Operator } from '@hooks-api';

import { OPERATOR_LABELS } from '../../constants/lumiTagSettings';
import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';

export interface ConditionOperatorSelectProps {
  valueIndex: number;
  scopeIndex: number;
  conditionIndex: number;
}

export function ConditionOperatorSelect({
  valueIndex,
  scopeIndex,
  conditionIndex,
}: ConditionOperatorSelectProps) {
  const conditionPath =
    `values.${valueIndex}.scopes.${scopeIndex}.conditions.${conditionIndex}` as const;
  const { setValue } = useFormContext<LumiTagFormData>();
  const { field } = useController<LumiTagFormData, `${typeof conditionPath}.criteria.operator`>({
    name: `${conditionPath}.criteria.operator` as const,
  });

  // numeric enum 的 Object.values 會同時回傳 name 跟 value，這裡只要 value
  const operatorValues = Object.values(Operator).filter(
    (value): value is Operator => typeof value === 'number'
  );

  const handleChange = (event: SingleSelectChangeEvent<Operator>) => {
    if (event.value === null) return;
    field.onChange(event.value);
    setValue(`${conditionPath}.criteria.values` as const, []);
  };

  return (
    <SingleSelect
      configKey={`operator-${valueIndex}-${scopeIndex}-${conditionIndex}`}
      value={field.value}
      options={operatorValues.map((op) => ({ id: op, name: OPERATOR_LABELS[op] }))}
      onChange={handleChange}
      sx={{ width: 120, flexShrink: 0 }}
      data-testid={`condition-operator-${valueIndex}-${scopeIndex}-${conditionIndex}`}
    />
  );
}
