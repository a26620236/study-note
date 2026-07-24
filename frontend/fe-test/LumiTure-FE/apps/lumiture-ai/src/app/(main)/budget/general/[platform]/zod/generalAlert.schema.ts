import { z } from 'zod';

import { thresholdsSchema } from '@app/(main)/budget/zod/threshold.schema';
import type { GeneralAlertsPayload } from '@hooks-api';

import type { FormBudget } from '../types/budgetSettings';

export const generalAlertSchema = z.object({
  thresholds: thresholdsSchema,
  notification: z.object({
    admin: z.object({
      organization: z.boolean(),
      childGroups: z.boolean(),
    }),
    t1Manager: z.object({
      ownGroup: z.boolean(),
      childGroups: z.boolean(),
    }),
    t1Member: z.object({
      ownGroup: z.boolean(),
      childGroups: z.boolean(),
    }),
    t2Manager: z.object({
      ownGroup: z.boolean(),
    }),
    t2Member: z.object({
      ownGroup: z.boolean(),
    }),
  }),
});

export type GeneralAlertSchema = z.infer<typeof generalAlertSchema>;

export type FormGeneralAlerts = Omit<GeneralAlertsPayload, 'thresholds'> & {
  thresholds: FormBudget[];
};
