import { useEffect } from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { Controller, useFormContext } from 'react-hook-form';

import GroupsSelect from '@app/(main)/budget/customized/components/BatchSettings/GroupsSelect';
import { CREATE_BY_OPTIONS, FORM_ID } from '@app/(main)/budget/customized/components/constants';
import type { CustomBudgetBatchForm } from '@app/(main)/budget/customized/components/types';
import { useGetPlatformResourceEmptyStatusMap } from '@hooks';

const BatchSettings = () => {
  const { control, watch, setValue } = useFormContext<CustomBudgetBatchForm>();
  const createBy = watch(`${FORM_ID.ALERT}.createdBy`);

  const { platformResourceEmptyStatusMap } = useGetPlatformResourceEmptyStatusMap();

  const options = CREATE_BY_OPTIONS.filter(
    (_option) => !_option.platform || !platformResourceEmptyStatusMap[_option.platform]
  );

  // option: Groups (all authorized platforms union groups)
  const allPlatforms = options
    .filter((_option) => !!_option.platform)
    .map((_option) => _option.platform);
  // another options
  const currentPlatform = options.find((_option) => _option.value === createBy)?.platform;

  useEffect(() => {
    setValue(`${FORM_ID.ALERT}.values`, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createBy]);

  return (
    <Paper>
      <Stack spacing={8}>
        {/* created by */}
        <FormControl>
          <InputLabel size="small">Batch create by</InputLabel>
          <Controller
            name={`${FORM_ID.ALERT}.createdBy`}
            control={control}
            render={({ field }) => (
              <Select {...field} sx={{ width: 200 }}>
                {options.map((_option) => (
                  <MenuItem key={_option.value} value={_option.value}>
                    {_option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        {/* groups */}
        <GroupsSelect platforms={currentPlatform ? [currentPlatform] : allPlatforms} />
      </Stack>
    </Paper>
  );
};

export default BatchSettings;
