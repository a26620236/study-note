import { alpha, Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import EllipsisTooltipCell from '@components/table/EllipsisTooltipCell';
import { Currency } from '@constants';
import { useGetRightsizingRecommendDetail, type RecommendationItem } from '@hooks-api';

import { RecommendationSummarySkeleton } from './RecommendationSummarySkeleton';

const LABELS = {
  estimatedAvoidance: 'Estimated Avoidance',
  monthly: ' / month',
  getInstanceType: (oldInstanceType: string, newInstanceType: string) =>
    `by changing from ${oldInstanceType} to ${newInstanceType}`,
  criteria: 'Criteria Applied:',
};

interface RecommendationSummaryProps {
  recId: RecommendationItem['recId'];
}

export function RecommendationSummary({ recId }: RecommendationSummaryProps) {
  const currency = Currency.USD;
  const { data: recommendDetail, isLoading } = useGetRightsizingRecommendDetail(recId);

  const {
    name = '--',
    estSaving,
    strategy = ['--', '--'],
    criteria = '--',
  } = recommendDetail?.data.recommendDetail ?? {};

  const formattedEstSaving = estSaving ? estSaving.toFixed(2) : '--';
  const formattedCriteria = `${LABELS.criteria} ${criteria}`;

  return (
    <VStack
      mt={8}
      p={2.5}
      borderRadius={2.5}
      gap={1.5}
      alignItems="center"
      justifyContent="center"
      boxShadow={`0px 1px 10px 0px ${alpha(theme.palette.black.main, 0.2)}`}
      width="100%"
    >
      {isLoading ? (
        <RecommendationSummarySkeleton />
      ) : (
        <>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="h4" color={theme.palette.primary.main}>
            {`${LABELS.estimatedAvoidance}: ${currency} ${formattedEstSaving} ${LABELS.monthly}`}
          </Typography>
          <Typography variant="bodyBold">
            {LABELS.getInstanceType(strategy[0], strategy[1])}
          </Typography>
          <EllipsisTooltipCell
            text={
              <Typography variant="caption" color="text.secondary">
                {formattedCriteria}
              </Typography>
            }
            sx={{ textAlign: 'center' }}
            tooltipText={formattedCriteria}
          />
        </>
      )}
    </VStack>
  );
}
