import Image from 'next/image';

import Stack from '@mui/material/Stack';
import { alpha, type Theme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { keyBy } from 'lodash-es';

import { Icon } from '@lumiture-ui';

import { currencyOptions, type CurrencyCode } from '@constants';

interface SelectInputProps {
  disabled: boolean;
  isOpen: boolean;
  currency: CurrencyCode;
}

const TooltipTitle = () => (
  <Stack>
    <Typography>
      Please note that due to exchange rate conversions and data latency in the console, the
      displayed numbers may slightly differ from those in the console. The actual amount should be
      based on your received invoice.
    </Typography>
    <Typography color="common.white">
      (Exchange rate source:{' '}
      <a
        href="https://rter.info/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit' }}
      >
        https://rter.info/
      </a>
      )
    </Typography>
  </Stack>
);
const SelectInput = ({ disabled, isOpen, currency }: SelectInputProps) => {
  const currencyMap = keyBy(currencyOptions, 'value');

  const styles = disabled
    ? {
        filter: 'opacity(0.32)',
        cursor: 'default',
      }
    : {
        cursor: 'pointer',
        '&:hover': { bgcolor: (theme: Theme) => alpha(theme.palette.text.secondary, 0.12) },
      };

  return (
    <Tooltip
      title={disabled || isOpen ? '' : <TooltipTitle />}
      placement="bottom-end"
      disableInteractive={false}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          pl: 2,
          py: 1,
          borderRadius: '4px',
          opacity: disabled ? 0.5 : 1,
          ...styles,
        }}
      >
        <Stack sx={{ borderRadius: '100%', border: '1px solid', borderColor: 'gray.border' }}>
          <Image
            src={currencyMap[currency].iconUrl}
            alt={currencyMap[currency].label}
            width={14}
            height={14}
          />
        </Stack>
        <Typography color="text.secondary" sx={{ lineHeight: 1, ml: 1 }}>
          {currency}
        </Typography>
        <Icon
          name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
          sx={(theme) => ({ color: alpha(theme.palette.common.black, 0.54) })}
        />
      </Stack>
    </Tooltip>
  );
};

export default SelectInput;
