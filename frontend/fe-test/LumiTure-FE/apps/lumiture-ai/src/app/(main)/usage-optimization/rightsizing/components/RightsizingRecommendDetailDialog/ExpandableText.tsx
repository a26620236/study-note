'use client';

import { useRef, useState } from 'react';

import { alpha, Box, Collapse, Tooltip, Typography, useTheme } from '@mui/material';

import { HStack, Icon, VStack } from '@lumiture-ui';
import { useOverflow } from '@shared/hooks';

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
}

export function ExpandableText({ text, maxLines = 2 }: ExpandableTextProps) {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const { isOverflowed, lineHeight } = useOverflow(ref, maxLines);
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded((prev) => !prev);

  // 動態計算 collapsedSize，如果 lineHeight 還沒計算出來就使用預設值
  const collapsedSize = lineHeight > 0 ? lineHeight * maxLines : 'auto';

  return (
    <VStack gap={2}>
      <Collapse in={expanded} collapsedSize={collapsedSize} timeout="auto">
        <Box sx={{ position: 'relative' }}>
          <Typography
            ref={ref}
            variant="body1"
            sx={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: expanded ? 'unset' : maxLines,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {text}
          </Typography>
          {!expanded && isOverflowed && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: lineHeight,
                background: `linear-gradient(180deg, ${alpha(theme.palette.white.main, 0.04)} 0%, ${alpha(theme.palette.white.main, 0.6)} 100%)`,
                pointerEvents: 'none',
              }}
            />
          )}
        </Box>
      </Collapse>
      {isOverflowed && (
        <HStack justifyContent="center" onClick={toggle} sx={{ cursor: 'pointer' }}>
          <Tooltip title={expanded ? 'Show Less' : 'Learn More'} followCursor placement="right">
            <Icon
              name={expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              sx={{ fontSize: 20 }}
            />
          </Tooltip>
        </HStack>
      )}
    </VStack>
  );
}
