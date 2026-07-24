import { parseUrl } from '@shared/utils';

import type { FilterValuesQueryString } from './initializeFilter';

export function getFilterFormCostDashboard() {
  // SSR safety: window does not exist on server
  if (typeof window === 'undefined') return undefined;

  const params = new URLSearchParams(window.location.search);
  const raw = params.get('filter_values');
  if (!raw) return undefined;

  return parseUrl<FilterValuesQueryString>(raw);
}
