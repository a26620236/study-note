import type { PropsWithChildren } from 'react';

import { Box, Paper, type BoxProps } from '@mui/material';

import { HStack } from '../Stack';

interface AlertWrapperProps {
  boxProps?: BoxProps;
}

export function AlertWrapper({ children, boxProps }: PropsWithChildren<AlertWrapperProps>) {
  return (
    <Paper sx={{ borderRadius: '6px', p: 0, overflow: 'hidden', border: '1px solid transparent' }}>
      <Box height="4px" {...boxProps} />
      <HStack p={5} m="0px -1px -1px -1px">
        {children}
      </HStack>
    </Paper>
  );
}
