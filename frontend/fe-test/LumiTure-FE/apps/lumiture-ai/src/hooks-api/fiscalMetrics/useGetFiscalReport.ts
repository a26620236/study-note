import { useQuery, type Query, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GetFiscalReportRes } from './fiscalMetrics.type';

type FiscalReportResponse = ResponseGenerics<GetFiscalReportRes>;

interface GetFiscalReportParams {
  year: string;
  month: string;
}

export const fiscalReportQueryKey = (params: GetFiscalReportParams) => [
  'dashboard',
  'fiscal-metrics',
  'report',
  { year: params.year, month: params.month },
];

export const fiscalReportQueryFn = async (
  headers: RawAxiosRequestHeaders,
  params: GetFiscalReportParams
) => {
  const res = await axiosInstance().get<FiscalReportResponse>('/dashboard/fiscal-metrics/report', {
    headers,
    params: { year: params.year, month: params.month },
  });
  return res.data;
};

export const useGetFiscalReport = (
  params: GetFiscalReportParams,
  options?: UseQueryOptions<FiscalReportResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<FiscalReportResponse>({
    queryKey: fiscalReportQueryKey(params),
    queryFn: async () => await fiscalReportQueryFn(headers, params),
    enabled: hasToken && !!params.year && !!params.month,
    refetchOnWindowFocus: 'always',
    ...options,
  });
};

export const createFiscalReportInvalidatePredicate =
  (year: string) =>
  (query: Query): boolean => {
    const [prefix1, prefix2, prefix3, params] = query.queryKey;
    return Boolean(
      prefix1 === 'dashboard' &&
        prefix2 === 'fiscal-metrics' &&
        prefix3 === 'report' &&
        params &&
        typeof params === 'object' &&
        'year' in params &&
        params.year === year
    );
  };
