import { Box, Dialog, Typography, useTheme } from '@mui/material';

import { HStack, Icon, VStack } from '@lumiture-ui';
import { basicColor } from '@lumiture-ui/theme';
import { Spark } from '@lumiture-ui/SvgIcon';
import { formatUtcToLocalTime } from '@shared/utils';

import { PLATFORM_CONFIG, PlatformsValue } from '@constants';
import type { AnalysisHistoryItem } from '@hooks-api';
import type { AIAnalysis } from '@hooks-ws';

import { CostSummaryFilterOption } from '../CostSummaryFilterOption/CostSummaryFilterOption';
import { CostSummary } from './CostSummary';
import { PinnedCostSummary } from './PinnedCostSummary';

const LABELS = {
  title: 'Cost Summary',
  createTime: 'Time Created',
  bottomText: 'AI may make mistakes. Please verify important information.',
};

interface CostSummaryDialogProps {
  summary?: AnalysisHistoryItem['summary'];
  summaryId?: AnalysisHistoryItem['id'];
  filterOptions?: AnalysisHistoryItem['filterOptions'];
  createTime?: AIAnalysis['timestamp'];
  isPinned: boolean;
  setIsPinned?: () => void;
  open: boolean;
  onClose: () => void;
}

export function CostSummaryDialog({
  summary,
  summaryId,
  filterOptions,
  createTime,
  isPinned,
  setIsPinned,
  open,
  onClose,
}: CostSummaryDialogProps) {
  const theme = useTheme();

  const { platform = PlatformsValue.GCP } = filterOptions ?? {};

  const IconComponent = PLATFORM_CONFIG[platform].icon;

  const formattedCreateTime = createTime
    ? formatUtcToLocalTime(createTime, 'dd MMM. yyyy HH:mm:ss')
    : '--';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableRestoreFocus
      sx={{
        '& .MuiDialog-paper': {
          p: '24px 32px',
          width: 1000,
          maxHeight: '720px',
          overflowY: 'auto',
          margin: 0,
        },
      }}
    >
      <VStack>
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" gap={6}>
            <Spark
              gradient={{
                startColor: theme.palette.primary.main,
                endColor: basicColor.secondary.turquoiseBlue[60],
              }}
              sx={{ width: '30px', height: '30px' }}
            />
            <Typography variant="h4">{LABELS.title}</Typography>
          </HStack>
          <Icon
            name="close"
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              fontSize: 24,
            }}
            onClick={onClose}
            data-testid="close-summary-button"
          />
        </HStack>
        {/* Content */}
        <HStack justifyContent="space-between" mt={6}>
          <HStack alignItems="center" gap={1}>
            <IconComponent />
            <Typography variant="caption" color="text.hint">
              {LABELS.createTime} {formattedCreateTime}
            </Typography>
          </HStack>
          <HStack alignItems="center" gap={2}>
            <CostSummaryFilterOption filterOptions={filterOptions} />
            <PinnedCostSummary id={summaryId} isPinned={isPinned} setIsPinned={setIsPinned} />
          </HStack>
        </HStack>
        <Box
          border="1px solid"
          borderColor={theme.palette.gray.border}
          borderRadius="10px"
          p={4}
          maxHeight="532px"
          overflow="auto"
          mt={4}
        >
          <CostSummary summary={summary} titleVariant="bodyBold" contentVariant="body1" />
        </Box>
        <Typography variant="body1" color="text.secondary" mt={6} textAlign="center">
          {LABELS.bottomText}
        </Typography>
      </VStack>
    </Dialog>
  );
}
