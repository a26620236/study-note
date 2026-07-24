import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { MultiSelect, type MultiSelectChangeEvent } from '@lumiture-ui';

import type { PlatformsValue } from '@constants';
import { useGetPlatformFilterOptions } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

export function ServiceFilter() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { startDate, endDate, services } = platformAllFilters;
  const [tempServices, setTempServices] = useState(services);

  useEffect(() => {
    setTempServices(services);
  }, [services]);

  const { data: filterOptionsData } = useGetPlatformFilterOptions(platform, {
    start_date: startDate,
    end_date: endDate,
  });

  const filterOptions = filterOptionsData?.data;

  const servicesOptions = useMemo(() => {
    if (!filterOptions) return [];

    return filterOptions.services.map((service) => ({
      id: service,
      name: service,
    }));
  }, [filterOptions]);

  const handleServicesChange = ({ value }: MultiSelectChangeEvent) => {
    setTempServices(value);
  };

  const handleClose = () => {
    handleSetFilter(platform, { services: tempServices });
  };

  return (
    <MultiSelect
      dataTestId={`${platform}-services-filter`}
      configKey="Services Categories"
      label="Service Category"
      defaultDisplayLabel="All Services Categories"
      options={servicesOptions}
      value={tempServices}
      onChange={handleServicesChange}
      handleClose={handleClose}
    />
  );
}
