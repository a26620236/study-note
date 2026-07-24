'use client';

import { useCallback, useEffect } from 'react';

import { useTheme } from '@mui/material';
import { toast } from 'sonner';

import { basicColor } from '@lumiture-ui/theme';

import { PlatformsValue } from '@constants';
import { AIAnalysisStatus, useWsAIAnalysis, type AIAnalysis, type TaskType } from '@hooks-ws';

import { AIAnalysisAttentionDetectedToast } from './AIAnalysisAttentionDetectedToast';
import { AIAnalysisErrorToast } from './AIAnalysisErrorToast';
import { AIAnalyzingToast } from './AIAnalyzingToast';
import { useAIAnalysisStore } from './useAIAnalysisStore';

const TaskTypeToPlatform: Record<TaskType, PlatformsValue> = {
  dashboard_gcp_summary: PlatformsValue.GCP,
  dashboard_aws_summary: PlatformsValue.AWS,
  dashboard_azure_summary: PlatformsValue.AZURE,
};

const baseToastOptions = {
  duration: Infinity,
  style: {
    padding: 0,
  },
};

export function AIAnalysisListener() {
  const theme = useTheme();
  const { data } = useWsAIAnalysis();
  const { setData, setStatus, setPrevStatus } = useAIAnalysisStore();

  const gradientBackground = `linear-gradient(272deg, ${theme.palette.primary.main} 0%, ${basicColor.secondary.turquoiseBlue[60]} 100%)`;
  const errorBackground = theme.palette.warning.dark;

  const processAIAnalysisData = useCallback(
    (analysisData: AIAnalysis) => {
      const platform = TaskTypeToPlatform[analysisData.taskType];
      setStatus(platform, analysisData.status);
      setData(platform, analysisData);
    },
    [setData, setStatus]
  );

  const showStatusChangeToast = useCallback(
    (analysisData: AIAnalysis) => {
      const platform = TaskTypeToPlatform[analysisData.taskType];
      const { data: innerData, status: currentStatus } = analysisData;
      const { prevStatus } = useAIAnalysisStore.getState()[platform];

      if (currentStatus === prevStatus) return;

      if (currentStatus === AIAnalysisStatus.InProgress) {
        toast.custom((id) => <AIAnalyzingToast id={id} platform={platform} />, {
          ...baseToastOptions,
          style: { ...baseToastOptions.style, background: gradientBackground },
          unstyled: true,
        });
      } else if (currentStatus === AIAnalysisStatus.Success) {
        toast.custom((id) => <AIAnalysisAttentionDetectedToast id={id} platform={platform} />, {
          ...baseToastOptions,
          style: { ...baseToastOptions.style, background: gradientBackground },
          unstyled: true,
        });
      } else {
        toast.custom(
          (id) => (
            <AIAnalysisErrorToast
              id={id}
              platform={platform}
              filterOptions={innerData.filterOptions}
            />
          ),
          {
            ...baseToastOptions,
            style: { ...baseToastOptions.style, background: errorBackground },
            unstyled: true,
          }
        );
      }

      setPrevStatus(platform, currentStatus);
    },
    [gradientBackground, errorBackground, setPrevStatus]
  );

  useEffect(() => {
    if (!data) return;
    processAIAnalysisData(data);
    showStatusChangeToast(data);
  }, [data, processAIAnalysisData, showStatusChangeToast]);

  return null;
}
