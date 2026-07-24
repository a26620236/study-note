import { Typography } from '@mui/material';

import { formatUtcToLocalTime } from '@shared/utils';

import { PLATFORM_CONFIG, PlatformsValue } from '@constants';
import { GranularityMap, type GCPFilter } from '@hooks-api';

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
    projects: 'Projects',
    labels: 'Labels',
    credits: 'Credits',
  },
};

const formatDate = (date?: string) => (date ? formatUtcToLocalTime(date, 'dd MMM. yyyy') : '--');

interface GCPFilterOptionsContentProps {
  filterOptions: GCPFilter;
}

export function GCPFilterOptionsContent({ filterOptions }: GCPFilterOptionsContentProps) {
  const {
    startDate,
    endDate,
    currency,
    period,
    groupBy,
    groups,
    services,
    skus,
    projects,
    labels,
    credits,
  } = filterOptions;

  return (
    <>
      <Typography variant="bodyBold">{LABELS.analysisCriteria.title}</Typography>
      <FilterList>
        <FilterLabelValue
          label={LABELS.analysisCriteria.cloudProvider}
          value={PLATFORM_CONFIG[PlatformsValue.GCP].label}
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
          value={GroupByLabelMap[PlatformsValue.GCP][groupBy.type]}
        />
      </FilterList>
      <Typography variant="bodyBold">{LABELS.filters.title}</Typography>
      <FilterList>
        <FilterLabelValue
          label={LABELS.filters.groups}
          value={formatFilterValues(groups, LABELS.filters.groups)}
        />
        <FilterLabelValue
          label={LABELS.filters.projects}
          value={formatFilterValues(projects, LABELS.filters.projects)}
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
          label={LABELS.filters.labels}
          value={formatFilterValues(
            labels.map((l) => `${l.key}: ${l.values.join(', ')}`),
            LABELS.filters.labels
          )}
        />
        <FilterLabelValue
          label={LABELS.filters.credits}
          value={formatFilterValues(credits.map(String), LABELS.filters.credits)}
        />
      </FilterList>
    </>
  );
}
