import { Typography } from '@mui/material';

import { formatUtcToLocalTime } from '@shared/utils';

import { PLATFORM_CONFIG, PlatformsValue } from '@constants';
import { AWSChargeTypesMap, GranularityMap, type AWSFilter } from '@hooks-api';

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
    accounts: 'Accounts',
    tags: 'Tags',
    chargeTypes: 'Charge Types',
  },
};

const formatDate = (date?: string) => (date ? formatUtcToLocalTime(date, 'dd MMM. yyyy') : '--');

interface AWSFilterOptionsContentProps {
  filterOptions: AWSFilter;
}

export function AWSFilterOptionsContent({ filterOptions }: AWSFilterOptionsContentProps) {
  const {
    startDate,
    endDate,
    currency,
    period,
    groupBy,
    groups,
    services,
    skus,
    accounts,
    tags,
    chargeTypes,
  } = filterOptions;

  return (
    <>
      <Typography variant="bodyBold">{LABELS.analysisCriteria.title}</Typography>
      <FilterList>
        <FilterLabelValue
          label={LABELS.analysisCriteria.cloudProvider}
          value={PLATFORM_CONFIG[PlatformsValue.AWS].label}
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
          value={GroupByLabelMap[PlatformsValue.AWS][groupBy.type]}
        />
      </FilterList>
      <Typography variant="bodyBold">{LABELS.filters.title}</Typography>
      <FilterList>
        <FilterLabelValue
          label={LABELS.filters.groups}
          value={formatFilterValues(groups, LABELS.filters.groups)}
        />
        <FilterLabelValue
          label={LABELS.filters.accounts}
          value={formatFilterValues(accounts, LABELS.filters.accounts)}
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
        <FilterLabelValue
          label={LABELS.filters.chargeTypes}
          value={formatFilterValues(
            chargeTypes.map((type) => AWSChargeTypesMap[type]),
            LABELS.filters.chargeTypes
          )}
        />
      </FilterList>
    </>
  );
}
