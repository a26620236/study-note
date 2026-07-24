import type { PlatformsValue } from '@constants';

// 跨雲加總值（僅查詢用）；放在 hooks-api domain type 供 hook 與 feature 共用，不耦合 feature constants
export enum BudgetCrossCloudValue {
  Total = 'total',
}

export type BudgetPlatformValue = PlatformsValue | BudgetCrossCloudValue;

export enum Segment {
  MONTHLY = '0',
}

export enum Month {
  Jan = 'Jan',
  Feb = 'Feb',
  Mar = 'Mar',
  Apr = 'Apr',
  May = 'May',
  Jun = 'Jun',
  Jul = 'Jul',
  Aug = 'Aug',
  Sep = 'Sep',
  Oct = 'Oct',
  Nov = 'Nov',
  Dec = 'Dec',
}

export interface Budget {
  // API 的 year-month 格式（`${year}-${month}`，如 '2026-03'）；解析年 / 月時以 budgetFormat 的 parseYearMonth 處理
  period: string;
  value: number | null;
  spend?: number | null;
  spendPercentage?: number | null;
  remaining?: number | null;
  isOverBudget?: boolean;
}

interface AllocatedBudgets {
  total: number | null;
  [period: string]: number | null;
}

interface GroupBudget {
  annualBudget: number | null;
  annualBudgetExchange: number | null;
  allocatedBudget: number | null;
  allocatedBudgetExchange: number | null;
  allocatedBudgets: AllocatedBudgets;
}

export interface FiscalYearOption {
  fiscalYear: number;
  startMonth: string;
  endMonth: string;
}

export interface CurrentGroupBudget {
  fiscalYear: number;
  groupName: string;
  fiscalYearOptions: FiscalYearOption[];
  [BudgetCrossCloudValue.Total]: GroupBudget;
  [PlatformsValue.GCP]: GroupBudget;
  [PlatformsValue.AWS]: GroupBudget;
  [PlatformsValue.AZURE]: GroupBudget;
}

export interface PeriodData {
  value: number | null;
  plannedBudget: number | null;
}

// index signature 與 known fields 型別衝突，用 intersection 拆開；GroupRowBase export 供測試用 Object.assign 建構
export interface GroupRowBase {
  id: number;
  name: string;
  total: number | null;
  spend: number | null;
  remaining: number | null;
  spendPercentage: number | null;
}

export type GroupRow = GroupRowBase & Record<string, PeriodData>;

export interface ChildGroupBudget {
  period: string[];
  budget: GroupRow[];
  spend: GroupRow[];
  remaining: GroupRow[];
  availableActions: {
    editBudget: boolean;
  };
}
