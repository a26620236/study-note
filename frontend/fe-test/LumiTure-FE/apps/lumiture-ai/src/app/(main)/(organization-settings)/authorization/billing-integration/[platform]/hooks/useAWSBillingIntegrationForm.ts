import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const awsBillingIntegrationFormSchema = z.object({
  accountId: z.string().min(1, { message: 'Account ID cannot be empty' }),
  roleArn: z.string().min(1, { message: 'Role ARN cannot be empty' }),
  policyArn: z.string().min(1, { message: 'Policy ARN cannot be empty' }),
  externalId: z.string().min(1, { message: 'External ID cannot be empty' }),
});

export type AWSBillingIntegrationForm = z.input<typeof awsBillingIntegrationFormSchema>;

export type ValidatedAWSBillingIntegrationData = z.output<typeof awsBillingIntegrationFormSchema>;

export function useAWSBillingIntegrationForm() {
  return useForm<AWSBillingIntegrationForm, unknown, ValidatedAWSBillingIntegrationData>({
    mode: 'onChange',
    defaultValues: {
      accountId: '',
      roleArn: '',
      policyArn: '',
      externalId: '',
    },
    resolver: zodResolver(awsBillingIntegrationFormSchema),
    shouldFocusError: false,
  });
}
