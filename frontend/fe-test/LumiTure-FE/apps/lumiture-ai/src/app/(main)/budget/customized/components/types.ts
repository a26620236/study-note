import type { ReactNode } from 'react';

import type { z } from 'zod';

import type { availablePlatforms } from '@app/(main)/budget/customized/components/constants';
import type {
  customBudgetBatchSchema,
  customBudgetSchema,
} from '@app/(main)/budget/customized/components/schema';

export enum CreateBy {
  GROUPS = 0,
  GcpProjects = 1,
  AwsAccounts = 2,
  AzureResourcesGroups = 3,
}

export enum CreateAlert {
  SINGLE = 'create',
  BATCH = 'batch_create',
}

export type AvailablePlatform = (typeof availablePlatforms)[number];

export enum ConditionFieldName {
  GROUPS = 'groups',
  SERVICES = 'services',
  PROJECTS = 'projects',
}

export enum BatchCreateConditionFieldName {
  GROUPS = 'groups',
  PROJECTS = 'projects',
  ACCOUNTS = 'accounts',
  ResourcesGroups = 'resourceGroups',
}

export type CustomBudgetForm = z.infer<typeof customBudgetSchema>;

export type CustomBudgetBatchForm = z.infer<typeof customBudgetBatchSchema>;

export type Rule = CustomBudgetForm['rules'][number];

export type RenderConditionInput = ({
  isOpen,
  fieldName,
}: {
  isOpen: boolean;
  fieldName: ConditionFieldName | BatchCreateConditionFieldName;
}) => ReactNode;

export type DateItem = Date | null;
export type Dates = [DateItem, DateItem];
export type DateString = `${number}-${number}-${number}`;

export enum MonitoringPeriod {
  MONTHLY = 0,
  YEARLY = 1,
  DAILY = 3,
  CUSTOMIZED = 2,
}
