'use client';

import { Typography } from '@mui/material';

import { Button, DatePickerWithQuickRange, HStack, Icon } from '@lumiture-ui';

import { initializeDate } from '../../utils/initializeDate';

const LABELS = {
  title: 'Cost Dashboard',
};

export const CostDashboardHeaderSkeleton = () => {
  const { startDate, endDate } = initializeDate();

  return (
    <HStack alignItems="center" justifyContent="space-between" width="100%">
      <Typography variant="h4">{LABELS.title}</Typography>
      {/* datepicker */}
      <HStack gap={4}>
        <DatePickerWithQuickRange
          disabled={true}
          selectsRange={true}
          // onChange 回傳的 dates 可以是 [date, null], 但 startDate 和 endDate 卻不能接受 null, 所以需要這樣處理
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onChange={() => {}}
        />
        {/* drawer button */}
        <Button
          variant="outlined"
          sx={{
            width: 36,
            minWidth: 'unset',
            backgroundColor: 'inherit',
          }}
          disabled={true}
        >
          <Icon name="tune" />
        </Button>
      </HStack>
    </HStack>
  );
};
