import type { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';

import { BasicDatePicker, DatePickerCustomInput } from '../DatePicker';
import { QuickRangeList } from './QuickRangeList';
import type { DatePickerWithQuickRangeProps, RangeItem } from './types';

export type { DatePickerWithQuickRangeProps, RangeItem };

export const DatePickerWithQuickRange = ({
  startDate,
  endDate,
  onChange,
  quickRangeList,
  selectedQuickRange,
  onQuickRangeSelect,
  disabled = false,
  minDate,
  maxDate,
  sx,
  datePickerSx,
  onCalendarClose,
}: DatePickerWithQuickRangeProps) => {
  const CalendarContainer = quickRangeList
    ? ({ children }: PropsWithChildren) => (
        <QuickRangeList
          list={quickRangeList}
          selectedQuickRange={selectedQuickRange}
          onQuickRangeSelect={onQuickRangeSelect}
        >
          {children}
        </QuickRangeList>
      )
    : undefined;

  return (
    <Stack sx={{ position: 'relative', gap: 8, ...sx }}>
      <BasicDatePicker
        selected={startDate}
        // TODO: need to modify this
        openToDate={startDate ?? undefined}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange={true}
        customInput={<DatePickerCustomInput />}
        calendarContainer={CalendarContainer}
        shouldCloseOnSelect={false}
        popperPlacement="top-end"
        sx={datePickerSx}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        onCalendarClose={onCalendarClose}
      />
    </Stack>
  );
};
