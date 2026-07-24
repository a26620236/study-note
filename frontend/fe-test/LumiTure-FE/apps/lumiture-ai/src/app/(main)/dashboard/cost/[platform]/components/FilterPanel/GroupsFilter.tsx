import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { MultiSelect, type MultiSelectChangeEvent } from '@lumiture-ui';

import type { PlatformsValue } from '@constants';
import { useGetPlatformFilterOptions } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

export function GroupsFilter() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { startDate, endDate, groups } = platformAllFilters;
  const [tempGroups, setTempGroups] = useState(groups);

  useEffect(() => {
    setTempGroups(groups);
  }, [groups]);

  const { data: filterOptionsData } = useGetPlatformFilterOptions(platform, {
    start_date: startDate,
    end_date: endDate,
  });

  const filterOptions = filterOptionsData?.data;

  const groupsOptions = useMemo(() => {
    if (!filterOptions) return [];

    return filterOptions.groups.map((group) => ({
      id: group.id,
      name: group.name,
    }));
  }, [filterOptions]);

  const handleGroupsChange = ({ value }: MultiSelectChangeEvent) => {
    setTempGroups(value);
  };

  const handleClose = () => {
    handleSetFilter(platform, { groups: tempGroups });
  };

  return (
    <MultiSelect
      dataTestId={`${platform}-groups-filter`}
      configKey="Groups"
      label="Group"
      defaultDisplayLabel="All Groups"
      options={groupsOptions}
      value={tempGroups}
      onChange={handleGroupsChange}
      handleClose={handleClose}
    />
  );
}
