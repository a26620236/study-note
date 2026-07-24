import { z } from 'zod';

import type { FORM_ID } from '@app/(main)/budget/customized/components/constants';
import type {
  CustomBudgetForm,
  DateString,
  MonitoringPeriod,
} from '@app/(main)/budget/customized/components/types';

export interface GeneralAlertsPayload {
  thresholds: number[];
  notification: {
    admin: {
      organization: boolean;
      childGroups: boolean;
    };
    t1Manager: {
      ownGroup: boolean;
      childGroups: boolean;
    };
    t1Member: {
      ownGroup: boolean;
      childGroups: boolean;
    };
    t2Manager: {
      ownGroup: boolean;
    };
    t2Member: {
      ownGroup: boolean;
    };
  };
}
export interface GetGeneralAlertsRes extends GeneralAlertsPayload {
  availableActions: {
    editAlerts: boolean;
  };
}

export interface GetCustomBudgetDetailsRes {
  [FORM_ID.NAME]: string;
  [FORM_ID.PERIOD]: MonitoringPeriod;
  [FORM_ID.START_DATE]: string | null;
  [FORM_ID.END_DATE]: string | null;
  [FORM_ID.AMOUNT]: number | null;
  [FORM_ID.CREDIT]: boolean;
  [FORM_ID.RECIPIENTS]: string[];
  [FORM_ID.STATUS]: boolean;
  [FORM_ID.THRESHOLDS]: number[];
  [FORM_ID.RULES]: (Omit<CustomBudgetForm[typeof FORM_ID.RULES][number], 'services'> & {
    services: string[] | null;
  })[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EmailSchema = z.email();
type ValidatedEmail = z.infer<typeof EmailSchema>;

export interface OrgUser {
  id: string;
  name: string;
  email: ValidatedEmail;
}
export type GetCustomBudgetAlertOrgUsersRes = OrgUser[];

export interface CustomizedAlerts {
  name: string;
  id: string | null;
  resourcesAmount: number;
  spending: number;
  budget: number;
  period: MonitoringPeriod;
  startDate: DateString;
  endDate: DateString;
  thresholds: number[];
  status: boolean;
  isOptimistic?: boolean;
}
export type GetCustomizedAlertsRes = CustomizedAlerts[];
