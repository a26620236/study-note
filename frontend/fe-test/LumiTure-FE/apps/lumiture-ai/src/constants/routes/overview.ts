const BASE_OVERVIEW_PATH = '/overview';

export const OVERVIEW_PATHS = {
  overview: {
    key: 'overview',
    name: 'Overview',
    pathname: '/',
    icon: 'home',
  },
  spendingRankings: {
    key: 'spendingRankings',
    name: 'Spending Rankings',
    pathname: `${BASE_OVERVIEW_PATH}/spending-rankings`,
    icon: null,
  },
} as const;
