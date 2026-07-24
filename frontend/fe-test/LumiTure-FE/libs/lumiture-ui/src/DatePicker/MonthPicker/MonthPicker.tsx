'use client';

import { useRef, type ReactNode } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import type { TooltipProps } from '@mui/material/Tooltip';
import { format, subDays, subYears } from 'date-fns';
import { enUS } from 'date-fns/locale';
import DatePicker, { registerLocale, type DatePickerProps } from 'react-datepicker';

import { Button } from '../../Button';
import { CustomHeader, DatePickerCustomInput } from '../DatePicker';

export type MonthPickerProps = DatePickerProps & {
  sx?: SxProps;
  onReset: () => void;
  onApply: () => void;
  tooltip?: TooltipProps['title'];
};

registerLocale('en', {
  ...enUS,
  options: {
    firstWeekContainsDate: 4,
    weekStartsOn: 0,
  },
});

interface PickerFooterProps {
  children: ReactNode;
  onReset: () => void;
  onClose: () => void;
  onApply: () => void;
}

const PickerFooter = ({ children, onReset, onClose, onApply }: PickerFooterProps) => (
  <Stack
    sx={{
      height: 320,
      borderRadius: '6px',
      boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.20)',
      bgcolor: 'common.white',
      p: 5,
    }}
  >
    {children}
    <Stack direction="row" sx={{ gap: 4 }}>
      <Button size="small" variant="link" sx={{ fontWeight: '700 !important' }} onClick={onReset}>
        Reset
      </Button>
      <Button
        size="small"
        variant="outlined"
        sx={{ ml: 'auto', minWidth: 'unset' }}
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button size="small" sx={{ minWidth: 'unset' }} onClick={onApply}>
        Apply
      </Button>
    </Stack>
  </Stack>
);

export const MonthPicker = ({
  minDate = subYears(new Date(), 100),
  maxDate = subDays(new Date(), 1),
  monthsShown = 1,
  sx,
  customInput,
  dateFormat = 'MMM. yyyy',
  onReset,
  onApply,
  tooltip = null,
  ...others
}: MonthPickerProps) => {
  const datePickerRef = useRef<DatePicker>(null);

  const renderMonthContent: DatePickerProps['renderMonthContent'] = (
    month,
    shortMonth,
    longMonth,
    day
  ) => {
    const fullYear = new Date(day).getFullYear();
    const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;
    return <span title={tooltipText}>{shortMonth}</span>;
  };

  const handleClose = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(false);
    }
  };

  const handleApply = () => {
    onApply();
    handleClose();
  };

  return (
    <Box
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

        // other styles
        '& .react-datepicker__month': {
          display: 'flex',
          flexDirection: 'column',
          m: (theme) => theme.spacing(4, 0),
          gap: 2,
        },

        '& .react-datepicker__month-text': {
          width: 80,
          height: 36,
          lineHeight: '36px',
          color: (theme) => theme.palette.text.secondary,
          fontWeight: 700,
        },

        '& .react-datepicker__month-text--selected': {
          color: (theme) => theme.palette.white.main,
          backgroundColor: (theme) => theme.palette.primary.main,
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.light,
          },
        },

        '& .react-datepicker__month-text--disabled': {
          color: (theme) => theme.palette.gray.disableDark,
        },
        ...sx,
      }}
    >
      <DatePicker
        ref={datePickerRef}
        popperPlacement="top-end"
        renderCustomHeader={(props) => (
          <CustomHeader
            minDate={minDate}
            maxDate={maxDate}
            monthsShown={monthsShown}
            showMonthChangeButtons={false}
            {...props}
          />
        )}
        calendarContainer={(props) => (
          <PickerFooter onReset={onReset} onClose={handleClose} onApply={handleApply}>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
            {props.children}
          </PickerFooter>
        )}
        minDate={minDate}
        maxDate={maxDate}
        locale="en"
        disabledKeyboardNavigation
        yearItemNumber={100}
        monthsShown={monthsShown}
        // month
        renderMonthContent={renderMonthContent}
        showMonthYearPicker
        customInput={
          customInput ?? (
            <DatePickerCustomInput
              formatter={(date) =>
                format(date, Array.isArray(dateFormat) ? dateFormat[0] : dateFormat)
              }
              tooltip={tooltip}
            />
          )
        }
        {...others}
      />
    </Box>
  );
};
