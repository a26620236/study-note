import type { AWSFilter, AzureFilter, GCPFilter } from '@hooks-api';

export enum AIAnalysisStatus {
  Ready = 'READY',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS',
  Error = 'ERROR',
  NotReady = 'NOT_READY',
}

export enum TaskType {
  DashboardGCPSummary = 'dashboard_gcp_summary',
  DashboardAWSSummary = 'dashboard_aws_summary',
  DashboardAzureSummary = 'dashboard_azure_summary',
}

export interface KeyCostDriver {
  name: string;
  summary: string;
  subGroups: {
    name: string;
    summary: string;
  }[];
}

export interface Summary {
  overallSummary: string;
  keyCostDrivers: KeyCostDriver[];
}

export interface AIAnalysisData {
  filterOptions: GCPFilter | AWSFilter | AzureFilter;
  summary: Summary;
  summaryId: string;
}

export interface AIAnalysis {
  taskType: TaskType;
  taskId: string;
  status: AIAnalysisStatus.InProgress | AIAnalysisStatus.Success | AIAnalysisStatus.Error;
  message: string;
  timestamp: string;
  data: AIAnalysisData;
}
