'use client';

import { Box, Typography } from '@mui/material';

import { HStack } from '@lumiture-ui';

import { AiQuotaServiceType, useGetAiQuota } from '@hooks-api';

import {
  AI_QUOTA_SERVICE_META,
  AiQuotaUsageText,
  getAiQuotaColor,
  getAiQuotaStatus,
} from '../AiQuota';

// Cost Dashboard 各狀態卡共用的「AI Analyses: {remaining} / {total} left」用量列
export function AiAnalysesUsageText() {
  const { data: aiQuota } = useGetAiQuota();
  const aiAnalyses = aiQuota?.data.quotas.find(
    (quota) => quota.serviceType === AiQuotaServiceType.AiPoweredAnalyses
  );

  if (!aiAnalyses) return null;

  const status = getAiQuotaStatus(aiAnalyses.remaining, aiAnalyses.total);

  return (
    <HStack gap={2} alignItems="center">
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          flexShrink: 0,
          bgcolor: getAiQuotaColor(status),
        }}
      />
      <HStack gap={1} alignItems="center">
        <Typography variant="caption" sx={{ color: getAiQuotaColor(status) }}>
          {`${AI_QUOTA_SERVICE_META[AiQuotaServiceType.AiPoweredAnalyses].displayLabel}:`}
        </Typography>
        <Typography variant="caption">
          <AiQuotaUsageText quota={aiAnalyses} />
        </Typography>
      </HStack>
    </HStack>
  );
}
