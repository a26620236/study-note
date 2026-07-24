import { useRef, type ReactNode } from 'react';

import { Tooltip } from '@mui/material';

import { HighlightText, HStack, VStack } from '@lumiture-ui';
import { useOverflow } from '@shared/hooks';

/**
 * 表格雙行文字元件，用於顯示名稱 + ID 的組合。
 *
 * 功能：
 * - 雙行佈局：上方顯示主要文字（name），下方顯示次要文字（id）
 * - 搜尋高亮：傳入 `searchText` 時會高亮匹配的文字
 * - 溢出提示：當文字被截斷時，hover 會顯示完整內容的 tooltip
 * - 可選圖示：支援在左側顯示圖示
 *
 * @example
 * ```tsx
 * <DoubleLineCell
 *   name="My Project"
 *   id="project-123"
 *   searchText={searchText}
 *   icon={<ProjectIcon />}
 * />
 * ```
 */
interface DoubleLineCellProps {
  name: string;
  id: string;
  searchText?: string;
  icon?: ReactNode;
}

export const DoubleLineCell = ({ name, id, searchText = '', icon }: DoubleLineCellProps) => {
  const nameRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<HTMLDivElement>(null);

  const isNameOverflowed = useOverflow(nameRef);
  const isIdOverflowed = useOverflow(idRef);
  const isAnyOverflowed = isNameOverflowed.isOverflowed || isIdOverflowed.isOverflowed;

  const TooltipContent = () => (
    <VStack gap={0.5}>
      <HighlightText
        text={name}
        highlightText={searchText}
        highlightStyle={{ lineHeight: '24.5px' }}
        variant="buttonRegular1"
      />
      <HighlightText
        text={id}
        highlightText={searchText}
        highlightStyle={{ lineHeight: '18px' }}
        variant="buttonRegular0"
        color="textHint"
      />
    </VStack>
  );

  return (
    <HStack gap={2.5} alignItems="center" width="100%" flexWrap="nowrap">
      {icon}
      <Tooltip
        title={isAnyOverflowed ? <TooltipContent /> : ''}
        placement="right"
        followCursor
        disableHoverListener={!isAnyOverflowed}
      >
        <VStack minWidth={0}>
          <HighlightText
            ref={nameRef}
            variant="buttonRegular1"
            noWrap
            text={name}
            highlightText={searchText}
            highlightStyle={{ color: 'primary.main', lineHeight: '24.5px' }}
            width="100%"
          />
          <HighlightText
            text={id}
            highlightText={searchText}
            highlightStyle={{ color: 'primary.main', lineHeight: '18px' }}
            color="textHint"
            ref={idRef}
            variant="buttonRegular0"
            noWrap
            width="100%"
          />
        </VStack>
      </Tooltip>
    </HStack>
  );
};
