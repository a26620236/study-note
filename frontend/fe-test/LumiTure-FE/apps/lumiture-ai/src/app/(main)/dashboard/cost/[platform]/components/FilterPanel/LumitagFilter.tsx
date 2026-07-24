import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { GroupedMultiSelect, type GroupData, type SelectedData } from '@lumiture-ui';

import type { PlatformsValue } from '@constants';
import { useGetPlatformFilterOptions } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

const LABELS = {
  label: 'LumiTag',
  allDisplay: 'All LumiTags',
  searchPlaceholder: 'Search LumiTag keys or values',
};

export function LumitagFilter() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { startDate, endDate, lumitag } = platformAllFilters;

  const { data: filterOptionsData } = useGetPlatformFilterOptions(platform, {
    start_date: startDate,
    end_date: endDate,
  });

  const filterOptions = filterOptionsData?.data;

  const selectedLumitags = useMemo<SelectedData>(
    () => lumitag.map(({ keyId, valueIds }) => ({ key: keyId, values: valueIds })),
    [lumitag]
  );

  const [tempSelectedLumitags, setTempSelectedLumitags] = useState<SelectedData>(selectedLumitags);

  useEffect(() => {
    setTempSelectedLumitags(selectedLumitags);
  }, [selectedLumitags]);

  const lumitagOptions = useMemo<GroupData>(() => {
    if (!filterOptions) return [];

    return filterOptions.lumitag.keys.map((key) => ({
      key: key.id,
      displayKey: key.name,
      values: key.values.map((value) => ({ id: value.id, name: value.name })),
    }));
  }, [filterOptions]);

  const handleChange = (newSelectedLumitags: SelectedData) => {
    setTempSelectedLumitags(newSelectedLumitags);
  };

  const handleClose = () => {
    handleSetFilter(platform, {
      lumitag: tempSelectedLumitags.map(({ key, values }) => ({ keyId: key, valueIds: values })),
    });
  };

  return (
    <GroupedMultiSelect
      dataTestId={`${platform}-lumitag-filter`}
      label={LABELS.label}
      defaultDisplayValue={LABELS.allDisplay}
      selectPlaceholder={LABELS.allDisplay}
      searchPlaceholder={LABELS.searchPlaceholder}
      data={lumitagOptions}
      value={tempSelectedLumitags}
      onChange={handleChange}
      handleClose={handleClose}
      defaultExpanded={false}
    />
  );
}
