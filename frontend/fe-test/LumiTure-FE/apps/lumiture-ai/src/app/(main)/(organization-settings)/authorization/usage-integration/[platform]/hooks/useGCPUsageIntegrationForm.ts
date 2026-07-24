import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const GCPUsageIntegrationFormSchema = z.object({
  scopingProjectId: z.string().min(1, { message: 'Scoping project ID cannot be empty' }),
});

export type GCPUsageIntegrationForm = z.input<typeof GCPUsageIntegrationFormSchema>;
export type ValidatedGCPUsageIntegrationData = z.output<typeof GCPUsageIntegrationFormSchema>;

export function useGCPUsageIntegrationForm() {
  return useForm<GCPUsageIntegrationForm, unknown, ValidatedGCPUsageIntegrationData>({
    mode: 'onChange',
    defaultValues: {
      scopingProjectId: '',
    },
    resolver: zodResolver(GCPUsageIntegrationFormSchema),
    shouldFocusError: false,
  });
}
