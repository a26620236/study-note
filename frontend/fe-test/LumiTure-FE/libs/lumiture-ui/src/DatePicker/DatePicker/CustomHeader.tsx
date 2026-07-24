import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  addYears,
  format,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  subDays,
  subYears,
} from 'date-fns';
import type { DatePickerProps, ReactDatePickerCustomHeaderProps } from 'react-datepicker';

import { Icon } from '../../Icon';

export type CustomHeaderProps = ReactDatePickerCustomHeaderProps & {
  minDate: DatePickerProps['minDate'];
  maxDate: DatePickerProps['maxDate'];
  monthsShown: DatePickerProps['monthsShown'];
  showMonthChangeButtons?: boolean;
};

export const CustomHeader = ({
  minDate = subYears(new Date(), 100),
  maxDate = subDays(new Date(), 1),
  monthsShown = 1,
  showMonthChangeButtons = true,
  ...others
}: CustomHeaderProps) => {
  const {
    monthDate,
    customHeaderCount,
    changeYear,
    changeMonth,
    decreaseYear,
    increaseYear,
    decreaseMonth,
    increaseMonth,
    prevYearButtonDisabled,
    nextYearButtonDisabled,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  } = others;
  const isFirstCustomHeader = customHeaderCount === 0;
  const isLastCustomHeader = customHeaderCount === monthsShown - 1;
  const iconButtonStyle = {
    minWidth: 20,
    p: 0,
    color: 'var(--date-picker-icon-button_color, var(--date-picker-main-color))',
  };

  const handleDecreaseYear = () => {
    const isBeforeMinDate = isBefore(subYears(monthDate, 1), minDate);

    if (isBeforeMinDate) {
      changeYear(getYear(minDate));
      changeMonth(getMonth(minDate));
    } else {
      decreaseYear();
    }
  };
  const handleIncreaseYear = () => {
    const isAfterMaxDate = isAfter(addYears(monthDate, 1), maxDate);

    if (isAfterMaxDate) {
      changeYear(getYear(maxDate));
      changeMonth(getMonth(maxDate));
    } else {
      increaseYear();
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        height: 36,
        pb: 2.5,
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'gray.border',
      }}
    >
      {isFirstCustomHeader && (
        <Box>
          <IconButton
            onClick={handleDecreaseYear}
            disabled={prevYearButtonDisabled}
            sx={iconButtonStyle}
            className="prevYear"
          >
            <Icon name="keyboard_double_arrow_left" />
          </IconButton>

          {showMonthChangeButtons && (
            <IconButton
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              sx={iconButtonStyle}
            >
              <Icon name="keyboard_arrow_left" />
            </IconButton>
          )}
        </Box>
      )}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          gap: 2,
          m: 'auto',
          cursor: 'inherit',
        }}
      >
        <Typography variant="h6">{format(monthDate, 'MMM yyyy')}</Typography>
      </Stack>
      {isLastCustomHeader && (
        <Box>
          {showMonthChangeButtons && (
            <IconButton
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              sx={iconButtonStyle}
            >
              <Icon name="keyboard_arrow_right" />
            </IconButton>
          )}
          <IconButton
            onClick={handleIncreaseYear}
            disabled={nextYearButtonDisabled}
            sx={iconButtonStyle}
          >
            <Icon name="keyboard_double_arrow_right" />
          </IconButton>
        </Box>
      )}
    </Stack>
  );
};
