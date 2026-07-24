import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const azureBillingIntegrationFormSchema = z.object({
  tenantId: z.string().min(1, { message: 'Tenant ID cannot be empty' }),
  subscriptionId: z.string().min(1, { message: 'Subscription ID cannot be empty' }),
});

export type AzureBillingIntegrationForm = z.input<typeof azureBillingIntegrationFormSchema>;
export type ValidatedAzureBillingIntegrationData = z.output<
  typeof azureBillingIntegrationFormSchema
>;

export function useAzureBillingIntegrationForm() {
  return useForm<AzureBillingIntegrationForm, unknown, ValidatedAzureBillingIntegrationData>({
    mode: 'onChange',
    defaultValues: {
      tenantId: '',
      subscriptionId: '',
    },
    resolver: zodResolver(azureBillingIntegrationFormSchema),
    shouldFocusError: false,
  });
}
