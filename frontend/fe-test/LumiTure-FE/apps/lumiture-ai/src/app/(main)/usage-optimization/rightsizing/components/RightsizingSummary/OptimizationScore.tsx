import { Box, Paper, Tooltip, Typography } from '@mui/material';

import { HStack, Icon, Markdown, VStack } from '@lumiture-ui';

import { useGetRightsizingOverview } from '@hooks-api';

import { PAPER_HEIGHT } from '../../constants/rightsizing';

const LABELS = {
  title: 'Optimization Score',
  noData: 'No Data',
  description: 'Higher means more optimized',
  tooltip:
    '<strong>Optimized Score</strong> is calculated as: <br /><u><em>(Total Cost - Avoidance Opportunities) / Total Cost x 100</em></u><br />Total cost calculated for the current month.',
};

export function OptimizationScore() {
  const { data: overviewResponse } = useGetRightsizingOverview();
  const overviewData = overviewResponse?.data;

  const { optimizedScore } = overviewData ?? {};

  // 使用 undefined 來判斷是否沒有資料，因為 percentage 可能為 0（有效值）
  const hasData = optimizedScore !== undefined;
  const formattedPercentage = hasData ? Math.floor(optimizedScore * 100) : LABELS.noData;

  return (
    <Paper sx={{ padding: '24px', height: PAPER_HEIGHT }}>
      <VStack gap={1}>
        <HStack alignItems="center" flexWrap="nowrap" gap={1}>
          <Typography variant="captionBold" color="text.secondary">
            {LABELS.title}
          </Typography>
          <Tooltip title={<Markdown>{LABELS.tooltip}</Markdown>}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Icon name="info" sx={{ fontSize: 16, color: 'text.hint', cursor: 'pointer' }} />
            </Box>
          </Tooltip>
        </HStack>
        <Typography variant="h2" color={hasData ? 'text.primary' : 'text.hint'}>
          {formattedPercentage}
        </Typography>
        <HStack justifyContent="flex-end">
          <Typography variant="caption" color="text.secondary">
            {LABELS.description}
          </Typography>
        </HStack>
      </VStack>
    </Paper>
  );
}
