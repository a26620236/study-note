import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GetFiscalMetricsSettingsResponse } from './fiscalMetrics.type';

type FiscalMetricsSettingsResponse = ResponseGenerics<GetFiscalMetricsSettingsResponse>;

export const fiscalMetricsSettingsQueryKey = (year?: string | null) => [
  'dashboard',
  'fiscal-metrics',
  'settings',
  { year },
];

export const fiscalMetricsSettingsQueryFn = async (
  headers: RawAxiosRequestHeaders,
  year?: string | null
) => {
  const res = await axiosInstance().get<FiscalMetricsSettingsResponse>(
    '/dashboard/fiscal-metrics/settings',
    {
      headers,
      params: year ? { year } : undefined,
    }
  );
  return res.data;
};

export const useGetFiscalMetricsSettings = (
  year?: string | null,
  options?: UseQueryOptions<FiscalMetricsSettingsResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<FiscalMetricsSettingsResponse>({
    queryKey: fiscalMetricsSettingsQueryKey(year),
    queryFn: async () => await fiscalMetricsSettingsQueryFn(headers, year),
    enabled: hasToken && !!year,
    ...options,
  });
};
