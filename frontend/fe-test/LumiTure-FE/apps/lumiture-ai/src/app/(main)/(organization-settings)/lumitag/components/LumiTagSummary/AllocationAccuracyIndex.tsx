import { Box, Paper, Tooltip, Typography } from '@mui/material';

import { HStack, Icon, Markdown, VStack } from '@lumiture-ui';

import { useGetLumiTagList } from '@hooks-api';

const LABELS = {
  title: 'Allocation Accuracy Index',
  suffix: '/ 100',
  description: 'Cloud cost tagged',
  noData: '--',
  tooltip:
    '**Allocation Accuracy Index (AAI)** measures how well your cloud cost is tagged with LumiTags. A score of 100 means all cost is fully allocated. Due to data latency from cloud service providers, values may differ slightly from final billing.',
};

export function AllocationAccuracyIndex() {
  const { data: lumiTagResponse } = useGetLumiTagList();
  const metricsBanner = lumiTagResponse?.data.metricsBanner;
  const aai = metricsBanner?.aai;

  const hasData = aai !== undefined;
  const displayValue = aai === undefined ? LABELS.noData : `${aai} ${LABELS.suffix}`;

  return (
    <Paper sx={{ padding: '24px', flex: 1 }}>
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
          {displayValue}
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
