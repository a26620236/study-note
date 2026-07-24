import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { Controller, useFormContext } from 'react-hook-form';

import { availablePlatforms, FORM_ID } from '@app/(main)/budget/customized/components/constants';
import type {
  AvailablePlatform,
  CustomBudgetForm,
} from '@app/(main)/budget/customized/components/types';
import { PLATFORM_CONFIG } from '@constants';
import { useGetPlatformResourceEmptyStatusMap } from '@hooks';

interface PlatformSelectProps {
  ruleIndex: number;
}

const PlatformSelect = ({ ruleIndex }: PlatformSelectProps) => {
  const { control } = useFormContext<CustomBudgetForm>();

  const { platformResourceEmptyStatusMap } = useGetPlatformResourceEmptyStatusMap();

  const platformOptions = availablePlatforms.filter(
    (platform) => !platformResourceEmptyStatusMap[platform]
  );

  const renderValue = (platform: AvailablePlatform) => {
    const PlatformIcon = PLATFORM_CONFIG[platform].icon;
    const { label } = PLATFORM_CONFIG[platform];
    return (
      <Stack direction="row" alignItems="center" gap={1}>
        <PlatformIcon />
        {label}
      </Stack>
    );
  };

  return (
    <FormControl>
      <Controller
        control={control}
        name={`${FORM_ID.RULES}.${ruleIndex}.platform`}
        render={({ field }) => (
          <Select
            {...field}
            value={field.value}
            onChange={(event: SelectChangeEvent<AvailablePlatform>) => {
              field.onChange(event.target.value);
            }}
            renderValue={renderValue}
            sx={{ minWidth: 200 }}
          >
            {platformOptions.map((platform) => {
              const PlatformIcon = PLATFORM_CONFIG[platform].icon;
              const { label } = PLATFORM_CONFIG[platform];
              return (
                <MenuItem key={platform} value={platform}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <PlatformIcon />
                    {label}
                  </Stack>
                </MenuItem>
              );
            })}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default PlatformSelect;
