'use client';

import { useState } from 'react';

import { MonthPicker } from '@lumiture-ui';

import {
  getMaxSelectableDate,
  useExecutiveInsightsStore,
} from '../hooks/useExecutiveInsightsStore';

export function ExecutiveInsightsMonthPicker({ disabled = false }: { disabled?: boolean }) {
  const { selectedDate, setSelectedDate } = useExecutiveInsightsStore();
  const [tempDate, setTempDate] = useState(selectedDate);
  const maxSelectableDate = getMaxSelectableDate();

  const handleDateChange = (date: Date | null) => date && setTempDate(date);
  const handleReset = () => setTempDate(maxSelectableDate);
  const handleApply = () => setSelectedDate(tempDate);
  const handleCalendarClose = () => setTempDate(selectedDate);

  return (
    <MonthPicker
      maxDate={maxSelectableDate}
      selected={tempDate}
      onChange={handleDateChange}
      onReset={handleReset}
      onApply={handleApply}
      onCalendarClose={handleCalendarClose}
      shouldCloseOnSelect={false}
      tooltip={null}
      disabled={disabled}
    />
  );
}
