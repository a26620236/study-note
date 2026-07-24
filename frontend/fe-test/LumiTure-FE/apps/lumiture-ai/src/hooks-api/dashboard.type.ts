import type { PlatformsValue } from '@constants';

import type { DateString } from './dashboard/dashboard.type';

export interface GetDashboardOverviewOrgParams {
  period: DateString;
}
export interface GetDashboardOverviewOrgRes {
  totalCost: {
    budget: number | null;
    spending: Record<string, number | null> | null;
    predict: Record<string, number | null> | null;
  };
  currentMonth: {
    cost: number | null;
    comparisonRate: number | null;
  };
  lastMonth: {
    cost: number | null;
    comparisonRate: number | null;
  };
  monthlyAvg: {
    cost: number | null;
    comparisonRate: number | null;
  };
  currentYear: {
    cost: number | null;
    comparisonRate: number | null;
  };
  threshold: {
    warning: number;
    alert: number;
  };
}

export enum OverviewPeriod {
  MONTHLY = '0',
  YEARLY = '1',
}

export interface CostByCloudItem {
  cost: number | null;
  budget: number | null;
}

// config filter options
export interface GetPlatformFilterOptionsParams {
  platforms: PlatformsValue[];
  params: {
    start_date: DateString | null;
    end_date: DateString | null;
  };
}

export interface GetPlatformFilterOptionsRes {
  groups: { id: string; name: string }[];
  services: string[];
  projects?: { id: string; name: string }[];
  accounts?: { id: string; name: string }[];
  skus: [
    {
      id: string;
      description?: string;
    },
  ];
  labels?: { key: string; values: string[] }[];
  tags?: { key: string; values: string[] }[];
  resourceGroups?: { id: string; name: string }[];
}

export type GetPlatformFilterOptionsReturn = Omit<
  GetPlatformFilterOptionsRes,
  'services' | 'skus'
> & {
  services: { id: string; name: string }[];
  skus: { id: string; name: string }[];
};

export interface GetCostSavingsReportRes {
  summary: {
    period: {
      startDate: string | null;
      endDate: string | null;
    };
    referencePeriod: {
      startDate: string | null;
      endDate: string | null;
    };
    lastUpdated: string;
    nextUpdate: string;
    totalActualCost: number | null;
    totalCostBaseline: number | null;
    totalSavings: number | null;
    totalSavingsPercentage: number | null;
  };
  resourceSavings: {
    resourceName: string;
    resourceId: string;
    platform: PlatformsValue;
    actualCost: number;
    costBaseline: number;
    costSaving: number;
    savingPercentage: number;
  }[];
}
