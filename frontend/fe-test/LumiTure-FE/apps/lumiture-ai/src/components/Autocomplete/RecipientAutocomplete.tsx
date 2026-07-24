import React, { useMemo, useRef, useState } from 'react';

import Autocomplete, {
  type AutocompleteChangeReason,
  type AutocompleteInputChangeReason,
  type AutocompleteProps,
} from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { compact, difference, some, trim, uniqBy } from 'lodash-es';

import { Icon, SquareChip } from '@lumiture-ui';
import { useToggle } from '@shared/hooks';

export interface Recipient {
  id: string;
  name: string;
  email: string;
}

export interface RecipientAutocompleteProps
  extends Omit<
    AutocompleteProps<Recipient, true, false, false>,
    'value' | 'onChange' | 'renderInput'
  > {
  value: Recipient[];
  onChange: (options: Recipient[]) => void;
  onBlurCallback?: (inputValue: string) => void;
  label?: TextFieldProps['label'];
  placeholder?: TextFieldProps['placeholder'];
  error?: TextFieldProps['error'];
  helperText?: TextFieldProps['helperText'];
}

interface HighlightPart {
  text: string;
  highlight: boolean;
}

const getLastInputSegment = (value: string) =>
  value.replace(/,+$/u, '').split(',').at(-1)?.trim().toLowerCase();

const parseHighlightParts = (str: string, searchQuery?: string): HighlightPart[] => {
  if (!str.trim()) return [{ text: '(Inactive)', highlight: false }];
  if (!searchQuery) return [{ text: str, highlight: false }];
  return parse(str, match(str, searchQuery, { insideWords: true }));
};

const getUserKey = (user: { name: string; email: string }) =>
  `${user.name}${user.email}`.toLowerCase();

const RecipientAutocomplete = ({
  options: users,
  value: recipients,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onBlurCallback = () => {},
  label,
  placeholder,
  error,
  helperText,
  limitTags = 10,
  ...otherProps
}: RecipientAutocompleteProps) => {
  const [isOpen, { handleOpen, handleClose }] = useToggle();
  const [inputValue, setInputValue] = useState<string>('');

  const isPasteTriggeredRef = useRef<boolean>(false);

  const recipientMapByEmail = useMemo(
    () => new Map(users.map((user) => [user.email, user])),
    [users]
  );

  const handleInputPaste = (event: React.ClipboardEvent) => {
    const pastedData = event.clipboardData.getData('text');
    const pastedEmails: string[] = compact(pastedData.split(',').map(trim));

    const matchedRecipients: Recipient[] = [];

    pastedEmails.forEach((email) => {
      const user = recipientMapByEmail.get(email);
      if (user) {
        matchedRecipients.push(user);
      }
    });

    isPasteTriggeredRef.current = true;

    onChange(uniqBy([...recipients, ...matchedRecipients], 'email'));
  };

  const handleInputChange = (
    event: React.SyntheticEvent,
    searchValue: string,
    reason: AutocompleteInputChangeReason
  ) => {
    if (reason === 'selectOption') {
      return;
    }

    const dedupSearchValue = isPasteTriggeredRef.current
      ? difference(
          searchValue.split(',').map(trim),
          recipients.map(({ email }) => email)
        ).join(',')
      : searchValue;

    setInputValue(dedupSearchValue);

    isPasteTriggeredRef.current = false;
  };

  const handleBlur = () => {
    handleClose();
    onBlurCallback(inputValue);
  };

  const handleSelectionChange = (
    event: React.SyntheticEvent,
    value: Recipient[],
    reason: AutocompleteChangeReason
  ) => {
    onChange(value);

    const currentInput = compact(inputValue.split(',')).slice(0, -1).join(',');

    if (reason === 'removeOption') {
      return;
    }

    setInputValue(currentInput);
  };

  const renderHighlightedText = (part: HighlightPart, index: number) => (
    <Box
      key={index}
      component="span"
      sx={{
        fontWeight: part.highlight ? 700 : 400,
      }}
    >
      {part.text}
    </Box>
  );

  return (
    <Autocomplete
      sx={{
        '& .MuiInputBase-root': { height: 'unset', minHeight: 36, py: 0 },
      }}
      multiple={true}
      autoHighlight={true}
      clearOnBlur={false}
      selectOnFocus={false}
      renderInput={(params) => {
        const { InputProps, inputProps, InputLabelProps, ...restParams } = params;
        return (
          <TextField
            {...restParams}
            onPaste={handleInputPaste}
            onFocus={handleOpen}
            onBlur={handleBlur}
            slotProps={{
              input: InputProps,
              htmlInput: inputProps,
              inputLabel: InputLabelProps,
            }}
            size="small"
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
          />
        );
      }}
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...others } = getTagProps({ index });

          return (
            <SquareChip
              key={key}
              {...others}
              size="ex-small"
              color="primary"
              label={option.email}
            />
          );
        })
      }
      renderOption={(props, option, { inputValue }) => {
        const lastSearchValue = getLastInputSegment(inputValue);
        const nameParts = parseHighlightParts(option.name, lastSearchValue);
        const emailParts = parseHighlightParts(option.email, lastSearchValue);

        return (
          <Stack component="li" {...props}>
            <Typography>{nameParts.map(renderHighlightedText)}</Typography>
            <Typography variant="caption" color="text.secondary">
              {emailParts.map(renderHighlightedText)}
            </Typography>
          </Stack>
        );
      }}
      limitTags={limitTags}
      options={users}
      getOptionLabel={(option) => option.email}
      getOptionDisabled={(option) => some(recipients, { email: option.email })}
      filterOptions={(options) => {
        if (!inputValue) return [...users];

        const lastInputSegment = getLastInputSegment(inputValue) || '';

        const filteredOptions = options
          .filter((option) => getUserKey(option).includes(lastInputSegment))
          .sort((a, b) => {
            const searchIndexA = getUserKey(a).indexOf(lastInputSegment);
            const searchIndexB = getUserKey(b).indexOf(lastInputSegment);

            return searchIndexA - searchIndexB;
          });

        return lastInputSegment ? filteredOptions : [];
      }}
      clearIcon={<Icon name="cancel" />}
      open={isOpen}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      value={recipients}
      onChange={handleSelectionChange}
      loadingText={
        <Stack sx={{ minHeight: 300 }}>
          <CircularProgress sx={{ m: 'auto' }} />
        </Stack>
      }
      {...otherProps}
    />
  );
};

export default RecipientAutocomplete;
