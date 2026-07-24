import type { ReactNode } from 'react';

import type { SxProps } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { subDays, subYears } from 'date-fns';
import { enUS } from 'date-fns/locale';
import DatePicker, { registerLocale, type DatePickerProps } from 'react-datepicker';

import { VStack } from '../../Stack';
import { CustomHeader } from './CustomHeader';

export type BasicDatePickerProps = DatePickerProps & {
  sx?: SxProps;
  footer?: ReactNode;
};

registerLocale('en', {
  ...enUS,
  options: {
    firstWeekContainsDate: 4,
    weekStartsOn: 0,
  },
});

const LABELS = {
  tooltipLabel:
    'Some dates do not occur in every month or year. If this happens, the system will automatically select the next available valid date.',
};

// 需要特殊处理的日期（月末日期）
const END_OF_MONTH_DAYS = [29, 30, 31];

export const BasicDatePicker = ({
  minDate = subYears(new Date(), 100),
  maxDate = subDays(new Date(), 1),
  monthsShown = 1,
  sx,
  footer,
  ...others
}: BasicDatePickerProps) => (
  <VStack
    sx={{
      // layout
      '--date-picker-main-color': (theme) => theme.palette.primary.main,
      '& .react-datepicker__triangle': { display: 'none' },
      '& .react-datepicker-wrapper': { width: '100%' },
      '& .react-datepicker': (theme) => ({
        border: 'unset',
        borderRadius: '6px',
        boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.20)',
        p: 5,
        display: 'flex',
        flexDirection: 'column',
        ...theme.typography.body1,
      }),
      '& .react-datepicker-popper': (theme) => ({
        zIndex: theme.zIndex.appBar + 2,
      }),
      // header
      '& .react-datepicker__header': {
        p: 0,
        bgcolor: 'common.white',
        borderBottom: 'unset',
      },
      // weekday names
      '& .react-datepicker__day-names': {
        mt: 2.5 + 3,
        mb: 3,
      },
      '& .react-datepicker__day-name': (theme) => ({
        width: 38,
        lineHeight: '18px',
        m: 0,
        color: theme.palette.primary.dark,
      }),
      // days container
      '& .react-datepicker__month': {
        display: 'flex',
        flexDirection: 'column',
        m: 0,
        gap: 4,
      },
      // selected range border radius
      '& .react-datepicker__week': {
        '& .react-datepicker__day--in-range, & .react-datepicker__day--in-selecting-range': {
          borderRadius: 0,
          '&:first-of-type': {
            borderTopLeftRadius: '5px',
            borderBottomLeftRadius: '5px',
          },
          '&:last-of-type': {
            borderTopRightRadius: '5px',
            borderBottomRightRadius: '5px',
          },
        },
        '& .react-datepicker__day--range-start, & .react-datepicker__day--selecting-range-start': {
          borderTopLeftRadius: '5px !important',
          borderBottomLeftRadius: '5px !important',
        },
        '& .react-datepicker__day--range-end, & .react-datepicker__day--selecting-range-end': {
          borderTopRightRadius: '5px !important',
          borderBottomRightRadius: '5px !important',
        },
      },
      // days
      '& .react-datepicker__day': {
        width: 38,
        lineHeight: '18px',
        m: 0,
        px: 2.5,
        py: 1,
        color: 'text.primary',
        '&:not(.react-datepicker__day--disabled, .react-datepicker__day--today, .react-datepicker__day--selected, .react-datepicker__day--in-range, .react-datepicker__day--in-selecting-range):hover':
          {
            width: 26,
            height: 26,
            px: 0,
            mx: 1.5,
            borderRadius: '5px',
            color: 'text.primary',
            bgcolor: 'gray.hover',
          },
      },
      // disabled
      '& .react-datepicker__day--disabled': {
        color: 'gray.disableDark',
        '&:hover': { color: 'gray.disableDark', bgcolor: 'transparent' },
      },
      // selected single
      '& .react-datepicker__day.react-datepicker__day--selected:not(.react-datepicker__day--in-selecting-range, .react-datepicker__day--selecting-range-start, .react-datepicker__day--in-range)':
        {
          width: 26,
          height: 26,
          px: 0,
          mx: 1.5,
          borderRadius: '5px',
          color: 'common.white',
          bgcolor: 'var(--date-picker-main-color)',
        },
      // selected range
      '& .react-datepicker__day--in-range, & .react-datepicker__day--in-selecting-range, & .react-datepicker__day--keyboard-selected':
        {
          position: 'relative',
          width: 38,
          m: 0,
          px: 2.5,
          py: 1,
          color: 'common.white',
          bgcolor: 'var(--date-picker-main-color)',
          borderRadius: 'unset',
          '&:hover': {
            color: 'common.white',
            bgcolor: 'var(--date-picker-main-color)',
            borderRadius: 'unset',
          },
          '&:empty': {
            p: 0,
            bgcolor: 'unset',
            cursor: 'default',
          },
          '&.react-datepicker__day--range-start.react-datepicker__day--range-end': {
            width: 26,
            px: 0,
            mx: 1.5,
          },
          '&.react-datepicker__day--today': {
            m: 0,
            color: 'common.white',
            border: 'none',
            lineHeight: '18px',
            '&:hover': {
              color: 'common.white',
              bgcolor: 'var(--date-picker-main-color)',
              borderRadius: 'unset',
            },
          },
        },
      // other styles
      '& .react-datepicker__day--outside-month': { visibility: 'hidden' },
      '& .react-datepicker__day--today': {
        width: 26,
        height: 26,
        lineHeight: 1,
        fontWeight: 'unset',
        px: 0,
        mx: 1.5,
        color: 'var(--date-picker-main-color)',
        border: '1px solid',
        borderColor: 'var(--date-picker-main-color)',
        borderRadius: '5px',
        '&:empty': {
          border: 'unset',
        },
        '&:hover': {
          color: 'var(--date-picker-main-color)',
        },
        '&.react-datepicker__day--disabled': {
          color: 'gray.disableDark',
          border: 'unset',
        },
      },
      '& .react-datepicker__children-container': {
        width: '100%',
        margin: 0,
        padding: 0,
        height: '100%',
      },
      ...sx,
    }}
  >
    <DatePicker
      renderCustomHeader={(props) => (
        <CustomHeader minDate={minDate} maxDate={maxDate} monthsShown={monthsShown} {...props} />
      )}
      minDate={minDate}
      maxDate={maxDate}
      locale="en"
      disabledKeyboardNavigation
      yearItemNumber={100}
      monthsShown={monthsShown}
      renderDayContents={(day) => {
        if (END_OF_MONTH_DAYS.includes(day)) {
          return (
            <Tooltip title={LABELS.tooltipLabel} placement="top">
              <div>{day}</div>
            </Tooltip>
          );
        }
        return day;
      }}
      {...others}
    >
      {footer}
    </DatePicker>
  </VStack>
);
