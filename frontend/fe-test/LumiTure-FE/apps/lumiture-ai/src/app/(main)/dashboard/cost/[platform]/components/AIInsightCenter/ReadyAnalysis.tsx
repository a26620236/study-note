import { useParams } from 'next/navigation';

import {
  AiAnalysesUsageText,
  AiQuotaStatus,
  getAiQuotaStatus,
  useAIAnalysisStore,
} from '@features';
import { Typography, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { AlertWrapper, Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { basicColor } from '@lumiture-ui/theme';
import { Insight, Spark } from '@lumiture-ui/SvgIcon';
import { formatUtcToLocalTime } from '@shared/utils';

import type { PlatformsValue } from '@constants';
import {
  aiQuotaQueryKey,
  AiQuotaServiceType,
  useGetAiQuota,
  usePostDashboardAnalysis,
} from '@hooks-api';
import { AIAnalysisStatus } from '@hooks-ws';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { transformFilterToPayload } from '../../utils/transformFilterToPayload';
import { validateAIAnalysisFilters } from '../../utils/validateAIAnalysisFilters';

const LABELS = {
  title: 'AI analysis is ready to go.',
  description: 'Preparing to analyze cost data between ',
  reachedTitle: 'AI Analysis limit reached for this cycle.',
  reachedDescription:
    'Your monthly limit has been reached. Please contact your LumiTure.ai representative <br /> to purchase Add-ons to increase your quota for this billing cycle.',
  buttonText: 'Analyze Data',
};

const FORMAT_STR = 'dd MMM. yyyy';

export function ReadyAnalysis() {
  const theme = useTheme();
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { data: aiQuota } = useGetAiQuota();
  const { [platform]: platformFilters } = useCostDashboardStore((state) => state);
  const { setStatus, clearToastIds } = useAIAnalysisStore();
  const queryClient = useQueryClient();
  const { mutate: postDashboardAnalysis, isPending } = usePostDashboardAnalysis(platform, {
    onSuccess: () => {
      clearToastIds(platform);
      setStatus(platform, AIAnalysisStatus.InProgress);
      // 用掉一次分析額度 → 刷新 AI Quota
      queryClient.invalidateQueries({ queryKey: aiQuotaQueryKey() });
    },
    onError: (error) => {
      setStatus(platform, AIAnalysisStatus.Error);
      console.error(error);
    },
  });

  const isValid = validateAIAnalysisFilters(platformFilters);
  const { startDate, endDate } = platformFilters;
  const formattedStartDate = startDate ? formatUtcToLocalTime(startDate, FORMAT_STR) : '--';
  const formattedEndDate = endDate ? formatUtcToLocalTime(endDate, FORMAT_STR) : '--';

  const aiAnalyses = aiQuota?.data.quotas.find(
    (quota) => quota.serviceType === AiQuotaServiceType.AiPoweredAnalyses
  );
  const isReached =
    !!aiAnalyses &&
    getAiQuotaStatus(aiAnalyses.remaining, aiAnalyses.total) === AiQuotaStatus.Reached;

  const readyBackground = `linear-gradient(272deg, ${theme.palette.primary.main} 0%, ${basicColor.secondary.turquoiseBlue[60]} 100%)`;

  const handlePostDashboardAnalysis = () => {
    if (!isValid) {
      setStatus(platform, AIAnalysisStatus.NotReady);
      return;
    }
    postDashboardAnalysis(transformFilterToPayload(platformFilters));
  };

  return (
    <AlertWrapper
      boxProps={{ sx: { background: isReached ? theme.palette.error.main : readyBackground } }}
    >
      <HStack alignItems="center" justifyContent="space-between" width="100%">
        <HStack gap={4} alignItems="center">
          {isReached ? (
            <Icon name="warning" sx={{ color: 'error.main', fontSize: '32px', flexShrink: 0 }} />
          ) : (
            <Insight
              gradient={{
                startColor: theme.palette.primary.main,
                endColor: basicColor.secondary.turquoiseBlue[60],
              }}
              sx={{ width: '32px', height: '32px' }}
            />
          )}
          <VStack gap={1}>
            <Typography variant="h6">{isReached ? LABELS.reachedTitle : LABELS.title}</Typography>
            {isReached ? (
              <Typography variant="caption" color="text.secondary">
                <Markdown>{LABELS.reachedDescription}</Markdown>
              </Typography>
            ) : (
              <HStack gap={1}>
                <Typography variant="caption" color="text.secondary">
                  {LABELS.description}
                </Typography>
                <Typography variant="captionBold" color="text.secondary">
                  {startDate && endDate ? `${formattedStartDate} - ${formattedEndDate}.` : '--'}
                </Typography>
              </HStack>
            )}
            <AiAnalysesUsageText />
          </VStack>
        </HStack>
        <Button
          startIcon={<Spark sx={{ '& path': { fill: theme.palette.white.main } }} />}
          onClick={handlePostDashboardAnalysis}
          isLoading={isPending}
          disabled={isPending || isReached}
          data-testid="analyze-data-button"
        >
          {LABELS.buttonText}
        </Button>
      </HStack>
    </AlertWrapper>
  );
}
