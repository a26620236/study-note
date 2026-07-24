import { CrossCloudValue } from '../platforms';

const BASE_DASHBOARD_PATH = '/dashboard';

export const DASHBOARD_PATHS = {
  dashboard: {
    key: 'dashboard',
    name: 'Dashboard',
    pathname: '',
    icon: null,
  },
  executiveInsights: {
    key: 'executiveInsights',
    name: 'Executive Insights',
    pathname: `${BASE_DASHBOARD_PATH}/executive-insights`,
    icon: 'query_stats',
  },
  executiveInsightsSettings: {
    key: 'executiveInsightsSettings',
    name: 'Executive Insights Settings',
    pathname: `${BASE_DASHBOARD_PATH}/executive-insights/settings`,
    icon: null,
  },
  costDashboard: {
    key: 'costDashboard',
    name: 'Cost Dashboard',
    pathname: `${BASE_DASHBOARD_PATH}/cost/[platform]`,
    icon: 'dashboard',
    defaultParams: {
      platform: CrossCloudValue.FOCUS,
    },
  },
  analysisHistory: {
    key: 'analysisHistory',
    name: 'Analysis History',
    pathname: `${BASE_DASHBOARD_PATH}/cost/analysis-history`,
    icon: null,
  },
} as const;
