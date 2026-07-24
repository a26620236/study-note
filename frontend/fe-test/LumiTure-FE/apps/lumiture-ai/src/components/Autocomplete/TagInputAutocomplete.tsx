'use client';

import type { SyntheticEvent } from 'react';

import {
  Autocomplete as MuiAutocomplete,
  type AutocompleteChangeReason,
  type AutocompleteProps,
} from '@mui/material';

import { Input, SquareChip, VStack } from '@lumiture-ui';

export interface TagInputAutocompleteProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  dataTestId?: string;
}

const TAG_SEPARATOR_REGEX = /[,\n]/u;

// Trim whitespace, drop empties, and dedupe against existing tags.
const sanitizeTags = (rawTags: string[], existing: string[]): string[] => {
  const seen = new Set(existing);
  const result: string[] = [...existing];

  for (const rawTag of rawTags) {
    const trimmed = rawTag.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
};

export function TagInputAutocomplete({
  value,
  onChange,
  placeholder,
  error,
  helperText,
  dataTestId,
}: TagInputAutocompleteProps) {
  const handleChange = (
    _event: SyntheticEvent,
    nextValue: string[],
    reason: AutocompleteChangeReason
  ) => {
    if (reason === 'createOption') {
      const created = nextValue.slice(value.length);
      const segments = created.flatMap((tag) => tag.split(TAG_SEPARATOR_REGEX));
      onChange(sanitizeTags(segments, value));
      return;
    }
    onChange(nextValue);
  };

  const renderValue: AutocompleteProps<string, true, false, true>['renderValue'] = (
    tagValues,
    getItemProps
  ) =>
    tagValues.map((tag, index) => {
      const { key, ...itemProps } = getItemProps({ index });
      return <SquareChip key={key} {...itemProps} size="ex-small" color="primary" label={tag} />;
    });

  const renderInput: AutocompleteProps<string, true, false, true>['renderInput'] = (params) => (
    <Input
      {...params}
      placeholder={value.length === 0 ? placeholder : undefined}
      error={error}
      helperText={helperText}
      size="small"
      dataTestId={dataTestId}
    />
  );

  return (
    <VStack sx={{ flex: 1, minWidth: 0 }}>
      <MuiAutocomplete
        multiple
        freeSolo
        autoSelect
        clearOnBlur
        open={false}
        forcePopupIcon={false}
        size="small"
        options={[]}
        value={value}
        onChange={handleChange}
        renderValue={renderValue}
        renderInput={renderInput}
      />
    </VStack>
  );
}
