import { useMemo, useState } from 'react';

import { GroupedMultiSelect, Markdown, type SelectedData } from '@lumiture-ui';

import { CrossCloudValue, PlatformsValue } from '@constants';
import { useGetFOCUSFilterOptions } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

export const LABELS = {
  label: 'Services Categories',
  selectPlaceholder: 'Select Services',
  defaultDisplayValue: 'All Services Categories',
  searchPlaceholder: 'Search FOCUS service categories',
  labelTooltipText:
    'To simplify FinOps across providers, we prioritize <b>FOCUS</b> (FinOps Open Cost & Usage Specification). Where standardization is not yet supported, native cloud categories are retained to provide a comprehensive cost breakdown.',
} as const;

const serviceKeyToDisplayName = {
  [CrossCloudValue.FOCUS]: 'All FOCUS Service Categories',
  [PlatformsValue.GCP]: 'All Google Cloud Service Categories',
};

export function FOCUSServiceFilter() {
  const { [CrossCloudValue.FOCUS]: focusAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { startDate, endDate } = focusAllFilters;
  const [tempServices, setTempServices] = useState<SelectedData>([]);

  const { data: filterOptionsData } = useGetFOCUSFilterOptions(CrossCloudValue.FOCUS, {
    start_date: startDate,
    end_date: endDate,
  });

  const serviceOptions = useMemo(() => {
    const filterOptions = filterOptionsData?.data;
    if (!filterOptions) return [];

    return filterOptions.services.map(({ key, values }) => ({
      key,
      displayKey: serviceKeyToDisplayName[key],
      values: values.map((value) => ({ id: value, name: value })),
    }));
  }, [filterOptionsData]);

  const handleChange = (newSelectedData: SelectedData) => {
    setTempServices(newSelectedData);
  };

  const handleClose = () => {
    const flatServices = tempServices.flatMap((item) => item.values);
    handleSetFilter(CrossCloudValue.FOCUS, { services: flatServices });
  };

  return (
    <GroupedMultiSelect
      dataTestId="focus-service-filter"
      label={LABELS.label}
      labelTooltipText={<Markdown>{LABELS.labelTooltipText}</Markdown>}
      selectPlaceholder={LABELS.selectPlaceholder}
      defaultDisplayValue={LABELS.defaultDisplayValue}
      searchPlaceholder={LABELS.searchPlaceholder}
      data={serviceOptions}
      value={tempServices}
      onChange={handleChange}
      handleClose={handleClose}
    />
  );
}
