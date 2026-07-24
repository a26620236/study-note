'use client';

import { useController, useWatch } from 'react-hook-form';

import { Input, MultiSelect, type MultiSelectChangeEvent } from '@lumiture-ui';

import { TagInputAutocomplete } from '@components/Autocomplete/TagInputAutocomplete';
import type { PlatformsValue } from '@constants';
import { Operator, useGetLumiTagFieldValues } from '@hooks-api';

import { FIELD_API_NAME_MAP, isNativeTagField } from '../../constants/lumiTagFields';
import {
  FREE_INPUT_MULTI_OPERATORS,
  MULTI_VALUE_OPERATORS,
  type PlatformFieldMeta,
} from '../../constants/lumiTagSettings';
import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';
import { LumiTagNativeTagInput } from './LumiTagNativeTagInput';

interface LumiTagFieldValueInputProps {
  valueIndex: number;
  scopeIndex: number;
  conditionIndex: number;
  platform: PlatformsValue;
  fieldMeta: PlatformFieldMeta | null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item): item is string => typeof item === 'string');
}

const LABELS = {
  selectFieldFirst: 'Select a field first',
  selectValues: 'Select values',
  enterValue: 'Enter value',
  enterValuesHint: 'Type and Press Enter',
} as const;

export function LumiTagFieldValueInput({
  valueIndex,
  scopeIndex,
  conditionIndex,
  platform,
  fieldMeta,
}: LumiTagFieldValueInputProps) {
  const { data: fieldValuesData } = useGetLumiTagFieldValues();

  const basePath =
    `values.${valueIndex}.scopes.${scopeIndex}.conditions.${conditionIndex}.criteria` as const;

  const operator = useWatch<LumiTagFormData, `${typeof basePath}.operator`>({
    name: `${basePath}.operator` as const,
  });

  const { field: valuesField, fieldState: valuesFieldState } = useController<
    LumiTagFormData,
    `${typeof basePath}.values`
  >({
    name: `${basePath}.values` as const,
  });

  if (!fieldMeta) {
    return (
      <Input size="small" disabled placeholder={LABELS.selectFieldFirst} sx={{ width: '100%' }} />
    );
  }

  const fields = fieldValuesData?.data.find((fv) => fv.platform === platform)?.fields;
  const apiName = FIELD_API_NAME_MAP[platform][fieldMeta.key];
  const rawFieldValues = fields?.[apiName];
  const multiOptions: string[] = isStringArray(rawFieldValues) ? rawFieldValues : [];

  if (isNativeTagField(fieldMeta.key)) {
    return (
      <LumiTagNativeTagInput
        basePath={basePath}
        platform={platform}
        nativeTags={isStringArray(rawFieldValues) ? undefined : rawFieldValues}
      />
    );
  }

  const isPredefinedMultiMode = MULTI_VALUE_OPERATORS.includes(operator);
  const isFreeInputMultiMode = FREE_INPUT_MULTI_OPERATORS.includes(operator);
  const currentValues = Array.isArray(valuesField.value) ? valuesField.value : [];

  if (isPredefinedMultiMode) {
    return (
      <MultiSelect
        configKey={`field-values-${valueIndex}-${scopeIndex}-${conditionIndex}`}
        value={currentValues}
        options={multiOptions.map((val) => ({ id: val, name: val }))}
        onChange={(event: MultiSelectChangeEvent) => {
          valuesField.onChange(event.value);
        }}
        wrapperSx={{ flex: 1 }}
        defaultDisplayLabel={LABELS.selectValues}
        helperText={valuesFieldState.error?.message}
        showSelectedValuesTooltip
      />
    );
  }

  if (isFreeInputMultiMode) {
    return (
      <TagInputAutocomplete
        value={currentValues}
        onChange={(next) => {
          valuesField.onChange(next);
        }}
        placeholder={LABELS.enterValuesHint}
        error={Boolean(valuesFieldState.error)}
        helperText={valuesFieldState.error?.message}
        dataTestId={`field-value-tag-input-${valueIndex}-${scopeIndex}-${conditionIndex}`}
      />
    );
  }

  const textValue =
    operator === Operator.Matches && currentValues.length > 0 ? currentValues[0] : '';

  return (
    <Input
      value={textValue}
      onChange={(event) => {
        valuesField.onChange(event.target.value ? [event.target.value] : []);
      }}
      size="small"
      placeholder={LABELS.enterValue}
      error={Boolean(valuesFieldState.error)}
      helperText={valuesFieldState.error?.message}
      sx={{ width: '100%' }}
      dataTestId={`field-value-input-${valueIndex}-${scopeIndex}-${conditionIndex}`}
    />
  );
}
