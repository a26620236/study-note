import type { Sensitivity } from '@app/(main)/budget/anomaly/constants';
import type { PlatformsValue } from '@constants';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface NotificationSettings {
  admin: {
    alert: boolean;
  };
  t1Manager: {
    alert: boolean;
  };
  t1Member: {
    alert: boolean;
  };
  t2Manager: {
    alert: boolean;
  };
  t2Member: {
    alert: boolean;
  };
}

export interface AnomalyDetectionSettings {
  detection: boolean;
  sensitivity: Sensitivity;
  notification: NotificationSettings;
  availableActions: {
    editSettings: boolean;
  };
}

export interface UpdateAnomalyDetectionSettingsPayload {
  detection: boolean;
  sensitivity?: number;
  notification?: DeepPartial<NotificationSettings>;
}

export interface AnomalyDetectionItem {
  id: number;
  platform: PlatformsValue;
  resourceId: string;
  resourceName: string;
  currency: string;
  cost: number;
  date: string;
  groups: string[];
  pin: boolean;
  children?: AnomalyDetectionItem[];
}

export interface CostDetailItem {
  service: string;
  sku: string;
  cost: number;
  costType: string;
  location: string | null;
  pricing: number;
  time: string;
  usageAmount: string;
  usageUnit: string;
}

export interface GroupInfo {
  id: string;
  depth: string;
  name: string;
  children: GroupInfo[];
}

export type TrendData = {
  dates: string[];
  ranking: string[];
} & Record<string, number[]>;

export interface AnomalyDetectionDetail {
  platform: PlatformsValue;
  costDate: string;
  resourceId: string;
  resourceName: string;
  totalCost: {
    amount: number;
    currency: string;
  };
  costDetails: CostDetailItem[];
  groups: GroupInfo[];
  trend: TrendData;
}
