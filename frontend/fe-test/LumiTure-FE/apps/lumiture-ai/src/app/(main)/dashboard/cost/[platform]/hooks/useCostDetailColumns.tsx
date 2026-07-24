import { useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';

import { Box, Tooltip, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { HStack } from '@lumiture-ui';
import { FOCUSIcon, GoogleIcon } from '@lumiture-ui/SvgIcon';
import { useOverflow } from '@shared/hooks';

import { SingleLineCell } from '@components/table/SingleLineCell';
import { CrossCloudValue, PlatformsValue, type PlatformValueWithFOCUS } from '@constants';
import { useGetCostTrend, useGetPlatformFilterOptions } from '@hooks-api';

import { CostCell } from '../components/CostDetail/CostCell';
import { CostFooter } from '../components/CostDetail/CostFooter';
import { TotalFooter } from '../components/CostDetail/TotalFooter';
import { GCP_FOCUS_TOOLTIP } from '../constants/focusTooltip';
import { getGroupByLabel } from '../utils/getGroupByLabel';
import { hasCreditsSelected } from '../utils/hasCreditsSelected';
import type { CostDetailRow } from '../utils/transformCostTrendData';
import { useCostDashboardStore } from './useCostDashboardStore';

const LABELS = {
  totalCost: 'Total Cost',
};

// 無法歸類到所選 tag / label 的 catch-all 桶（後端會以這些字串命名並自行包上括號）
const UNCATEGORIZED_PHRASES = ['Charges for other usage', 'Untagged', 'No tag key'];

// catch-all 桶以斜體 + secondary 呈現；括號由後端負責，FE 只判斷是否為此類桶
function isUncategorized(name: string): boolean {
  return UNCATEGORIZED_PHRASES.some((phrase) => name.includes(phrase));
}

interface GroupByColumnHeaderProps {
  prefix: string;
  value: string;
}

function GroupByColumnHeader({ prefix, value }: GroupByColumnHeaderProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const { isOverflowed } = useOverflow(textRef);
  const fullText = value ? `${prefix}: ${value}` : prefix;

  return (
    <Tooltip
      title={isOverflowed ? fullText : ''}
      placement="right"
      followCursor
      disableHoverListener={!isOverflowed}
    >
      <Box
        ref={textRef}
        sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
      >
        <Typography component="span" variant="bodyBold" color="text.primary">
          {value ? `${prefix}:` : prefix}
        </Typography>
        {value && (
          <Typography component="span" variant="bodyBold" color="primary.main" ml={0.5}>
            {value}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}

/**
 * Custom hook to generate column definitions for CostDetailTable
 * Handles sticky columns, footers with totals, and dynamic date columns
 * Fetches all necessary data internally
 */
export function useCostDetailColumns(): ColumnDef<CostDetailRow>[] {
  const { platform } = useParams<{ platform: PlatformValueWithFOCUS }>();
  const { [platform]: platformFilters } = useCostDashboardStore((state) => state);
  const { data: costTrendData } = useGetCostTrend(platformFilters);

  const costTrend = costTrendData?.data;
  const { dateAxis, series } = costTrend ?? {};

  const hasCredits = hasCreditsSelected(platform, platformFilters);
  const optionsPlatform = platform === CrossCloudValue.FOCUS ? PlatformsValue.GCP : platform;

  const { data: filterOptionsData } = useGetPlatformFilterOptions(
    optionsPlatform,
    { start_date: platformFilters.startDate, end_date: platformFilters.endDate },
    { enabled: platform !== CrossCloudValue.FOCUS }
  );
  const lumiTagKeys = filterOptionsData?.data.lumitag.keys ?? [];
  const { prefix: groupByPrefix, value: groupByValue } = getGroupByLabel(
    platformFilters,
    lumiTagKeys
  );

  return useMemo<ColumnDef<CostDetailRow>[]>(() => {
    const totalCost = series?.reduce((sum, item) => sum + item.totalCost, 0) ?? 0;
    const totalCredits = series?.reduce((sum, item) => sum + item.totalCredits, 0) ?? 0;

    // First column: Dynamic group by column (sticky left)
    const firstColumn: ColumnDef<CostDetailRow> = {
      accessorKey: 'name',
      header: () => <GroupByColumnHeader prefix={groupByPrefix} value={groupByValue} />,
      size: 160,
      meta: {
        align: 'left',
        sticky: 'left',
      },
      cell: ({ row }) => {
        const { name, platform } = row.original;
        const isGCP = platform === PlatformsValue.GCP;
        const isFOCUS = platform === CrossCloudValue.FOCUS;
        const uncategorized = isUncategorized(name);
        return (
          <HStack gap={1} overflow="hidden" alignItems="center">
            {isGCP && (
              <Tooltip title={GCP_FOCUS_TOOLTIP}>
                <Box flexShrink={0} display="flex">
                  <GoogleIcon sx={{ fontSize: 20 }} />
                </Box>
              </Tooltip>
            )}
            {isFOCUS && <FOCUSIcon />}
            <Box flex={1} minWidth={0}>
              <SingleLineCell
                text={name}
                sx={
                  uncategorized
                    ? { fontStyle: 'italic', paddingRight: '2px', color: 'text.secondary' }
                    : undefined
                }
              />
            </Box>
          </HStack>
        );
      },
      footer: () => <TotalFooter showCredits={hasCredits} />,
    };

    // Second column: Total Cost (sticky left)
    const totalCostColumn: ColumnDef<CostDetailRow> = {
      accessorKey: 'totalCost',
      header: LABELS.totalCost,
      size: 120,
      meta: {
        sticky: 'left',
      },
      cell: ({ row }) => <CostCell amount={row.original.totalCost} />,
      footer: () => (
        <CostFooter total={totalCost} credits={totalCredits} showCredits={hasCredits} />
      ),
    };

    // Date columns: Generate from dateAxis
    const dateColumns: ColumnDef<CostDetailRow>[] =
      dateAxis?.map((date, dateIndex) => {
        // Calculate daily totals for footer
        const dailyTotal = series?.reduce((sum, item) => sum + item.data[dateIndex], 0) ?? 0;
        const dailyCredits = series?.reduce((sum, item) => sum + item.credits[dateIndex], 0) ?? 0;

        return {
          accessorKey: `dailyCosts.${date}`,
          header: format(new Date(date), 'd MMM.'),
          size: 120,
          cell: ({ row }) => <CostCell amount={row.original.dailyCosts[date] || 0} />,
          footer: () => (
            <CostFooter total={dailyTotal} credits={dailyCredits} showCredits={hasCredits} />
          ),
        };
      }) ?? [];

    return [firstColumn, totalCostColumn, ...dateColumns];
  }, [dateAxis, groupByPrefix, groupByValue, series, hasCredits]);
}
