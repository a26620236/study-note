import { Tooltip, useTheme } from '@mui/material';

import { Icon } from '@lumiture-ui';

import { PlatformsValue } from '@constants';
import type { AWSFilter, AzureFilter, GCPFilter } from '@hooks-api';

import { AWSFilterOptionsContent } from './AWSFilterOptionsContent';
import { AzureFilterOptionsContent } from './AzureFilterOptionsContent';
import { GCPFilterOptionsContent } from './GCPFilterOptionsContent';

interface FilterOptionsContentProps {
  filterOptions?: GCPFilter | AWSFilter | AzureFilter;
}

function FilterOptionsContent({ filterOptions }: FilterOptionsContentProps) {
  if (!filterOptions) return null;

  switch (filterOptions.platform) {
    case PlatformsValue.GCP:
      return <GCPFilterOptionsContent filterOptions={filterOptions} />;
    case PlatformsValue.AWS:
      return <AWSFilterOptionsContent filterOptions={filterOptions} />;
    case PlatformsValue.AZURE:
      return <AzureFilterOptionsContent filterOptions={filterOptions} />;
  }
}

interface CostSummaryFilterOptionProps {
  filterOptions?: GCPFilter | AWSFilter | AzureFilter;
}

export function CostSummaryFilterOption({ filterOptions }: CostSummaryFilterOptionProps) {
  const theme = useTheme();

  return (
    <Tooltip title={<FilterOptionsContent filterOptions={filterOptions} />}>
      <Icon
        name="filter_list"
        sx={{ fontSize: '18px', color: theme.palette.text.secondary }}
        data-testid="filter-option-icon"
      />
    </Tooltip>
  );
}
