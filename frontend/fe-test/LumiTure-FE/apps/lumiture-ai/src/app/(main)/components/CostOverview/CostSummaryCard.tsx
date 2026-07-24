import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';

import { nFormatAbbreviation, nFormatter } from '@shared/utils';

import { THRESHOLD_COLOR, TREND_CONFIG } from '@app/(main)/components/CostOverview/constants';
import type { GetDashboardOverviewOrgRes } from '@hooks-api';

interface CostSummaryCardProps {
  budget: GetDashboardOverviewOrgRes['totalCost']['budget'];
  warningThreshold: GetDashboardOverviewOrgRes['threshold']['warning'];
  alertThreshold: GetDashboardOverviewOrgRes['threshold']['alert'];
  title: string;
  cost?: number | null;
  desc: string;
  comparisonRate?: number | null;
  sx?: SxProps;
  isError?: boolean;
}

export interface GetCostStatusParams {
  percentage: number;
  warningThreshold: CostSummaryCardProps['warningThreshold'];
  alertThreshold: CostSummaryCardProps['alertThreshold'];
}

interface GetCostStatusReturn {
  color: string;
  threshold: number | null;
}

export const getCostStatusConfig = ({
  percentage,
  warningThreshold,
  alertThreshold,
}: GetCostStatusParams): GetCostStatusReturn => {
  if (percentage >= alertThreshold) {
    return { color: THRESHOLD_COLOR.ALERT, threshold: alertThreshold };
  }
  if (percentage >= warningThreshold) {
    return { color: THRESHOLD_COLOR.WARNING, threshold: warningThreshold };
  }
  return { color: THRESHOLD_COLOR.NORMAL, threshold: null };
};

export const getTrendConfig = ({
  comparisonRate,
  desc,
}: {
  comparisonRate: CostSummaryCardProps['comparisonRate'];
  desc: CostSummaryCardProps['desc'];
}) => {
  if (comparisonRate === null || comparisonRate === undefined) return TREND_CONFIG.NO_DATA;
  if (comparisonRate === 0) return { ...TREND_CONFIG.NEUTRAL, desc };
  if (comparisonRate > 0) return { ...TREND_CONFIG.INCREASE, desc };
  if (comparisonRate < 0) return { ...TREND_CONFIG.DECREASE, desc };
  return TREND_CONFIG.NO_DATA;
};

const CostSummaryCard = ({
  title,
  cost,
  budget,
  warningThreshold,
  alertThreshold,
  desc,
  comparisonRate,
  sx,
  isError = false,
}: CostSummaryCardProps) => {
  const { icon, color, desc: diffDesc } = getTrendConfig({ comparisonRate, desc });
  const { data } = useSession();
  const currency = data?.user.currency;

  const costStatusSettings = getCostStatusConfig({
    percentage: !cost || !budget ? 0 : cost / budget,
    warningThreshold,
    alertThreshold,
  });

  const tooltip =
    costStatusSettings.threshold &&
    `${nFormatter({ num: cost, fixed: 2 })} ${currency}\nThe cost had exceeded ${(costStatusSettings.threshold || 0) * 100 || '--'}% of your budget.`;

  return (
    <Card
      sx={{
        p: 6,
        height: 180,
        border: 'unset',
        boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.10)',
        ...sx,
      }}
    >
      {/* label */}
      <Typography variant="captionBold" color="text.secondary" sx={{ mb: 5, display: 'block' }}>
        {title}
      </Typography>
      {/* no data */}
      {cost === null || isError ? (
        <Typography
          variant="h2"
          color="text.hint"
          align="center"
          sx={{ height: '80px', lineHeight: '80px' }}
        >
          No Data
        </Typography>
      ) : (
        <>
          {/* cost */}
          <Tooltip title={tooltip}>
            <Stack
              direction="row"
              alignItems="baseline"
              sx={{ gap: 1, color: costStatusSettings.color || 'text.primary', mb: 2 }}
            >
              <Typography variant="h2">{nFormatAbbreviation({ num: cost })}</Typography>
              <Typography variant="captionBold">{currency}</Typography>
            </Stack>
          </Tooltip>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
          >
            {/* desc */}
            <Typography
              variant="caption"
              color="text.secondary"
              align="right"
              sx={{ whiteSpace: 'pre-line' }}
            >
              {diffDesc}
            </Typography>
            {/* diff percent */}
            <Stack direction="row" spacing={0.5} sx={{ color }}>
              {icon}
              <Typography>
                {typeof comparisonRate === 'number'
                  ? nFormatAbbreviation({ num: comparisonRate * 100, suffix: '%' })
                  : null}
              </Typography>
            </Stack>
          </Stack>
        </>
      )}
    </Card>
  );
};

export default CostSummaryCard;
