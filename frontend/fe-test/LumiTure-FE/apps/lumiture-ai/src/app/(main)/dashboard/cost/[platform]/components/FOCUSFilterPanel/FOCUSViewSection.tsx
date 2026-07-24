import { Typography } from '@mui/material';

import { HStack } from '@lumiture-ui';

import { VIEW_SECTION_LABELS } from '../FilterPanel/ViewSection';
import { GranularityFilter } from '../GranularityFilter';
import { FOCUSGroupByFilter } from './FOCUSGroupByFilter';

export function FOCUSViewSection() {
  return (
    <>
      <HStack gap={1} alignItems="center">
        <Typography variant="bodyBold">{VIEW_SECTION_LABELS.title}</Typography>
      </HStack>
      <FOCUSGroupByFilter />
      <GranularityFilter />
    </>
  );
}
