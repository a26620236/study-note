import React from 'react';

import { Divider, Typography } from '@mui/material';
import { format } from 'date-fns';
import type { CallbackDataParams } from 'echarts/types/dist/shared.js';

import { VStack } from '@lumiture-ui';
import { palette } from '@lumiture-ui/theme';
import { nFormatter } from '@shared/utils';

import TooltipItem from '@app/(main)/components/TooltipItem';
import type { CurrencySymbol } from '@constants';
import { Granularity } from '@hooks-api';

interface TooltipPRops {
  params: CallbackDataParams[];
  hoveredSeriesIndex: number | null;
  period: Granularity;
  currencySymbol: CurrencySymbol | undefined;
  hasCreditsFilter: boolean;
  creditsValue: number;
}

export const CostTrendChartTooltip = ({
  params,
  hoveredSeriesIndex,
  period,
  currencySymbol,
  hasCreditsFilter,
  creditsValue,
}: TooltipPRops) => {
  if (params.length === 0) return null;

  const total = params.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
    (sum: number, item: CallbackDataParams) => sum + (item.value as number),
    0
  );

  return (
    <VStack
      style={{
        minWidth: 180,
        maxWidth: 600,
        padding: 8,
        gap: 8,
        color: palette.text.primary,
      }}
    >
      <Typography variant="caption" style={{ fontWeight: 500 }}>
        {format(
          new Date(params[0]?.name),
          period === Granularity.Day ? 'd MMM. yyyy' : 'MMM. yyyy'
        )}
      </Typography>
      <Divider sx={{ width: '100%', bgcolor: palette.gray.selected, fontWeight: 400 }} />
      <VStack style={{ gap: 4, maxHeight: 212, overflow: 'auto' as const }}>
        {params.map((item: CallbackDataParams, i: number) => {
          const isHovered = item.seriesIndex === hoveredSeriesIndex;
          return (
            <VStack key={item.seriesName} className={`costTrendItem${i}`}>
              <TooltipItem
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
                label={item.seriesName as string}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
                value={item.value as number}
                currencySymbol={currencySymbol}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
                color={item.color as string}
                labelStyles={{
                  fontWeight: isHovered ? 700 : 400,
                }}
              />
            </VStack>
          );
        })}
      </VStack>
      <Divider sx={{ width: '100%', bgcolor: palette.gray.selected, fontWeight: 400 }} />
      <TooltipItem label="Total" value={total} currencySymbol={currencySymbol} color={null} />
      {hasCreditsFilter && (
        <Typography
          variant="caption"
          style={{
            marginTop: -4,
            color: palette.text.hint,
            textAlign: 'right' as const,
            width: '100%',
          }}
        >
          {`(Include Credits: ${currencySymbol}${nFormatter({ num: creditsValue, fixed: 2 })})`}
        </Typography>
      )}
    </VStack>
  );
};
