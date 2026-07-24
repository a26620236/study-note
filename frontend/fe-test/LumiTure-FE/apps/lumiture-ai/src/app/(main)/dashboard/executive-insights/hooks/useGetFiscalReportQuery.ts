import { useGetFiscalReport } from '@hooks-api';

import { useExecutiveInsightsStore } from './useExecutiveInsightsStore';

export function useGetFiscalReportQuery() {
  const { getFiscalReportQueryString } = useExecutiveInsightsStore();

  return useGetFiscalReport(getFiscalReportQueryString());
}
