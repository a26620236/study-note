import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Button, HStack, Icon, Markdown, VStack } from '@lumiture-ui';

const LABELS = {
  title: 'Unlink Resource',
  previousButton: 'Previous',
  unlinkButton: 'Unlink',
  unlinkMessage: (name: string, isPlural: boolean) =>
    `Unlink <strong>${name}</strong> will affect following ${isPlural ? 'groups' : 'group'}:`,
};

export interface UnlinkResourceInfos {
  id: string;
  name: string;
  groups: string[];
}

interface UnlinkResourceContentProps {
  isPending: boolean;
  unlinkResources: UnlinkResourceInfos[];
  handleCloseDialog: () => void;
  handlePreviousStep: () => void;
  handleUnlinkResources: () => void;
}

export function UnlinkResourceWarningContent({
  isPending,
  unlinkResources,
  handleCloseDialog,
  handlePreviousStep,
  handleUnlinkResources,
}: UnlinkResourceContentProps) {
  const theme = useTheme();
  return (
    <VStack gap={6}>
      <HStack justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{LABELS.title}</Typography>
        <Icon
          name="close"
          sx={{ color: 'text.secondary', cursor: 'pointer', fontSize: 24 }}
          onClick={() => handleCloseDialog()}
        />
      </HStack>
      <Box
        sx={{
          border: `1px solid ${theme.palette.gray.borderLight}`,
          borderRadius: 2,
          maxHeight: '500px',
          overflow: 'scroll',
          p: '8px 4px',
        }}
      >
        {unlinkResources.map((resource) => (
          <Box key={resource.id} sx={{ mb: 3 }}>
            <Markdown
              components={{
                p: ({ children }) => (
                  <Typography variant="body2" color="text.primary">
                    {children}
                  </Typography>
                ),
                strong: ({ children }) => (
                  <Typography
                    variant="body2"
                    color="primary"
                    component="span"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {children}
                  </Typography>
                ),
              }}
            >
              {LABELS.unlinkMessage(resource.name.trim(), resource.groups.length > 1)}
            </Markdown>
            <ul style={{ margin: 0 }}>
              {resource.groups.map((group) => (
                <li key={group}>
                  <Typography variant="body2" display="inline">
                    {group}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        ))}
      </Box>
      <HStack justifyContent="flex-end" gap={4}>
        <Button
          variant="outlined"
          onClick={() => handlePreviousStep()}
          sx={{ width: '100px' }}
          disabled={isPending}
        >
          {LABELS.previousButton}
        </Button>
        <Button
          variant="contained"
          isLoading={isPending}
          disabled={isPending}
          onClick={() => handleUnlinkResources()}
          sx={{ width: '100px' }}
        >
          {LABELS.unlinkButton}
        </Button>
      </HStack>
    </VStack>
  );
}
