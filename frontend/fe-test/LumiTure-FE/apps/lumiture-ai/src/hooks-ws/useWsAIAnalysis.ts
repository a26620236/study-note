import { useSession } from 'next-auth/react';

import { useWebSocket } from '@shared/hooks';

import type { AIAnalysis } from './types/aiAnalysis';

export function useWsAIAnalysis() {
  const session = useSession();
  const token = session.data?.user.access;
  const path = token ? `/ws/tasks?token=${token}` : null;

  const { data } = useWebSocket<AIAnalysis>(path);

  return {
    data,
  };
}
