import { BUDGET_PATHS } from './budgetMonitoringAlert';
import { DASHBOARD_PATHS } from './dashboard';
import { OPTIMIZATION_PATHS } from './optimization';
import { ORG_SETTINGS_PATHS } from './orgSettings';
import { OVERVIEW_PATHS } from './overview';
import type { PathsType } from './types';

export { AUTH_PATHS } from './auth';
export { EXTERNAL_PATHS } from './external';
export { BUDGET_PATHS } from './budgetMonitoringAlert';
export { DASHBOARD_PATHS } from './dashboard';
export { ORG_SETTINGS_PATHS } from './orgSettings';
export { OVERVIEW_PATHS } from './overview';
export { OPTIMIZATION_PATHS } from './optimization';
export type { PathsType } from './types';

export const MAIN_PATHS: PathsType = {
  ...OVERVIEW_PATHS,
  ...OPTIMIZATION_PATHS,
  ...DASHBOARD_PATHS,
  ...ORG_SETTINGS_PATHS,
  ...BUDGET_PATHS,
} as const;
