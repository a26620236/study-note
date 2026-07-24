import { z } from 'zod';

import { PlatformsValue } from '@constants';
import { Logic, Operator } from '@hooks-api';

import {
  LABELS as ERROR_MESSAGES,
  MAX_CONDITION_VALUE_LENGTH,
  MAX_CONDITIONS,
  MAX_VALUES,
  TAG_KEY_REGEX,
} from '../constants/lumiTagSettings';

const validateConditionValues = (
  data: { operator: Operator; values: string[] },
  ctx: z.RefinementCtx
): void => {
  const isEmpty =
    data.values.length === 0 || data.values.some((value) => value.trim().length === 0);
  if (isEmpty) {
    ctx.addIssue({
      code: 'custom',
      message: ERROR_MESSAGES.conditionValueRequired,
      path: ['values'],
    });
    return;
  }

  if (data.values.some((value) => value.length > MAX_CONDITION_VALUE_LENGTH)) {
    ctx.addIssue({
      code: 'custom',
      message: ERROR_MESSAGES.conditionValueMaxLength,
      path: ['values'],
    });
    return;
  }

  if (data.operator === Operator.Matches) {
    try {
      // eslint-disable-next-line no-new
      new RegExp(data.values[0], 'u');
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message.replace(/^Invalid regular expression: \/.*?\/[a-z]*: /u, '')
          : 'invalid pattern';
      ctx.addIssue({
        code: 'custom',
        message: ERROR_MESSAGES.matchesInvalidRegex(detail),
        path: ['values'],
      });
    }
  }
};

const regularCriteriaSchema = z
  .object({
    operator: z.enum(Operator),
    values: z.array(z.string()),
  })
  .superRefine(validateConditionValues);

const nativeTagCriteriaSchema = z.object({
  tagKey: z.string().min(1, ERROR_MESSAGES.tagKeyRequired),
  tagValue: z
    .object({
      operator: z.enum(Operator),
      values: z.array(z.string()),
    })
    .superRefine(validateConditionValues)
    .optional(),
});

const conditionCriteriaSchema = z.union([regularCriteriaSchema, nativeTagCriteriaSchema]);

const conditionSchema = z.object({
  logic: z.enum(Logic),
  field: z.number(),
  criteria: conditionCriteriaSchema,
});

const scopeSchema = z.object({
  platform: z.enum([PlatformsValue.GCP, PlatformsValue.AWS, PlatformsValue.AZURE]),
  conditions: z
    .array(conditionSchema)
    .min(1, ERROR_MESSAGES.conditionRequired)
    .max(MAX_CONDITIONS, ERROR_MESSAGES.maxConditions),
});

const valueSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, ERROR_MESSAGES.valueNameRequired)
    .max(256, ERROR_MESSAGES.valueNameMaxLength),
  displayOrder: z.number(),
  scopes: z.array(scopeSchema).min(1, ERROR_MESSAGES.scopeRequired),
});

export const lumiTagSettingsSchema = z.object({
  name: z
    .string()
    .min(1, ERROR_MESSAGES.nameRequired)
    .max(128, ERROR_MESSAGES.nameMaxLength)
    .regex(TAG_KEY_REGEX, ERROR_MESSAGES.nameFormat),
  values: z
    .array(valueSchema)
    .min(1, ERROR_MESSAGES.valuesRequired)
    .max(MAX_VALUES, ERROR_MESSAGES.maxValues),
});

export type LumiTagFormData = z.input<typeof lumiTagSettingsSchema>;
export type ValidatedLumiTagData = z.infer<typeof lumiTagSettingsSchema>;
