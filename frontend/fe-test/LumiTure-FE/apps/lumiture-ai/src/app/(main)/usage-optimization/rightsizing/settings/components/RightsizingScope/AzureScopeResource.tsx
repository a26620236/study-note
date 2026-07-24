import { useEffect, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import { AzureIcon } from '@lumiture-ui/SvgIcon';

import { PlatformsValue } from '@constants';
import { useGetRightsizingAvailableResources } from '@hooks-api';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';
import { PlatformResource } from './PlatformResource';

const LABELS = {
  title: 'Azure',
  label: 'Resource Groups',
  searchPlaceholder: 'Search Resource Groups',
  selectPlaceholder: 'Select Resource Groups',
};

interface AzureScopeResourceProps {
  scopeId: string;
  selectedGroupIds: string[];
}

export function AzureScopeResource({ scopeId, selectedGroupIds }: AzureScopeResourceProps) {
  const { data: availableResources, isSuccess } = useGetRightsizingAvailableResources(
    scopeId,
    selectedGroupIds
  );
  const { azure: azureData } = availableResources?.data ?? {};
  const { setValue, trigger } = useFormContext<RightsizingSettingsFormData>();

  const isEmpty = useMemo(() => azureData?.length === 0, [azureData]);

  const azureResourcesOptions = useMemo(
    () =>
      azureData?.map((resource) => ({
        id: resource.id,
        name: resource.resourceGroupName,
        desc: resource.resourceGroupId,
      })) ?? [],
    [azureData]
  );

  const selectedAzureResources = useMemo(
    () => azureData?.filter((resource) => resource.assigned).map((resource) => resource.id) ?? [],
    [azureData]
  );

  const selectedAzureGroupIds = useMemo(
    () =>
      azureData?.filter((resource) => resource.assigned).map((resource) => resource.groupId) ?? [],
    [azureData]
  );

  const azureResourceIdToGroupIdMap = useMemo(
    () => Object.fromEntries(azureData?.map((resource) => [resource.id, resource.groupId]) ?? []),
    [azureData]
  );

  useEffect(() => {
    if (!isSuccess || !azureData) return;
    setValue('rightsizingScope.azure.resources', selectedAzureResources);
    setValue('rightsizingScope.azure.groupIds', selectedAzureGroupIds);
    setValue('rightsizingScope.azure.hasResources', azureResourcesOptions.length > 0);
    trigger('rightsizingScope');
  }, [
    isSuccess,
    azureData,
    selectedAzureResources,
    selectedAzureGroupIds,
    azureResourcesOptions,
    setValue,
    trigger,
  ]);

  if (!azureData || isEmpty) return null;

  return (
    <PlatformResource
      platform={PlatformsValue.AZURE}
      icon={<AzureIcon />}
      title={LABELS.title}
      label={LABELS.label}
      searchPlaceholder={LABELS.searchPlaceholder}
      selectPlaceholder={LABELS.selectPlaceholder}
      options={azureResourcesOptions}
      fieldName="rightsizingScope.azure.resources"
      configKey="azureResources"
      resourceIdToGroupIdMap={azureResourceIdToGroupIdMap}
    />
  );
}
