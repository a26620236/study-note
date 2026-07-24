import { AI_QUOTA_STATUS_COLOR } from '../constants/aiQuota';
import type { AiQuotaStatus } from '../types/aiQuotaStatus';

export function getAiQuotaColor(status: AiQuotaStatus): string {
  return AI_QUOTA_STATUS_COLOR[status];
}
