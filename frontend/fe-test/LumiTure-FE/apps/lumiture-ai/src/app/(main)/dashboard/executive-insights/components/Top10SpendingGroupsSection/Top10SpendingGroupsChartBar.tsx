'use client';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import { renderToString } from 'react-dom/server';

import { VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import TooltipItem from '@app/(main)/components/TooltipItem';

import { useGetFiscalReportQuery } from '../../hooks/useGetFiscalReportQuery';
import { BaseRankingChartBar } from '../BaseRankingChartBar';

const LABELS = {
  monthlyCost: 'Monthly Cost',
};

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
  DIVIDER: {
    height: 1,
    backgroundColor: theme.palette.gray.selected,
  },
  LIST: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
} as const;

export function Top10SpendingGroupsChartBar() {
  const { data: fiscalReport } = useGetFiscalReportQuery();
  const { data: session } = useSession();

  const { highestSpending = [], period } = fiscalReport?.data ?? {};
  const currencyInfo = session?.user.currencyInfo;
  const barColor = theme.palette.colorKit.dark[2];

  const getBarColor = () => barColor;

  const renderTooltip = useCallback(
    (index: number) => {
      const item = highestSpending[index];
      return renderToString(
        <VStack style={TOOLTIP_STYLES.WRAPPER}>
          <Typography variant="caption" style={TOOLTIP_STYLES.TITLE}>
            {item.groupName}
          </Typography>
          <Box style={TOOLTIP_STYLES.DIVIDER} />
          <VStack style={TOOLTIP_STYLES.LIST}>
            <Box>
              <TooltipItem
                label={LABELS.monthlyCost}
                value={item.spending}
                currencySymbol={currencyInfo?.symbol}
                color={barColor}
              />
            </Box>
          </VStack>
        </VStack>
      );
    },
    [highestSpending, currencyInfo?.symbol, barColor]
  );

  return (
    <BaseRankingChartBar
      data={highestSpending}
      period={period}
      getBarColor={getBarColor}
      renderTooltip={renderTooltip}
    />
  );
}
