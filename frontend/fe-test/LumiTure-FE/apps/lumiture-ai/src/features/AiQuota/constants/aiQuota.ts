import { AiQuotaServiceType } from '@hooks-api';

import { AiQuotaStatus } from '../types/aiQuotaStatus';

// usage 達此比例（含）視為 approaching
export const AI_QUOTA_APPROACHING_THRESHOLD = 0.8;

interface AiQuotaServiceMeta {
  displayLabel: string; // menu 列 / 頁面前綴（Title Case）
  unit: string; // tooltip 文案的量詞
  label: string; // tooltip 文案的功能名
}

export const AI_QUOTA_SERVICE_META: Record<AiQuotaServiceType, AiQuotaServiceMeta> = {
  [AiQuotaServiceType.AiPoweredAnalyses]: {
    displayLabel: 'AI Analyses',
    unit: 'AI analyses',
    label: 'Cost Dashboard',
  },
  [AiQuotaServiceType.RightsizingScans]: {
    displayLabel: 'Rightsizing Scans',
    unit: 'Rightsizing scans',
    label: 'Usage Optimization',
  },
};

export const AI_QUOTA_STATUS_COLOR: Record<AiQuotaStatus, string> = {
  [AiQuotaStatus.Normal]: 'success.main',
  [AiQuotaStatus.Approaching]: 'warning.main',
  [AiQuotaStatus.Reached]: 'error.main',
};
