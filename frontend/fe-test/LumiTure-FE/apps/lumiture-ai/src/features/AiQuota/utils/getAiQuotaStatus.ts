import { AI_QUOTA_APPROACHING_THRESHOLD } from '../constants/aiQuota';
import { AiQuotaStatus } from '../types/aiQuotaStatus';

export function getAiQuotaStatus(remaining: number, total: number): AiQuotaStatus {
  if (total <= 0) return AiQuotaStatus.Normal;
  if (remaining <= 0) return AiQuotaStatus.Reached;

  const usage = (total - remaining) / total;
  if (usage >= AI_QUOTA_APPROACHING_THRESHOLD) return AiQuotaStatus.Approaching;

  return AiQuotaStatus.Normal;
}
