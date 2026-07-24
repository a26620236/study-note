import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Tooltip, { type TooltipProps } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { getPrevNextUpdateTimes, type Time } from '@utils';

const LABELS = {
  description:
    'According to the status of cloud platform’s data, the usage data for the current day may be available only on the next day and may differ from actual usage. Accurate cost information is typically available approximately 48 hours after the usage is generated.',
};

interface UpdateAtProps {
  times?: Time[];
  placement?: TooltipProps['placement'];
  sx?: SxProps;
  iconSx?: SxProps;
  isScreenshotMode?: boolean;
  description?: string;
}

const UpdateAt = ({
  times = ['03:00', '09:00', '15:00', '21:00'],
  placement,
  sx,
  iconSx,
  isScreenshotMode = false,
  description = LABELS.description,
}: UpdateAtProps) => {
  const { prev, next } = getPrevNextUpdateTimes({ times });

  return (
    <Stack direction="row" sx={{ gap: 1, ml: 'auto', color: 'text.secondary', ...sx }}>
      <Stack direction="row" sx={{ gap: 5 }}>
        <Typography className="lastUpdate" variant="caption">
          {`Last Updated ${prev}`}
        </Typography>
        {!isScreenshotMode && (
          <Typography className="nextUpdate" variant="caption">
            {`Next Update ${next}`}
          </Typography>
        )}
      </Stack>
      {!isScreenshotMode && (
        <Tooltip placement={placement} title={description}>
          <InfoRoundedIcon sx={{ fontSize: 16, color: 'text.secondary', ...iconSx }} />
        </Tooltip>
      )}
    </Stack>
  );
};

export default UpdateAt;
