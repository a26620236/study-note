import { forwardRef, useMemo } from 'react';

import { Box, Typography, type TypographyProps } from '@mui/material';

interface TextPart {
  text: string;
  isHighlight: boolean;
}

interface HighlightTextProps extends TypographyProps {
  /**
   * 原始文字
   */
  text: string;
  /**
   * 高亮文字
   */
  highlightText: string;
  /**
   * 高亮文字的样式
   */
  highlightStyle?: TypographyProps['sx'];
  /**
   * 是否區分大小寫
   */
  caseSensitive?: boolean;
}

export const HighlightText = forwardRef<HTMLSpanElement, HighlightTextProps>(function HighlightText(
  { text, highlightText, highlightStyle = { fontWeight: 700 }, caseSensitive = false, ...props },
  ref
) {
  const highlightedText = useMemo((): TextPart[] => {
    // 如果highlightText為空，則返回原始文字
    if (!highlightText.trim()) {
      return [{ text, isHighlight: false }];
    }

    // 如果caseSensitive為true，則使用原始文字，否則使用小寫文字
    const searchText = caseSensitive ? highlightText : highlightText.toLowerCase();
    const sourceText = caseSensitive ? text : text.toLowerCase();

    // 初始化parts
    const textParts: TextPart[] = [];
    let lastIndex = 0;
    let index = sourceText.indexOf(searchText);

    while (index !== -1) {
      // 添加highlight前的文字
      if (index > lastIndex) {
        textParts.push({
          text: text.slice(lastIndex, index),
          isHighlight: false,
        });
      }

      // 添加highlight的文字
      textParts.push({
        text: text.slice(index, index + highlightText.length),
        isHighlight: true,
      });

      lastIndex = index + highlightText.length;
      index = sourceText.indexOf(searchText, lastIndex);
    }

    // 添加剩餘的文字
    if (lastIndex < text.length) {
      textParts.push({
        text: text.slice(lastIndex),
        isHighlight: false,
      });
    }

    return textParts;
  }, [text, highlightText, caseSensitive]);

  return (
    <Typography ref={ref} {...props}>
      {highlightedText.map((part: TextPart, index: number) => (
        <Box
          key={index}
          component="span"
          sx={part.isHighlight ? { fontWeight: 700, ...highlightStyle } : undefined}
        >
          {part.text}
        </Box>
      ))}
    </Typography>
  );
});
