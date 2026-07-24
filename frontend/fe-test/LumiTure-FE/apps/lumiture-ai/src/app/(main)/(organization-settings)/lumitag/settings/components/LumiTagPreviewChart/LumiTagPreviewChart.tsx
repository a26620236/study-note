'use client';

import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { HStack, Markdown, VStack } from '@lumiture-ui';
import { nFormatter } from '@shared/utils';

import { CollapsibleLegends } from '@components/echart/CollapsibleLegends';
import { COLOR_KIT } from '@constants';
import { useGetLumiTagPreviewOverview, type LumiTagPreviewValueItem } from '@hooks-api';

import {
  MAX_INDIVIDUAL_VALUES,
  UNTAGGED_COLOR,
  UNTAGGED_NAME,
} from '../../constants/lumiTagPreview';
import type { LumiTagFormData } from '../../zod/lumiTagSettings.schema';
import { ChartSegment, type SegmentData } from './ChartSegment';

const LABELS = {
  renderTitle: (tagName: string) => `Coverage for LumiTag: ${tagName}`,
  renderTotalSpend: (amount: string) => `30-Day Total Spend\n**${amount}**`,
};

function buildChartData(values: LumiTagPreviewValueItem[]) {
  // Untagged 代表未被此 tag 覆蓋的費用，需固定排在最後且顏色獨立，先拆出來
  const taggedValues = values.filter((item) => item.name !== UNTAGGED_NAME);
  const untaggedItem = values.find((item) => item.name === UNTAGGED_NAME);
  // COLOR_KIT index 0–8 給個別 values，index 9 固定留給 Others，所以上限是 9
  const individualValues = taggedValues.slice(0, MAX_INDIVIDUAL_VALUES);
  const overflowValues = taggedValues.slice(MAX_INDIVIDUAL_VALUES);
  // 超出上限的 values 合併成單一 Others segment，cost / portion 各自加總
  const othersSegment: SegmentData | null =
    overflowValues.length > 0
      ? {
          name: `Other Values (${overflowValues.length} more)`,
          cost: overflowValues.reduce((sum, item) => sum + item.cost, 0),
          portion: overflowValues.reduce((sum, item) => sum + item.portion, 0),
          color: COLOR_KIT[MAX_INDIVIDUAL_VALUES],
          isOthers: true,
          isUntagged: false,
        }
      : null;
  // portion 為 0 代表完全覆蓋，不需要顯示 Untagged segment
  const untaggedSegment: SegmentData | null =
    untaggedItem !== undefined && untaggedItem.portion > 0
      ? {
          name: UNTAGGED_NAME,
          cost: untaggedItem.cost,
          portion: untaggedItem.portion,
          color: UNTAGGED_COLOR,
          isOthers: false,
          isUntagged: true,
        }
      : null;
  // 排列順序固定：個別 values → Others → Untagged，讓圖表與 legend 視覺一致
  const segments: SegmentData[] = [
    ...individualValues.map((item, index) => ({
      name: item.name,
      cost: item.cost,
      portion: item.portion,
      color: COLOR_KIT[index],
      isOthers: false,
      isUntagged: false,
    })),
    ...(othersSegment === null ? [] : [othersSegment]),
    ...(untaggedSegment === null ? [] : [untaggedSegment]),
  ];
  // legend 直接從 segments map，確保顏色與順序和圖表完全對齊，portion 為 0 的不顯示
  const legendItems = segments
    .filter((segment) => segment.portion > 0)
    .map((segment) => ({
      id: segment.name,
      label: segment.name,
      color: segment.color,
    }));

  return { segments, legendItems };
}

export function LumiTagPreviewChart() {
  const { getValues } = useFormContext<LumiTagFormData>();
  const payload = getValues();
  const { data: overviewData, isLoading } = useGetLumiTagPreviewOverview(payload);

  const { values, totalCost } = overviewData?.data ?? { values: [], totalCost: 0 };
  const { segments, legendItems } = buildChartData(values);

  return (
    <Paper sx={{ p: 6, gap: 1.5 }}>
      <VStack gap={4}>
        <HStack justifyContent="space-between">
          <Typography variant="h5">{LABELS.renderTitle(payload.name)}</Typography>
          <Typography variant="captionMedium" color="text.secondary">
            <Markdown>
              {LABELS.renderTotalSpend(nFormatter({ num: totalCost, fixed: 2, prefix: 'USD ' }))}
            </Markdown>
          </Typography>
        </HStack>
        {isLoading ? (
          <LumiTagPreviewChartSkeleton />
        ) : (
          <>
            <HStack
              sx={{
                width: '100%',
                height: 36,
                borderRadius: 2,
                overflow: 'hidden',
                flexWrap: 'nowrap',
              }}
            >
              {segments.map((segment, index) => (
                <ChartSegment key={index} segment={segment} />
              ))}
            </HStack>
            <CollapsibleLegends legends={legendItems} />
          </>
        )}
      </VStack>
    </Paper>
  );
}

function LumiTagPreviewChartSkeleton() {
  return (
    <>
      <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 2 }} />
      <HStack gap={2} justifyContent="center">
        {Array.from({ length: 3 }).map((_, index) => (
          <Box key={index} py="3px">
            <Skeleton variant="rectangular" width={120} height={12} sx={{ borderRadius: 2 }} />
          </Box>
        ))}
      </HStack>
    </>
  );
}
