import { Tooltip, Typography } from '@mui/material';

import { HStack, Icon, Markdown } from '@lumiture-ui';

import { FILTER_SECTION_LABELS } from '../FilterPanel/FilterSection';
import { CloudServiceProvidersFilter } from './CloudServiceProvidersFilter';
import { FOCUSGroupsFilter } from './FOCUSGroupsFilter';
import { FOCUSServiceFilter } from './FOCUSServiceFilter';

export function FOCUSFilterSection() {
  return (
    <>
      <HStack gap={1} alignItems="center">
        <Typography variant="bodyBold">{FILTER_SECTION_LABELS.title}</Typography>
        <Tooltip title={<Markdown>{FILTER_SECTION_LABELS.tooltip}</Markdown>}>
          <Icon name="info" sx={{ color: 'text.hint', fontSize: 16 }} />
        </Tooltip>
      </HStack>
      <CloudServiceProvidersFilter />
      <FOCUSGroupsFilter />
      <FOCUSServiceFilter />
    </>
  );
}
