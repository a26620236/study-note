'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { Box, Tooltip, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { HStack, Icon, Markdown, SingleSelect, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import { useGetFiscalMetricsSettings } from '@hooks-api';

import {
  INDUSTRY_BENCHMARK_EMPTY_VALUE,
  type FiscalMetricsFormData,
} from '../hooks/useFiscalMetricsForm';

const BOX_STYLES = {
  p: 4,
  border: `1px solid ${theme.palette.gray.borderLight}`,
  borderRadius: '8px',
  backgroundColor: theme.palette.primary.light10,
};

const LABELS = {
  title: 'Industry Benchmark',
  description:
    'Select your closest industry to compare against the benchmark. If no selection is made, the benchmark comparison will not be shown.',
  tooltipText:
    'Lumiture.ai will periodically update industry benchmarks. Choose the one that is closest to your business to unlock insights and discover their value firsthand.',
  placeholder: 'Select Industry Benchmark',
  none: 'None',
};

export function FiscalMetricsSettingsIndustryBenchmarkField() {
  const searchParams = useSearchParams();
  const fiscalYear = searchParams.get('year');

  const { data } = useGetFiscalMetricsSettings(fiscalYear);
  const { industryBenchmark } = data?.data ?? {};

  const { control } = useFormContext<FiscalMetricsFormData>();

  const options = useMemo(
    () => [
      {
        id: INDUSTRY_BENCHMARK_EMPTY_VALUE,
        name: LABELS.none,
      },
      ...(industryBenchmark?.options.map((option) => ({
        id: option,
        name: option,
      })) ?? []),
    ],
    [industryBenchmark]
  );

  return (
    <Box sx={BOX_STYLES}>
      <VStack sx={{ gap: 2 }}>
        <HStack sx={{ alignItems: 'center', gap: 1 }}>
          <Typography variant="bodyBold">{LABELS.title}</Typography>
          <Tooltip title={<Markdown>{LABELS.tooltipText}</Markdown>} placement="top">
            <Box display="flex" alignItems="center" justifyContent="center">
              <Icon name="info" sx={{ fontSize: 16, color: 'text.hint' }} />
            </Box>
          </Tooltip>
        </HStack>
        <Controller
          name="industryBenchmark"
          control={control}
          render={({ field }) => (
            <SingleSelect
              {...field}
              configKey={field.name}
              value={field.value}
              options={options}
              onChange={({ value }) => field.onChange(value)}
              selectPlaceholder={LABELS.placeholder}
              sx={{ width: '340px' }}
            />
          )}
        />
        <Typography variant="caption" color="text.secondary">
          <Markdown components={{ p: 'span' }}>{LABELS.description}</Markdown>
        </Typography>
      </VStack>
    </Box>
  );
}
