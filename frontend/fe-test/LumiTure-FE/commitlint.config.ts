import type { UserConfig } from '@commitlint/types';

const CommitlintConfig: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0], // 關閉限制
  },
};

export default CommitlintConfig;
