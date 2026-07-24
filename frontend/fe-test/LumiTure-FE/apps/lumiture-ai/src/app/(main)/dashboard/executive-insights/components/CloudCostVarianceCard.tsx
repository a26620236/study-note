'use client';

import { Tooltip, Typography } from '@mui/material';
import { isNil } from 'lodash-es';

import { HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

export enum VarianceStatus {
  Accurate = 'Accurate',
  Moderate = 'Moderate',
  High = 'High',
  Inaccurate = 'Inaccurate',
}

interface CloudCostVarianceCardProps {
  variancePercent?: number | null;
}

const THRESHOLDS = {
  MODERATE: 12,
  HIGH: 15,
  INACCURATE: 20,
};

const LABELS = {
  title: 'Variance %',
  message: {
    [VarianceStatus.Accurate]: 'Your variance to forecast is Accurate.',
    [VarianceStatus.Moderate]: 'Your variance to forecast is Moderate.',
    [VarianceStatus.High]: 'Your variance to forecast is High.',
    [VarianceStatus.Inaccurate]: 'Your variance to forecast is Inaccurate.',
  },
  description: `**Variance %** is calculated as:<br/><u><em>Variance ÷ Forecast</em></u><br/><br/>**Indicators:**<br/>&nbsp;&nbsp;< 12% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Accurate<br/>&nbsp;&nbsp;12%-15% &nbsp;&nbsp;— Moderate<br/>&nbsp;&nbsp;15%-20% &nbsp;&nbsp;— High<br/>&nbsp;&nbsp;> 20% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— Inaccurate`,
  noData: 'No Data',
};

const icons = {
  [VarianceStatus.Accurate]: <Icon sx={{ fontSize: 16 }} name="mood" />,
  [VarianceStatus.Moderate]: <Icon sx={{ fontSize: 16 }} name="sentiment_neutral" />,
  [VarianceStatus.High]: <Icon sx={{ fontSize: 16 }} name="sentiment_dissatisfied" />,
  [VarianceStatus.Inaccurate]: <Icon sx={{ fontSize: 16 }} name="error" />,
};

const BASIC_CARD_STYLES = {
  backgroundColor: 'inherit',
  padding: '16px',
  borderRadius: '8px',
  width: '100%',
  minHeight: '122px',
  border: `1px solid ${theme.palette.grey[200]}`,
};

const getCardStyles = (status: VarianceStatus) => {
  switch (status) {
    case VarianceStatus.Accurate:
      return {
        ...BASIC_CARD_STYLES,
        color: theme.palette.success.main,
      };
    case VarianceStatus.Moderate:
      return {
        ...BASIC_CARD_STYLES,
        color: theme.palette.warning.dark,
      };
    case VarianceStatus.High:
    case VarianceStatus.Inaccurate:
      return {
        ...BASIC_CARD_STYLES,
        color: theme.palette.error.dark,
      };
  }
};

const getStatus = (variance: number): VarianceStatus => {
  if (variance < THRESHOLDS.MODERATE) return VarianceStatus.Accurate;
  if (variance >= THRESHOLDS.MODERATE && variance < THRESHOLDS.HIGH) {
    return VarianceStatus.Moderate;
  }
  if (variance >= THRESHOLDS.HIGH && variance <= THRESHOLDS.INACCURATE) {
    return VarianceStatus.High;
  }
  return VarianceStatus.Inaccurate;
};

export function CloudCostVarianceCard({ variancePercent }: CloudCostVarianceCardProps) {
  if (isNil(variancePercent)) {
    return (
      <VStack style={BASIC_CARD_STYLES}>
        <Typography variant="captionBold" color="text.secondary">
          {LABELS.title}
        </Typography>
        <Typography variant="h2" color="text.hint">
          {LABELS.noData}
        </Typography>
      </VStack>
    );
  }

  const currentStatus = getStatus(Math.abs(variancePercent));

  return (
    <Tooltip followCursor placement="top-start" title={<Markdown>{LABELS.description}</Markdown>}>
      <div>
        <VStack style={getCardStyles(currentStatus)}>
          <Typography variant="captionBold" color="text.secondary">
            {LABELS.title}
          </Typography>

          <Typography variant="h2">{`${variancePercent}%`}</Typography>

          <HStack alignItems="center" gap={1}>
            {icons[currentStatus]}
            <Typography variant="caption">{LABELS.message[currentStatus]}</Typography>
          </HStack>
        </VStack>
      </div>
    </Tooltip>
  );
}
