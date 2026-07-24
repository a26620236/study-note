'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, Divider, Tooltip, Typography, useTheme } from '@mui/material';

import { HStack, VStack } from '@lumiture-ui';
import { nFormatter } from '@shared/utils';

const MIN_LABEL_WIDTH = 44;

export interface SegmentData {
  name: string;
  cost: number;
  portion: number;
  color: string;
  isOthers: boolean;
  isUntagged: boolean;
}

function formatPortion(portion: number) {
  return `${(portion * 100).toFixed(1)}%`;
}

function SegmentTooltipContent({ segment }: ChartSegmentProps) {
  return (
    <VStack gap={2} minWidth={240}>
      <Typography variant="caption">{segment.name}</Typography>
      <Divider />
      <HStack justifyContent="space-between">
        <HStack gap={1} alignItems="center">
          <Box width={8} height={8} bgcolor={segment.color} />
          <Typography variant="caption">{formatPortion(segment.portion)}</Typography>
        </HStack>
        <Typography variant="captionBold">
          {nFormatter({ num: segment.cost, fixed: 2, prefix: '$' })}
        </Typography>
      </HStack>
    </VStack>
  );
}

interface ChartSegmentProps {
  segment: SegmentData;
}

export function ChartSegment({ segment }: ChartSegmentProps) {
  const theme = useTheme();
  const segmentRef = useRef<HTMLDivElement>(null);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const element = segmentRef.current;
    if (element === null) return;

    const observer = new ResizeObserver(([entry]) => {
      setShowLabel(entry.contentRect.width >= MIN_LABEL_WIDTH);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (segment.portion === 0) {
    return null;
  }

  return (
    <Tooltip
      title={<SegmentTooltipContent segment={segment} />}
      placement="top"
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2],
          },
        },
      }}
    >
      <HStack
        ref={segmentRef}
        sx={{
          width: `${segment.portion * 100}%`,
          height: 36,
          backgroundColor: segment.color,
          alignItems: 'center',
          justifyContent: 'center',
          px: 0.5,
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 },
        }}
      >
        {showLabel && (
          <Typography variant="captionBold" color={theme.palette.common.black}>
            {formatPortion(segment.portion)}
          </Typography>
        )}
      </HStack>
    </Tooltip>
  );
}
