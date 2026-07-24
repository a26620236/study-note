import type { NodeEnvName } from '@constants';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_NODE_ENV_NAME?: NodeEnvName;
    }
  }
}

export {};
