import { useMutation } from '@tanstack/react-query';

import { useAuthHeaders } from '@hooks';
import { axiosInstance } from '@utils';

import type { RecommendStatus } from './rightsizing.type';

type Action = RecommendStatus | 'remove';

interface RecommendActionPayload {
  action: Action;
  items: string[];
  reason?: string;
}

export const usePatchRecommendAction = () => {
  const { headers } = useAuthHeaders();
  return useMutation({
    mutationKey: ['/rightsizing', 'recommend', 'action'],
    mutationFn: async (payload: RecommendActionPayload) =>
      await axiosInstance().patch<RecommendActionPayload>(
        `/rightsizing/recommend/actions`,
        payload,
        {
          headers,
        }
      ),
  });
};
