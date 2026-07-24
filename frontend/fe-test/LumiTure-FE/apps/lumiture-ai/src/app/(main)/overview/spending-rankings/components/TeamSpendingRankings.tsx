'use client';

import { useEffect, useRef } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { sendGAEvent } from '@next/third-parties/google';

import FrequencySelector from '@app/(main)/components/optimize-cloud-spend/highestSpending/FrequencySelector';
import SpendingRankingsChart from '@app/(main)/overview/spending-rankings/components/SpendingRankingsChart';
import TopInfos from '@app/(main)/overview/spending-rankings/components/TopInfos';
import useOverviewParamChange from '@app/(main)/useOverviewParamChange';
import EmptyState from '@components/EmptyState/EmptyState';
import { EVENT_FULL_RANK, OVERVIEW_PATHS } from '@constants';
import { useGetSpendingRankings, type OverviewPeriod } from '@hooks-api';

interface TeamSpendingRankingsProps {
  isScreenshotMode?: boolean;
  onTakeScreenshot?: () => void;
}

const TeamSpendingRankings = ({
  isScreenshotMode,
  onTakeScreenshot,
}: TeamSpendingRankingsProps) => {
  const { frequency, period, periodCaption, handleParamsChange } = useOverviewParamChange();

  const preFrequency = useRef<OverviewPeriod | null>(null);

  const {
    data: spendingRankingsData,
    isLoading: isLoadingSpendingRankings,
    isSuccess: isSuccessSpendingRankings,
    isError: isErrorSpendingRankings,
  } = useGetSpendingRankings({ freq: frequency, period });
  const spendingRankings = spendingRankingsData?.data;

  const isNoData = spendingRankings?.costRankings.length === 0;
  const isEmptySpendingRankings =
    (isSuccessSpendingRankings && isNoData) || isErrorSpendingRankings;
  const groupCosts = spendingRankings?.costRankings ?? [];

  const handleFrequencyChange = (value: OverviewPeriod) => {
    handleParamsChange({
      frequency: value,
      path: OVERVIEW_PATHS.spendingRankings.pathname,
    });
  };

  useEffect(() => {
    if (preFrequency.current === frequency) return;
    preFrequency.current = frequency;
    sendGAEvent('event', EVENT_FULL_RANK.DISPLAY_FREQ, { freq: frequency });
  }, [frequency]);

  return (
    <>
      <TopInfos
        isDisabledScreenShot={isScreenshotMode || isLoadingSpendingRankings}
        isScreenshotMode={isScreenshotMode}
        onTakeScreenshot={onTakeScreenshot}
      />
      <Stack direction="row" justifyContent="flex-end">
        <FrequencySelector
          isScreenshotMode={isScreenshotMode}
          label="Display Frequency"
          frequency={frequency}
          setFrequency={handleFrequencyChange}
          isLoading={isLoadingSpendingRankings}
        />
      </Stack>
      <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2, mb: -5 }}>
        <Typography color="text.hint" variant="caption" sx={{ fontStyle: 'italic' }}>
          {`OverviewPeriod: ${periodCaption}`}
        </Typography>
      </Stack>
      <Stack
        sx={{ minHeight: isLoadingSpendingRankings || isEmptySpendingRankings ? 400 : 'unset' }}
      >
        {isLoadingSpendingRankings ? (
          <CircularProgress sx={{ m: 'auto' }} />
        ) : isEmptySpendingRankings ? (
          <EmptyState type="emptyChart" />
        ) : (
          <SpendingRankingsChart isScreenshotMode={isScreenshotMode} sourceData={groupCosts} />
        )}
      </Stack>
    </>
  );
};

export default TeamSpendingRankings;
