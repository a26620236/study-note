import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_NODE_ENV_NAME?.toLowerCase(),
  tracesSampleRate: 0.1,
  sendDefaultPii: true,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});
