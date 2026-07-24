import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@app': resolve(__dirname, './src/app'),
      '@components': resolve(__dirname, './src/components'),
      '@constants': resolve(__dirname, './src/constants'),
      '@features': resolve(__dirname, './src/features/index.ts'),
      '@hooks': resolve(__dirname, './src/hooks/index.ts'),
      '@hooks-ws': resolve(__dirname, './src/hooks-ws/index.ts'),
      '@utils': resolve(__dirname, './src/utils/index.ts'),
      '@lumiture-ui/SvgIcon': resolve(__dirname, '../../libs/lumiture-ui/src/SvgIcon/index.ts'),
      '@lumiture-ui/theme': resolve(__dirname, '../../libs/lumiture-ui/src/theme/index.ts'),
      '@lumiture-ui': resolve(__dirname, '../../libs/lumiture-ui/src/index.ts'),
      '@hooks-api': resolve(__dirname, './src/hooks-api/index.ts'),
      '@shared/hooks': resolve(__dirname, '../../libs/hooks/src/index.ts'),
      '@shared/utils': resolve(__dirname, '../../libs/utils/src/index.ts'),
      '@shared/types': resolve(__dirname, '../../libs/types/src/index.ts'),
      '@styles': resolve(__dirname, './src/styles'),
      '@validators': resolve(__dirname, './src/validators/index.ts'),
    },
  },
  test: {
    env: { TZ: 'UTC' },
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['json', 'json-summary', 'text-summary'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      include: ['src/**/utils/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        // 已經不用這邊串接API，將來會加速淘汰
        'src/utils/api.ts',
        // Zustand store factory
        '**/cost/[platform]/utils/createCostDashboardStore.ts',
        // Barrel re-export，無任何邏輯
        'src/utils/index.ts',
        // NextAuth 框架配置，深度依賴 next-auth internals，測試等於測試框架本身
        'src/utils/auth.ts',
        // Server-only 單行 wrapper，唯一邏輯是呼叫 getServerSession
        'src/utils/getServerAuthHeaders.ts',
        // Axios factory，只設定 baseURL + headers，無業務邏輯
        'src/utils/axiosInstance.ts',
        // Sonner thin wrapper，固定 duration 的 UI side-effect，無邏輯可驗證
        'src/utils/toastTrigger.ts',
        // Thin glue functions — 只轉發 query keys 到 invalidateQueries()，無業務邏輯
        '**/rightsizing/utils/invalidateRecommendQuery.ts',
        '**/group-list/utils/invalidateResourceQueries.ts',
      ],
    },
  },
});
