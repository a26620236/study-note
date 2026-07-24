'use client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { useTakeScreenshot } from '@shared/hooks';

import ScreenshotNotes from '@app/(main)/overview/spending-rankings/components/ScreenshotNotes';
import TeamSpendingRankings from '@app/(main)/overview/spending-rankings/components/TeamSpendingRankings';
import useOverviewParamChange from '@app/(main)/useOverviewParamChange';
import CurrencySelector from '@components/CurrencySelector/CurrencySelector';
import GoBack from '@components/GoBack';
import ScreenshotWrapper from '@components/ScreenshotWrapper';
import { OVERVIEW_PATHS } from '@constants';

const SpendingRankings = () => {
  const { screenshotRef, isScreenshotMode, handleTakeScreenshot } = useTakeScreenshot({
    fileName: 'LumiTure_spending_rankings',
  });

  const { handleParamsChange } = useOverviewParamChange();

  const handleGoBack = () => {
    handleParamsChange({ path: OVERVIEW_PATHS.overview.pathname });
  };

  return (
    <>
      <Stack alignContent="center" justifyContent="space-between" direction="row" sx={{ mb: 4 }}>
        <GoBack content="Back to Overview" onClick={handleGoBack} />
        <CurrencySelector />
      </Stack>

      <Paper>
        <TeamSpendingRankings onTakeScreenshot={handleTakeScreenshot} />
      </Paper>

      {isScreenshotMode && (
        <ScreenshotWrapper ref={screenshotRef}>
          <CurrencySelector sx={{ ml: 'auto', mb: 4, '& .MuiIcon-root': { display: 'none' } }} />
          <Paper>
            <TeamSpendingRankings isScreenshotMode />
          </Paper>
          <ScreenshotNotes />
        </ScreenshotWrapper>
      )}
    </>
  );
};

export default SpendingRankings;
