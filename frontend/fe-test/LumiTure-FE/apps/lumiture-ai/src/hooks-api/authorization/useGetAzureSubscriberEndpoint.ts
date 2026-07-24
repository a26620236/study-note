import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { GetAzureSubscriberEndpointResponse } from './authorization.type';

type AzureSubscriberEndpointResponse = ResponseGenerics<GetAzureSubscriberEndpointResponse>;

export const azureSubscriberEndpointQueryKey = [
  'platforms',
  'azure',
  'authorization',
  'event-trigger-url',
];

export const azureSubscriberEndpointQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<AzureSubscriberEndpointResponse>(
    '/platforms/azure/authorization/event-trigger-url/',
    { headers }
  );
  return res.data;
};

export const useGetAzureSubscriberEndpoint = (
  options?: UseQueryOptions<AzureSubscriberEndpointResponse>
) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<AzureSubscriberEndpointResponse>({
    queryKey: azureSubscriberEndpointQueryKey,
    queryFn: async () => await azureSubscriberEndpointQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
