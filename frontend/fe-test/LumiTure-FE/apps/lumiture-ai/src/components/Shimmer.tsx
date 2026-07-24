import type { PropsWithChildren } from 'react';

import { alpha, Box, useTheme, type BoxProps } from '@mui/material';
import { motion, type HTMLMotionProps } from 'motion/react';

/**
 * Shimmer 閃爍效果組件
 *
 * 用於在內容上添加水平移動的光澤效果，用於強調特定 UI 元素。
 * 組件會在容器內從左到右無限循環播放一道漸層光線。
 */
interface ShimmerProps extends HTMLMotionProps<'div'> {
  /** 閃爍光線的寬度，預設為 '20%' */
  width?: string;
  /** 動畫持續時間（秒），預設為 1.5 秒 */
  duration?: number;
  /** 閃爍光線的顏色，預設使用主題中的半透明白色 */
  color?: string;
  /** 每次動畫重複前的延遲時間（秒），預設為 0 */
  repeatDelay?: number;
  /**
   * 根容器的自訂樣式
   * @note 可以使用 `width: 'fit-content'` 讓閃爍範圍與內部內容寬度一致
   * @example rootSx={{ width: 'fit-content' }}
   */
  rootSx?: BoxProps['sx'];
}

export function Shimmer({
  width = '20%',
  duration = 1.5,
  color: colorProp,
  repeatDelay = 0,
  children,
  rootSx,
  ...rest
}: PropsWithChildren<ShimmerProps>) {
  const theme = useTheme();
  const color = colorProp ?? alpha(theme.palette.white.main, 0.5);

  return (
    <Box position="relative" overflow="hidden" sx={rootSx}>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: '-20%',
          width,
          height: '100%',
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          pointerEvents: 'none',
          zIndex: 10,
        }}
        animate={{
          left: ['-20%', '100%'],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatDelay,
          ease: 'linear',
        }}
        {...rest}
      />
      {children}
    </Box>
  );
}
