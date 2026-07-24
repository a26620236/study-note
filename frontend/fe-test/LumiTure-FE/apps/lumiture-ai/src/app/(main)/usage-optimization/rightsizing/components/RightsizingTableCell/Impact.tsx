'use client';

import type { CSSProperties } from 'react';

import { Box, Typography } from '@mui/material';

import { HStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

import type { RecommendationItem } from '@hooks-api';

const LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const ImpactValue = {
  Low: 0,
  Medium: 1,
  High: 2,
} as const;

interface ImpactProps {
  impact: RecommendationItem['impact'];
}

export function Impact({ impact }: ImpactProps) {
  return (
    <HStack gap={2.5} alignItems="center" width="100%" flexWrap="nowrap">
      {impact === ImpactValue.Low && (
        <EllipseLabel bgColor={theme.palette.success.hover} label={LABELS.low} />
      )}
      {impact === ImpactValue.Medium && (
        <EllipseLabel bgColor={theme.palette.warning.main} label={LABELS.medium} />
      )}
      {impact === ImpactValue.High && (
        <EllipseLabel bgColor={theme.palette.error.main} label={LABELS.high} />
      )}
    </HStack>
  );
}

interface EllipseLabelProps {
  bgColor: CSSProperties['backgroundColor'];
  label: string;
}

const EllipseLabel = ({ bgColor, label }: EllipseLabelProps) => (
  <HStack gap={2.5} alignItems="center" width="100%" flexWrap="nowrap">
    <Box width={8} height={8} borderRadius="50%" bgcolor={bgColor} />
    <Typography variant="body1">{label}</Typography>
  </HStack>
);
