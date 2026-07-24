import type { PlatformsValue } from '@constants';

export enum RecommendStatus {
  Recommendations = 'recommendations',
  Done = 'done',
  Dismiss = 'dismiss',
  Archived = 'archived',
}

export const EndOfTrackTypeEnum = {
  EndOfMonth: 0,
  EndOfQuarter: 1,
  EndOfYear: 2,
  Customized: 3,
} as const;

export const EndOfTrackTypeEnumMap = {
  [EndOfTrackTypeEnum.EndOfMonth]: 'End Of Month',
  [EndOfTrackTypeEnum.EndOfQuarter]: 'End Of Quarter',
  [EndOfTrackTypeEnum.EndOfYear]: 'End Of Year',
  [EndOfTrackTypeEnum.Customized]: 'Customized',
} as const;

export interface RightsizingOverview {
  scopeSettings: boolean;
  optimizedScore: number;
  recommendationsCompleted: {
    done: number;
    total: number;
  };
  currentMonthlyAvoidance: {
    amount: number;
    original: number;
    savingRate: number;
  };
  actualAvoidanceToDate: {
    amount: number;
    since: string | null;
  };
  recommendListAmounts: {
    recommendations: number;
    done: number;
    dismiss: number;
  };
  lastUpdatedAt: string;
  nextUpdateAt: string;
}

export interface RecommendationItem {
  recId: string;
  configurationItem: {
    provider: PlatformsValue;
    id: string;
    name: string | null;
    type: string;
  };
  impact: 0 | 1 | 2; // 0 -> low, 1 -> medium, 2 -> high
  status: 0 | 1 | 2; // 0 -> todo, 1 -> changed, 2 -> error
  recDate: string;
  estimatedAvoidance: {
    amount: number;
    saveRate: number;
  };
  recommendation: string;
  criteria: string[];
  actualAvoidance: {
    amount: number;
    saveRate: number;
  };
  endTrack: {
    type: (typeof EndOfTrackTypeEnum)[keyof typeof EndOfTrackTypeEnum];
    value: string | null;
  };
  assignTo: string[] | null;
  resource: {
    name: string;
    id: string;
  };
  resourceTag: string[] | null;
}

// 推薦列表
export interface RightsizingList {
  totals: number;
  items: RecommendationItem[];
}

// 推薦列表選項
export interface RightsizingOptions {
  cloudService: string[];
  groups: string[];
}

export const ImpactSettingTypeEnum = {
  Percentage: 0,
  Amount: 1,
} as const;

export const ScopeStatusEnum = {
  Draft: 0,
  Configured: 1,
} as const;

export interface RightsizingSettingsGroup {
  groupId: string;
  groupName: string;
  assigned: boolean;
}

export interface RightsizingSettings {
  groups: RightsizingSettingsGroup[];
  scopes: {
    scopeId: string;
    scopeName: string;
    scopeStatus: (typeof ScopeStatusEnum)[keyof typeof ScopeStatusEnum];
  }[];
  criteria: {
    virtualMachine: {
      duration: number;
      CPUUtilization: {
        max: number;
        avg: number;
      };
      memoryUtilization: {
        max: number;
        avg: number;
      };
      networkIOPS: {
        enable: boolean;
        value: number | string;
      };
      diskIOPS: {
        enable: boolean;
        value: number | string;
      };
    };
  };
  advance: {
    dismissalPeriod: number;
    endOfTrack: {
      type: (typeof EndOfTrackTypeEnum)[keyof typeof EndOfTrackTypeEnum];
      value?: string; // API returns ISO 8601 date string
    };
    impact: {
      type: (typeof ImpactSettingTypeEnum)[keyof typeof ImpactSettingTypeEnum];
      threshold: {
        high: number;
        medium: number;
        low: number;
      };
    };
  };
}
// 推薦列表
export interface RecommendList {
  type: string;
  spec: string;
  hourlyCost: number;
}

export interface RightsizingRecommendDetail {
  recommendDetail: {
    id: string;
    name: string;
    estSaving: number;
    strategy: string[];
    criteria: string;
  };
  usageAnalysis: {
    averageCPUUtilization: number;
    averageDiskTotalOpsCount: number;
    averageMemoryUtilization: number;
    averageNetworkTotalOpsCount: number;
    maximumCPUUtilization: number;
    maximumDiskTotalOpsCount: number;
    maximumMemoryUtilization: number;
    maximumNetworkTotalOpsCount: number;
  };
  analysis: string;
  recommendList: RecommendList[];
}

export interface AWSResource {
  id: string;
  accountId: string;
  accountName: string;
  assigned: boolean;
  groupId: string;
}

export interface GCPResource {
  id: string;
  projectId: string;
  projectName: string;
  groupId: string;
  assigned: boolean;
}

export interface AzureResource {
  id: string;
  resourceGroupId: string;
  resourceGroupName: string;
  assigned: boolean;
  groupId: string;
}

export interface RightsizingResource {
  [PlatformsValue.AWS]: AWSResource[];
  [PlatformsValue.GCP]: GCPResource[];
  [PlatformsValue.AZURE]: AzureResource[];
}
