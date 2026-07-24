'use client';

import { Tooltip, Typography } from '@mui/material';
import { isNil } from 'lodash-es';

import { HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

enum CloudSpendStatus {
  Good = 'Good',
  Poor = 'Poor',
  Equal = 'Equal',
  UnKnown = 'UnKnown',
}

interface CloudSpendRevenueCardProps {
  percentage?: number | null;
  benchmark?: number | null;
}

const LABELS = {
  title: 'Your Cloud Spend as a % of Revenue',
  message: {
    [CloudSpendStatus.Good]: 'Lower than the industry benchmark.',
    [CloudSpendStatus.Poor]: 'Higher than the industry benchmark.',
    [CloudSpendStatus.Equal]: 'Equal to the industry benchmark.',
    [CloudSpendStatus.UnKnown]: 'No benchmark is set for comparison.',
  },
  description:
    '<strong>Cloud Spend as % of Revenue</strong> is calculated as: <br/><u><em>Actual Cost ÷ Revenue</em></u>',
  noData: 'No Data',
};

const icons = {
  [CloudSpendStatus.Good]: <Icon sx={{ fontSize: 16 }} name="mood" />,
  [CloudSpendStatus.Equal]: <Icon sx={{ fontSize: 16 }} name="mood" />,
  [CloudSpendStatus.Poor]: <Icon sx={{ fontSize: 16 }} name="sentiment_dissatisfied" />,
  [CloudSpendStatus.UnKnown]: <Icon sx={{ fontSize: 16 }} name="sentiment_neutral" />,
};

const BASIC_CARD_STYLES = {
  backgroundColor: 'inherit',
  padding: '16px',
  borderRadius: '8px',
  width: '100%',
  minHeight: '122px',
  border: `1px solid ${theme.palette.grey[200]}`,
};

const getCardStyles = (status: CloudSpendStatus) => {
  switch (status) {
    case CloudSpendStatus.Good:
    case CloudSpendStatus.Equal:
      return {
        ...BASIC_CARD_STYLES,
        color: theme.palette.success.main,
      };
    case CloudSpendStatus.Poor:
      return {
        ...BASIC_CARD_STYLES,
        color: theme.palette.error.dark,
      };
    case CloudSpendStatus.UnKnown:
      return {
        ...BASIC_CARD_STYLES,
        color: theme.palette.text.primary,
      };
  }
};

const getStatus = (percentage: number, benchmark?: number | null): CloudSpendStatus => {
  if (!benchmark) return CloudSpendStatus.UnKnown;
  if (percentage === benchmark) return CloudSpendStatus.Equal;
  if (percentage < benchmark) return CloudSpendStatus.Good;
  return CloudSpendStatus.Poor;
};

export function CloudSpendRevenueCard({ percentage, benchmark }: CloudSpendRevenueCardProps) {
  if (isNil(percentage)) {
    return (
      <VStack style={BASIC_CARD_STYLES}>
        <HStack alignItems="center" gap={1}>
          <Typography variant="captionBold" color="text.secondary">
            {LABELS.title}
          </Typography>
        </HStack>

        <Typography variant="h2" color="text.hint">
          {LABELS.noData}
        </Typography>
      </VStack>
    );
  }

  const currentStatus = getStatus(percentage, benchmark);

  return (
    <Tooltip followCursor placement="top-start" title={<Markdown>{LABELS.description}</Markdown>}>
      <div>
        <VStack style={getCardStyles(currentStatus)}>
          <HStack alignItems="center" gap={1}>
            <Typography variant="captionBold" color="text.secondary">
              {LABELS.title}
            </Typography>
          </HStack>

          <Typography variant="h2">{percentage}%</Typography>

          <HStack alignItems="center" gap={1}>
            {icons[currentStatus]}
            <Typography variant="caption">{LABELS.message[currentStatus]}</Typography>
          </HStack>
        </VStack>
      </div>
    </Tooltip>
  );
}
