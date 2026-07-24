'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { sendGAEvent } from '@next/third-parties/google';
import { addDays, endOfMonth, format, isAfter, startOfMonth, subDays, subMonths } from 'date-fns';

import { Button, DatePickerWithQuickRange, HStack, Icon, type RangeItem } from '@lumiture-ui';

import { EVENT_COST_DASHBOARD, type PlatformsValue } from '@constants';
import { useSinglePlatformResourceStatus } from '@hooks';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

const LABELS = {
  title: 'Cost Dashboard',
};

type Dates = [Date | null, Date | null];

const CUSTOM_SELECT_TYPE = 'custom';

// 寬鬆的一年半 365 + 190 = 555
const ONE_AND_HALF_YEARS = 555;

const QUICK_RANGE_LIST: RangeItem[] = [
  { label: 'last30Days', value: 'Last 30 Days' },
  { label: 'last7Days', value: 'Last 7 Days' },
  { label: 'lastMonth', value: 'Last Month' },
  { label: 'thisMonth', value: 'This Month' },
];

const DEFAULT_SELECTED_LABEL = QUICK_RANGE_LIST[0].label;

export const CostDashboardHeader = () => {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const theme = useTheme();

  const {
    [platform]: platformFilter,
    handleSetFilter,
    isDrawerOpen,
    handleDrawerToggle,
  } = useCostDashboardStore((state) => state);

  const [tempDates, setTempDates] = useState<Dates | undefined>(undefined);
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>(DEFAULT_SELECTED_LABEL);

  const { isLoading, isEmpty } = useSinglePlatformResourceStatus({ platform });

  const handleDateChange = (dates: Dates) => {
    setTempDates(dates);
    setSelectedLabel(undefined);
  };

  const handleCalendarClose = () => {
    if (!tempDates?.[0] || !tempDates[1]) {
      setTempDates(undefined);
      return;
    }
    sendGAEvent('event', EVENT_COST_DASHBOARD.SELECT_DATE, { type: CUSTOM_SELECT_TYPE });
    handleSetFilter(platform, {
      startDate: format(tempDates[0], 'yyyy-MM-dd'),
      endDate: format(tempDates[1], 'yyyy-MM-dd'),
    });
    setTempDates(undefined);
  };

  const handleQuickRangeSelect = (label: string) => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const dateMap: Partial<Record<string, [Date, Date]>> = {
      last30Days: [subDays(today, 30), yesterday],
      last7Days: [subDays(today, 7), yesterday],
      lastMonth: [startOfMonth(subMonths(today, 1)), endOfMonth(subMonths(today, 1))],
      thisMonth: [startOfMonth(today), yesterday],
    };
    const dates = dateMap[label];
    if (!dates) return;
    setSelectedLabel(label);
    setTempDates(dates);
  };

  // 確保結束日期不會超過起始日期 1.5 年,也不會超過昨天
  const maxDate = (() => {
    const parsedStartDate = new Date(platformFilter.startDate);
    const pastYearAndHalf = addDays(parsedStartDate, ONE_AND_HALF_YEARS);
    const yesterday = subDays(new Date(), 1);

    return isAfter(pastYearAndHalf, yesterday) ? yesterday : pastYearAndHalf;
  })();

  return (
    <HStack alignItems="center" justifyContent="space-between" width="100%">
      <Typography variant="h4">{LABELS.title}</Typography>
      {/* datepicker */}
      <HStack gap={4}>
        <DatePickerWithQuickRange
          dataTestId={`${platform}-date-picker`}
          selectsRange={true}
          disabled={isLoading || isEmpty}
          // onChange 回傳的 dates 可以是 [date, null], 但 startDate 和 endDate 卻不能接受 null, 所以需要這樣處理
          startDate={tempDates ? (tempDates[0] ?? undefined) : new Date(platformFilter.startDate)}
          endDate={tempDates ? (tempDates[1] ?? undefined) : new Date(platformFilter.endDate)}
          onChange={handleDateChange}
          quickRangeList={QUICK_RANGE_LIST}
          selectedQuickRange={selectedLabel}
          onQuickRangeSelect={handleQuickRangeSelect}
          maxDate={maxDate}
          onCalendarClose={handleCalendarClose}
        />
        {/* drawer button */}
        <Tooltip title="Toggle Dashboard Configuration">
          <Box>
            <Button
              data-testid={`${platform}-drawer-button`}
              variant="outlined"
              sx={{
                width: 36,
                minWidth: 'unset',
                backgroundColor: isDrawerOpen ? theme.palette.primary.light20 : 'inherit',
              }}
              onClick={() => handleDrawerToggle(!isDrawerOpen)}
              disabled={isLoading || isEmpty}
            >
              <Icon name="tune" />
            </Button>
          </Box>
        </Tooltip>
      </HStack>
    </HStack>
  );
};
