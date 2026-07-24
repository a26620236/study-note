import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ValidatedRightsizingSettingsData } from '@app/(main)/usage-optimization/rightsizing/settings/zod/rightsizingSettings.schema';
import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

interface ResourcePayload {
  platform: string;
  resource_ids: string[];
  group_ids: string[];
}

export type PutRightsizingSettingsPayload = Omit<
  ValidatedRightsizingSettingsData,
  'rightsizingScope'
> & {
  resources: ResourcePayload[];
};

export const usePutRightsizingSettings = (
  scopeId?: string | null,
  options?: UseMutationOptions<unknown, AxiosError, PutRightsizingSettingsPayload>
) => {
  const { headers } = useAuthHeaders();
  const params = scopeId ? { scopeId } : {};

  return useMutation({
    mutationKey: ['/rightsizing/settings', 'update', scopeId],
    mutationFn: async (payload: PutRightsizingSettingsPayload) =>
      await axiosInstance().put('/rightsizing/settings', payload, {
        headers,
        params,
      }),
    ...options,
  });
};
