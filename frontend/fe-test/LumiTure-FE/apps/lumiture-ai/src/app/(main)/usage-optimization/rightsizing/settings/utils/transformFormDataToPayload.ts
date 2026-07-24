import { EndOfTrackTypeEnum, type PutRightsizingSettingsPayload } from '@hooks-api';

import type { ValidatedRightsizingSettingsData } from '../zod/rightsizingSettings.schema';

const mapFormData = (
  formData: ValidatedRightsizingSettingsData
): ValidatedRightsizingSettingsData => {
  const { virtualMachine } = formData.criteria;

  // 轉換百分比為小數的輔助函數
  const toDecimal = (utilization: { max: number; avg: number }) => ({
    max: utilization.max / 100,
    avg: utilization.avg / 100,
  });

  const result = {
    ...formData,
    criteria: {
      virtualMachine: {
        ...virtualMachine,
        CPUUtilization: toDecimal(virtualMachine.CPUUtilization),
        memoryUtilization: toDecimal(virtualMachine.memoryUtilization),
      },
    },
  };

  if (formData.advance.endOfTrack.type !== EndOfTrackTypeEnum.Customized) {
    delete result.advance.endOfTrack.value;
  }

  if (!virtualMachine.networkIOPS.enable) delete result.criteria.virtualMachine.networkIOPS.value;

  if (!virtualMachine.diskIOPS.enable) delete result.criteria.virtualMachine.diskIOPS.value;

  return result;
};

export function transformFormDataToPayload(
  formData: ValidatedRightsizingSettingsData
): PutRightsizingSettingsPayload {
  const { rightsizingScope, ...rest } = mapFormData(formData);
  const { aws, gcp, azure } = rightsizingScope;

  const resources: PutRightsizingSettingsPayload['resources'] = [];

  if (gcp.resources.length > 0) {
    resources.push({
      platform: 'gcp',
      resource_ids: gcp.resources,
      group_ids: Array.from(new Set(gcp.groupIds)),
    });
  }

  if (aws.resources.length > 0) {
    resources.push({
      platform: 'aws',
      resource_ids: aws.resources,
      group_ids: Array.from(new Set(aws.groupIds)),
    });
  }

  if (azure.resources.length > 0) {
    resources.push({
      platform: 'azure',
      resource_ids: azure.resources,
      group_ids: Array.from(new Set(azure.groupIds)),
    });
  }

  return {
    ...rest,
    resources,
  };
}
