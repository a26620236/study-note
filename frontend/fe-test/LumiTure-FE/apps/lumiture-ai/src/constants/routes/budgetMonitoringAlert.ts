import { createElement } from 'react';

import { MoneySpark } from '@lumiture-ui/SvgIcon';

const BASE_BUDGET_PATH = '/budget';

export const BUDGET_PATHS = {
  'budgetMonitoring&Alert': {
    key: 'budgetMonitoring&Alert',
    name: 'Budget Monitoring & Alert',
    pathname: '',
    icon: null,
  },
  generalBudget: {
    key: 'generalBudget',
    name: 'General Budget',
    pathname: `${BASE_BUDGET_PATH}/general/[platform]`,
    icon: 'paid',
    defaultParams: {
      // 'total' = BudgetCrossCloudValue.Total；此處用字面值，避免 constants 反向 import @hooks-api 造成循環相依
      platform: 'total',
    },
  },
  customizedBudget: {
    key: 'customizedBudget',
    name: 'Customized Budget',
    pathname: `${BASE_BUDGET_PATH}/customized`,
    icon: createElement(MoneySpark, { sx: { width: 24, height: 24 } }),
  },
  budgetEditAlert: {
    key: 'budgetEditAlert',
    name: 'Customized Budget',
    pathname: `${BASE_BUDGET_PATH}/customized/[alert_id]`,
    icon: null,
  },
  anomalyDetection: {
    key: 'anomalyDetection',
    name: 'Anomaly Detection',
    pathname: `${BASE_BUDGET_PATH}/anomaly`,
    icon: 'troubleshoot',
  },
  anomalyDetail: {
    key: 'anomalyDetail',
    name: 'Anomaly Detail',
    pathname: `${BASE_BUDGET_PATH}/anomaly/[alertId]`,
    icon: null,
  },
} as const;
