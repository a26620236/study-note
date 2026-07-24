import React, { useRef, type ReactNode } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Typography, { type TypographyProps } from '@mui/material/Typography';

import { useOverflow } from '@shared/hooks';

interface EllipsisTooltipCellProps extends TypographyProps {
  text: ReactNode;
  tooltipText?: ReactNode;
  maxLines?: number;
}

const EllipsisTooltipCell = ({
  text,
  tooltipText,
  maxLines = 1,
  ...rest
}: EllipsisTooltipCellProps) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const { isOverflowed } = useOverflow(cellRef, maxLines);
  const displayText = tooltipText || text;

  return (
    <Tooltip
      title={isOverflowed ? displayText : ''}
      placement="right"
      followCursor
      disableHoverListener={!isOverflowed}
    >
      <Typography
        width="100%"
        ref={cellRef}
        noWrap={maxLines === 1}
        sx={{
          ...(maxLines > 1 && {
            display: '-webkit-box',
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }),
          ...rest.sx,
        }}
        {...rest}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

export default EllipsisTooltipCell;
