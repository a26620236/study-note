import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { palette } from '@lumiture-ui/theme';

import type { HighestSpendingChartTooltipProps } from '@app/(main)/components/optimize-cloud-spend/types';
import TooltipItem from '@app/(main)/components/TooltipItem';

const TOOLTIP_STYLES = {
  WRAPPER: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 240,
    maxWidth: 580,
    padding: 8,
    gap: 8,
    borderRadius: 5,
  },
  TITLE_WRAPPER: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  TITLE: {
    fontWeight: 400,
    color: palette.text.primary,
  },
  DIVIDER: {
    height: 1,
    backgroundColor: palette.gray.selected,
  },
} as const;

const Tooltip = ({ totalCost, paramsMap, currencySymbol }: HighestSpendingChartTooltipProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const budgetLeft = (paramsMap.total?.value as number) - totalCost;
  const title = paramsMap.total?.name ?? paramsMap.cloud[0].name;

  return (
    <Box style={TOOLTIP_STYLES.WRAPPER}>
      <Box style={TOOLTIP_STYLES.TITLE_WRAPPER}>
        <Typography variant="caption" style={TOOLTIP_STYLES.TITLE}>
          {title}
        </Typography>
      </Box>
      <Box style={TOOLTIP_STYLES.DIVIDER} />
      {paramsMap.cloud.map((item) => {
        const isOverBudget =
          typeof item.data === 'object' &&
          item.data !== null &&
          'isOverrun' in item.data &&
          !!item.data.isOverrun;

        return (
          <TooltipItem
            key={item.seriesId}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
            label={item.seriesName as string}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
            value={item.value as number}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
            color={item.color as string}
            valueStyles={{
              color: isOverBudget ? palette.error.dark : palette.text.primary,
            }}
            currencySymbol={currencySymbol}
          />
        );
      })}

      <Box style={TOOLTIP_STYLES.DIVIDER} />

      {paramsMap.total?.value ? (
        <>
          <TooltipItem
            label="Total Budget"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
            value={paramsMap.total.value as number}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
            color={paramsMap.total.color as string}
            currencySymbol={currencySymbol}
          />

          <TooltipItem
            label="Remaining Budget"
            value={budgetLeft}
            labelStyles={{ marginLeft: '14px' }}
            valueStyles={{
              color: budgetLeft < 0 ? palette.error.dark : palette.text.primary,
            }}
            currencySymbol={currencySymbol}
          />
        </>
      ) : (
        <TooltipItem label="Total Cost" value={totalCost} />
      )}
    </Box>
  );
};

export default Tooltip;
