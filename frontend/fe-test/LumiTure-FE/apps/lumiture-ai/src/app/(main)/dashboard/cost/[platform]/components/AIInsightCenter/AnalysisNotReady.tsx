import { useParams } from 'next/navigation';

import { AiAnalysesUsageText, useAIAnalysisStore } from '@features';
import { Typography, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { AlertWrapper, Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { Spark } from '@lumiture-ui/SvgIcon';

import type { PlatformsValue } from '@constants';
import { aiQuotaQueryKey, usePostDashboardAnalysis } from '@hooks-api';
import { AIAnalysisStatus } from '@hooks-ws';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { transformFilterToPayload } from '../../utils/transformFilterToPayload';
import { validateAIAnalysisFilters } from '../../utils/validateAIAnalysisFilters';

const LABELS = {
  title: 'Almost there!',
  description: `To unlock LumiTure.ai's AI analysis and uncover hidden issues, <strong>please set your<br/> time range to 1–31 days</strong> and <strong>ensure the "Group by" Dimension is not set to SKU, Label Key or LumiTag.</strong>`,
  buttonText: 'Retry Analysis',
};

export function AnalysisNotReady() {
  const theme = useTheme();
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const queryClient = useQueryClient();
  const { [platform]: platformFilters } = useCostDashboardStore((state) => state);
  const isValid = validateAIAnalysisFilters(platformFilters);

  const { setStatus, clearToastIds } = useAIAnalysisStore();

  const { mutate: postDashboardAnalysis, isPending } = usePostDashboardAnalysis(platform, {
    onSuccess: () => {
      clearToastIds(platform);
      setStatus(platform, AIAnalysisStatus.InProgress);
      // 用掉一次分析額度 → 刷新 AI Quota
      queryClient.invalidateQueries({ queryKey: aiQuotaQueryKey() });
    },
    onError: (error) => {
      console.error(error);
      setStatus(platform, AIAnalysisStatus.Error);
    },
  });

  const handleRetryAnalysis = () => {
    if (!isValid) {
      setStatus(platform, AIAnalysisStatus.NotReady);
      return;
    }
    postDashboardAnalysis(transformFilterToPayload(platformFilters));
  };

  return (
    <AlertWrapper
      boxProps={{
        sx: {
          background: theme.palette.warning.main,
        },
      }}
    >
      <HStack alignItems="center" justifyContent="space-between" width="100%" flexWrap="nowrap">
        <HStack gap={4} alignItems="center">
          <Icon name="chat" sx={{ color: theme.palette.warning.main, fontSize: '32px' }} />
          <VStack gap={1}>
            <Typography variant="h6">{LABELS.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              <Markdown>{LABELS.description}</Markdown>
            </Typography>
            <AiAnalysesUsageText />
          </VStack>
        </HStack>
        <Button
          variant="outlined"
          color="warning"
          startIcon={<Spark sx={{ '& path': { fill: theme.palette.warning.main } }} />}
          onClick={handleRetryAnalysis}
          isLoading={isPending}
          disabled={isPending}
          data-testid="retry-analysis-button"
          sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          {LABELS.buttonText}
        </Button>
      </HStack>
    </AlertWrapper>
  );
}
