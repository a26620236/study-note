'use client';

import { Box, Tooltip, Typography, type SxProps } from '@mui/material';
import { isNil } from 'lodash-es';

import { HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { nFormatAbbreviation } from '@shared/utils';

import type { Currency } from '@constants';

const LABELS = {
  noData: 'No Data',
};

interface MetricDisplayProps {
  title: React.ReactNode;
  currency?: Currency;
  description?: string;
  numberFormatProps: {
    num?: number | null;
    fixed?: number;
    prefix?: string;
    suffix?: string;
  };
  sx?: SxProps;
}

export function MetricDisplay({
  title,
  description,
  currency,
  numberFormatProps,
  sx,
}: MetricDisplayProps) {
  const { num } = numberFormatProps;

  return (
    <VStack sx={{ width: 'fit-content', flex: 1, ...sx }}>
      <HStack alignItems="center" gap={1}>
        <Typography variant="captionBold" color="text.secondary" noWrap>
          {title}
        </Typography>
        {description && (
          <Tooltip title={<Markdown>{description}</Markdown>} placement="top">
            <Box display="flex" alignItems="center" justifyContent="center">
              <Icon name="info" sx={{ fontSize: 16, color: 'text.hint' }} />
            </Box>
          </Tooltip>
        )}
      </HStack>
      <HStack alignItems="baseline" gap={1} flexWrap="nowrap">
        {isNil(num) ? (
          <Typography variant="h3" color="text.hint">
            {LABELS.noData}
          </Typography>
        ) : (
          <>
            <Typography variant="h3">{nFormatAbbreviation({ ...numberFormatProps })}</Typography>
            {currency && <Typography variant="captionBold">{currency}</Typography>}
          </>
        )}
      </HStack>
    </VStack>
  );
}
