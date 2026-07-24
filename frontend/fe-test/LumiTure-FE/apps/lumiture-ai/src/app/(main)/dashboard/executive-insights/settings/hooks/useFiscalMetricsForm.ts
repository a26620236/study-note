import { zodResolver } from '@hookform/resolvers/zod';
import { getYear } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getIsEmptyValue } from '@shared/utils';

import type { GetFiscalMetricsSettingsResponse, MonthlyData } from '@hooks-api';

interface UseFiscalMetricsFormProps {
  data?: GetFiscalMetricsSettingsResponse;
}

interface CreateMonthlyDataSchemaProps {
  required: boolean;
  errorMessage?: string;
}

const EXPECTED_ROI_DEFAULT_VALUE = 1;
export const INDUSTRY_BENCHMARK_EMPTY_VALUE = 'none';

const LABELS = {
  errorMessage: {
    financialBudget: 'Budget cannot be empty.',
    expectedRoi: 'Expected ROI cannot be empty.',
    cloudCostPerCustomer: 'Cloud Cost per Active Customer cannot be empty.',
  },
};

const createRequiredNumberSchema = (errorMessage: string) =>
  z
    .union([z.string(), z.number()])
    .transform((val) => {
      // Handle empty values - return undefined to trigger required error
      if (getIsEmptyValue(val)) {
        return undefined;
      }
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        // If parsing results in NaN, return undefined to trigger error
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    })
    .pipe(z.number({ message: errorMessage }));

const createOptionalNumberSchema = () =>
  z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (getIsEmptyValue(val)) {
        return null;
      }
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
      }
      return val;
    })
    .pipe(z.number().nullable());

const createMonthlyDataSchema = ({ required, errorMessage }: CreateMonthlyDataSchemaProps) => {
  const numberSchema = required
    ? createRequiredNumberSchema(errorMessage ?? '')
    : createOptionalNumberSchema();

  const recordSchema = z.record(z.string(), numberSchema);

  return required ? recordSchema : recordSchema.optional();
};

export const fiscalMetricsFormSchema = z.object({
  year: z.number(),
  financialBudget: createMonthlyDataSchema({
    required: true,
    errorMessage: LABELS.errorMessage.financialBudget,
  }),
  expectedRoi: createMonthlyDataSchema({
    required: true,
    errorMessage: LABELS.errorMessage.expectedRoi,
  }),
  industryBenchmark: z
    .string()
    .nullable()
    .transform((val) => (val === INDUSTRY_BENCHMARK_EMPTY_VALUE ? null : val)),
  revenue: createMonthlyDataSchema({ required: false }),
  cloudCostPerCustomer: createRequiredNumberSchema(LABELS.errorMessage.cloudCostPerCustomer),
  activeCustomers: createMonthlyDataSchema({ required: false }),
  costForecast: createMonthlyDataSchema({ required: false }),
});

export type ValidatedFiscalMetricsData = z.infer<typeof fiscalMetricsFormSchema>;

// Keep for backward compatibility with other components
export type FiscalMetricsFormData = z.input<typeof fiscalMetricsFormSchema>;

const processExpectedRoi = (expectedRoi?: MonthlyData) => {
  if (!expectedRoi) return expectedRoi;

  return Object.entries(expectedRoi).reduce<MonthlyData>((acc, [month, value]) => {
    acc[month] = value ?? EXPECTED_ROI_DEFAULT_VALUE;
    return acc;
  }, {});
};

export const createDefaultValues = (data?: GetFiscalMetricsSettingsResponse) => {
  const {
    financialBudget,
    expectedRoi,
    revenue,
    activeCustomers,
    costForecast,
    industryBenchmark,
    cloudCostPerCustomer,
    period,
  } = data ?? {};

  return {
    year: getYear(new Date(period?.start ?? '')),
    industryBenchmark: industryBenchmark?.default ?? INDUSTRY_BENCHMARK_EMPTY_VALUE,
    financialBudget: financialBudget ?? {},
    expectedRoi: processExpectedRoi(expectedRoi) ?? {},
    revenue: revenue ?? {},
    activeCustomers: activeCustomers ?? {},
    costForecast: costForecast ?? {},
    cloudCostPerCustomer: cloudCostPerCustomer ?? 0,
  };
};

export function useFiscalMetricsForm({ data }: UseFiscalMetricsFormProps) {
  return useForm({
    defaultValues: createDefaultValues(),
    values: data ? createDefaultValues(data) : undefined,
    resolver: zodResolver(fiscalMetricsFormSchema),
    shouldFocusError: false,
  });
}
