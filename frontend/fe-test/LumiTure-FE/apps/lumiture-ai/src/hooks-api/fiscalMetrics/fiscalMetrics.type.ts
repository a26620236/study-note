import type { Currency } from '@constants';

export type MonthlyData = Record<string, number | null>;

export interface FiscalYearSettings {
  configured: number[];
  unconfigured: number[];
}

export interface GetFiscalMetricsSettingsResponse {
  year: FiscalYearSettings;
  period: {
    start: string;
    end: string;
  };
  industryBenchmark: {
    options: string[];
    default: string | null;
  };
  cloudCostPerCustomer: number | null;
  financialBudget: MonthlyData;
  expectedRoi: MonthlyData;
  revenue: MonthlyData;
  activeCustomers: MonthlyData;
  costForecast: MonthlyData;
  generalBudget: MonthlyData;
}

export interface HighestBudgetOverspend {
  groupName: string;
  overspendPercent: number;
  spending: number;
}

export interface HighestSpending {
  groupName: string;
  spending: number;
}

export interface CVRMetricsTrendChart {
  date: string[];
  expectedValues: number[];
  realizedValues: number[];
  actualCosts: number[];
}

export interface CloudCostPerCustomerTrendChart {
  date: string[];
  values: number[];
}

export interface Top10CostByFOCUS {
  ranking: number;
  name: string;
  spending: number;
  proportion: number;
  changeRatio: number | null;
}

export interface GetFiscalReportRes {
  period: {
    start: string;
    end: string;
  };
  currency: Currency;
  lastUpdated: string;
  nextUpdate: string;
  cloudValueRealization: {
    cvrScore: number | null;
    financialBudget: number | null;
    expectedRoi: number | null;
    expectedValue: number | null;
    actualCost: number | null;
    realizedValue: number | null;
    costVariance: number | null;
    trendChart: CVRMetricsTrendChart;
  };
  cloudSpendToRevenue: {
    value: number | null;
    revenue: number | null;
    industryBenchmark: number | null;
  };
  cloudCostPerCustomer: {
    value: number | null;
    activeCustomers: number | null;
    trendChart: CloudCostPerCustomerTrendChart | null;
  };
  costForecastVariance: {
    forecast: number | null;
    actualCost: number;
    variance: number | null;
    variancePercent: number | null;
  };
  highestBudgetOverspend: HighestBudgetOverspend[];
  highestSpending: HighestSpending[];
  focusServiceCategoryCost: {
    focusRankings: Top10CostByFOCUS[];
  };
}
