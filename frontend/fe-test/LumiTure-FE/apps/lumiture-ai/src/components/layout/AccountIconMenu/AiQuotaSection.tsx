import {
  AI_QUOTA_SERVICE_META,
  AiQuotaUsageText,
  getAiQuotaColor,
  getAiQuotaStatus,
} from '@features';
import { alpha, Box, Skeleton, Typography } from '@mui/material';
import { format, isValid } from 'date-fns';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';
import { basicColor } from '@lumiture-ui/theme';

import { useGetAiQuota, type AiQuotaItem } from '@hooks-api';

import { AccountMenuItemWrap } from './AccountMenuItem';

interface AiQuotaRowProps {
  quota: AiQuotaItem;
}

const AiQuotaRow = ({ quota }: AiQuotaRowProps) => {
  const status = getAiQuotaStatus(quota.remaining, quota.total);
  const { displayLabel } = AI_QUOTA_SERVICE_META[quota.serviceType];

  return (
    <HStack alignItems="center" justifyContent="space-between">
      <HStack alignItems="center" gap={2}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            flexShrink: 0,
            bgcolor: getAiQuotaColor(status),
          }}
        />
        <Typography variant="caption">{displayLabel}</Typography>
      </HStack>
      <Typography variant="caption">
        <AiQuotaUsageText quota={quota} />
      </Typography>
    </HStack>
  );
};

const LABELS = {
  title: 'AI Quota',
  orgWideRefresh: 'Org-wide, refresh on',
  loadError: "Couldn't load quota",
  retry: 'Retry',
  renderAddOnsText: (activePacks: number) => `${activePacks} x AI Quota Add-ons Activated`,
};

export const AiQuotaSection = () => {
  const { data: response, isLoading, isError, refetch } = useGetAiQuota();
  const aiQuota = response?.data;
  const SKELETON_ROW_KEYS = ['first', 'second'];

  const aiQuotaIsEmpty = aiQuota === undefined || aiQuota.quotas.length === 0;

  const formatRefreshDate = (date: string) => {
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? format(parsedDate, 'd MMM. yyyy') : '--';
  };

  // 初次載入尚無資料 → skeleton
  if (isLoading && aiQuotaIsEmpty) {
    return (
      <AccountMenuItemWrap>
        <VStack gap={2.5} p={2}>
          <HStack alignItems="center" justifyContent="space-between">
            <Typography variant="bodyBold">{LABELS.title}</Typography>
            <Skeleton
              variant="text"
              width={80}
              height={12}
              sx={{ bgcolor: (theme) => alpha(theme.palette.common.white, 0.12) }}
            />
          </HStack>
          {SKELETON_ROW_KEYS.map((key) => (
            <Skeleton
              key={key}
              variant="rounded"
              width="100%"
              height={12}
              sx={{ bgcolor: (theme) => alpha(theme.palette.common.white, 0.12) }}
            />
          ))}
        </VStack>
      </AccountMenuItemWrap>
    );
  }

  // 刷新失敗且無資料 → error + retry
  if (isError && aiQuotaIsEmpty) {
    return (
      <AccountMenuItemWrap>
        <VStack gap={1} p={2}>
          <Typography variant="bodyBold">{LABELS.title}</Typography>
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center" gap={1}>
              <Icon name="help" sx={{ fontSize: 16 }} />
              <Typography variant="caption">{LABELS.loadError}</Typography>
            </HStack>
            <Button
              variant="link"
              onClick={() => {
                refetch();
              }}
              sx={{ color: basicColor.secondary.turquoiseBlue[60] }}
            >
              {LABELS.retry}
            </Button>
          </HStack>
        </VStack>
      </AccountMenuItemWrap>
    );
  }

  // org 無 pricing plan / 無配額 → 不渲染整個區塊
  if (aiQuotaIsEmpty) return null;

  return (
    <AccountMenuItemWrap>
      <VStack gap={2} data-testid="ai-quota-section" p={2}>
        <HStack alignItems="center" justifyContent="space-between">
          <Typography variant="bodyBold">{LABELS.title}</Typography>
          <Typography variant="caption" sx={{ color: 'grey.400' }}>
            {`${LABELS.orgWideRefresh} ${formatRefreshDate(aiQuota.refreshDate)}`}
          </Typography>
        </HStack>
        <VStack gap={1}>
          {aiQuota.quotas.map((quota) => (
            <AiQuotaRow key={quota.serviceType} quota={quota} />
          ))}
        </VStack>
        {aiQuota.activePacks > 0 && (
          <Typography variant="caption" sx={{ color: 'grey.400' }}>
            {LABELS.renderAddOnsText(aiQuota.activePacks)}
          </Typography>
        )}
      </VStack>
    </AccountMenuItemWrap>
  );
};
