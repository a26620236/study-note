'use client';

import { Tooltip, Typography } from '@mui/material';
import { isNil } from 'lodash-es';

import { HStack, Icon, Markdown, VStack } from '@lumiture-ui';
import { basicColor, theme } from '@lumiture-ui/theme';

enum CVRScoreStatus {
  Excellent = 'Excellent',
  Good = 'Good',
  Poor = 'Poor',
}

interface CVRScoreCardProps {
  score?: number | null;
}

const CVR_SCORE_THRESHOLDS = 1;

const BASIC_CARD_STYLES = {
  padding: '16px 0',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: '128px',
  border: `1px solid ${theme.palette.gray.borderLight}`,
};

const LABELS = {
  title: 'CVR Score',
  message: {
    [CVRScoreStatus.Excellent]: 'Realized cloud value exceeds expectations.',
    [CVRScoreStatus.Good]: 'Realized cloud value meets expectations.',
    [CVRScoreStatus.Poor]: 'Realized cloud value falls below expectations.',
  },
  tooltip: {
    description: `**CVR** refers to CPI (Cloud Performance Index), calculated as:<br/><u><em>Realized Value ÷ Actual Cost</em></u><br/>
    Indicators:
      &nbsp;&nbsp;• &nbsp;> 1 — Realized value exceeds expectations
      &nbsp;&nbsp;• &nbsp;= 1 — Realized value meets expectations
      &nbsp;&nbsp;• &nbsp;< 1 — Realized value falls below expectations`,
  },
  noData: 'No Data',
};

const icons = {
  [CVRScoreStatus.Excellent]: <Icon sx={{ fontSize: 16 }} name="mood" />,
  [CVRScoreStatus.Good]: <Icon sx={{ fontSize: 16 }} name="sentiment_neutral" />,
  [CVRScoreStatus.Poor]: <Icon sx={{ fontSize: 16 }} name="sentiment_dissatisfied" />,
};

const getCardStyles = (status: CVRScoreStatus) => {
  switch (status) {
    case CVRScoreStatus.Excellent:
      return {
        ...BASIC_CARD_STYLES,
        backgroundColor: theme.palette.success.bg,
        borderColor: theme.palette.success.main,
        color: theme.palette.success.dark,
      };
    case CVRScoreStatus.Good:
      return {
        ...BASIC_CARD_STYLES,
        backgroundColor: basicColor.secondary.turquoiseBlue[10],
        borderColor: basicColor.secondary.turquoiseBlue[70],
        color: basicColor.secondary.turquoiseBlue[70],
      };
    case CVRScoreStatus.Poor:
      return {
        ...BASIC_CARD_STYLES,
        backgroundColor: theme.palette.error.bg,
        borderColor: theme.palette.error.main,
        color: theme.palette.error.dark,
      };
  }
};

const getStatus = (score: number): CVRScoreStatus => {
  if (score > CVR_SCORE_THRESHOLDS) return CVRScoreStatus.Excellent;
  if (score === CVR_SCORE_THRESHOLDS) return CVRScoreStatus.Good;
  return CVRScoreStatus.Poor;
};

export function CVRScoreCard({ score }: CVRScoreCardProps) {
  if (isNil(score)) {
    return (
      <VStack alignItems="center" style={BASIC_CARD_STYLES}>
        <Typography variant="captionBold" color="text.secondary">
          {LABELS.title}
        </Typography>

        <Typography variant="h1" color="text.hint">
          {LABELS.noData}
        </Typography>
      </VStack>
    );
  }

  const currentStatus = getStatus(score);

  return (
    <Tooltip
      followCursor
      placement="top-start"
      slotProps={{
        tooltip: {
          sx: { maxWidth: '500px' },
        },
      }}
      title={<Markdown>{LABELS.tooltip.description}</Markdown>}
    >
      <div style={getCardStyles(currentStatus)}>
        <VStack alignItems="center">
          <Typography variant="captionBold" color="text.secondary">
            {LABELS.title}
          </Typography>

          <Typography variant="h1">{score.toFixed(2)}</Typography>

          <HStack alignItems="center" justifyContent="center" gap={1}>
            {icons[currentStatus]}
            <Typography variant="caption">{LABELS.message[currentStatus]}</Typography>
          </HStack>
        </VStack>
      </div>
    </Tooltip>
  );
}
