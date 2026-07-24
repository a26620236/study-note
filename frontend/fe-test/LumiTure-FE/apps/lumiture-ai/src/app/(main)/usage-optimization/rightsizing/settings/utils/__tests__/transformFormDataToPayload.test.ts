import type { ValidatedRightsizingSettingsData } from '../../zod/rightsizingSettings.schema';
import { transformFormDataToPayload } from '../transformFormDataToPayload';

function createFormData(overrides?: {
  endOfTrackType?: 0 | 1 | 2 | 3;
  endOfTrackValue?: Date | null;
  networkIOPS?: { enable: boolean; value?: number };
  diskIOPS?: { enable: boolean; value?: number };
  gcpScope?: { resources: string[]; groupIds: string[]; hasResources: boolean };
  awsScope?: { resources: string[]; groupIds: string[]; hasResources: boolean };
  azureScope?: { resources: string[]; groupIds: string[]; hasResources: boolean };
}): ValidatedRightsizingSettingsData {
  return {
    rightsizingScope: {
      groups: ['group-1'],
      gcp: overrides?.gcpScope ?? { resources: ['gcp-vm-1'], groupIds: ['g1'], hasResources: true },
      aws: overrides?.awsScope ?? { resources: [], groupIds: [], hasResources: false },
      azure: overrides?.azureScope ?? { resources: [], groupIds: [], hasResources: false },
    },
    criteria: {
      virtualMachine: {
        duration: 7,
        CPUUtilization: { max: 80, avg: 50 },
        memoryUtilization: { max: 70, avg: 40 },
        networkIOPS: overrides?.networkIOPS ?? { enable: false },
        diskIOPS: overrides?.diskIOPS ?? { enable: false },
      },
    },
    advance: {
      dismissalPeriod: 30,
      endOfTrack: {
        type: overrides?.endOfTrackType ?? 0,
        value: overrides?.endOfTrackValue ?? null,
      },
      impact: {
        type: 0,
        threshold: { high: 80, medium: 50, low: 20 },
      },
    },
  } satisfies ValidatedRightsizingSettingsData;
}

describe('transformFormDataToPayload', () => {
  describe('CPU and memory utilization conversion', () => {
    it('should convert CPUUtilization percentage to decimal', () => {
      const result = transformFormDataToPayload(createFormData());

      expect(result.criteria.virtualMachine.CPUUtilization).toEqual({ max: 0.8, avg: 0.5 });
    });

    it('should convert memoryUtilization percentage to decimal', () => {
      const result = transformFormDataToPayload(createFormData());

      expect(result.criteria.virtualMachine.memoryUtilization).toEqual({ max: 0.7, avg: 0.4 });
    });
  });

  describe('endOfTrack.value handling', () => {
    it('should remove endOfTrack.value when type is EndOfMonth (0)', () => {
      const result = transformFormDataToPayload(
        createFormData({ endOfTrackType: 0, endOfTrackValue: new Date() })
      );

      expect(result.advance.endOfTrack).not.toHaveProperty('value');
    });

    it('should remove endOfTrack.value when type is EndOfQuarter (1)', () => {
      const result = transformFormDataToPayload(
        createFormData({ endOfTrackType: 1, endOfTrackValue: new Date() })
      );

      expect(result.advance.endOfTrack).not.toHaveProperty('value');
    });

    it('should remove endOfTrack.value when type is EndOfYear (2)', () => {
      const result = transformFormDataToPayload(
        createFormData({ endOfTrackType: 2, endOfTrackValue: new Date() })
      );

      expect(result.advance.endOfTrack).not.toHaveProperty('value');
    });

    it('should keep endOfTrack.value when type is Customized (3)', () => {
      const customDate = new Date('2025-12-31');

      const result = transformFormDataToPayload(
        createFormData({ endOfTrackType: 3, endOfTrackValue: customDate })
      );

      expect(result.advance.endOfTrack.value).toBe(customDate);
    });
  });

  describe('networkIOPS.value handling', () => {
    it('should remove networkIOPS.value when enable is false', () => {
      const result = transformFormDataToPayload(
        createFormData({ networkIOPS: { enable: false, value: 100 } })
      );

      expect(result.criteria.virtualMachine.networkIOPS).not.toHaveProperty('value');
    });

    it('should keep networkIOPS.value when enable is true', () => {
      const result = transformFormDataToPayload(
        createFormData({ networkIOPS: { enable: true, value: 100 } })
      );

      expect(result.criteria.virtualMachine.networkIOPS.value).toBe(100);
    });
  });

  describe('diskIOPS.value handling', () => {
    it('should remove diskIOPS.value when enable is false', () => {
      const result = transformFormDataToPayload(
        createFormData({ diskIOPS: { enable: false, value: 200 } })
      );

      expect(result.criteria.virtualMachine.diskIOPS).not.toHaveProperty('value');
    });

    it('should keep diskIOPS.value when enable is true', () => {
      const result = transformFormDataToPayload(
        createFormData({ diskIOPS: { enable: true, value: 200 } })
      );

      expect(result.criteria.virtualMachine.diskIOPS.value).toBe(200);
    });
  });

  describe('resources mapping', () => {
    // Extract predicates here (depth 2) to avoid exceeding max-nested-callbacks (3) inside `it`
    const toPlatform = (r: { platform: string }) => r.platform;
    const isGcp = (r: { platform: string }) => r.platform === 'gcp';
    const isAws = (r: { platform: string }) => r.platform === 'aws';

    it('should include gcp resources when gcp has resources', () => {
      const result = transformFormDataToPayload(
        createFormData({
          gcpScope: { resources: ['gcp-vm-1', 'gcp-vm-2'], groupIds: ['g1'], hasResources: true },
        })
      );

      expect(result.resources).toContainEqual({
        platform: 'gcp',
        resource_ids: ['gcp-vm-1', 'gcp-vm-2'],
        group_ids: ['g1'],
      });
    });

    it('should include aws resources when aws has resources', () => {
      const result = transformFormDataToPayload(
        createFormData({
          gcpScope: { resources: [], groupIds: [], hasResources: false },
          awsScope: { resources: ['aws-ec2-1'], groupIds: ['a1'], hasResources: true },
        })
      );

      expect(result.resources).toContainEqual({
        platform: 'aws',
        resource_ids: ['aws-ec2-1'],
        group_ids: ['a1'],
      });
    });

    it('should include azure resources when azure has resources', () => {
      const formData = createFormData({
        azureScope: { resources: ['azure-vm-1'], groupIds: ['a1'], hasResources: true },
      });

      const result = transformFormDataToPayload(formData);

      const platforms = result.resources.map(toPlatform);
      expect(platforms).toContain('azure');
      expect(result.resources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ platform: 'azure', resource_ids: ['azure-vm-1'] }),
        ])
      );
    });

    it('should return empty resources array when neither gcp nor aws has resources', () => {
      const result = transformFormDataToPayload(
        createFormData({
          gcpScope: { resources: [], groupIds: [], hasResources: false },
          awsScope: { resources: [], groupIds: [], hasResources: false },
        })
      );

      expect(result.resources).toHaveLength(0);
    });

    it('should deduplicate gcp groupIds', () => {
      const result = transformFormDataToPayload(
        createFormData({
          gcpScope: {
            resources: ['gcp-vm-1'],
            groupIds: ['g1', 'g1', 'g2'],
            hasResources: true,
          },
        })
      );

      const gcpResource = result.resources.find(isGcp);
      expect(gcpResource?.group_ids).toEqual(['g1', 'g2']);
    });

    it('should deduplicate aws groupIds', () => {
      const result = transformFormDataToPayload(
        createFormData({
          gcpScope: { resources: [], groupIds: [], hasResources: false },
          awsScope: {
            resources: ['aws-ec2-1'],
            groupIds: ['a1', 'a1', 'a2'],
            hasResources: true,
          },
        })
      );

      const awsResource = result.resources.find(isAws);
      expect(awsResource?.group_ids).toEqual(['a1', 'a2']);
    });
  });

  describe('output shape', () => {
    it('should strip rightsizingScope from the output', () => {
      const result = transformFormDataToPayload(createFormData());

      expect(result).not.toHaveProperty('rightsizingScope');
    });
  });
});
