import { useEffect, useState } from 'react';

import { MultiSelect, type MultiSelectChangeEvent } from '@lumiture-ui';

import { AWS, AZURE, CrossCloudValue, GCP, PlatformsValue } from '@constants';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

const cloudServiceProvidersOptions = [
  { id: PlatformsValue.AWS, name: AWS.label },
  { id: PlatformsValue.AZURE, name: AZURE.label },
  { id: PlatformsValue.GCP, name: GCP.label },
];

const LABELS = {
  label: 'Cloud Service Providers',
  defaultDisplayLabel: 'All Cloud Service Providers',
  searchPlaceholder: 'Search all providers',
};

export function CloudServiceProvidersFilter() {
  const platform = useCostDashboardStore((state) => state[CrossCloudValue.FOCUS].platform);
  const handleSetFilter = useCostDashboardStore((state) => state.handleSetFilter);

  const [tempValue, setTempValue] = useState<PlatformsValue[]>(platform);

  useEffect(() => {
    setTempValue(platform);
  }, [platform]);

  const handleChange = ({ value }: MultiSelectChangeEvent<PlatformsValue>) => {
    setTempValue(value);
  };

  const handleClose = () => {
    handleSetFilter(CrossCloudValue.FOCUS, { platform: tempValue });
  };

  return (
    <MultiSelect
      dataTestId="focus-cloud-service-providers-filter"
      configKey="CloudServiceProviders"
      label={LABELS.label}
      defaultDisplayLabel={LABELS.defaultDisplayLabel}
      searchPlaceholder={LABELS.searchPlaceholder}
      options={cloudServiceProvidersOptions}
      value={tempValue}
      onChange={handleChange}
      handleClose={handleClose}
    />
  );
}
