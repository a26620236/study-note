import { Lumiture as LumitureIcon } from '@lumiture-ui/SvgIcon';

import { AWS, AZURE, GCP, PlatformsValue } from '@constants';
import { BudgetCrossCloudValue } from '@hooks-api';

export enum BudgetAction {
  ALLOCATE = 0,
  FILL = 1,
  REBALANCE = 2,
}

export enum AllocateType {
  EqualAmount = 0, // amount each group
  DistributeEqually = 1, // amount distribute to groups equally
}

// Monthly View 三視角（純展示切換，同一份 child_groups response）
export enum MonthlyViewMode {
  Budget = 'budget',
  Spend = 'spend',
  Remaining = 'remaining',
}

export const PLATFORMS = [
  BudgetCrossCloudValue.Total,
  PlatformsValue.GCP,
  PlatformsValue.AWS,
  PlatformsValue.AZURE,
] as const;

export const PLATFORM_TAB_CONFIG = [
  { value: BudgetCrossCloudValue.Total, label: 'Total', icon: LumitureIcon },
  { value: PlatformsValue.GCP, label: GCP.label, icon: GCP.icon },
  { value: PlatformsValue.AWS, label: AWS.label, icon: AWS.icon },
  { value: PlatformsValue.AZURE, label: AZURE.label, icon: AZURE.icon },
];

export const VIEW_MODE_OPTIONS = [
  MonthlyViewMode.Budget,
  MonthlyViewMode.Spend,
  MonthlyViewMode.Remaining,
];

export const BUDGET_ACTION_CONFIG = {
  [BudgetAction.ALLOCATE]: {
    label: 'Allocate',
    buttonText: 'Allocate',
    value: BudgetAction.ALLOCATE,
    desc: 'The amount will be evenly allocate to the 12 months. The amounts will be rounded down to the nearest whole number.',
  },
  [BudgetAction.FILL]: {
    label: 'Fill',
    buttonText: 'Fill',
    value: BudgetAction.FILL,
    desc: `The amount will be directly fill into each month's field.`,
  },
  [BudgetAction.REBALANCE]: {
    label: 'Rebalance within the group',
    buttonText: 'Rebalance',
    value: BudgetAction.REBALANCE,
    desc: 'The budgets within the chosen groups will be summed up and evenly rebalanced to the 12 months within each group. The amounts will be rounded down to the nearest whole number.',
  },
} as const;

export const ALLOCATE_TYPE_OPTIONS = [
  {
    label: 'Each group',
    value: AllocateType.EqualAmount,
  },
  {
    label: 'Distribute to groups',
    value: AllocateType.DistributeEqually,
  },
] as const;

// 可設定金額最大值：99999999
export const MAXIMUM_BUDGET = 1e8 - 1;

export const MONTHS = 12;

// Spent % 色階門檻：0–79 success / 80–99 warning / 100+ error
export const SPENT_PERCENT_THRESHOLD = {
  WARNING: 80,
  ERROR: 100,
} as const;
