import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { RightsizingSettings } from './rightsizing.type';

export type RightsizingSettingsResponse = ResponseGenerics<RightsizingSettings>;

export const getRightsizingSettingsQueryKey = (scopeId?: string | null) =>
  ['/rightsizing', 'settings', scopeId].filter(Boolean);

export const rightsizingSettingsQueryFn = async (
  headers: RawAxiosRequestHeaders,
  scopeId?: string | null
) => {
  const params = scopeId ? { scopeId } : {};
  const res = await axiosInstance().get<RightsizingSettingsResponse>('/rightsizing/settings', {
    headers,
    params,
  });
  return res.data;
};

export const useGetRightsizingSettings = (
  scopeId?: string | null,
  options?: UseQueryOptions<RightsizingSettingsResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<RightsizingSettingsResponse>({
    queryKey: getRightsizingSettingsQueryKey(scopeId),
    queryFn: async () => await rightsizingSettingsQueryFn(headers, scopeId),
    enabled: hasToken,
    ...options,
  });
};
