import { CircularProgress, IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Icon, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { copyText, popSuccessToast } from '@shared/utils';

interface CodeClipboardProps {
  code: string;
  plainText?: boolean;
  isLoading?: boolean;
}

const LABELS = {
  copy: 'Copy code',
  copied: 'Copied successfully.',
};

const plainStyle = {
  'code[class*="language-"]': {
    color: theme.palette.text.hint,
  },
  'pre[class*="language-"]': {
    background: theme.palette.black.main,
  },
};

export function CodeClipboard({ code, plainText = false, isLoading = false }: CodeClipboardProps) {
  const handleCopy = () => {
    copyText(code);
    popSuccessToast({
      description: LABELS.copied,
    });
  };

  return (
    <VStack>
      <Box
        sx={{
          backgroundColor: theme.palette.text.primary,
          borderRadius: '6px 6px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
        }}
      >
        <IconButton
          size="small"
          color="default"
          onClick={handleCopy}
          sx={{
            '&.MuiIconButton-root': {
              width: 'fit-content',
              gap: 1,
              height: '36px',
              padding: '0 11px',
            },
          }}
        >
          <Icon name="content_paste" sx={{ color: theme.palette.text.hint }} />
          <Typography variant="body1" component="span" sx={{ color: theme.palette.text.hint }}>
            {LABELS.copy}
          </Typography>
        </IconButton>
      </Box>
      {isLoading ? (
        <Box
          sx={{
            background: theme.palette.black.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '550px',
          }}
        >
          <CircularProgress
            size={24}
            sx={{
              '& .MuiCircularProgress-circle': {
                stroke: theme.palette.white.main,
              },
            }}
          />
        </Box>
      ) : (
        <SyntaxHighlighter
          language="javascript"
          style={plainText ? plainStyle : atomDark}
          customStyle={{ margin: 0, padding: '16px', width: '100%', borderRadius: '0' }}
        >
          {code}
        </SyntaxHighlighter>
      )}
    </VStack>
  );
}
