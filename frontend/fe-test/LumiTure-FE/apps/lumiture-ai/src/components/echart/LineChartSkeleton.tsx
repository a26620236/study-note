'use client';

import { Box, Skeleton } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';

const X_AXIS_LABELS = 12;
const LEGEND_ROW1 = ['26%', '8%', '26%', '8%', '26%'];
const LEGEND_ROW2 = ['8%', '34%', '8%', '34%', '8%'];

interface LineChartSkeletonProps {
  height: number;
}

export function LineChartSkeleton({ height }: LineChartSkeletonProps) {
  return (
    <VStack gap={3} width="100%">
      {/* Chart area */}
      <HStack gap={2} alignItems="stretch" flexWrap="nowrap">
        {/* Y-axis labels */}
        <VStack justifyContent="space-between" alignItems="flex-end" sx={{ height, py: 1 }}>
          <Skeleton variant="rounded" width={24} height={12} />
          <Skeleton variant="rounded" width={24} height={12} />
          <Skeleton variant="rounded" width={24} height={12} />
        </VStack>

        {/* Chart with area shape */}
        <VStack sx={{ flex: 1 }} gap={2}>
          <Box
            sx={{
              position: 'relative',
              height,
              width: '100%',
              borderBottom: '1px solid #e0e0e0',
              borderLeft: '1px solid #e0e0e0',
              backgroundImage: `
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to bottom, #e0e0e0 0 6px, transparent 6px 12px),
                  repeating-linear-gradient(to right, #e0e0e0 0 6px, transparent 6px 12px)
                `,
              backgroundSize: `
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  1px 100%,
                  100% 1px
                `,
              backgroundPosition: `
                  6.67% 0,
                  13.33% 0,
                  20% 0,
                  26.67% 0,
                  33.33% 0,
                  40% 0,
                  46.67% 0,
                  53.33% 0,
                  60% 0,
                  66.67% 0,
                  73.33% 0,
                  80% 0,
                  86.67% 0,
                  93.33% 0,
                  0 50%
                `,
              backgroundRepeat: 'no-repeat',
            }}
          >
            <Skeleton
              variant="rectangular"
              height="100%"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 0,
                background: 'linear-gradient(to bottom, #e0e0e0, transparent)',
                clipPath:
                  'polygon(0% 40%, 2% 38%, 4% 36%, 6% 34%, 8% 36%, 10% 38%, 12% 40%, 14% 38%, 16% 36%, 18% 34%, 20% 32%, 22% 30%, 24% 28%, 26% 26%, 28% 28%, 30% 30%, 32% 28%, 34% 26%, 36% 28%, 38% 30%, 40% 32%, 42% 30%, 44% 28%, 46% 30%, 48% 32%, 50% 34%, 52% 36%, 54% 38%, 56% 36%, 58% 34%, 60% 36%, 62% 38%, 64% 40%, 66% 42%, 68% 40%, 70% 38%, 72% 40%, 74% 42%, 76% 40%, 78% 38%, 80% 36%, 82% 38%, 84% 40%, 86% 38%, 88% 36%, 90% 38%, 92% 40%, 94% 38%, 96% 40%, 98% 42%, 100% 40%, 100% 100%, 0% 100%)',
              }}
            />
          </Box>

          {/* X-axis labels */}
          <HStack justifyContent="space-between" sx={{ width: '100%' }} gap={2.5}>
            {Array.from({ length: X_AXIS_LABELS }).map((_, index) => (
              <Skeleton key={index} variant="rounded" sx={{ flex: 1 }} height={12} />
            ))}
          </HStack>
        </VStack>
      </HStack>

      {/* Legend */}
      <VStack gap={1} alignItems="center" sx={{ width: '100%', paddingLeft: '32px' }}>
        <HStack gap={2} flexWrap="nowrap" justifyContent="space-between" sx={{ width: '100%' }}>
          {LEGEND_ROW1.map((width, index) => (
            <Skeleton key={index} variant="rounded" width={width} height={12} />
          ))}
        </HStack>
        <HStack gap={2} flexWrap="nowrap" justifyContent="space-between" sx={{ width: '100%' }}>
          {LEGEND_ROW2.map((width, index) => (
            <Skeleton key={index} variant="rounded" width={width} height={12} />
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
}
