import { forwardRef, type ForwardedRef } from 'react';

import { Box, type BoxProps } from '@mui/material';

interface StackProps extends Omit<BoxProps, 'ref'> {}

export const HStack = forwardRef(function HStack(
  { ...props }: StackProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return <Box ref={ref} display="flex" flexDirection="row" flexWrap="wrap" {...props} />;
});

export const VStack = forwardRef(function VStack(
  { ...props }: StackProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return <Box ref={ref} display="flex" flexDirection="column" flexWrap="wrap" {...props} />;
});
