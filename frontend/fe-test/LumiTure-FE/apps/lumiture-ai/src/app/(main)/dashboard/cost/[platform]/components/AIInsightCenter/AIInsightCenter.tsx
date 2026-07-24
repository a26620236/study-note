'use client';

import { useParams, useRouter } from 'next/navigation';

import { useAIAnalysisStore } from '@features';
import Typography from '@mui/material/Typography';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import { DASHBOARD_PATHS, type PlatformsValue } from '@constants';
import { AIAnalysisStatus } from '@hooks-ws';

import { AnalysisAttentionDetected } from './AnalysisAttentionDetected';
import { AnalysisError } from './AnalysisError';
import { AnalysisNotReady } from './AnalysisNotReady';
import { Analyzing } from './Analyzing';
import { ReadyAnalysis } from './ReadyAnalysis';

const LABELS = {
  title: 'AI Insight Center',
  button: 'Analysis History',
};

export function AIInsightCenter() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const router = useRouter();
  const {
    [platform]: { status },
  } = useAIAnalysisStore();

  const handleClickAnalysisHistory = () => {
    router.push(DASHBOARD_PATHS.analysisHistory.pathname);
  };

  return (
    <VStack gap={2}>
      <HStack justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{LABELS.title}</Typography>
        <Button
          variant="link"
          color="primary"
          startIcon={<Icon name="history" />}
          onClick={handleClickAnalysisHistory}
          data-testid="analysis-history-button"
        >
          <Typography variant="linkBold">{LABELS.button}</Typography>
        </Button>
      </HStack>
      {status === AIAnalysisStatus.Ready && <ReadyAnalysis />}
      {status === AIAnalysisStatus.InProgress && <Analyzing />}
      {status === AIAnalysisStatus.Success && <AnalysisAttentionDetected />}
      {status === AIAnalysisStatus.Error && <AnalysisError />}
      {status === AIAnalysisStatus.NotReady && <AnalysisNotReady />}
    </VStack>
  );
}
