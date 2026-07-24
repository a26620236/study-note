import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import TooltipItem from '@app/(main)/components/TooltipItem';
import { Currency, currencyMap } from '@constants';

interface ServiceData {
  name: string;
  value: number;
  color: string;
}

export interface TooltipData {
  date: string;
  services: ServiceData[];
}

interface CostByTop10SpendingServicesTooltipProps {
  data: TooltipData;
}

const TOOLTIP_STYLES = {
  WRAPPER: {
    width: '300px',
    gap: 8,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
  },
  TITLE: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: theme.palette.text.primary,
  },
  LIST: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  DIVIDER: {
    height: 1,
    backgroundColor: theme.palette.gray.border,
  },
} as const;

export function CostByTop10SpendingServicesTooltip({
  data,
}: CostByTop10SpendingServicesTooltipProps) {
  const { date, services } = data;

  return (
    <VStack style={TOOLTIP_STYLES.WRAPPER}>
      <Typography variant="caption" style={TOOLTIP_STYLES.TITLE}>
        {date}
      </Typography>
      <Box style={TOOLTIP_STYLES.DIVIDER} />
      <VStack style={TOOLTIP_STYLES.LIST}>
        {services.map((service) => (
          <TooltipItem
            key={service.name}
            label={service.name}
            value={service.value}
            color={service.color}
            currencySymbol={currencyMap[Currency.USD].symbol}
            markType="circle"
          />
        ))}
      </VStack>
    </VStack>
  );
}
