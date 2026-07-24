import { useRef } from 'react';

import { Tooltip, Typography } from '@mui/material';

import { HighlightText } from '@lumiture-ui';
import { useOverflow } from '@shared/hooks';

import type { RecommendationItem } from '@hooks-api';

import { useRightsizingStore } from '../../hooks/useRightsizingStore';

interface ResourceTagProps {
  resourceTag: RecommendationItem['resourceTag'];
}

export function ResourceTag({ resourceTag }: ResourceTagProps) {
  const { searchText } = useRightsizingStore();
  const textRef = useRef<HTMLDivElement>(null);
  const text = resourceTag?.join(', ') || '--';

  const { isOverflowed } = useOverflow(textRef);

  const TooltipContent = () => (
    <Typography
      component="ul"
      sx={{
        pl: 4,
      }}
    >
      {resourceTag?.map((tag) => (
        <Typography key={tag} component="li">
          <HighlightText
            text={tag}
            highlightText={searchText}
            highlightStyle={{ lineHeight: '16px' }}
          />
        </Typography>
      ))}
    </Typography>
  );

  return (
    <Tooltip
      title={isOverflowed ? <TooltipContent /> : ''}
      placement="right"
      followCursor
      disableHoverListener={!isOverflowed}
    >
      <HighlightText
        ref={textRef}
        text={text}
        highlightText={searchText}
        highlightStyle={{ color: 'primary.main', lineHeight: '20px' }}
        variant="body1"
        noWrap
        width="100%"
      />
    </Tooltip>
  );
}
