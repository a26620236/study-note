import { Dialog, Typography } from '@mui/material';

import { HStack, Icon, VStack } from '@lumiture-ui';

import { AnalysisSection } from './AnalysisSection';
import { CostCalculator } from './CostCalculator';
import { RecommendationSummary } from './RecommendationSummary';

interface RightsizingDialogAIRecommendProps {
  recId: string;
  open: boolean;
  onClose: () => void;
}

export function RightsizingDialogRecommendDetail({
  recId,
  open,
  onClose,
}: RightsizingDialogAIRecommendProps) {
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
          <Typography variant="h4">Recommendation Details</Typography>
          <Icon
            name="close"
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              fontSize: 24,
            }}
            onClick={onClose}
          />
        </HStack>
        {/* Content */}
        <RecommendationSummary recId={recId} />
        <AnalysisSection recId={recId} />
        <CostCalculator recId={recId} />
      </VStack>
    </Dialog>
  );
}
