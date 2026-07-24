import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { ScreenShot } from '@lumiture-ui/SvgIcon';

import UpdateAt from '@components/UpdateAt';

interface TopInfosProps {
  isDisabledScreenShot?: boolean;
  isScreenshotMode?: boolean;
  onTakeScreenshot?: () => void;
}

const TopInfos = ({ isDisabledScreenShot, isScreenshotMode, onTakeScreenshot }: TopInfosProps) => (
  <Stack sx={{ mb: isScreenshotMode ? 4 : 0 }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
      <Typography variant="h4">Full Team Spending Rankings</Typography>
      <UpdateAt isScreenshotMode={isScreenshotMode} />
      {!isScreenshotMode && (
        <Tooltip title="Take Screenshot">
          <Box>
            <IconButton sx={{ ml: 2 }} disabled={isDisabledScreenShot} onClick={onTakeScreenshot}>
              <ScreenShot />
            </IconButton>
          </Box>
        </Tooltip>
      )}
    </Stack>
    <Typography variant="caption" color="text.secondary">
      Please note that this chart is displayed on a group basis.
      <br />
      The total amount in this chart may not match the organization&apos;s total amount due to the
      duplication of resources assigned to multiple groups.
    </Typography>
  </Stack>
);

export default TopInfos;
