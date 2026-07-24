import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useGetAwsExternalId } from '@hooks-api';

const AWSUsageIntegrationFormSchema = z.object({
  stacksetName: z.string().min(1, { message: 'StackSet Name cannot be empty' }),
  roleName: z.string().min(1, { message: 'Role Name cannot be empty' }),
  accountId: z.string().min(1, { message: 'Invalid account ID' }),
  externalId: z.string().min(1, { message: 'Invalid External ID' }),
});

export type AWSUsageIntegrationForm = z.input<typeof AWSUsageIntegrationFormSchema>;
export type ValidatedAWSUsageIntegrationData = z.output<typeof AWSUsageIntegrationFormSchema>;

export function useAWSUsageIntegrationForm() {
  const { data: awsExternalIdData } = useGetAwsExternalId();
  const externalId = awsExternalIdData?.data.externalId || '';

  return useForm<AWSUsageIntegrationForm, unknown, ValidatedAWSUsageIntegrationData>({
    mode: 'onChange',
    values: {
      stacksetName: '',
      roleName: '',
      accountId: '',
      externalId,
    },
    resolver: zodResolver(AWSUsageIntegrationFormSchema),
    shouldFocusError: false,
  });
}
