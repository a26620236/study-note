import type { AiQuotaItem } from '@hooks-api';

import { nFormatter } from '@shared/utils';

import { AI_QUOTA_SERVICE_META } from '../constants/aiQuota';
import { AiQuotaStatus } from '../types/aiQuotaStatus';
import { getAiQuotaStatus } from './getAiQuotaStatus';

// approaching / reached 僅動詞不同，其餘文案相同
const getAiQuotaLimitMessage = (limit: string, label: string, isReached: boolean): string =>
  `Your monthly limit (${limit}) ${isReached ? 'has been reached' : 'is approaching'} for ${label}. Please contact your LumiTure.ai representative to purchase Add-ons to increase your quota for this billing cycle.`;

// tooltip 文字；normal 無文案回傳空字串
export function getAiQuotaTooltip(quota: AiQuotaItem): string {
  const status = getAiQuotaStatus(quota.remaining, quota.total);
  if (status === AiQuotaStatus.Normal) return '';

  const { unit, label } = AI_QUOTA_SERVICE_META[quota.serviceType];
  const limit = `${nFormatter({ num: quota.total })} ${unit}`;

  return getAiQuotaLimitMessage(limit, label, status === AiQuotaStatus.Reached);
}
