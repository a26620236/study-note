import { Typography } from '@mui/material';

import { formatUtcToLocalTime } from '@shared/utils';

import { PLATFORM_CONFIG, PlatformsValue } from '@constants';
import { GranularityMap, type AzureFilter } from '@hooks-api';

import { GroupByLabelMap } from '../../constants/groupByLabelMap';
import { formatFilterValues } from '../../utils/formatFilterValues';
import { FilterLabelValue, FilterList } from './FilterList';

const LABELS = {
  analysisCriteria: {
    title: 'Analysis Criteria',
    cloudProvider: 'Cloud Provider',
    analysisPeriod: 'Analysis Granularity',
    currency: 'Currency',
  },
  dashboardConfiguration: {
    title: 'Dashboard Configuration',
    granularity: 'Granularity',
    groupBy: 'Group By',
  },
  filters: {
    title: 'Filters',
    groups: 'Groups',
    services: 'Service',
    skus: 'SKUs',
    resourceGroups: 'Resource Groups',
    tags: 'Tags',
  },
};

const formatDate = (date?: string) => (date ? formatUtcToLocalTime(date, 'dd MMM. yyyy') : '--');

interface AzureFilterOptionsContentProps {
  filterOptions: AzureFilter;
}

export function AzureFilterOptionsContent({ filterOptions }: AzureFilterOptionsContentProps) {
  const {
    startDate,
    endDate,
    currency,
    period,
    groupBy,
    groups,
    services,
    skus,
    resourceGroups,
    tags,
  } = filterOptions;

  return (
    <>
      <Typography variant="bodyBold">{LABELS.analysisCriteria.title}</Typography>
      <FilterList>
        <FilterLabelValue
          label={LABELS.analysisCriteria.cloudProvider}
          value={PLATFORM_CONFIG[PlatformsValue.AZURE].label}
        />
        <FilterLabelValue
          label={LABELS.analysisCriteria.analysisPeriod}
          value={`${formatDate(startDate)} - ${formatDate(endDate)}`}
        />
        <FilterLabelValue label={LABELS.analysisCriteria.currency} value={currency ?? '--'} />
      </FilterList>
      <Typography variant="bodyBold">{LABELS.dashboardConfiguration.title}</Typography>
      <FilterList>
        <FilterLabelValue
          label={LABELS.dashboardConfiguration.granularity}
          value={GranularityMap[period]}
        />
        <FilterLabelValue
          label={LABELS.dashboardConfiguration.groupBy}
          value={GroupByLabelMap[PlatformsValue.AZURE][groupBy.type]}
        />
      </FilterList>
      <Typography variant="bodyBold">{LABELS.filters.title}</Typography>
      <FilterList>
        <FilterLabelValue
          label={LABELS.filters.groups}
          value={formatFilterValues(groups, LABELS.filters.groups)}
        />
        <FilterLabelValue
          label={LABELS.filters.resourceGroups}
          value={formatFilterValues(resourceGroups, LABELS.filters.resourceGroups)}
        />
        <FilterLabelValue
          label={LABELS.filters.services}
          value={formatFilterValues(services, LABELS.filters.services)}
        />
        <FilterLabelValue
          label={LABELS.filters.skus}
          value={formatFilterValues(skus, LABELS.filters.skus)}
        />
        <FilterLabelValue
          label={LABELS.filters.tags}
          value={formatFilterValues(
            tags.map((t) => `${t.key}: ${t.values.join(', ')}`),
            LABELS.filters.tags
          )}
        />
      </FilterList>
    </>
  );
}
