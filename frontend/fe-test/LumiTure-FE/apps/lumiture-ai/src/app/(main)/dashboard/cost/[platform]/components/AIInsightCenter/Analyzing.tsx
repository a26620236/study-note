import { useParams } from 'next/navigation';

import { useAIAnalysisStore } from '@features';
import { Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';

import { AlertWrapper, Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { basicColor } from '@lumiture-ui/theme';
import { Spark } from '@lumiture-ui/SvgIcon';

import { Shimmer } from '@components/Shimmer';
import type { PlatformsValue } from '@constants';
import { useCancelDashboardAnalysis } from '@hooks-api';
import { AIAnalysisStatus } from '@hooks-ws';

const LABELS = {
  title: 'LumiTure.ai is now analyzing your data.',
  description:
    'This may take a few moments. Feel free to <strong>continue with Dashboard Configuration</strong>\nor <strong>leave this page</strong>. We will notify you once the analysis is complete.',
  buttonText: 'Stop Analysis',
};

export function Analyzing() {
  const theme = useTheme();
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const {
    [platform]: { data },
    setStatus,
  } = useAIAnalysisStore();
  const background = `linear-gradient(272deg, ${theme.palette.primary.main} 0%, ${basicColor.secondary.turquoiseBlue[60]} 100%)`;

  const taskId = data?.taskId;

  const { mutateAsync: cancelDashboardAnalysis } = useCancelDashboardAnalysis(platform, taskId);

  const handleCancelDashboardAnalysis = async () => {
    try {
      if (!taskId) return;
      await cancelDashboardAnalysis(taskId);
      setStatus(platform, AIAnalysisStatus.Ready);
    } catch (error) {
      setStatus(platform, AIAnalysisStatus.Error);
      console.error(error);
    }
  };

  return (
    <Shimmer width="20%" duration={1.5} repeatDelay={0.5}>
      <AlertWrapper
        boxProps={{
          sx: {
            background,
          },
        }}
      >
        <HStack alignItems="center" justifyContent="space-between" width="100%">
          <HStack gap={4} alignItems="center">
            <motion.div
              style={{
                width: '32px',
                height: '32px',
                transformStyle: 'preserve-3d',
              }}
              animate={{
                rotateZ: [0, 180, 180],
                rotateX: [0, 0, 180],
                rotateY: [0, 0, 180],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.4, 1],
              }}
            >
              <Spark
                gradient={{
                  startColor: theme.palette.primary.main,
                  endColor: basicColor.secondary.turquoiseBlue[60],
                }}
                sx={{ width: '32px', height: '32px' }}
              />
            </motion.div>
            <VStack gap={1}>
              <Typography
                variant="h6"
                sx={{
                  background,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {LABELS.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                <Markdown>{LABELS.description}</Markdown>
              </Typography>
            </VStack>
          </HStack>
          <Button
            variant="outlined"
            startIcon={<Icon name="block" fill={false} />}
            onClick={handleCancelDashboardAnalysis}
            data-testid="stop-analysis-button"
          >
            {LABELS.buttonText}
          </Button>
        </HStack>
      </AlertWrapper>
    </Shimmer>
  );
}
