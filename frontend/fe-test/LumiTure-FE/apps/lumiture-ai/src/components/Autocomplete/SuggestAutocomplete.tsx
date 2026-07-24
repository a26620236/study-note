'use client';

import type { HTMLAttributes, Key, ReactNode, Ref, SyntheticEvent } from 'react';

import {
  Autocomplete as MuiAutocomplete,
  Typography,
  useTheme,
  type AutocompleteRenderGroupParams,
  type TextFieldProps,
} from '@mui/material';

import { HStack, Input, SquareChip } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

export interface SuggestOption {
  label: string;
  group?: string;
  disabled?: boolean;
  tag?: string;
}

export interface SuggestAutocompleteProps {
  options: SuggestOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  renderGroupHeader?: (group: string) => ReactNode;
  textFieldProps?: Partial<TextFieldProps>;
  ref?: Ref<HTMLDivElement>;
}

const PAPER_SX = {
  '& .MuiAutocomplete-option': { backgroundColor: 'transparent' },
  '& .MuiAutocomplete-option:hover, & .MuiAutocomplete-option.Mui-focused': {
    backgroundColor: theme.palette.gray.hover,
  },
  '& .MuiAutocomplete-option[aria-selected="true"]': {
    backgroundColor: theme.palette.gray.selected,
  },
  '& .MuiAutocomplete-option[aria-selected="true"]:hover': {
    backgroundColor: theme.palette.gray.selected,
  },
  '& .MuiAutocomplete-option[aria-disabled="true"]': { backgroundColor: 'transparent', opacity: 1 },
  '&:empty': { display: 'none' },
} as const;

const getOptionLabel = (option: string | SuggestOption): string =>
  typeof option === 'string' ? option : option.label;

const getOptionDisabled = (option: string | SuggestOption): boolean =>
  typeof option !== 'string' && (option.disabled ?? false);

const getOptionGroup = (option: string | SuggestOption): string =>
  typeof option === 'string' ? '' : (option.group ?? '');

const isOptionEqualToValue = (
  option: string | SuggestOption,
  val: string | SuggestOption
): boolean => getOptionLabel(option).toLowerCase() === getOptionLabel(val).toLowerCase();

const renderDefaultGroupHeader = (group: string) => (
  <Typography variant="caption" sx={{ px: 2, py: 0.75, display: 'block' }}>
    {group}
  </Typography>
);

type SuggestOptionItemProps = {
  key: Key;
  option: string | SuggestOption;
};

function SuggestOptionItem({ option, ...liProps }: SuggestOptionItemProps) {
  const theme = useTheme();
  const optionData = typeof option === 'string' ? null : option;
  const label = optionData?.label ?? (typeof option === 'string' ? option : '');
  const isDisabled = optionData?.disabled ?? false;
  const tag = optionData?.tag;

  return (
    <li {...liProps}>
      <HStack sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Typography
          variant="body1"
          sx={{ color: isDisabled ? theme.palette.gray.border : 'inherit' }}
        >
          {label}
        </Typography>
        {isDisabled && tag && (
          <SquareChip
            label={tag}
            size="small"
            sx={{
              backgroundColor: theme.palette.gray.border,
              borderColor: theme.palette.gray.border,
              '& .MuiChip-label': { color: 'white.main' },
            }}
          />
        )}
      </HStack>
    </li>
  );
}

export function SuggestAutocomplete({
  options,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  renderGroupHeader,
  textFieldProps,
  ref,
}: SuggestAutocompleteProps) {
  const handleValueChange = (_event: SyntheticEvent, newValue: string | SuggestOption | null) => {
    if (newValue === null) {
      onChange('');
      return;
    }
    onChange(getOptionLabel(newValue));
  };

  const handleInputChange = (_event: SyntheticEvent, newInputValue: string) => {
    onChange(newInputValue);
  };

  const renderGroup = (params: AutocompleteRenderGroupParams) => (
    <li key={params.key}>
      {(renderGroupHeader ?? renderDefaultGroupHeader)(params.group)}
      <ul style={{ padding: 0 }}>{params.children}</ul>
    </li>
  );

  const renderOption = (
    { key, ...liProps }: HTMLAttributes<HTMLLIElement> & { key: Key },
    option: string | SuggestOption
  ) => <SuggestOptionItem key={key} {...liProps} option={option} />;

  return (
    <MuiAutocomplete
      ref={ref}
      freeSolo
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionDisabled={getOptionDisabled}
      isOptionEqualToValue={isOptionEqualToValue}
      groupBy={getOptionGroup}
      value={value}
      onChange={handleValueChange}
      onInputChange={handleInputChange}
      slotProps={{ paper: { sx: PAPER_SX } }}
      renderGroup={renderGroup}
      renderOption={renderOption}
      renderInput={(params) => (
        <Input
          {...params}
          {...textFieldProps}
          slotProps={{
            ...textFieldProps?.slotProps,
            htmlInput: {
              ...params.inputProps,
              ...textFieldProps?.slotProps?.htmlInput,
            },
          }}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          size="small"
        />
      )}
    />
  );
}
