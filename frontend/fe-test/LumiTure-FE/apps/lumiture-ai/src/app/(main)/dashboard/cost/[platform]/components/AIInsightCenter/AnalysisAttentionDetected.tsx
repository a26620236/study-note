import { useState } from 'react';
import { useParams } from 'next/navigation';

import { AiAnalysesUsageText, useAIAnalysisStore } from '@features';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { AlertWrapper, Button, HStack, Icon, VStack } from '@lumiture-ui';

import { CostSummary } from '@app/(main)/dashboard/components/CostSummaryDialog/CostSummary';
import { CostSummaryDialog } from '@app/(main)/dashboard/components/CostSummaryDialog/CostSummaryDialog';
import { PinnedCostSummary } from '@app/(main)/dashboard/components/CostSummaryDialog/PinnedCostSummary';
import { CostSummaryFilterOption } from '@app/(main)/dashboard/components/CostSummaryFilterOption/CostSummaryFilterOption';
import type { PlatformsValue } from '@constants';
import { aiQuotaQueryKey, usePostDashboardAnalysis } from '@hooks-api';
import { AIAnalysisStatus } from '@hooks-ws';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';
import { transformFilterToPayload } from '../../utils/transformFilterToPayload';
import { validateAIAnalysisFilters } from '../../utils/validateAIAnalysisFilters';

const LABELS = {
  title: 'Cost Summary',
  button: {
    reAnalyze: 'Re-analyze',
    expandSummary: 'Expand Summary',
  },
  tooltip: {
    reAnalyze:
      'The analysis will be rerun using your current time range, configuration, and filter settings.',
  },
};

export function AnalysisAttentionDetected() {
  const theme = useTheme();
  const { platform } = useParams<{ platform: PlatformsValue }>();

  const [isPinned, setIsPinned] = useState(false);
  const {
    [platform]: { data, isSummaryDialogOpen },
    setIsSummaryDialogOpen,
  } = useAIAnalysisStore();
  const { [platform]: platformFilters } = useCostDashboardStore((state) => state);

  const isValid = validateAIAnalysisFilters(platformFilters);
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
      console.error(error);
      setStatus(platform, AIAnalysisStatus.Error);
    },
  });

  const { summaryId, summary, filterOptions } = data?.data ?? {};

  const shouldShowSummary = !!summary?.keyCostDrivers && summary.keyCostDrivers.length > 1;

  const summaryData = shouldShowSummary
    ? { overallSummary: summary.overallSummary, keyCostDrivers: [summary.keyCostDrivers[0]] }
    : summary;

  const handleReAnalyze = () => {
    if (!isValid) {
      setStatus(platform, AIAnalysisStatus.NotReady);
      return;
    }
    // Re-analyze 的時候，使用的是當前面板filter options
    postDashboardAnalysis(transformFilterToPayload(platformFilters));
  };

  return (
    <>
      <AlertWrapper
        boxProps={{
          sx: {
            background: theme.palette.success.dark,
          },
        }}
      >
        <HStack gap={4} width="100%">
          <Icon name="check_circle" sx={{ color: theme.palette.success.dark, fontSize: '32px' }} />
          <VStack flex={1}>
            <HStack justifyContent="space-between">
              <Typography variant="h6" sx={{ color: theme.palette.success.dark }}>
                {LABELS.title}
              </Typography>
              <HStack gap={1} alignItems="center">
                <AiAnalysesUsageText />
                <Tooltip title={LABELS.tooltip.reAnalyze}>
                  <Button
                    variant="link"
                    color="primary"
                    startIcon={<Icon name="refresh" sx={{ fontSize: '16px' }} />}
                    sx={{ '&.MuiButtonBase-root': { height: '24px', padding: '0 12px' } }}
                    onClick={handleReAnalyze}
                    isLoading={isPending}
                    disabled={isPending}
                    data-testid="re-analyze-button"
                  >
                    <Typography variant="linkBold" sx={{ fontSize: '14px' }}>
                      {LABELS.button.reAnalyze}
                    </Typography>
                  </Button>
                </Tooltip>
                <CostSummaryFilterOption filterOptions={filterOptions} />
                <PinnedCostSummary
                  id={summaryId}
                  isPinned={isPinned}
                  setIsPinned={() => setIsPinned(!isPinned)}
                />
              </HStack>
            </HStack>
            <Box mt={2}>
              <CostSummary
                summary={summaryData}
                titleVariant="captionBold"
                contentVariant="caption"
              />
            </Box>
            {shouldShowSummary && (
              <HStack mt={5} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsSummaryDialogOpen(platform, true)}
                  data-testid="expand-summary-button"
                >
                  {LABELS.button.expandSummary}
                </Button>
              </HStack>
            )}
          </VStack>
        </HStack>
      </AlertWrapper>
      <CostSummaryDialog
        summary={summary}
        summaryId={summaryId}
        filterOptions={filterOptions}
        createTime={data?.timestamp}
        isPinned={isPinned}
        setIsPinned={() => setIsPinned(!isPinned)}
        open={isSummaryDialogOpen}
        onClose={() => setIsSummaryDialogOpen(platform, false)}
      />
    </>
  );
}
