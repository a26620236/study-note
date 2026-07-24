import { TrendingDown, TrendingFlat, TrendingUp } from '@lumiture-ui/SvgIcon';

import { OverviewPeriod } from '@hooks-api';

export const DEFAULT_THRESHOLD = {
  WARNING: 1,
  ALERT: 1,
};

export const THRESHOLD_COLOR = {
  NORMAL: 'text.main',
  WARNING: 'warning.dark',
  ALERT: 'error.dark',
} as const;

export const TREND_CONFIG = {
  NO_DATA: {
    icon: null,
    color: null,
    desc: `There is not enough data to\n compare to the previous period.`,
  },
  NEUTRAL: {
    icon: <TrendingFlat viewBox="0 -8 24 25" sx={{ color: 'text.hint' }} />,
    color: 'text.hint',
  },
  INCREASE: {
    icon: <TrendingUp viewBox="0 -6 24 25" sx={{ color: 'error.main' }} />,
    color: 'error.main',
  },
  DECREASE: {
    icon: <TrendingDown viewBox="0 -6 24 25" sx={{ color: 'success.main' }} />,
    color: 'success.main',
  },
} as const;

export const ACCUMULATE_COST = 'Year-to-Date Cost' as const;

export const COST_STATUS = {
  ACTUAL_COST: 'Actual Cost',
  OVERSPENT: 'Overspend',
  FORECAST_COST: 'Forecasted Cost',
  FORECAST_OVERSPEND: 'Overspend Forecast',
} as const;

export const OVERVIEW_INIT_PARAMS = {
  PERIOD: new Date(),
  FREQUENCY: OverviewPeriod.MONTHLY,
} as const;
