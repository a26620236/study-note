import type { CSSProperties } from 'react';

import { Typography } from '@mui/material';
import { useSession } from 'next-auth/react';

import { VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { nFormatAbbreviation } from '@shared/utils';

import type { RecommendationItem } from '@hooks-api';

interface AvoidanceProps {
  avoidance: RecommendationItem['estimatedAvoidance'] | RecommendationItem['actualAvoidance'];
}

export function Avoidance({ avoidance }: AvoidanceProps) {
  const { data } = useSession();
  const currency = data?.user.currency ?? '--';
  const amount = nFormatAbbreviation({ num: avoidance.amount });
  const percentage = avoidance.saveRate * 100;
  const amountWithCurrency = `${currency} ${amount} `;
  const formattedAvoidanceRate = `Avoid ${percentage.toFixed(2)}%`;

  const getColor = (): CSSProperties['color'] => {
    if (percentage > 0) return theme.palette.success.main;
    if (percentage < 0) return theme.palette.error.main;
    return theme.palette.text.hint;
  };

  return (
    <VStack>
      <Typography variant="body1">{amountWithCurrency}</Typography>
      <Typography variant="buttonRegular0" color={getColor()}>
        {formattedAvoidanceRate}
      </Typography>
    </VStack>
  );
}
