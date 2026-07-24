import { Typography } from '@mui/material';

import { HStack } from '@lumiture-ui';

import { GranularityFilter } from '../GranularityFilter';
import { GroupByFilter } from './GroupByFilter';

export const VIEW_SECTION_LABELS = {
  title: 'View',
};

export function ViewSection() {
  return (
    <>
      <HStack gap={1} alignItems="center">
        <Typography variant="bodyBold">{VIEW_SECTION_LABELS.title}</Typography>
      </HStack>
      <GroupByFilter />
      <GranularityFilter />
    </>
  );
}
