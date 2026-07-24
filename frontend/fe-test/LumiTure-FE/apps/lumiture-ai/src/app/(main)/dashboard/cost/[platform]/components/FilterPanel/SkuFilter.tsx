import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { MultiSelect, type MultiSelectChangeEvent } from '@lumiture-ui';

import type { PlatformsValue } from '@constants';
import { useGetPlatformFilterOptions } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

export function SkuFilter() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { startDate, endDate, skus } = platformAllFilters;
  const [tempSkus, setTempSkus] = useState(skus);

  useEffect(() => {
    setTempSkus(skus);
  }, [skus]);

  const { data: filterOptionsData } = useGetPlatformFilterOptions(platform, {
    start_date: startDate,
    end_date: endDate,
  });

  const filterOptions = filterOptionsData?.data;

  const skusOptions = useMemo(() => {
    if (!filterOptions) return [];

    return filterOptions.skus.map((sku) => ({
      id: sku.id,
      name: sku.description,
    }));
  }, [filterOptions]);

  const handleSkusChange = ({ value }: MultiSelectChangeEvent) => {
    setTempSkus(value);
  };

  const handleClose = () => {
    handleSetFilter(platform, { skus: tempSkus });
  };

  return (
    <MultiSelect
      dataTestId={`${platform}-skus-filter`}
      configKey="SKUs"
      label="SKU"
      defaultDisplayLabel="All SKUs"
      options={skusOptions}
      value={tempSkus}
      onChange={handleSkusChange}
      handleClose={handleClose}
    />
  );
}
