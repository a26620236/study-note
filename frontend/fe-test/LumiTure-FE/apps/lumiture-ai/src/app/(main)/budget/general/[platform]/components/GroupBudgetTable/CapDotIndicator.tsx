import { Box, Tooltip, Typography } from '@mui/material';
import { nFormatter } from '@shared/utils';

const LABELS = {
  title: (tier: string) => `${tier} Budget Over Your Cap`,
  planned: (tier: string) => `${tier} Planned`,
  allocatedCap: 'Your Allocated cap',
  overBy: (amount: string, pct: number) => `Over by ${amount} (${pct}% of your cap)`,
};

interface CapDotIndicatorProps {
  subordinateTierLabel: string;
  plannedBudget: number;
  capValue: number;
}

export const CapDotIndicator = ({ subordinateTierLabel, plannedBudget, capValue }: CapDotIndicatorProps) => {
  const overBy = plannedBudget - capValue;
  const percentage = capValue > 0 ? Math.round((overBy / capValue) * 100) : 0;
  const fmt = (num: number) => `$${nFormatter({ num, fixed: 0 })}`;

  const tooltipTitle = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
        {LABELS.title(subordinateTierLabel)}
      </Typography>
      <Typography variant="caption">{`• ${LABELS.planned(subordinateTierLabel)}: ${fmt(plannedBudget)}`}</Typography>
      <Typography variant="caption">{`• ${LABELS.allocatedCap}: ${fmt(capValue)}`}</Typography>
      <Typography variant="caption">{`• ${LABELS.overBy(fmt(overBy), percentage)}`}</Typography>
    </Box>
  );

  return (
    <Tooltip title={tooltipTitle} placement="top">
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: 'warning.main',
          flexShrink: 0,
        }}
      />
    </Tooltip>
  );
};
