import { Tooltip, Typography } from '@mui/material';

import { HStack, Icon, Markdown } from '@lumiture-ui';

import { CloudScopeFilter } from './CloudScopeFilter';
import { CloudTagFilter } from './CloudTagFilter';
import { GroupsFilter } from './GroupsFilter';
import { LumitagFilter } from './LumitagFilter';
import { ServiceFilter } from './ServiceFilter';
import { SkuFilter } from './SkuFilter';

export const FILTER_SECTION_LABELS = {
  title: 'Filter',
  tooltip:
    '<strong>Data Intersection:</strong> The data displayed in the chart represents the intersection of all specified filter criteria, meaning it includes only the data points that meet all conditions.',
};

export function FilterSection() {
  return (
    <>
      <HStack gap={1} alignItems="center">
        <Typography variant="bodyBold">{FILTER_SECTION_LABELS.title}</Typography>
        <Tooltip title={<Markdown>{FILTER_SECTION_LABELS.tooltip}</Markdown>}>
          <Icon name="info" sx={{ color: 'text.hint', fontSize: 16 }} />
        </Tooltip>
      </HStack>
      <GroupsFilter />
      <CloudScopeFilter />
      <ServiceFilter />
      <SkuFilter />
      <LumitagFilter />
      <CloudTagFilter />
    </>
  );
}
