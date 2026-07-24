import { CostByFOCUSTreeMap, Top10CostByFOCUSTable } from '@features';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { CircularProgress, Paper, Tooltip, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';

import { HStack, VStack } from '@lumiture-ui';

import EmptyState from '@components/EmptyState/EmptyState';

import { useGetFiscalReportQuery } from '../hooks/useGetFiscalReportQuery';
import { getEndPeriod } from '../utils/getEndPeriod';

const LABELS = {
  title: 'Cost by FOCUS Framework',
  tooltip:
    'FOCUS: FinOps Open Cost & Usage Specification, an open specification that standardizes cost and usage data across cloud providers to simplify FinOps.',
  getCurrency: (currency: string) => `Cost (${currency})`,
  emptyState: {
    title: 'No Spending Data Yet',
    desc: 'Your cloud accounts have not generated any spending, or resources have not yet been synced to LumiTure.ai.\nOnce you begin using your resources, your spending will be displayed here.',
  },
};

export function CostByFOCUSSection() {
  const { data: session } = useSession();
  const currency = session?.user.currencyInfo;

  const { data: fiscalReport, isLoading: isLoadingFiscalReport } = useGetFiscalReportQuery();

  const { focusServiceCategoryCost, period } = fiscalReport?.data ?? {};

  const FOCUSCostRankingsData = focusServiceCategoryCost?.focusRankings ?? [];

  if (isLoadingFiscalReport) {
    return <CircularProgress sx={{ m: 'auto' }} />;
  }

  return (
    <Paper>
      <VStack sx={{ gap: 4 }}>
        <HStack sx={{ justifyContent: 'space-between' }}>
          <HStack sx={{ alignItems: 'center' }} gap={2}>
            <Typography variant="h5">{LABELS.title}</Typography>
            <Tooltip title={LABELS.tooltip}>
              <InfoRoundedIcon sx={{ fontSize: 16, color: 'text.hint' }} />
            </Tooltip>
          </HStack>
        </HStack>

        <HStack sx={{ justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.hint">
            {LABELS.getCurrency(currency?.value ?? '')}
          </Typography>
          <Typography color="text.hint" sx={{ fontStyle: 'italic' }}>
            {getEndPeriod(period?.end)}
          </Typography>
        </HStack>

        <HStack sx={{ flexWrap: 'nowrap', width: '100%', alignItems: 'center' }} gap={4}>
          {FOCUSCostRankingsData.length > 0 ? (
            <>
              <CostByFOCUSTreeMap data={FOCUSCostRankingsData} />
              <Top10CostByFOCUSTable data={FOCUSCostRankingsData} />
            </>
          ) : (
            <EmptyState
              type="emptyChart"
              title={LABELS.emptyState.title}
              desc={LABELS.emptyState.desc}
            />
          )}
        </HStack>
      </VStack>
    </Paper>
  );
}
