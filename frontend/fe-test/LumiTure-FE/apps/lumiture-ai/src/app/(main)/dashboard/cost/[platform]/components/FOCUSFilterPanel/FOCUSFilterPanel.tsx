import { Divider } from '@mui/material';

import { VStack } from '@lumiture-ui';

import { FilterPanelButton } from '../FilterPanelButton/FilterPanelButton';
import { FilterPanelHeader } from '../FilterPanelHeader/FilterPanelHeader';
import { FOCUSAdjustmentSection } from './FOCUSAdjustmentSection';
import { FOCUSFilterSection } from './FOCUSFilterSection';
import { FOCUSViewSection } from './FOCUSViewSection';

export function FOCUSFilterPanel() {
  return (
    <>
      <VStack gap={4} px={4} py={8} mb="120px">
        <FilterPanelHeader />
        <FOCUSFilterSection />
        <Divider />
        <FOCUSViewSection />
        <Divider />
        <FOCUSAdjustmentSection />
      </VStack>
      <FilterPanelButton />
    </>
  );
}
