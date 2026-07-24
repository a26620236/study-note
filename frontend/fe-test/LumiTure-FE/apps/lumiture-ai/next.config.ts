import { composePlugins, withNx } from '@nx/next';
import type { WithNxOptions } from '@nx/next/plugins/with-nx';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: WithNxOptions = {
  nx: {},
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: [
    '@mui/material',
    '@mui/icons-material',
    '@mui/material-nextjs',
    '@emotion/react',
    '@emotion/styled',
    '@emotion/cache',
    'mui-tel-input',
    'lodash-es',
    'material-symbols',
    'autosuggest-highlight',
    // ESM/TS packages used by react-markdown/rehype that need bundling in dev
    'react-markdown',
    'rehype-raw',
    'hast-util-raw',
    'hast-util-to-html',
    'stringify-entities',
    'decode-named-character-reference',
    'entities',
  ],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const plugins = [withNx];

export default withSentryConfig(composePlugins(...plugins)(nextConfig), {
  org: 'lumiture',
  project: 'lumiture-frontend',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  tunnelRoute: '/sentry-tunnel',
  silent: !process.env.CI,
});
