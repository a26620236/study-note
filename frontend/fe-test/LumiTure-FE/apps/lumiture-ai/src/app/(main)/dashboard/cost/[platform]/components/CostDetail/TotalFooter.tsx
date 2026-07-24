import { Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

interface TotalFooterProps {
  showCredits?: boolean;
}

export function TotalFooter({ showCredits }: TotalFooterProps) {
  return (
    <VStack gap={2} alignItems="flex-end" width="100%">
      <Typography variant="bodyBold" color={theme.palette.black.main}>
        Total
      </Typography>
      {showCredits && (
        <Typography variant="body1" color="text.secondary">
          (Include Credits)
        </Typography>
      )}
    </VStack>
  );
}
