import { useEffect, useMemo, useState } from 'react';

import { MultiSelect, type MultiSelectChangeEvent } from '@lumiture-ui';

import { CrossCloudValue } from '@constants';
import { useGetFOCUSFilterOptions } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

export function FOCUSGroupsFilter() {
  const { [CrossCloudValue.FOCUS]: focusAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { startDate, endDate, groups } = focusAllFilters;
  const [tempGroups, setTempGroups] = useState(groups);

  useEffect(() => {
    setTempGroups(groups);
  }, [groups]);

  const { data: filterOptionsData } = useGetFOCUSFilterOptions(CrossCloudValue.FOCUS, {
    start_date: startDate,
    end_date: endDate,
  });

  const groupsOptions = useMemo(() => {
    const filterOptions = filterOptionsData?.data;
    if (!filterOptions) return [];

    return filterOptions.groups.map((group) => ({
      id: group.id,
      name: group.name,
    }));
  }, [filterOptionsData]);

  const handleGroupsChange = ({ value }: MultiSelectChangeEvent) => {
    setTempGroups(value);
  };

  const handleClose = () => {
    handleSetFilter(CrossCloudValue.FOCUS, { groups: tempGroups });
  };

  return (
    <MultiSelect
      dataTestId="focus-groups-filter"
      configKey="Groups"
      label="Groups"
      defaultDisplayLabel="All Groups"
      options={groupsOptions}
      value={tempGroups}
      onChange={handleGroupsChange}
      handleClose={handleClose}
    />
  );
}
