import { forwardRef } from 'react';

import FormControl, { type FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Tooltip, { type TooltipProps } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { isNil, negate } from 'lodash-es';

import { Icon } from '../../Icon';

interface StyledButtonProps {
  disabled?: boolean;
  error?: boolean;
  children: React.ReactNode;
  sx?: SxProps;
}

type DatePickerCustomInputProps = FormControlProps & {
  className?: string;
  value?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  error?: boolean;
  formatter?: (date: Date) => string;
  helperText?: string;
  sx?: SxProps;
  tooltip?: TooltipProps['title'];
};

const isNotNil = negate(isNil);

const StyledButton = ({
  disabled = false,
  error = false,
  children,
  sx = {},
}: StyledButtonProps) => {
  const disabledStyles = disabled
    ? {
        color: 'text.hint',
        borderColor: 'gray.borderLight',
        bgcolor: 'gray.disableLight',
        '&.MuiStack-root': { pointerEvents: 'none' },
        '& .calendarIcon': { color: '#D9D9D9' },
        '& .hyphenIcon': { color: 'gray.disableDark' },
      }
    : {};

  const errorStyles = error
    ? {
        borderColor: 'error.main',
        '&:hover': { borderColor: 'error.main' },
        '&:active': { borderColor: 'error.main' },
      }
    : {};

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        gap: 2,
        height: 36,
        px: 4,
        color: 'text.secondary',
        border: '1px solid',
        borderColor: 'gray.border',
        bgcolor: 'common.white',
        borderRadius: '6px',
        outline: 'unset',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'gray.hover',
          borderColor: 'gray.border',
        },
        '&:active': {
          bgcolor: 'gray.selected',
          borderColor: 'gray.border',
        },
        '& .calendarIcon': {
          fontSize: 20,
          color: 'text.secondary',
        },
        '& .hyphenIcon': {
          fontSize: 16,
          color: 'text.hint',
        },
        ...disabledStyles,
        ...errorStyles,
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
};

export const DatePickerCustomInput = forwardRef<HTMLDivElement, DatePickerCustomInputProps>(
  function Render(props, ref) {
    const shadowProps = props as DatePickerCustomInputProps;
    const { className, disabled, value, onClick, error, formatter, helperText, sx, tooltip } =
      shadowProps;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
    const [startDate, endDate] = (value ? value.split(' - ') : ['', '']) as [string, string];

    const typographyStyle = {
      textAlign: 'center',
      minWidth: 80,
    };

    const formatDate = (date: string) => {
      if (!date) return 'd MM yyyy';
      if (typeof formatter === 'function') return formatter(new Date(date));
      return format(new Date(date), 'dd MMM. yyyy');
    };

    return (
      <Tooltip title={tooltip}>
        <FormControl ref={ref} className={className} onClick={onClick} sx={{ width: '100%' }}>
          <StyledButton disabled={disabled} error={error} sx={sx}>
            <Icon className="calendarIcon" name="event" />
            <Stack direction="row" alignItems="center" sx={{ m: 'auto', gap: 2 }}>
              <Typography sx={typographyStyle}>{formatDate(startDate)}</Typography>
              {isNotNil(endDate) && (
                <>
                  <Icon className="hyphenIcon" name="east" sx={{ fontSize: 16 }} />
                  <Typography sx={typographyStyle}>{formatDate(endDate)}</Typography>
                </>
              )}
            </Stack>
          </StyledButton>
          {error && helperText && <FormHelperText error>{helperText}</FormHelperText>}
        </FormControl>
      </Tooltip>
    );
  }
);
