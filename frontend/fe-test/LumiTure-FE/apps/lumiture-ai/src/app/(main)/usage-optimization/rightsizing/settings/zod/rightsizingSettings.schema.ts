import { z } from 'zod';

import { EndOfTrackTypeEnum, ImpactSettingTypeEnum } from '@hooks-api';

const LABELS = {
  errorMessage: {
    pleaseEnterNumberFrom1To30: 'Please enter a number from 1 to 30.',
    pleaseEnterNumberFrom1To100: 'Please enter a number from 1 to 100.',
    pleaseEnterNumberGreaterThan0: 'Please enter a number greater than 0.',
    highThresholdMustBeHigher: 'It must be higher than Medium and Low Threshold.',
    mediumThresholdMustBeBetween: 'It must be between the High and Low Threshold.',
    lowThresholdMustBeLess: 'It must be less than High and Medium Threshold.',
    pleaseSelectAtLeastOneGroup: 'Please select at least one group.',
    pleaseSelectResources:
      'The selected group has no resources. Please choose other groups that contain resources to proceed.',
    pleaseSelectAtLeastOneItem: 'Please select at least one item.',
  },
};

const groupsSchema = z.array(z.string()).min(1, LABELS.errorMessage.pleaseSelectAtLeastOneGroup);

export const rightsizingScopeSchema = z
  .object({
    groups: groupsSchema,
    aws: z.object({
      resources: z.array(z.string()),
      groupIds: z.array(z.string()),
      hasResources: z.boolean(),
    }),
    gcp: z.object({
      resources: z.array(z.string()),
      groupIds: z.array(z.string()),
      hasResources: z.boolean(),
    }),
    azure: z.object({
      resources: z.array(z.string()),
      groupIds: z.array(z.string()),
      hasResources: z.boolean(),
    }),
  })
  .refine((data) => data.aws.hasResources || data.gcp.hasResources || data.azure.hasResources, {
    message: LABELS.errorMessage.pleaseSelectResources,
    path: ['groups'],
  })
  .superRefine((data, ctx) => {
    if (
      data.aws.resources.length > 0 ||
      data.gcp.resources.length > 0 ||
      data.azure.resources.length > 0
    )
      return;
    ctx.addIssue({
      code: 'custom',
      message: LABELS.errorMessage.pleaseSelectAtLeastOneItem,
      path: ['aws', 'resources'],
    });
    ctx.addIssue({
      code: 'custom',
      message: LABELS.errorMessage.pleaseSelectAtLeastOneItem,
      path: ['gcp', 'resources'],
    });
    ctx.addIssue({
      code: 'custom',
      message: LABELS.errorMessage.pleaseSelectAtLeastOneItem,
      path: ['azure', 'resources'],
    });
  });

const numberFrom1To30Schema = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === 'string' ? Number(val) : val))
  .pipe(
    z
      .number()
      .min(1, LABELS.errorMessage.pleaseEnterNumberFrom1To30)
      .max(30, LABELS.errorMessage.pleaseEnterNumberFrom1To30)
  );

const numberFrom1To100Schema = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === 'string' ? Number(val) : val))
  .pipe(
    z
      .number()
      .min(1, LABELS.errorMessage.pleaseEnterNumberFrom1To100)
      .max(100, LABELS.errorMessage.pleaseEnterNumberFrom1To100)
  );

const numberGreaterThan0Schema = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === 'string' ? Number(val) : val))
  .pipe(z.number().min(1, LABELS.errorMessage.pleaseEnterNumberGreaterThan0));

export const rightsizingSettingsSchema = z.object({
  rightsizingScope: rightsizingScopeSchema,
  criteria: z.object({
    virtualMachine: z.object({
      duration: numberFrom1To30Schema,
      CPUUtilization: z.object({
        max: numberFrom1To100Schema,
        avg: numberFrom1To100Schema,
      }),
      memoryUtilization: z.object({
        max: numberFrom1To100Schema,
        avg: numberFrom1To100Schema,
      }),
      networkIOPS: z.object({
        enable: z.boolean(),
        value: z
          .union([z.string(), z.number()])
          .transform((val) => (typeof val === 'string' ? Number(val) : val))
          .pipe(z.number())
          .optional(),
      }),
      diskIOPS: z.object({
        enable: z.boolean(),
        value: z
          .union([z.string(), z.number()])
          .transform((val) => (typeof val === 'string' ? Number(val) : val))
          .pipe(z.number())
          .optional(),
      }),
    }),
  }),
  advance: z.object({
    dismissalPeriod: numberGreaterThan0Schema,
    endOfTrack: z.object({
      type: z.union([
        z.literal(EndOfTrackTypeEnum.EndOfMonth),
        z.literal(EndOfTrackTypeEnum.EndOfQuarter),
        z.literal(EndOfTrackTypeEnum.EndOfYear),
        z.literal(EndOfTrackTypeEnum.Customized),
      ]),
      value: z.date().nullable().optional(),
    }),
    impact: z
      .object({
        type: z.union([
          z.literal(ImpactSettingTypeEnum.Percentage),
          z.literal(ImpactSettingTypeEnum.Amount),
        ]),
        threshold: z.object({
          high: numberGreaterThan0Schema,
          medium: numberGreaterThan0Schema,
          low: numberGreaterThan0Schema,
        }),
      })
      .superRefine((data, ctx) => {
        const { type, threshold } = data;
        const { high, medium, low } = threshold;

        // When the type is percentage, validate the value is between 1 and 100
        if (type === ImpactSettingTypeEnum.Percentage) {
          if (high > 100) {
            ctx.addIssue({
              code: 'custom',
              message: LABELS.errorMessage.pleaseEnterNumberFrom1To100,
              path: ['threshold', 'high'],
            });
          }
          if (medium > 100) {
            ctx.addIssue({
              code: 'custom',
              message: LABELS.errorMessage.pleaseEnterNumberFrom1To100,
              path: ['threshold', 'medium'],
            });
          }
          if (low > 100) {
            ctx.addIssue({
              code: 'custom',
              message: LABELS.errorMessage.pleaseEnterNumberFrom1To100,
              path: ['threshold', 'low'],
            });
          }
        }

        // When the type is amount, validate the value is greater than 0
        if (!(high > medium && high > low)) {
          ctx.addIssue({
            code: 'custom',
            message: LABELS.errorMessage.highThresholdMustBeHigher,
            path: ['threshold', 'high'],
          });
        }
        if (!(medium < high && medium > low)) {
          ctx.addIssue({
            code: 'custom',
            message: LABELS.errorMessage.mediumThresholdMustBeBetween,
            path: ['threshold', 'medium'],
          });
        }
        if (!(low < high && low < medium)) {
          ctx.addIssue({
            code: 'custom',
            message: LABELS.errorMessage.lowThresholdMustBeLess,
            path: ['threshold', 'low'],
          });
        }
      }),
  }),
});

export type ValidatedRightsizingSettingsData = z.infer<typeof rightsizingSettingsSchema>;
export type RightsizingSettingsFormData = z.input<typeof rightsizingSettingsSchema>;
