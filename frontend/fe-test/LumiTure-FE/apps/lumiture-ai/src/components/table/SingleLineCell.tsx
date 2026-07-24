import { useRef } from 'react';

import { Tooltip, type SxProps, type Theme } from '@mui/material';

import { HighlightText, HStack } from '@lumiture-ui';
import { useOverflow } from '@shared/hooks';

/**
 * 表格單行/多行文字元件，用於顯示單一文字。
 *
 * 功能：
 * - 單行/多行佈局：顯示主要文字（text），可透過 `maxLines` 設定最大行數
 * - 搜尋高亮：傳入 `searchText` 時會高亮匹配的文字
 * - 溢出提示：當文字被截斷時，hover 會顯示完整內容的 tooltip
 *
 * @example
 * ```tsx
 *  單行
 * <SingleLineCell
 *   text="My Project"
 *   searchText={searchText}
 *   icon={<ProjectIcon />}
 * />
 *
 * 多行
 * <SingleLineCell
 *   text="My Project with a very long name"
 *   searchText={searchText}
 *   maxLines={2}
 * />
 * ```
 */
interface SingleLineCellProps {
  text: string;
  searchText?: string;
  maxLines?: number;
  sx?: SxProps<Theme>;
}

export const SingleLineCell = ({
  text,
  searchText = '',
  maxLines = 1,
  sx,
}: SingleLineCellProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const { isOverflowed } = useOverflow(textRef, maxLines);

  const TooltipContent = () => (
    <HighlightText
      text={text}
      highlightText={searchText}
      highlightStyle={{ lineHeight: '24.5px' }}
      variant="buttonRegular1"
    />
  );

  return (
    <HStack gap={2.5} alignItems="center" width="100%" flexWrap="nowrap">
      <Tooltip
        title={isOverflowed ? <TooltipContent /> : ''}
        placement="right"
        followCursor
        disableHoverListener={!isOverflowed}
      >
        <HighlightText
          ref={textRef}
          variant="buttonRegular1"
          noWrap={maxLines === 1}
          text={text}
          highlightText={searchText}
          highlightStyle={{ color: 'primary.main', lineHeight: '24.5px' }}
          width="100%"
          sx={
            maxLines > 1
              ? {
                  display: '-webkit-box',
                  WebkitLineClamp: maxLines,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  ...sx,
                }
              : sx
          }
        />
      </Tooltip>
    </HStack>
  );
};
