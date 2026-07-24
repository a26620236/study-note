'use client';

import { useCallback } from 'react';

import { Box, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { renderToString } from 'react-dom/server';

import { VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import TooltipItem from '@app/(main)/components/TooltipItem';

import { OVERSPEND_PERCENT_THRESHOLD } from '../../constants';
import { useGetFiscalReportQuery } from '../../hooks/useGetFiscalReportQuery';
import { BaseRankingChartBar } from '../BaseRankingChartBar';

const LABELS = {
  getOverspendLabel: (overspendPercent: number) => `Over budget by ${overspendPercent}%`,
  BudgetOverSpend: 'Budget Over Spend',
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
  LISTITEM: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  LISTITEM_DESCRIPTION: {
    display: 'flex',
    justifyContent: 'flex-end',
    fontWeight: 700,
  },
} as const;

export function Top10OverspendGroupsChartBar() {
  const { data: fiscalReport } = useGetFiscalReportQuery();
  const { data: session } = useSession();

  const { highestBudgetOverspend = [], period } = fiscalReport?.data ?? {};
  const currencyInfo = session?.user.currencyInfo;

  const getBarColor = useCallback(
    (index: number) =>
      highestBudgetOverspend[index].overspendPercent >= OVERSPEND_PERCENT_THRESHOLD
        ? theme.palette.error.dark
        : theme.palette.warning.dark,
    [highestBudgetOverspend]
  );

  const renderTooltip = useCallback(
    (index: number) => {
      const item = highestBudgetOverspend[index];
      const color = getBarColor(index);

      return renderToString(
        <VStack style={TOOLTIP_STYLES.WRAPPER}>
          <Typography variant="caption" style={TOOLTIP_STYLES.TITLE}>
            {item.groupName}
          </Typography>
          <Box style={TOOLTIP_STYLES.DIVIDER} />
          <VStack style={TOOLTIP_STYLES.LIST}>
            <VStack style={TOOLTIP_STYLES.LISTITEM}>
              <Box>
                <TooltipItem
                  label={LABELS.BudgetOverSpend}
                  value={item.spending}
                  currencySymbol={currencyInfo?.symbol}
                  color={color}
                />
              </Box>
              <Typography
                variant="captionBold"
                style={{
                  ...TOOLTIP_STYLES.LISTITEM_DESCRIPTION,
                  color,
                }}
              >
                {LABELS.getOverspendLabel(item.overspendPercent)}
              </Typography>
            </VStack>
          </VStack>
        </VStack>
      );
    },
    [highestBudgetOverspend, currencyInfo?.symbol, getBarColor]
  );

  return (
    <BaseRankingChartBar
      data={highestBudgetOverspend}
      period={period}
      getBarColor={getBarColor}
      renderTooltip={renderTooltip}
    />
  );
}
