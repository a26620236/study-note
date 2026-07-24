import type { CSSProperties } from 'react';

import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';

import { basicColor } from '@lumiture-ui/theme';
import { nFormatter } from '@shared/utils';

import type { ACCUMULATE_COST, COST_STATUS } from '@app/(main)/components/CostOverview/constants';
import type { CurrencySymbol } from '@constants';

type CostStatusValue = (typeof COST_STATUS)[keyof typeof COST_STATUS];

interface CostData {
  label: CostStatusValue | typeof ACCUMULATE_COST;
  value: number | null;
  itemStyle: CSSProperties;
}

type LegendItemProps = CostData & {
  currencySymbol?: CurrencySymbol;
};

interface ChartTooltipProps {
  monthLabel: string;
  costData: CostData[];
  currencySymbol?: CurrencySymbol;
}

export const LEGEND_STYLES = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    height: '24px',
  },
  legend: {
    width: '8px',
    height: '8px',
    border: '1px dashed',
    marginRight: '4px',
  },
  costValue: {
    marginLeft: 'auto',
    fontWeight: 700,
  },
} as const;

export const TOOLTIP_STYLES = {
  wrapper: {
    minWidth: '240px',
    maxWidth: '600px',
    color: basicColor.achromatic.gray[90],
    padding: '8px',
    backgroundColor: basicColor.achromatic.white,
  },
  hintWrapper: {
    maxWidth: '200px',
    color: basicColor.achromatic.white,
    whiteSpace: 'pre-wrap',
    padding: '8px',
    backgroundColor: alpha(basicColor.achromatic.gray[100], 0.8),
  },
  font: {
    fontSize: 12,
    fontWeight: 400,
  },
  title: {
    fontWeight: 500,
    paddingBottom: '8px',
    marginBottom: '8px',
    borderBottom: `1px solid ${basicColor.achromatic.gray[10]}`,
  },
  legendsWrapper: {
    padding: 0,
  },
} as const;

// NOTE: hiding tooltip because forecasting is not supported yet
// const OverspendWarning = () => (
//   <div style={TOOLTIP_STYLES.hintWrapper} role="alert">
//     According to forecasting, you may exceed your budget during this period.
//   </div>
// );

export const LegendItem = ({ label, value, itemStyle, currencySymbol = '$' }: LegendItemProps) => (
  <li
    style={LEGEND_STYLES.wrapper}
    aria-label={`${label} ${nFormatter({ num: value, fixed: 2, prefix: '$' })}`}
  >
    <div style={{ ...LEGEND_STYLES.legend, ...itemStyle, backgroundColor: itemStyle.color }} />
    <span>{label}</span>
    <span style={LEGEND_STYLES.costValue}>
      {nFormatter({ num: value, fixed: 2, prefix: currencySymbol })}
    </span>
  </li>
);

const TotalCostTooltip = ({ monthLabel, costData, currencySymbol }: ChartTooltipProps) => {
  const year = format(new Date(), 'yyyy');

  return (
    <div style={{ ...TOOLTIP_STYLES.font, ...TOOLTIP_STYLES.wrapper }} role="tooltip">
      <p style={TOOLTIP_STYLES.title}>{`${monthLabel} ${year}`}</p>
      {!Array.isArray(costData) || costData.length === 0 ? (
        'No data'
      ) : (
        <ul style={TOOLTIP_STYLES.legendsWrapper}>
          {costData.map((_item) => (
            <LegendItem key={_item.label} {..._item} currencySymbol={currencySymbol} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TotalCostTooltip;
