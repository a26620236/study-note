# 技術棧

## 核心框架

- **Next.js 16.2** — App Router，資料夾即路由，Server / Client Component 分離
- **React 19** + **TypeScript 5.9**
- **pnpm 10** — 套件管理器

## UI

- **MUI v7**（`@mui/material`、`@mui/icons-material`、`@mui/x-tree-view`）
- **Emotion**（`@emotion/react`、`@emotion/styled`）— MUI 底層 CSS-in-JS
- **material-symbols** — icon font
- **motion** — 動畫

## 資料與狀態

- **TanStack Query v5**（`@tanstack/react-query`）— Server state
- **Zustand v4** — Client state
- **Axios** — HTTP client
- **next-auth v4** — 認證

## 表單與驗證

- **react-hook-form v7**（`@hookform/resolvers` v5）
- **Zod v4**

## 表格 / 列表效能

- **TanStack Table v8**（`@tanstack/react-table`）
- **TanStack Virtual v3**（`@tanstack/react-virtual`）— 虛擬捲動
- **react-window** — 虛擬列表

## 工具函式

- **lodash-es** — 工具函式（tree-shakable）
- **date-fns v3** + **date-fns-tz** — 日期處理
- **immer** — immutable state 更新
- **usehooks-ts** — 常用 hooks 集合

## 圖表

- **ECharts v6**（`echarts-for-react`）

## 通知

- **sonner v2** — Toast 通知（`popSuccessToast` / `popErrorToast` 封裝自此）

## 測試

- **Vitest v4** + **@testing-library/react v16** + **jsdom**
- 指令：`pnpm test`（watch）、`pnpm test-ci:all`（單次 + coverage）

## 程式碼品質

- **ESLint v9**（`eslint-config-love`、`eslint-plugin-sonarjs`、`eslint-plugin-react-hooks`）
- **Prettier 3.3** + `@ianvs/prettier-plugin-sort-imports`
- **Husky** — pre-commit hook
- **commitlint** — commit message 格式檢查
- 一鍵檢查：`pnpm check`（type-check + lint）

## Monorepo 工具

- **Nx 22**（`@nx/next`、`@nx/eslint`、`@nx/vite`、`@nx/playwright`、`@nx/js/typescript`）— workspace 管理、project graph、task 快取
- **pnpm workspaces** — `pnpm-workspace.yaml` 涵蓋 `apps/*` 與 `libs/*`
- **Root scripts**：一律透過 `nx run-many` 執行
  - 無後綴（如 `pnpm lint`）= 跑 affected projects
  - `:all` 後綴（如 `pnpm lint:all`）= 跑所有 projects
- **TypeScript**：根目錄 `tsconfig.base.json` 集中共用 `compilerOptions`；每個 app 各自 extends

> Monorepo 完整結構（apps / libs 目錄、`@shared/*` 與 `@lumiture-ui` 命名規則）見 `architecture.md`。
