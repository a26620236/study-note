import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GetGeneralAlertsRes } from '../budget.type';

export type GeneralAlertsResponse = ResponseGenerics<GetGeneralAlertsRes>;

export const generalAlertsQueryKey = ['/budget', 'general_alerts'];

export const generalAlertsQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<GeneralAlertsResponse>('/budget/general_alerts', {
    headers,
  });
  return res.data;
};

export const useGetGeneralAlerts = (options?: UseQueryOptions<GeneralAlertsResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<GeneralAlertsResponse>({
    queryKey: generalAlertsQueryKey,
    queryFn: async () => await generalAlertsQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
