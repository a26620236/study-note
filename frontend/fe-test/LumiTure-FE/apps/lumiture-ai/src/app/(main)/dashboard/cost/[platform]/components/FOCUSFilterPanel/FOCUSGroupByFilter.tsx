import { SingleSelect, type SingleSelectChangeEvent } from '@lumiture-ui';

import { CrossCloudValue } from '@constants';
import { FOCUSGroupBy, FOCUSGroupByMap } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

const LABELS = {
  label: 'GroupBy',
  serviceCategoryTooltipText:
    'FOCUS: FinOps Open Cost & Usage Specification, an open specification that standardizes cost and usage data across cloud providers to simplify FinOps.',
} as const;

const focusGroupByOptions = [
  { id: FOCUSGroupBy.Organization, name: FOCUSGroupByMap[FOCUSGroupBy.Organization] },
  {
    id: FOCUSGroupBy.CloudServiceProvider,
    name: FOCUSGroupByMap[FOCUSGroupBy.CloudServiceProvider],
  },
  { id: FOCUSGroupBy.Group, name: FOCUSGroupByMap[FOCUSGroupBy.Group] },
  {
    id: FOCUSGroupBy.ServiceCategory,
    name: FOCUSGroupByMap[FOCUSGroupBy.ServiceCategory],
    tooltipText: LABELS.serviceCategoryTooltipText,
  },
] as const;

export function FOCUSGroupByFilter() {
  const { [CrossCloudValue.FOCUS]: focusAllFilters } = useCostDashboardStore((state) => state);
  const handleSetFilter = useCostDashboardStore((state) => state.handleSetFilter);

  const handleGroupByChange = ({ value }: SingleSelectChangeEvent<FOCUSGroupBy>) => {
    if (value === null) return;
    handleSetFilter(CrossCloudValue.FOCUS, { groupBy: { type: value, key: null } });
  };

  return (
    <SingleSelect
      dataTestId="focus-group-by-filter"
      configKey="GroupBy"
      label={LABELS.label}
      options={focusGroupByOptions}
      value={focusAllFilters.groupBy.type}
      onChange={handleGroupByChange}
    />
  );
}
