'use client';

import { useMemo, useState } from 'react';

import { Paper, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { HStack, Icon, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import EmptyState from '@components/EmptyState/EmptyState';
import TableSkeleton from '@components/table/TableSkeleton';
import VirtualizedTable from '@components/table/VirtualizedTable/VirtualizedTable';
import { useGetLumiTagPreviewOverview, type LumiTagPreviewValueItem } from '@hooks-api';

import { UNTAGGED_NAME } from '../../constants/lumiTagPreview';
import { useLumiTagPreviewTableColumns } from '../../hooks/useLumiTagPreviewTableColumns';
import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';
import { LumiTagResourceDialog } from '../LumiTagResourceDialog/LumiTagResourceDialog';

const LABELS = {
  title: 'Spend Breakdown',
  coverageBanner:
    '100% Coverage Achieved! All resources are successfully tagged and accounted for.',
} as const;

export function LumiTagPreviewTable() {
  const { getValues } = useFormContext<LumiTagFormData>();
  const payload = getValues();
  const { data: overviewRes, isLoading } = useGetLumiTagPreviewOverview(payload);
  const [selectedValue, setSelectedValue] = useState<LumiTagPreviewValueItem | null>(null);
  const overviewData = useMemo(() => overviewRes?.data.values ?? [], [overviewRes]);

  const taggedValues = useMemo(
    () => overviewData.filter((item) => item.name !== UNTAGGED_NAME),
    [overviewData]
  );
  const untaggedItem = useMemo(
    () => overviewData.find((item) => item.name === UNTAGGED_NAME),
    [overviewData]
  );

  const coverage = untaggedItem === undefined || untaggedItem.portion === 0;
  const hasUntagged = untaggedItem !== undefined && untaggedItem.portion > 0;

  const columns = useLumiTagPreviewTableColumns({ untaggedItem, setSelectedValue });

  if (overviewRes?.data.values.length === 0) return <EmptyState type="emptyTable" />;

  return (
    <Paper sx={{ p: 6 }}>
      <VStack gap={4}>
        <Typography variant="h5">{LABELS.title}</Typography>
        {isLoading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : (
          <VStack>
            <VirtualizedTable
              data={taggedValues}
              columns={columns}
              footerRowSx={hasUntagged ? { backgroundColor: theme.palette.error.bg } : undefined}
            />
            {coverage && (
              <HStack
                borderRadius={2}
                gap={1}
                p={4}
                alignItems="center"
                justifyContent="center"
                bgcolor={theme.palette.success.light}
                mt={6}
              >
                <Icon
                  name="celebration"
                  fill
                  sx={{ fontSize: 20, color: theme.palette.success.main }}
                />
                <Typography variant="buttonBold1" color="success.main">
                  {LABELS.coverageBanner}
                </Typography>
              </HStack>
            )}
          </VStack>
        )}
      </VStack>
      {selectedValue !== null && (
        <LumiTagResourceDialog
          open
          valueName={selectedValue.name}
          onClose={() => setSelectedValue(null)}
        />
      )}
    </Paper>
  );
}
