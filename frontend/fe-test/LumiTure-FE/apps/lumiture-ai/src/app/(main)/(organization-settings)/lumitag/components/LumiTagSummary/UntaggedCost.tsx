import { Box, Paper, Tooltip, Typography } from '@mui/material';

import { HStack, Icon, VStack } from '@lumiture-ui';
import { nFormatAbbreviation } from '@shared/utils';

import { useGetLumiTagList } from '@hooks-api';

const LABELS = {
  title: 'Untagged Cost',
  noData: '--',
  tooltip:
    'The total cost of resources that have not been assigned to any LumiTag value. Excludes credits. Due to data latency from cloud service providers, values may differ slightly from final billing.',
};

export function UntaggedCost() {
  const { data: lumiTagResponse } = useGetLumiTagList();
  const metricsBanner = lumiTagResponse?.data.metricsBanner;
  const untaggedCost = metricsBanner?.untaggedCost;
  const untaggedPercentage = (100 - (metricsBanner?.aai ?? 0)).toFixed(1);

  const hasData = untaggedCost !== undefined;
  const displayValue =
    untaggedCost === undefined
      ? LABELS.noData
      : nFormatAbbreviation({ num: untaggedCost, prefix: '$' });
  const description = `${untaggedPercentage}% cost remains untagged`;

  return (
    <Paper sx={{ padding: '24px', flex: 1 }}>
      <VStack gap={1}>
        <HStack alignItems="center" flexWrap="nowrap" gap={1}>
          <Typography variant="captionBold" color="text.secondary">
            {LABELS.title}
          </Typography>
          <Tooltip title={LABELS.tooltip}>
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
            {description}
          </Typography>
        </HStack>
      </VStack>
    </Paper>
  );
}
