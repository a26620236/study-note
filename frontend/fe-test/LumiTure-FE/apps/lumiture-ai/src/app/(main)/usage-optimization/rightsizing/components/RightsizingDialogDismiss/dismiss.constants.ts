import * as z from 'zod';

export const dismissSchema = z
  .object({
    reason: z.string().min(1),
    customReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.reason === 'other') {
        return data.customReason && data.customReason.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Reason cannot be empty.',
      path: ['customReason'],
    }
  );

export type DismissFormData = z.infer<typeof dismissSchema>;

export const DISMISS_REASONS = [
  {
    value: 'stability_first',
    label: 'Stability first, reserve buffer: Designed for high availability or failover scenarios',
  },
  {
    value: 'planned_future_usage',
    label: 'Planned future usage: Reserved for upcoming launches or scaling plans',
  },
  {
    value: 'contract_bound',
    label:
      'Contract-bound configuration: Cannot modify due to CUD or reserved instance commitments',
  },
  {
    value: 'high_availability',
    label: 'Used for high availability: Part of multi-zone deployment or failover setup',
  },
  {
    value: 'unreasonable_recommendation',
    label: 'Unreasonable recommendation: Not aligned with actual usage patterns',
  },
  {
    value: 'other',
    label: 'Other: Please specify your reason',
  },
];
