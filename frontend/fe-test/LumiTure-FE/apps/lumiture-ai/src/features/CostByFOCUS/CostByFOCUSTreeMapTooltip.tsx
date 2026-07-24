'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import TooltipItem from '@app/(main)/components/TooltipItem';
import type { CurrencySymbol } from '@constants';

export interface TooltipData {
  name: string;
  value: number;
  color: string;
}

interface CostByFOCUSTreeMapTooltipProps {
  data: TooltipData;
  currencySymbol: CurrencySymbol | undefined;
}

const TOOLTIP_STYLES = {
  WRAPPER: {
    width: '240px',
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
    backgroundColor: theme.palette.gray.selected,
  },
} as const;

export function CostByFOCUSTreeMapTooltip({
  data,
  currencySymbol,
}: CostByFOCUSTreeMapTooltipProps) {
  const { name, value, color } = data;

  return (
    <VStack style={TOOLTIP_STYLES.WRAPPER}>
      <Typography variant="caption" style={TOOLTIP_STYLES.TITLE}>
        {name}
      </Typography>
      <Box style={TOOLTIP_STYLES.DIVIDER} />
      <VStack style={TOOLTIP_STYLES.LIST}>
        <Box>
          <TooltipItem label={name} value={value} currencySymbol={currencySymbol} color={color} />
        </Box>
      </VStack>
    </VStack>
  );
}
