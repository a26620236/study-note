import { Paper, Typography } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

import { useGetRightsizingOverview } from '@hooks-api';

import { PAPER_HEIGHT } from '../../constants/rightsizing';

const LABELS = {
  title: 'Optimization Completed',
  noData: 'No Data',
  progressNotAvailable: 'Completion progress not available',
};

export function OptimizationCompleted() {
  const { data: overviewResponse } = useGetRightsizingOverview();
  const overviewData = overviewResponse?.data;

  const { recommendationsCompleted } = overviewData ?? {};

  const hasData = !!recommendationsCompleted;
  const hasDenominator = recommendationsCompleted?.total && recommendationsCompleted.total > 0;

  const percentage =
    hasData && hasDenominator
      ? ((recommendationsCompleted.done / recommendationsCompleted.total) * 100).toFixed(2)
      : 0;

  return (
    <Paper sx={{ padding: '24px', height: PAPER_HEIGHT }}>
      <VStack gap={1}>
        <Typography variant="captionBold" color="text.secondary">
          {LABELS.title}
        </Typography>
        <Typography variant="h2" color={hasData ? 'text.primary' : 'text.hint'}>
          {hasData
            ? `${recommendationsCompleted.done} / ${recommendationsCompleted.total}`
            : LABELS.noData}
        </Typography>
        <HStack justifyContent="flex-end" flexWrap="nowrap">
          <Typography variant="caption" color="text.secondary">
            {hasData ? `${percentage}% completed` : LABELS.progressNotAvailable}
          </Typography>
        </HStack>
      </VStack>
    </Paper>
  );
}
