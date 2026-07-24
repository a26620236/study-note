import { useParams } from 'next/navigation';

import { Divider } from '@mui/material';

import { VStack } from '@lumiture-ui';

import { PlatformsValue } from '@constants';

import { FilterPanelButton } from '../FilterPanelButton/FilterPanelButton';
import { FilterPanelHeader } from '../FilterPanelHeader/FilterPanelHeader';
import { AdjustmentSection } from './AdjustmentSection';
import { FilterSection } from './FilterSection';
import { ViewSection } from './ViewSection';

export function FilterPanel() {
  const { platform } = useParams<{ platform: PlatformsValue }>();

  const isAzureFilter = platform === PlatformsValue.AZURE;

  return (
    <>
      <VStack gap={4} px={4} py={8} mb="120px">
        <FilterPanelHeader />
        <FilterSection />
        <Divider />
        <ViewSection />
        {!isAzureFilter && (
          <>
            <Divider />
            <AdjustmentSection />
          </>
        )}
      </VStack>
      <FilterPanelButton />
    </>
  );
}
