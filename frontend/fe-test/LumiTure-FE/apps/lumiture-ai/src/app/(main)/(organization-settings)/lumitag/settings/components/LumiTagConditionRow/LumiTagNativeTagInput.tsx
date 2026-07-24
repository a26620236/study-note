'use client';

import type { ChangeEvent } from 'react';

import { Box, Tooltip } from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';

import {
  HStack,
  Input,
  MultiSelect,
  SingleSelect,
  type MultiSelectChangeEvent,
  type SingleSelectChangeEvent,
} from '@lumiture-ui';

import { TagInputAutocomplete } from '@components/Autocomplete/TagInputAutocomplete';
import type { PlatformsValue } from '@constants';
import { Operator, type NativeTagFieldValue } from '@hooks-api';

import {
  FREE_INPUT_MULTI_OPERATORS,
  MULTI_VALUE_OPERATORS,
  OPERATOR_LABELS,
} from '../../constants/lumiTagSettings';
import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';

export interface LumiTagNativeTagInputProps {
  basePath: `values.${number}.scopes.${number}.conditions.${number}.criteria`;
  platform: PlatformsValue;
  nativeTags: NativeTagFieldValue[] | undefined;
}

const LABELS = {
  selectTagKey: 'Select Tag Key',
  selectTagValue: 'Select Tag Value',
  enterTagValue: 'Enter tag value',
  enterTagValuesHint: 'Type and Press Enter',
  selectTagKeyFirst: 'You should select a Label / Tag Key first.',
} as const;

const OPERATOR_OPTIONS = Object.values(Operator)
  .filter((value): value is Operator => typeof value === 'number')
  .map((op) => ({ id: op, name: OPERATOR_LABELS[op] }));

export function LumiTagNativeTagInput({ basePath, nativeTags }: LumiTagNativeTagInputProps) {
  const { setValue } = useFormContext<LumiTagFormData>();

  const { field: tagKeyField } = useController<LumiTagFormData, `${typeof basePath}.tagKey`>({
    name: `${basePath}.tagKey`,
  });

  const { field: tagValueOperatorField } = useController<
    LumiTagFormData,
    `${typeof basePath}.tagValue.operator`
  >({
    name: `${basePath}.tagValue.operator`,
  });

  const { field: tagValueValuesField, fieldState: tagValueValuesFieldState } = useController<
    LumiTagFormData,
    `${typeof basePath}.tagValue.values`
  >({
    name: `${basePath}.tagValue.values`,
  });

  const nativeTagEntries = nativeTags ?? [];
  const nativeTagKeys = nativeTagEntries.map((entry) => entry.key);
  const selectedKey = tagKeyField.value;
  const nativeTagValues = nativeTagEntries.find((entry) => entry.key === selectedKey)?.values ?? [];

  const tagValueOperator = tagValueOperatorField.value ?? Operator.Equals;

  const tagKeyOptions = nativeTagKeys.map((key) => ({ id: key, name: key }));

  const currentValues = tagValueValuesField.value ?? [];
  const matchesRegexValue = currentValues[0] ?? '';

  const handleTagKeyChange = (event: SingleSelectChangeEvent<string>) => {
    if (event.value === null) return;
    tagKeyField.onChange(event.value);
    setValue(`${basePath}.tagValue.values`, []);
  };

  const handleOperatorChange = (event: SingleSelectChangeEvent<Operator>) => {
    if (event.value === null) return;
    setValue(`${basePath}.tagValue`, { operator: event.value, values: [] });
  };

  const handleMatchesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    tagValueValuesField.onChange(next ? [next] : []);
  };

  return (
    <HStack sx={{ gap: 1, flex: 1, flexWrap: 'nowrap', alignItems: 'center' }}>
      <SingleSelect
        configKey={`native-tag-key-${basePath}`}
        value={selectedKey || null}
        options={tagKeyOptions}
        onChange={handleTagKeyChange}
        defaultDisplayLabel={LABELS.selectTagKey}
        sx={{ width: 200, flexShrink: 0 }}
      />

      <SingleSelect
        configKey={`native-tag-operator-${basePath}`}
        value={tagValueOperator}
        options={OPERATOR_OPTIONS}
        onChange={handleOperatorChange}
        sx={{ width: 120, flexShrink: 0 }}
      />

      {MULTI_VALUE_OPERATORS.includes(tagValueOperator) && (
        <Tooltip title={selectedKey ? '' : LABELS.selectTagKeyFirst}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <MultiSelect
              configKey={`native-tag-values-${selectedKey}`}
              value={currentValues}
              options={nativeTagValues.map((val) => ({ id: val, name: val }))}
              onChange={(event: MultiSelectChangeEvent) => {
                tagValueValuesField.onChange(event.value);
              }}
              wrapperSx={{ width: '100%' }}
              defaultDisplayLabel={LABELS.selectTagValue}
              helperText={tagValueValuesFieldState.error?.message}
              disabled={!selectedKey}
              showSelectedValuesTooltip
            />
          </Box>
        </Tooltip>
      )}

      {FREE_INPUT_MULTI_OPERATORS.includes(tagValueOperator) && (
        <TagInputAutocomplete
          value={currentValues}
          onChange={(next) => {
            tagValueValuesField.onChange(next);
          }}
          placeholder={LABELS.enterTagValuesHint}
          error={Boolean(tagValueValuesFieldState.error)}
          helperText={tagValueValuesFieldState.error?.message}
        />
      )}

      {tagValueOperator === Operator.Matches && (
        <Input
          value={matchesRegexValue}
          onChange={handleMatchesChange}
          size="small"
          placeholder={LABELS.enterTagValue}
          error={Boolean(tagValueValuesFieldState.error)}
          helperText={tagValueValuesFieldState.error?.message}
          sx={{ flex: 1, minWidth: 0 }}
        />
      )}
    </HStack>
  );
}
