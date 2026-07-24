import { Typography } from '@mui/material';

import { VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { nFormatter } from '@shared/utils';

interface CostFooterProps {
  total: number;
  credits?: number;
  showCredits?: boolean;
  variant?: 'body1' | 'bodyBold';
}

export function CostFooter({ total, credits, showCredits, variant = 'body1' }: CostFooterProps) {
  return (
    <VStack gap={2} alignItems="flex-end" width="100%">
      <Typography variant={variant} color={theme.palette.black.main}>
        ${nFormatter({ num: total, fixed: 2 })}
      </Typography>
      {showCredits && credits !== undefined && (
        <Typography variant="body1" color="text.secondary">
          ${nFormatter({ num: credits, fixed: 2 })}
        </Typography>
      )}
    </VStack>
  );
}
