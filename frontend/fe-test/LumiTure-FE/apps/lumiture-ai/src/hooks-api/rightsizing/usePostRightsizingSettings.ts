import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { ValidatedRightsizingSettingsData } from '@app/(main)/usage-optimization/rightsizing/settings/zod/rightsizingSettings.schema';
import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

interface PostRightsizingSettingsResponse {
  scopeId: string;
}

interface ResourcePayload {
  platform: string;
  resource_ids: string[];
  group_ids: string[];
}

export type PostRightsizingSettingsPayload = Omit<
  ValidatedRightsizingSettingsData,
  'rightsizingScope'
> & {
  resources: ResourcePayload[];
};

export const usePostRightsizingSettings = (
  options?: UseMutationOptions<
    PostRightsizingSettingsResponse,
    AxiosError,
    PostRightsizingSettingsPayload
  >
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/rightsizing/settings', 'create'],
    mutationFn: async (payload: PostRightsizingSettingsPayload) => {
      const res = await axiosInstance().post<PostRightsizingSettingsResponse>(
        '/rightsizing/settings',
        payload,
        {
          headers,
        }
      );
      return res.data;
    },
    ...options,
  });
};
