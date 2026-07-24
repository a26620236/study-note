import * as React from 'react';

import ErrorIcon from '@mui/icons-material/People';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import CenteredBox from '@components/CenteredBox';

interface ErrorViewProps {
  message: string;
  href: string;
  linkText: string;
  errorIcon?: React.ReactNode;
}

export function ErrorView({ message, href, linkText, errorIcon }: ErrorViewProps) {
  return (
    <CenteredBox>
      <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
        {errorIcon || <ErrorIcon color="error" fontSize="large" />}
        <Typography variant="h5" fontWeight={700} color="error">
          Error
        </Typography>
      </Box>
      <Typography variant="caption">
        {message}
        <Link href={href}>
          <Typography variant="link" color="primary">
            {linkText}
          </Typography>
        </Link>
      </Typography>
    </CenteredBox>
  );
}
