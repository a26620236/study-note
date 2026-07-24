import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ResponseGenerics } from '@shared/types';

import { CrossCloudValue, PlatformsValue, type PlatformValueWithFOCUS } from '@constants';
import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { AWSFilter, AzureFilter, FOCUSFilter, GCPFilter } from './dashboard.type';

const getPlatformPath = (payload: DownloadCostDetailCsvPayload): PlatformValueWithFOCUS => {
  if ('projects' in payload.filters) return PlatformsValue.GCP;
  if ('accounts' in payload.filters) return PlatformsValue.AWS;
  if ('resourceGroups' in payload.filters) return PlatformsValue.AZURE;
  return CrossCloudValue.FOCUS;
};

interface DownloadCostDetailCsvResponse extends ResponseGenerics<{ link: string }> {}

interface DownloadCostDetailCsvPayload {
  filters: GCPFilter | AWSFilter | AzureFilter | FOCUSFilter;
}
export const useDownloadCostDetailCsv = (
  options?: UseMutationOptions<
    DownloadCostDetailCsvResponse,
    AxiosError,
    DownloadCostDetailCsvPayload
  >
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/cost_dashboard', 'cost_trend', 'csv'],
    mutationFn: async (payload: DownloadCostDetailCsvPayload) => {
      const platformPath = getPlatformPath(payload);
      const res = await axiosInstance().post<DownloadCostDetailCsvResponse>(
        `/dashboard/analysis/${platformPath}/csv`,
        payload.filters,
        {
          headers,
        }
      );
      return res.data;
    },
    ...options,
  });
};
