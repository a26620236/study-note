'use client';

import { Divider, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';

import { Button, HStack, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';
import { GitHub, Google, Microsoft } from '@lumiture-ui/SvgIcon';

import { OAuthProviderEnum } from '@constants';

const LABELS = {
  orContinueWith: 'Or Continue With',
  google: 'Google',
  microsoft: 'Microsoft',
  github: 'GitHub',
};

const SSO_PROVIDERS = [
  { id: OAuthProviderEnum.Google, label: LABELS.google, icon: <Google /> },
  { id: OAuthProviderEnum.AzureAd, label: LABELS.microsoft, icon: <Microsoft /> },
  { id: OAuthProviderEnum.GitHub, label: LABELS.github, icon: <GitHub /> },
];

export function SSOButtons() {
  return (
    <VStack alignItems="center" gap={2} sx={{ mt: 2 }}>
      <HStack alignItems="center" gap="10px" sx={{ width: '100%' }}>
        <Divider flexItem sx={{ flex: 1, alignSelf: 'center' }} />
        <Typography variant="bodyBold" color="text.hint" sx={{ whiteSpace: 'nowrap' }}>
          {LABELS.orContinueWith}
        </Typography>
        <Divider flexItem sx={{ flex: 1, alignSelf: 'center' }} />
      </HStack>

      <HStack gap={4} alignItems="center" justifyContent="center">
        {SSO_PROVIDERS.map(({ id, icon }) => (
          <Button
            key={id}
            variant="outlined"
            onClick={async () => await signIn(id)}
            sx={{
              '&.MuiButtonBase-root': {
                padding: '6px',
                width: '36px',
                minWidth: '36px',
                borderColor: theme.palette.gray.border,
              },
            }}
          >
            {icon}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
}
