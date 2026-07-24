import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';

import { palette } from '@lumiture-ui/theme';

import { Copyright } from '@components/layout/MainFooter';
import Logo from '@components/Logo';

interface ScreenshotWrapperProps {
  children: React.ReactNode;
  debug?: boolean;
  sx?: SxProps;
}

const Border = ({ children }: { children?: React.ReactNode }) => (
  <Stack
    alignItems="center"
    justifyContent="center"
    width="100%"
    p={6}
    gap={4}
    sx={{
      background: `linear-gradient(272deg, ${palette.primary.main} 0%, #4ADFFF 100%)`,
    }}
  >
    {children}
  </Stack>
);

const ScreenshotWrapper = forwardRef<HTMLDivElement, ScreenshotWrapperProps>(
  function ScreenshotWrapper({ children, debug = false, sx }, ref) {
    const defaultStyles: SxProps = debug ? {} : { position: 'absolute', top: -99999 };

    return (
      <Box sx={{ minWidth: 1440, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ ...defaultStyles, ...sx }}>
          <Stack
            ref={ref}
            direction="column"
            justifyContent="space-between"
            component="div"
            sx={{ bgcolor: 'primary.light10' }}
          >
            <Border>
              <Logo isColored={false} height={40} />
            </Border>
            <Stack flex={1} gap={4} p="32px 128px">
              {children}
            </Stack>
            <Border>
              <Logo isColored={false} height={40} />
              <Copyright sx={{ color: '#FFFFFF' }} />
            </Border>
          </Stack>
        </Box>
      </Box>
    );
  }
);

export default ScreenshotWrapper;
