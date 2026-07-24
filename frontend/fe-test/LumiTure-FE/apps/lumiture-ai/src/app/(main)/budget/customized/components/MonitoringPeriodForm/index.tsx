import React, { useCallback, useEffect } from 'react';

import type { SxProps } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  addMonths,
  addYears,
  endOfYear,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import { isNil } from 'lodash-es';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { BasicDatePicker, DatePickerCustomInput } from '@lumiture-ui';

import { FORM_ID, PERIOD_OPTIONS } from '@app/(main)/budget/customized/components/constants';
import PeriodInfo from '@app/(main)/budget/customized/components/MonitoringPeriodForm/PeriodInfo';
import usePeriodInfo from '@app/(main)/budget/customized/components/MonitoringPeriodForm/usePeriodInfo';
import type {
  CustomBudgetForm,
  DateItem,
  Dates,
  MonitoringPeriod,
} from '@app/(main)/budget/customized/components/types';

const MonitoringPeriodForm = ({ sx, disabled }: { sx?: SxProps; disabled: boolean }) => {
  const { control, setValue } = useFormContext<CustomBudgetForm>();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const monitoringPeriod = useWatch({ name: FORM_ID.PERIOD }) as MonitoringPeriod;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const startDate = useWatch({ name: FORM_ID.START_DATE }) as DateItem;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const endDate = useWatch({ name: FORM_ID.END_DATE }) as DateItem;

  const { isDaily, isMonthly, isYearly, isCustomized } = usePeriodInfo();

  const minDate = (() => {
    if (isDaily) {
      return new Date();
    }
    if (isMonthly) {
      return subMonths(new Date(), 1);
    }
    return subYears(new Date(), 1);
  })();
  const handleFormatEndDate = useCallback(
    (startDate: DateItem, endDate: DateItem): DateItem => {
      if (isDaily) {
        return startDate;
      }
      if (isMonthly) {
        return startDate ? subDays(addMonths(startDate, 1), 1) : null;
      }
      if (isYearly) {
        return startDate ? subDays(addYears(startDate, 1), 1) : null;
      }

      return endDate;
    },
    [isDaily, isMonthly, isYearly]
  );

  const handleUpdateTempDatePeriod = (dates: Dates | DateItem) => {
    const [selectedStartDate, selectedEndDate]: Dates = Array.isArray(dates)
      ? dates
      : [dates, null];

    const formattedEndDate = handleFormatEndDate(selectedStartDate, selectedEndDate);

    setValue(FORM_ID.START_DATE, selectedStartDate);
    setValue(FORM_ID.END_DATE, formattedEndDate);
  };
  const handleCalendarClose = () => {
    if (isCustomized && isNil(endDate) && startDate) {
      setValue(FORM_ID.END_DATE, startDate);
    }
  };

  const datepickerProps = isCustomized
    ? ({
        startDate,
        endDate,
        selectsRange: true,
      } as const)
    : {};

  useEffect(() => {
    if (isDaily) {
      setValue(FORM_ID.START_DATE, new Date());
      setValue(FORM_ID.END_DATE, new Date());
    }
    if (isMonthly) {
      setValue(FORM_ID.START_DATE, new Date());
      setValue(FORM_ID.END_DATE, subDays(addMonths(new Date(), 1), 1));
    }
    if (isYearly) {
      setValue(FORM_ID.START_DATE, startOfYear(new Date()));
      setValue(FORM_ID.END_DATE, subDays(addYears(startOfYear(new Date()), 1), 1));
    }
    if (isCustomized) {
      setValue(FORM_ID.START_DATE, new Date());
      setValue(FORM_ID.END_DATE, subDays(addMonths(new Date(), 1), 1));
    }
  }, [monitoringPeriod, isDaily, isMonthly, isYearly, setValue, isCustomized]);

  return (
    <Stack sx={sx}>
      <InputLabel size="small">Monitoring Period</InputLabel>
      <Stack direction="row" alignContent="center" sx={{ gap: 4 }}>
        <Controller
          name={FORM_ID.PERIOD}
          control={control}
          render={({ field }) => (
            <Select disabled={disabled} {...field} sx={{ flex: '1.5 1 0' }}>
              {PERIOD_OPTIONS.map((_option) => (
                <MenuItem key={_option.value} value={_option.value}>
                  {_option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        <Stack direction="row" alignItems="center" sx={{ flex: '2 1 0', gap: 2 }}>
          {!isCustomized && <Typography sx={{ whiteSpace: 'nowrap' }}>Starts on</Typography>}
          <BasicDatePicker
            disabled={disabled}
            selected={startDate}
            openToDate={startDate ?? undefined}
            onChange={handleUpdateTempDatePeriod}
            onCalendarClose={handleCalendarClose}
            customInput={<DatePickerCustomInput />}
            shouldCloseOnSelect={false}
            popperPlacement="top-end"
            minDate={minDate}
            maxDate={endOfYear(addYears(new Date(), 3))}
            sx={{ flex: 1 }}
            {...datepickerProps}
          />
        </Stack>
      </Stack>
      <PeriodInfo />
    </Stack>
  );
};

export default MonitoringPeriodForm;
