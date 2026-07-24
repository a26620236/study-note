import type { CSSProperties } from 'react';

import { Box } from '@mui/material';
import { useTheme, type Theme } from '@mui/material/styles';

import { HStack } from '@lumiture-ui';

/**
 * 分段式進度條元件，將百分比視覺化為 5 格色塊。
 *
 * - 0–40%：紅色
 * - 41–79%：黃色
 * - 80–100%：綠色
 * - 最後一格支援比例填色，呈現精確進度
 *
 * @example
 * <ProgressBar percentage={78} />
 */

interface ProgressBarProps {
  /** 0 到 100 的百分比數值 */
  percentage: number;
  /** 自訂顏色邏輯，傳入百分比回傳色碼；未傳時使用預設三階段配色 */
  getColor?: (percentage: number) => CSSProperties['backgroundColor'];
  /** 整個進度條的總寬度（px）；未傳時預設 118px */
  width?: number;
}

const TOTAL_BLOCKS = 5;
const GAP_SIZE = 2; // px，對應 HStack gap="2px"
const DEFAULT_WIDTH = 118;

const defaultGetColor = (percentage: number, palette: Theme['palette']) => {
  if (percentage <= 40) return palette.error.main;
  if (percentage <= 79) return palette.warning.hover;
  return palette.success.main;
};

const getBorderRadius = (index: number) => {
  if (index === 0) return '4px 0 0 4px';
  if (index === TOTAL_BLOCKS - 1) return '0 4px 4px 0';
  return '0';
};

export function ProgressBar({ percentage, getColor, width: widthProp }: ProgressBarProps) {
  const { palette } = useTheme();

  const width = widthProp ?? DEFAULT_WIDTH;

  const blockWidth = (width - (TOTAL_BLOCKS - 1) * GAP_SIZE) / TOTAL_BLOCKS;

  // 防止超出範圍的值（如 -5 或 150）破壞畫面
  const clamped = Math.min(100, Math.max(0, percentage));
  const color = getColor ? getColor(clamped) : defaultGetColor(clamped, palette);
  // 換算成「佔幾格」，例如 63% → 3.15 格
  const filledBlocks = (clamped / 100) * TOTAL_BLOCKS;
  // 完整填滿的格數，例如 3.15 → 3 格全滿
  const fullBlocks = Math.floor(filledBlocks);
  // 最後一格的填色比例，例如 3.15 → 0.15 = 15% 寬
  const partialFill = filledBlocks - fullBlocks;

  return (
    <HStack gap="2px" alignItems="center" flexWrap="nowrap">
      {Array.from({ length: TOTAL_BLOCKS }, (_, i) => {
        const isFullFilled = i < fullBlocks; // 這格要全滿
        const isPartial = i === fullBlocks && partialFill > 0; // 這格要部分填色

        return (
          <Box
            key={i}
            sx={{
              position: 'relative',
              width: blockWidth,
              height: 16,
              borderRadius: getBorderRadius(i),
              backgroundColor: palette.gray.borderLight,
              overflow: 'hidden',
            }}
          >
            {(isFullFilled || isPartial) && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: isFullFilled ? '100%' : `${partialFill * 100}%`,
                  backgroundColor: color,
                }}
              />
            )}
          </Box>
        );
      })}
    </HStack>
  );
}
