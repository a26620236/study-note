import { useEffect, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import { GoogleIcon } from '@lumiture-ui/SvgIcon';

import { PlatformsValue } from '@constants';
import { useGetRightsizingAvailableResources } from '@hooks-api';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';
import { PlatformResource } from './PlatformResource';

const LABELS = {
  title: 'Google Cloud',
  label: 'Projects',
  searchPlaceholder: 'Search Projects',
  selectPlaceholder: 'Select Projects',
};

interface GCPScopeResourceProps {
  scopeId: string;
  selectedGroupIds: string[];
}

export function GCPScopeResource({ scopeId, selectedGroupIds }: GCPScopeResourceProps) {
  const { data: availableResources, isSuccess } = useGetRightsizingAvailableResources(
    scopeId,
    selectedGroupIds
  );
  const { gcp: gcpData } = availableResources?.data ?? {};
  const { setValue, trigger } = useFormContext<RightsizingSettingsFormData>();

  const isEmpty = useMemo(() => gcpData?.length === 0, [gcpData]);

  const gcpResourcesOptions = useMemo(
    () =>
      gcpData?.map((resource) => ({
        id: resource.id,
        name: resource.projectName,
        desc: resource.projectId,
      })) ?? [],
    [gcpData]
  );

  const selectedGcpResources = useMemo(
    () => gcpData?.filter((resource) => resource.assigned).map((resource) => resource.id) ?? [],
    [gcpData]
  );

  const selectedGcpGroupIds = useMemo(
    () =>
      gcpData?.filter((resource) => resource.assigned).map((resource) => resource.groupId) ?? [],
    [gcpData]
  );

  const gcpResourceIdToGroupIdMap = useMemo(
    () => Object.fromEntries(gcpData?.map((resource) => [resource.id, resource.groupId]) ?? []),
    [gcpData]
  );

  useEffect(() => {
    if (!isSuccess || !gcpData) return;
    setValue('rightsizingScope.gcp.resources', selectedGcpResources);
    setValue('rightsizingScope.gcp.groupIds', selectedGcpGroupIds);
    setValue('rightsizingScope.gcp.hasResources', gcpResourcesOptions.length > 0);
    trigger('rightsizingScope');
  }, [
    isSuccess,
    gcpData,
    selectedGcpResources,
    selectedGcpGroupIds,
    gcpResourcesOptions,
    setValue,
    trigger,
  ]);

  if (!gcpData || isEmpty) return null;

  return (
    <PlatformResource
      platform={PlatformsValue.GCP}
      icon={<GoogleIcon />}
      title={LABELS.title}
      label={LABELS.label}
      searchPlaceholder={LABELS.searchPlaceholder}
      selectPlaceholder={LABELS.selectPlaceholder}
      options={gcpResourcesOptions}
      fieldName="rightsizingScope.gcp.resources"
      configKey="gcpResources"
      resourceIdToGroupIdMap={gcpResourceIdToGroupIdMap}
    />
  );
}
