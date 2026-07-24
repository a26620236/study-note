'use client';

import { useEffect, useState } from 'react';

import { endOfMonth, format, startOfMonth, subDays, subMonths } from 'date-fns';

import { DatePickerWithQuickRange } from '@lumiture-ui';

import { DATE_QUICK_RANGE_LIST } from '../../constants/auditLog';
import { useUserActivityStore } from '../../hooks/useUserActivityStore';

export function UserActivityDateFilter() {
  const { filters, setFilters } = useUserActivityStore();

  const today = new Date();
  const minDate = subMonths(today, 13);
  const maxDate = today;

  const [tempDates, setTempDates] = useState<[Date | null, Date | null] | undefined>(undefined);
  const [dateQuickRange, setDateQuickRange] = useState<string | undefined>(
    DATE_QUICK_RANGE_LIST[0].label
  );

  useEffect(() => {
    setTempDates(undefined);
    setDateQuickRange(DATE_QUICK_RANGE_LIST[0].label);
  }, [filters.startDate, filters.endDate]);

  const handleDatesChange = ([start, end]: [Date | null, Date | null]) => {
    setTempDates([start, end]);
    setDateQuickRange(undefined);
  };

  const handleQuickRangeSelect = (label: string) => {
    const dateMap: Partial<Record<string, [Date, Date]>> = {
      allTime: [minDate, maxDate],
      last1Day: [maxDate, maxDate],
      last7Days: [subDays(maxDate, 7), maxDate],
      lastMonth: [startOfMonth(subMonths(maxDate, 1)), endOfMonth(subMonths(maxDate, 1))],
    };
    const dates = dateMap[label];
    if (!dates) return;
    setDateQuickRange(label);
    setTempDates(dates);
  };

  const handleCalendarClose = () => {
    if (!tempDates) return;
    const [start, end] = tempDates;
    if (start && end) {
      setFilters({
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      });
    }
    setTempDates(undefined);
  };

  return (
    <DatePickerWithQuickRange
      selectsRange={true}
      startDate={tempDates ? (tempDates[0] ?? undefined) : new Date(filters.startDate ?? '')}
      endDate={tempDates ? (tempDates[1] ?? undefined) : new Date(filters.endDate ?? '')}
      onChange={handleDatesChange}
      quickRangeList={DATE_QUICK_RANGE_LIST}
      selectedQuickRange={dateQuickRange}
      onQuickRangeSelect={handleQuickRangeSelect}
      onCalendarClose={handleCalendarClose}
      minDate={minDate}
      maxDate={maxDate}
    />
  );
}
