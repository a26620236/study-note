import { Typography } from '@mui/material';

import { HStack, Markdown } from '@lumiture-ui';

const LABELS = {
  description:
    'Allocate cloud costs with precision using LumiTags. By EXCLUDING CREDITS, we provide a clearer view of your actual expenditure and highlight true opportunities for optimization.',
};

export function LumiTagInfoBanner() {
  return (
    <HStack alignItems="center" mt={2}>
      <Typography variant="caption" color="text.secondary" component="div">
        <Markdown>{LABELS.description}</Markdown>
      </Typography>
    </HStack>
  );
}
