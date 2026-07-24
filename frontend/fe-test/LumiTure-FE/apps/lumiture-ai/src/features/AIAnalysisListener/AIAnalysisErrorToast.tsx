import { useEffect } from 'react';

import { Typography, useTheme } from '@mui/material';
import type { ToastT } from 'sonner';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';

import { PLATFORM_CONFIG, type PlatformsValue } from '@constants';
import { usePostDashboardAnalysis } from '@hooks-api';
import { AIAnalysisStatus, type AIAnalysisData } from '@hooks-ws';

import { useAIAnalysisStore } from './useAIAnalysisStore';

const LABELS = {
  getTitle: (platform: PlatformsValue): string => {
    const platformLabel = PLATFORM_CONFIG[platform].label;
    return `AI Analysis - ${platformLabel}`;
  },
  status: 'Status: Failed',
  toastLink: 'Try Again',
};

interface AIAnalysisErrorToastProps {
  id: ToastT['id'];
  platform: PlatformsValue;
  filterOptions: AIAnalysisData['filterOptions'];
}

export function AIAnalysisErrorToast({ id, platform, filterOptions }: AIAnalysisErrorToastProps) {
  const theme = useTheme();
  const toastBackground = theme.palette.warning.dark;
  const textColor = theme.palette.white.main;
  const { mutateAsync: postDashboardAnalysis, isPending } = usePostDashboardAnalysis(platform);
  const { setStatus, addToastId, removeToastId, clearToastIds } = useAIAnalysisStore();

  // 將 addToastId 移到 useEffect 中，避免在渲染期間更新狀態
  useEffect(() => {
    addToastId(platform, id);
  }, [platform, id, addToastId]);

  const handleClickToastLink = async () => {
    try {
      await postDashboardAnalysis(filterOptions);
      clearToastIds(platform);
      setStatus(platform, AIAnalysisStatus.InProgress);
    } catch (error) {
      console.error(error);
      setStatus(platform, AIAnalysisStatus.Error);
    }
    removeToastId(platform, id);
  };

  return (
    <HStack
      px={4}
      py={2}
      sx={{
        background: toastBackground,
      }}
      justifyContent="space-between"
      alignItems="center"
    >
      <HStack alignItems="center" gap={2} flexWrap="nowrap">
        <Icon
          name="warning"
          sx={{ color: theme.palette.white.main, fontSize: '20px', flexShrink: 0 }}
        />
        <VStack gap={1}>
          <Typography variant="bodyBold" color={textColor} sx={{ whiteSpace: 'nowrap' }}>
            {LABELS.getTitle(platform)}
          </Typography>
          <Typography variant="body2" color={textColor}>
            {LABELS.status}
          </Typography>
        </VStack>
      </HStack>
      <HStack alignItems="center" gap={2} flexWrap="nowrap">
        <Button
          variant="text"
          sx={{
            color: textColor,
            '&.MuiButton-text': {
              padding: '0 10px',
            },
          }}
          onClick={handleClickToastLink}
          isLoading={isPending}
          disabled={isPending}
        >
          <Typography
            variant="link"
            color={textColor}
            fontSize={14}
            sx={{
              textDecoration: 'underline',
            }}
          >
            {LABELS.toastLink}
          </Typography>
        </Button>
        <Icon
          name="close"
          sx={{
            fontSize: 20,
            color: textColor,
            cursor: 'pointer',
          }}
          onClick={() => removeToastId(platform, id)}
        />
      </HStack>
    </HStack>
  );
}
