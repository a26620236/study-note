'use client';

import { useController, useFormContext } from 'react-hook-form';

import { SingleSelect, type SingleSelectChangeEvent } from '@lumiture-ui';

import type { PlatformsValue } from '@constants';
import { Operator } from '@hooks-api';

import { isNativeTagField, type FieldKey } from '../../constants/lumiTagFields';
import { PLATFORM_FIELD_META } from '../../constants/lumiTagSettings';
import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';

export interface ConditionFieldSelectProps {
  valueIndex: number;
  scopeIndex: number;
  conditionIndex: number;
  platform: PlatformsValue;
}

const LABELS = {
  selectField: 'Select field',
} as const;

export function ConditionFieldSelect({
  valueIndex,
  scopeIndex,
  conditionIndex,
  platform,
}: ConditionFieldSelectProps) {
  const conditionPath =
    `values.${valueIndex}.scopes.${scopeIndex}.conditions.${conditionIndex}` as const;
  const { setValue } = useFormContext<LumiTagFormData>();
  const { field } = useController<LumiTagFormData, `${typeof conditionPath}.field`>({
    name: `${conditionPath}.field` as const,
  });
  const platformFields = PLATFORM_FIELD_META[platform];

  const handleChange = (event: SingleSelectChangeEvent<FieldKey>) => {
    if (event.value === null) return;
    const newField = event.value;
    field.onChange(newField);
    const criteriaPath = `${conditionPath}.criteria` as const;

    if (isNativeTagField(newField)) {
      setValue(criteriaPath, {
        tagKey: '',
        tagValue: { operator: Operator.Equals, values: [] },
      });
    } else {
      setValue(criteriaPath, { operator: Operator.Equals, values: [] });
    }
  };

  return (
    <SingleSelect
      configKey={`field-${valueIndex}-${scopeIndex}-${conditionIndex}`}
      value={field.value}
      options={platformFields.map((meta) => ({ id: meta.key, name: meta.displayName }))}
      onChange={handleChange}
      defaultDisplayLabel={LABELS.selectField}
      sx={{ width: 200, flexShrink: 0 }}
      data-testid={`condition-field-${valueIndex}-${scopeIndex}-${conditionIndex}`}
    />
  );
}
