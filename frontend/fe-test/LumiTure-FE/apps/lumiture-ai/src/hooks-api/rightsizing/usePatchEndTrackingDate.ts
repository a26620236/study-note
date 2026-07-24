import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { RecommendationItem } from './rightsizing.type';

interface EndOfTrackingPayload {
  endTrackDate: Date;
}

export const usePatchEndOfTrackingDate = (
  recId: RecommendationItem['recId'],
  options?: UseMutationOptions<unknown, AxiosError, EndOfTrackingPayload>
) => {
  const { headers } = useAuthHeaders();

  return useMutation({
    mutationKey: ['/rightsizing', 'end-of-tracking', 'update', recId],
    mutationFn: async ({ endTrackDate }: EndOfTrackingPayload) => {
      const payload = { endTrackDate };
      return await axiosInstance().patch(
        `/rightsizing/recommend/${recId}/end-track-date`,
        payload,
        {
          headers,
        }
      );
    },
    ...options,
  });
};
