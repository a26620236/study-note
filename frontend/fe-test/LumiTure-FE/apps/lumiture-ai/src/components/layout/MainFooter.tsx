'use client';

import { Typography } from '@mui/material';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import { sendGAEvent } from '@next/third-parties/google';
import { getYear } from 'date-fns';

import { EVENT_UI, EXTERNAL_PATHS } from '@constants';

export const Copyright = ({ sx }: { sx?: SxProps }) => (
  <Typography variant="caption" sx={{ color: 'text.secondary', ...sx }}>
    Copyright &copy; {`${getYear(new Date())} LumiTure.ai, Inc. All rights reserved.`}
  </Typography>
);

interface MainFooterProps {
  sx?: SxProps;
}

export default function MainFooter({ sx }: MainFooterProps) {
  const handleFeedbackClick = () => {
    sendGAEvent('event', EVENT_UI.FOOTER_FEEDBACK);
  };
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mt: 'auto', width: '100%', pt: 4, ...sx }}
    >
      <Copyright />
      <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
        {/* <Link href={AUTH_PATHS.termsOfUse.pathname} color="textSecondary" fontWeight={500}>
          <Typography variant="caption">Terms of Use</Typography>
        </Link>
        <Link href={AUTH_PATHS.privacyPolicy.pathname} color="textSecondary" fontWeight={500}>
          <Typography variant="caption">Privacy Policy</Typography>
        </Link> */}
        <Link
          href={EXTERNAL_PATHS.giveFeedback.pathname}
          target="_blank"
          color="textSecondary"
          rel="noopener noreferrer"
          onClick={handleFeedbackClick}
        >
          <Typography variant="linkBold" color="text.secondary" sx={{ fontSize: 14 }}>
            Give Feedback
          </Typography>
        </Link>
      </Stack>
    </Stack>
  );
}
