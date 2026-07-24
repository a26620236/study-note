import { useEffect, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import { AWSIcon } from '@lumiture-ui/SvgIcon';

import { PlatformsValue } from '@constants';
import { useGetRightsizingAvailableResources } from '@hooks-api';

import type { RightsizingSettingsFormData } from '../../zod/rightsizingSettings.schema';
import { PlatformResource } from './PlatformResource';

const LABELS = {
  title: 'AWS',
  label: 'Accounts',
  searchPlaceholder: 'Search Accounts',
  selectPlaceholder: 'Select Accounts',
};

interface AWSScopeResourceProps {
  scopeId: string;
  selectedGroupIds: string[];
}

export function AWSScopeResource({ scopeId, selectedGroupIds }: AWSScopeResourceProps) {
  const { data: availableResources, isSuccess } = useGetRightsizingAvailableResources(
    scopeId,
    selectedGroupIds
  );
  const { aws: awsData } = availableResources?.data ?? {};
  const { setValue, trigger } = useFormContext<RightsizingSettingsFormData>();

  const isEmpty = useMemo(() => awsData?.length === 0, [awsData]);

  const awsResourcesOptions = useMemo(
    () =>
      awsData?.map((resource) => ({
        id: resource.id,
        name: resource.accountName,
        desc: resource.accountId,
      })) ?? [],
    [awsData]
  );

  const selectedAwsResources = useMemo(
    () => awsData?.filter((resource) => resource.assigned).map((resource) => resource.id) ?? [],
    [awsData]
  );

  const selectedAwsGroupIds = useMemo(
    () =>
      awsData?.filter((resource) => resource.assigned).map((resource) => resource.groupId) ?? [],
    [awsData]
  );

  const awsResourceIdToGroupIdMap = useMemo(
    () => Object.fromEntries(awsData?.map((resource) => [resource.id, resource.groupId]) ?? []),
    [awsData]
  );

  useEffect(() => {
    if (!isSuccess || !awsData) return;
    setValue('rightsizingScope.aws.resources', selectedAwsResources);
    setValue('rightsizingScope.aws.groupIds', selectedAwsGroupIds);
    setValue('rightsizingScope.aws.hasResources', awsResourcesOptions.length > 0);
    trigger('rightsizingScope');
  }, [
    isSuccess,
    awsData,
    selectedAwsResources,
    selectedAwsGroupIds,
    awsResourcesOptions,
    setValue,
    trigger,
  ]);

  if (!awsData || isEmpty) return null;

  return (
    <PlatformResource
      platform={PlatformsValue.AWS}
      icon={<AWSIcon />}
      title={LABELS.title}
      label={LABELS.label}
      searchPlaceholder={LABELS.searchPlaceholder}
      selectPlaceholder={LABELS.selectPlaceholder}
      options={awsResourcesOptions}
      fieldName="rightsizingScope.aws.resources"
      configKey="awsResources"
      resourceIdToGroupIdMap={awsResourceIdToGroupIdMap}
    />
  );
}
