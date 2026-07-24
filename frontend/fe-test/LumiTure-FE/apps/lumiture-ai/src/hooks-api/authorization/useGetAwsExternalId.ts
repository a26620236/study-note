import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { RawAxiosRequestHeaders } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { useAuthHeaders } from '@hooks';
import { axiosInstance, type ApiError } from '@utils';

import type { GetAwsExternalIdResponse } from './authorization.type';

type AwsExternalIdResponse = ResponseGenerics<GetAwsExternalIdResponse>;

export const awsExternalIdQueryKey = ['platforms', 'aws', 'authorization', 'external-id'];

export const awsExternalIdQueryFn = async (headers: RawAxiosRequestHeaders) => {
  const res = await axiosInstance().get<AwsExternalIdResponse>(
    '/platforms/aws/authorization/external-id/',
    { headers }
  );
  return res.data;
};

export const useGetAwsExternalId = (options?: UseQueryOptions<AwsExternalIdResponse, ApiError>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery<AwsExternalIdResponse, ApiError>({
    queryKey: awsExternalIdQueryKey,
    queryFn: async () => await awsExternalIdQueryFn(headers),
    enabled: hasToken,
    ...options,
  });
};
