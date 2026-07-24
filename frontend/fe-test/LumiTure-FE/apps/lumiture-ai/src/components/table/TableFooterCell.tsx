import type { ReactNode } from 'react';

import { Box } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

import { VStack } from '@lumiture-ui';

export const TableFooterCell = ({
  children,
  hidden,
  sx,
}: {
  children?: ReactNode;
  hidden?: boolean;
  sx?: SxProps;
}) =>
  hidden ? null : (
    <Box
      sx={{
        height: 50,
        borderTop: '1px solid',
        borderColor: 'gray.borderLight',
        '&:first-of-type': { border: 'unset' },
        ...sx,
      }}
    >
      <VStack alignItems="flex-end" justifyContent="center" sx={{ height: '100%', px: 4, py: 1.5 }}>
        {children}
      </VStack>
    </Box>
  );
