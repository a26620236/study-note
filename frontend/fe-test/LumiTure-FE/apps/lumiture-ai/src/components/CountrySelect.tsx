import * as React from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent, type SelectProps } from '@mui/material/Select';
import { getCode, getNames } from 'country-list';

const countryNames = getNames();

const getFlagEmoji = (countryCode: string) =>
  countryCode.replace(/./gu, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const countryNameModifier = (countryName: string) => {
  if (getCode(countryName) === 'TW') {
    return 'Taiwan';
  }
  return countryName;
};

interface CountrySelectProps {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  onBlur: () => void;
  error?: boolean;
  helperText?: string;
  size?: SelectProps['size'];
}

const CountrySelect = ({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  size,
}: CountrySelectProps) => (
  <FormControl required fullWidth size="small" margin="normal" error={error}>
    <InputLabel id="country" shrink>
      Country / Region
    </InputLabel>
    <Select
      labelId="country"
      label="Country / Region"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      size={size}
      MenuProps={{
        anchorOrigin: {
          vertical: 'center',
          horizontal: 'center',
        },
        transformOrigin: {
          vertical: 'center',
          horizontal: 'center',
        },
      }}
    >
      {countryNames.map((countryName) => {
        const countryCode = getCode(countryName);
        const flagEmoji = countryCode ? `${getFlagEmoji(countryCode)} ` : '';
        return (
          <MenuItem key={countryCode} value={countryCode}>
            {flagEmoji}
            {countryNameModifier(countryName)}
          </MenuItem>
        );
      })}
    </Select>
    {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
  </FormControl>
);

export default CountrySelect;
