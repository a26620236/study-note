import { useParams } from 'next/navigation';

import { SingleSelect, type SingleSelectChangeEvent } from '@lumiture-ui';

import type { PlatformsValue } from '@constants';
import { Granularity, GranularityMap } from '@hooks-api';

import { useCostDashboardStore } from '../hooks/useCostDashboardStore';

export function GranularityFilter() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { period } = platformAllFilters;

  const periodOptions = [
    { id: Granularity.Day, name: GranularityMap[Granularity.Day] },
    { id: Granularity.Month, name: GranularityMap[Granularity.Month] },
  ] as const;

  const handlePeriodChange = ({ value }: SingleSelectChangeEvent<Granularity>) => {
    if (value === null) return;
    handleSetFilter(platform, { period: value });
  };

  return (
    <SingleSelect
      dataTestId={`${platform}-granularity-filter`}
      configKey="Granularity"
      label="Granularity"
      options={periodOptions}
      value={period}
      onChange={handlePeriodChange}
    />
  );
}
