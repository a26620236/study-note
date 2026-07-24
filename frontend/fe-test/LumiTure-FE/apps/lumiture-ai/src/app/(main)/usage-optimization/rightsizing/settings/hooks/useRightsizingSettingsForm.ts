import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { addYears } from 'date-fns';
import { omit } from 'lodash-es';
import { useForm } from 'react-hook-form';

import {
  EndOfTrackTypeEnum,
  ImpactSettingTypeEnum,
  useGetRightsizingAvailableResources,
  useGetRightsizingSettings,
} from '@hooks-api';

import {
  rightsizingSettingsSchema,
  type RightsizingSettingsFormData,
  type ValidatedRightsizingSettingsData,
} from '../zod/rightsizingSettings.schema';

export function useRightsizingSettingsForm() {
  const paramScopeId = useSearchParams().get('scopeId');
  const { data: rightsizingSettings } = useGetRightsizingSettings(paramScopeId);

  const { groups, scopes = [], criteria, advance } = rightsizingSettings?.data ?? {};

  const scopeId = paramScopeId ?? scopes[0]?.scopeId;

  const defaultGroups = useMemo(
    () => groups?.filter((group) => group.assigned).map((group) => group.groupId) ?? [],
    [groups]
  );

  const { data: availableResources } = useGetRightsizingAvailableResources(
    scopeId || '',
    defaultGroups
  );

  const { aws, gcp, azure } = availableResources?.data ?? {};

  const awsResources = useMemo(
    () => aws?.filter((resource) => resource.assigned).map((resource) => resource.id) ?? [],
    [aws]
  );

  const gcpResources = useMemo(
    () => gcp?.filter((resource) => resource.assigned).map((resource) => resource.id) ?? [],
    [gcp]
  );

  const azureResources = useMemo(
    () => azure?.filter((resource) => resource.assigned).map((resource) => resource.id) ?? [],
    [azure]
  );

  const awsGroupIds = useMemo(
    () => aws?.filter((resource) => resource.assigned).map((resource) => resource.groupId) ?? [],
    [aws]
  );

  const gcpGroupIds = useMemo(
    () => gcp?.filter((resource) => resource.assigned).map((resource) => resource.groupId) ?? [],
    [gcp]
  );

  const azureGroupIds = useMemo(
    () => azure?.filter((resource) => resource.assigned).map((resource) => resource.groupId) ?? [],
    [azure]
  );

  const defaultEndOfTrackDate = useMemo(() => addYears(new Date(), 1), []);

  const form = useForm<RightsizingSettingsFormData, unknown, ValidatedRightsizingSettingsData>({
    resolver: zodResolver(rightsizingSettingsSchema),
    values: rightsizingSettings?.data
      ? {
          ...omit(rightsizingSettings.data, 'scopes'),
          rightsizingScope: {
            groups: defaultGroups,
            aws: {
              resources: awsResources,
              groupIds: awsGroupIds,
              hasResources: awsResources.length > 0,
            },
            gcp: {
              resources: gcpResources,
              groupIds: gcpGroupIds,
              hasResources: gcpResources.length > 0,
            },
            azure: {
              resources: azureResources,
              groupIds: azureGroupIds,
              hasResources: azureResources.length > 0,
            },
          },
          criteria: {
            virtualMachine: {
              duration: criteria?.virtualMachine.duration ?? 0,
              CPUUtilization: {
                max: (criteria?.virtualMachine.CPUUtilization.max ?? 0) * 100,
                avg: (criteria?.virtualMachine.CPUUtilization.avg ?? 0) * 100,
              },
              memoryUtilization: {
                max: (criteria?.virtualMachine.memoryUtilization.max ?? 0) * 100,
                avg: (criteria?.virtualMachine.memoryUtilization.avg ?? 0) * 100,
              },
              networkIOPS: {
                enable: criteria?.virtualMachine.networkIOPS.enable ?? false,
                value: criteria?.virtualMachine.networkIOPS.value ?? '',
              },
              diskIOPS: {
                enable: criteria?.virtualMachine.diskIOPS.enable ?? false,
                value: criteria?.virtualMachine.diskIOPS.value ?? '',
              },
            },
          },
          advance: {
            dismissalPeriod: advance?.dismissalPeriod ?? 0,
            endOfTrack: {
              type: advance?.endOfTrack.type ?? EndOfTrackTypeEnum.EndOfMonth,
              value: advance?.endOfTrack.value
                ? new Date(advance.endOfTrack.value)
                : defaultEndOfTrackDate,
            },
            impact: {
              type: advance?.impact.type ?? ImpactSettingTypeEnum.Percentage,
              threshold: {
                high: advance?.impact.threshold.high ?? '',
                medium: advance?.impact.threshold.medium ?? '',
                low: advance?.impact.threshold.low ?? '',
              },
            },
          },
        }
      : undefined,
    shouldFocusError: false,
  });

  return form;
}
