import { CostByFOCUSTreeMap, Top10CostByFOCUSTable } from '@features';
import { CircularProgress } from '@mui/material';

import { HStack } from '@lumiture-ui';

import useOverviewParamChange from '@app/(main)/useOverviewParamChange';
import EmptyState from '@components/EmptyState/EmptyState';
import { useGetOverviewFOCUSCostRankings } from '@hooks-api';

import CardContainer from './CardContainer';

interface CostByFOCUSProps {
  isScreenshotMode?: boolean;
}

const LABELS = {
  title: 'Cost by FOCUS Framework',
  tooltip:
    'FOCUS: FinOps Open Cost & Usage Specification, an open specification that standardizes cost and usage data across cloud providers to simplify FinOps.',
  emptyState: {
    title: 'No Spending Data Yet',
    desc: 'Your cloud accounts have not generated any spending, or resources have not yet been synced to LumiTure.ai.\nOnce you begin using your resources, your spending will be displayed here.',
  },
};

export function CostByFOCUS({ isScreenshotMode = false }: CostByFOCUSProps) {
  const { period, frequency } = useOverviewParamChange();

  const { data: focusCostRankings, isLoading: isLoadingFocusCostRankings } =
    useGetOverviewFOCUSCostRankings({
      freq: frequency,
      period,
    });

  const focusCostRankingsData = focusCostRankings?.data.focusRankings ?? [];

  if (isLoadingFocusCostRankings) {
    return <CircularProgress sx={{ m: 'auto' }} />;
  }

  return (
    <CardContainer
      isScreenshotMode={isScreenshotMode}
      title={LABELS.title}
      tooltipText={LABELS.tooltip}
    >
      {focusCostRankingsData.length > 0 ? (
        <HStack sx={{ flexWrap: 'nowrap', width: '100%', alignItems: 'center' }} gap={4}>
          <CostByFOCUSTreeMap data={focusCostRankingsData} />
          <Top10CostByFOCUSTable data={focusCostRankingsData} />
        </HStack>
      ) : (
        <EmptyState
          type="emptyChart"
          title={LABELS.emptyState.title}
          desc={LABELS.emptyState.desc}
        />
      )}
    </CardContainer>
  );
}
