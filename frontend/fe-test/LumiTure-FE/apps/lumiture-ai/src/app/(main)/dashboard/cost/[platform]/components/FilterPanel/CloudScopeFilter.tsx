import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { MultiSelect, type MultiSelectChangeEvent } from '@lumiture-ui';

import { PlatformsValue } from '@constants';
import { useGetPlatformFilterOptions } from '@hooks-api';

import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

export function CloudScopeFilter() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const { startDate, endDate } = platformAllFilters;

  const [tempValue, setTempValue] = useState<string[]>([]);

  const { data: filterOptionsData } = useGetPlatformFilterOptions(platform, {
    start_date: startDate,
    end_date: endDate,
  });

  const filterOptions = filterOptionsData?.data;

  const isGCPFilter = platform === PlatformsValue.GCP;
  const isAWSFilter = platform === PlatformsValue.AWS;
  const isAzureFilter = platform === PlatformsValue.AZURE;

  // 根据平台建立相應的 config
  const config = useMemo(() => {
    if (isGCPFilter && 'projects' in platformAllFilters) {
      const gcpFilters = platformAllFilters;
      return {
        value: gcpFilters.projects,
        filterKey: 'projects',
        optionsKey: 'projects',
        configKey: 'Projects',
        label: 'Project',
        defaultLabel: 'All Projects',
      };
    }
    if (isAWSFilter && 'accounts' in platformAllFilters) {
      const awsFilters = platformAllFilters;
      return {
        value: awsFilters.accounts,
        filterKey: 'accounts',
        optionsKey: 'accounts',
        configKey: 'Accounts',
        label: 'Account',
        defaultLabel: 'All Accounts',
      };
    }
    // Azure
    if (isAzureFilter && 'resourceGroups' in platformAllFilters) {
      const azureFilters = platformAllFilters;
      return {
        value: azureFilters.resourceGroups,
        filterKey: 'resourceGroups',
        optionsKey: 'resourceGroups',
        configKey: 'ResourceGroups',
        label: 'Resource Group',
        defaultLabel: 'All Resource Groups',
      };
    }
  }, [isAWSFilter, isAzureFilter, isGCPFilter, platformAllFilters]);

  // 同步 store 中的值到 tempValue
  useEffect(() => {
    if (config?.value) {
      setTempValue(config.value);
    }
  }, [config?.value]);

  const scopeOptions = useMemo(() => {
    if (!filterOptions) return [];

    if (isGCPFilter && 'projects' in filterOptions) {
      return filterOptions.projects.map((item) => ({
        id: item.id,
        name: item.name,
      }));
    }
    if (isAWSFilter && 'accounts' in filterOptions) {
      return filterOptions.accounts.map((item) => ({
        id: item.id,
        name: item.name,
      }));
    }
    if (isAzureFilter && 'resourceGroups' in filterOptions) {
      return filterOptions.resourceGroups.map((item) => ({
        id: item.id,
        name: item.name,
      }));
    }

    return [];
  }, [filterOptions, isAWSFilter, isAzureFilter, isGCPFilter]);

  const handleChange = ({ value }: MultiSelectChangeEvent) => {
    setTempValue(value);
  };

  const handleClose = () => {
    if (platform === PlatformsValue.GCP) {
      handleSetFilter(platform, { projects: tempValue });
    } else if (platform === PlatformsValue.AWS) {
      handleSetFilter(platform, { accounts: tempValue });
    } else {
      handleSetFilter(platform, { resourceGroups: tempValue });
    }
  };

  return (
    <MultiSelect
      dataTestId={`${platform}-cloud-scope-filter`}
      configKey={config?.configKey ?? ''}
      label={config?.label ?? ''}
      defaultDisplayLabel={config?.defaultLabel ?? ''}
      options={scopeOptions}
      value={tempValue}
      onChange={handleChange}
      handleClose={handleClose}
    />
  );
}
