'use client';

import { AiQuotaStatus, getAiQuotaStatus } from '@features';
import { Box, Typography } from '@mui/material';

import { AlertWrapper, HStack, Icon, Markdown, VStack } from '@lumiture-ui';

import { AiQuotaServiceType, useGetAiQuota } from '@hooks-api';

const LABELS = {
  title: 'Rightsizing Scan limit reached for this cycle.',
  description: `<strong>New scans are paused until the next cycle.</strong> Existing recommendations below are provided for reference only.<br/>To resume scanning within this billing cycle, please contact your LumiTure.ai representative to purchase Add-ons.`,
};

export function RightsizingScanLimitBanner() {
  const { data: aiQuota } = useGetAiQuota();
  const rightsizingScans = aiQuota?.data.quotas.find(
    (quota) => quota.serviceType === AiQuotaServiceType.RightsizingScans
  );

  if (!rightsizingScans) return null;

  const status = getAiQuotaStatus(rightsizingScans.remaining, rightsizingScans.total);
  if (status !== AiQuotaStatus.Reached) return null;

  return (
    <Box mt={4}>
      <AlertWrapper boxProps={{ sx: { bgcolor: 'error.main' } }}>
        <HStack gap={4} width="100%" alignItems="center">
          <Icon name="warning" sx={{ color: 'error.main', fontSize: '32px' }} />
          <VStack gap={1} flex={1}>
            <Typography variant="h6">{LABELS.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              <Markdown>{LABELS.description}</Markdown>
            </Typography>
          </VStack>
        </HStack>
      </AlertWrapper>
    </Box>
  );
}
