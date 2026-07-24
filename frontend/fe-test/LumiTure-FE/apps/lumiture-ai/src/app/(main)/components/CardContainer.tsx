'use client';

import type { ReactNode } from 'react';

import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';

import { HStack } from '@lumiture-ui';

import FrequencySelector from '@app/(main)/components/optimize-cloud-spend/highestSpending/FrequencySelector';
import useOverviewParamChange from '@app/(main)/useOverviewParamChange';
import type { OverviewPeriod } from '@hooks-api';

interface CardContainerProps {
  title: string;
  tooltipText?: string;
  buttons?: ReactNode[];
  children?: ReactNode;
  sx?: SxProps;
  isScreenshotMode: boolean;
  isLoading?: boolean;
  showCurrency?: boolean;
}

const CardContainer = ({
  title,
  tooltipText,
  buttons,
  children,
  sx = {},
  isScreenshotMode,
  isLoading = false,
  showCurrency = true,
}: CardContainerProps) => {
  const { data } = useSession();
  const { currency } = data?.user ?? {};
  const { frequency, periodCaption, handleParamsChange } = useOverviewParamChange();

  const handleFrequencyChange = (value: OverviewPeriod) => {
    handleParamsChange({ frequency: value });
  };

  return (
    <Paper
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 280, p: 6, ...sx }}
    >
      <Stack sx={{ gap: 4, flex: 1 }}>
        <Stack direction="row" alignItems="center">
          <HStack alignItems="center" gap={2}>
            <Typography variant="h5">{title}</Typography>
            {tooltipText && (
              <Tooltip title={tooltipText}>
                <InfoRoundedIcon sx={{ fontSize: 16, color: 'text.hint' }} />
              </Tooltip>
            )}
          </HStack>
          {buttons}
          <FrequencySelector
            isScreenshotMode={isScreenshotMode}
            label="Display Frequency"
            frequency={frequency}
            setFrequency={handleFrequencyChange}
            isLoading={isLoading}
            sx={{ ml: 'auto' }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={4}>
            <Typography variant="caption" color="text.hint">
              {showCurrency && `Cost (${currency})`}
            </Typography>
          </Stack>

          <Typography
            color="text.hint"
            sx={{ fontStyle: 'italic' }}
          >{`OverviewPeriod: ${periodCaption}`}</Typography>
        </Stack>

        <Stack sx={{ flex: 1 }}>{children}</Stack>
      </Stack>
    </Paper>
  );
};

export default CardContainer;
