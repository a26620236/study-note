'use client';

import { Box, Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';

import { HStack, Icon } from '@lumiture-ui';

import { AI_QUOTA_SERVICE_META, AiQuotaUsageText, getAiQuotaColor, getAiQuotaStatus } from '@features';
import {
  AiQuotaServiceType,
  useGetAiQuota,
  useGetRightsizingOverview,
  type AiQuotaItem,
} from '@hooks-api';

export const LABELS = {
  title: 'Rightsizing',
  description:
    'Due to data latency from cloud service provider, the cloud cost here may be slightly different from the final billing.',
};

interface UpdateTimeProps {
  updateTitle: string;
  updateTime: string;
  hasUtc?: boolean;
}

const UpdateTime = ({ updateTitle, updateTime, hasUtc = false }: UpdateTimeProps) => (
  <HStack gap={1}>
    <Typography variant="captionMedium" color="text.secondary">
      {updateTitle}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {updateTime}
    </Typography>
    {hasUtc && (
      <Typography variant="caption" color="text.secondary">
        (UTC+0)
      </Typography>
    )}
  </HStack>
);

const ScanUsageIndicator = ({ quota }: { quota: AiQuotaItem }) => {
  const status = getAiQuotaStatus(quota.remaining, quota.total);
  const { displayLabel } = AI_QUOTA_SERVICE_META[quota.serviceType];

  return (
    <HStack gap={1} alignItems="center">
      <Box
        sx={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, bgcolor: getAiQuotaColor(status) }}
      />
      <Typography variant="caption" sx={{ color: getAiQuotaColor(status) }}>{`${displayLabel}:`}</Typography>
      <Typography variant="caption">
        <AiQuotaUsageText quota={quota} />
      </Typography>
    </HStack>
  );
};

export function RightsizingTitle() {
  const { data: overviewResponse } = useGetRightsizingOverview();
  const { data: aiQuota } = useGetAiQuota();
  const overviewData = overviewResponse?.data;

  const rightsizingScans = aiQuota?.data.quotas.find(
    (quota) => quota.serviceType === AiQuotaServiceType.RightsizingScans
  );

  const lastUpdatedAt = overviewData?.lastUpdatedAt;
  const nextUpdateAt = overviewData?.nextUpdateAt;

  const formattedLastUpdatedAt = lastUpdatedAt ? format(lastUpdatedAt, 'dd/MM/yyyy HH:mm') : '-';
  const formattedNextUpdateAt = nextUpdateAt ? format(nextUpdateAt, 'dd/MM/yyyy HH:mm') : '-';

  return (
    <HStack alignItems="center" justifyContent="space-between">
      <Typography variant="h4">{LABELS.title}</Typography>
      <HStack gap={5}>
        {rightsizingScans && <ScanUsageIndicator quota={rightsizingScans} />}
        <UpdateTime updateTitle="Last Updated" updateTime={formattedLastUpdatedAt} />
        <HStack gap={1}>
          <UpdateTime updateTitle="Next Update" updateTime={formattedNextUpdateAt} hasUtc />
          <Tooltip title={LABELS.description}>
            <HStack alignItems="center" justifyContent="center">
              <Icon name="info" sx={{ fontSize: 16, color: 'text.secondary', cursor: 'pointer' }} />
            </HStack>
          </Tooltip>
        </HStack>
      </HStack>
    </HStack>
  );
}
