import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const gcpBillingIntegrationFormSchema = z.object({
  billingAccountId: z.string().min(1, { message: 'Billing Account ID cannot be empty' }),
  detailedUsageCost: z.object({
    projectId: z.string().min(1, { message: 'Project ID cannot be empty' }),
    datasetId: z.string().min(1, { message: 'Dataset ID cannot be empty' }),
  }),
  pricing: z.object({
    projectId: z.string().min(1, { message: 'Project ID cannot be empty' }),
    datasetId: z.string().min(1, { message: 'Dataset ID cannot be empty' }),
  }),
});

export type GCPBillingIntegrationForm = z.input<typeof gcpBillingIntegrationFormSchema>;
export type ValidatedGCPBillingIntegrationData = z.output<typeof gcpBillingIntegrationFormSchema>;

export function useGCPBillingIntegrationForm() {
  return useForm<GCPBillingIntegrationForm, unknown, ValidatedGCPBillingIntegrationData>({
    mode: 'onChange',
    defaultValues: {
      billingAccountId: '',
      detailedUsageCost: {
        projectId: '',
        datasetId: '',
      },
      pricing: {
        projectId: '',
        datasetId: '',
      },
    },
    resolver: zodResolver(gcpBillingIntegrationFormSchema),
    shouldFocusError: false,
  });
}
