import { useParams } from 'next/navigation';

import { AiAnalysesUsageText, useAIAnalysisStore } from '@features';
import { Typography, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { AlertWrapper, Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { Spark } from '@lumiture-ui/SvgIcon';
import { formatUtcToLocalTime } from '@shared/utils';

import type { PlatformsValue } from '@constants';
import { aiQuotaQueryKey, usePostDashboardAnalysis } from '@hooks-api';
import { AIAnalysisStatus } from '@hooks-ws';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { validateAIAnalysisFilters } from '../../utils/validateAIAnalysisFilters';

const LABELS = {
  title: 'Oops! Something went wrong with AI analysis.',
  renderDescription(startDate: string, endDate: string): string {
    return `The analysis for <strong>${startDate} - ${endDate}</strong> failed. Please try again later.`;
  },
  retryAnalysisButton: 'Retry Analysis',
};

const FORMAT_STR = 'dd MMM. yyyy';

export function AnalysisError() {
  const theme = useTheme();
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformFilters } = useCostDashboardStore((state) => state);
  const isValid = validateAIAnalysisFilters(platformFilters);
  const {
    [platform]: { data },
    setStatus,
    clearToastIds,
  } = useAIAnalysisStore();

  const { filterOptions } = data?.data ?? {};

  const { startDate, endDate } = filterOptions ?? {};
  const queryClient = useQueryClient();

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

  const formattedStartDate = startDate
    ? formatUtcToLocalTime(startDate, FORMAT_STR)
    : formatUtcToLocalTime(platformFilters.startDate);
  const formattedEndDate = endDate
    ? formatUtcToLocalTime(endDate, FORMAT_STR)
    : formatUtcToLocalTime(platformFilters.endDate);

  const handleRetryAnalysis = () => {
    if (!isValid) {
      setStatus(platform, AIAnalysisStatus.NotReady);
      return;
    }
    if (!filterOptions) return;
    // Retry analysis 的時候，使用的是之前任務的filter options
    postDashboardAnalysis(filterOptions);
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
          <Icon name="chat_error" sx={{ color: theme.palette.warning.main, fontSize: '32px' }} />
          <VStack gap={1}>
            <Typography variant="h6">{LABELS.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              <Markdown>{LABELS.renderDescription(formattedStartDate, formattedEndDate)}</Markdown>
            </Typography>
            <AiAnalysesUsageText />
          </VStack>
        </HStack>
        <Button
          variant="outlined"
          color="warning"
          onClick={handleRetryAnalysis}
          startIcon={
            <Spark
              sx={{ width: '16px', height: '16px', '& path': { fill: theme.palette.warning.main } }}
            />
          }
          isLoading={isPending}
          disabled={isPending}
          data-testid="retry-analysis-button"
          sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          {LABELS.retryAnalysisButton}
        </Button>
      </HStack>
    </AlertWrapper>
  );
}
