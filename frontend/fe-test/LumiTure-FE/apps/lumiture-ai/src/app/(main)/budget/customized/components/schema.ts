import { z } from 'zod';

import {
  availablePlatforms,
  FORM_ID,
  NAME_MAX_LENGTH,
} from '@app/(main)/budget/customized/components/constants';
import { CreateBy } from '@app/(main)/budget/customized/components/types';
import { thresholdsSchema } from '@app/(main)/budget/zod/threshold.schema';

const createObjArraySchema = z.union([
  z.null(),
  z
    .array(z.object({ id: z.string(), name: z.string() }))
    .min(1, { message: 'Please select at least one item.' }),
]);

export const customBudgetBaseSchema = z.object({
  [FORM_ID.NAME]: z
    .string({
      message: 'Budget Name cannot be empty.',
    })
    .min(1, 'Budget Name cannot be empty.')
    .max(NAME_MAX_LENGTH, {
      message: `Budget Name cannot exceed ${NAME_MAX_LENGTH} characters.`,
    }),
  [FORM_ID.AMOUNT]: z
    .number({
      message: 'Please input positive half-width integers greater than 0.',
    })
    .min(1, 'Please input positive half-width integers greater than 0.'),
  [FORM_ID.PERIOD]: z.number(),
  [FORM_ID.START_DATE]: z.union([z.date(), z.null()]),
  [FORM_ID.END_DATE]: z.union([z.date(), z.null()]),
  [FORM_ID.CREDIT]: z.boolean(),
  [FORM_ID.RECIPIENTS]: z.array(z.string()),
  [FORM_ID.RECIPIENTS_INPUT]: z
    .string()
    .refine((val) => !val || val.length === 0, {
      message:
        "We couldn't find a matching user for the keyword you entered. Please verify or remove the keyword to save your budget settings.",
    })
    .optional(),
  [FORM_ID.STATUS]: z.boolean(),
  [FORM_ID.THRESHOLDS]: thresholdsSchema,
});

export const customBudgetSchema = z.object({
  ...customBudgetBaseSchema.shape,
  [FORM_ID.RULES]: z
    .array(
      z.object({
        platform: z.enum(availablePlatforms),
        groups: createObjArraySchema,
        services: createObjArraySchema,
        projects: createObjArraySchema,
      })
    )
    .min(1, { message: 'Budget Scope cannot be empty.' }),
});

export const customBudgetBatchSchema = z.object({
  ...customBudgetBaseSchema.shape,
  [FORM_ID.ALERT]: z.object({
    createdBy: z.union([
      z.literal(CreateBy.GROUPS),
      z.literal(CreateBy.GcpProjects),
      z.literal(CreateBy.AwsAccounts),
      z.literal(CreateBy.AzureResourcesGroups),
    ]),
    values: z
      .array(z.object({ id: z.string(), name: z.string() }))
      .min(1, { message: 'Please select at least one item.' }),
  }),
});
