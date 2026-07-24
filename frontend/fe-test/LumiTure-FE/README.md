# LumiTure FE

LumiTure（FinOPS）前端 repository — **Nx + pnpm workspace monorepo**，主 app 為 Next.js 16（App Router）。

## 環境需求

| 工具                           | 版本                  | 備註                                                |
| ------------------------------ | --------------------- | --------------------------------------------------- |
| [Node.js](https://nodejs.org/) | **20.x**（≥ 20.13.1） | CI 與 Docker 均使用 Node 20，請對齊                 |
| [pnpm](https://pnpm.io/)       | **10.33.0**           | 由 root `package.json` 的 `packageManager` 欄位鎖定 |
| [git](https://git-scm.com/)    | ≥ 2.37.1              |                                                     |

## 快速開始（本地開發）

### 1. 安裝依賴

```sh
pnpm install
```

所有依賴集中在 root `package.json`（`apps/lumiture-ai/package.json` 只是 stub），只需在 repo root 安裝一次。

### 2. 設定環境變數

請複製 [Notion：環境變數](https://app.notion.com/p/cloudmile/env-2fc9f03f7077810c9613e4bfd9c36d9b?source=copy_link#2fc9f03f707781308adfd6f3de8b1e06) 頁面的內容到 `apps/lumiture-ai/.env.development.local`（放在 app 目錄下、不是 repo root；`.env*.local` 已被 gitignore，不會被 commit）。

### 3. 啟動 dev server

```sh
pnpm nx dev lumiture-ai
```

開啟 [http://localhost:3000](http://localhost:3000)。（port 固定 3000，無任何覆寫設定；如需換 port：`pnpm nx dev lumiture-ai -- --port 3001`。）

## 專案結構

```
LumiTure-FE/
├── apps/
│   ├── lumiture-ai/                  # Next.js 16 主 app（App Router）
│   │   └── src/
│   │       ├── app/                  # App Router — 資料夾即路由
│   │       │   ├── (auth)/           # login、sign-up、activate、forgot/reset-password
│   │       │   ├── (main)/           # dashboard、overview、budget、usage-optimization、
│   │       │   │                     #   (organization-settings)/ 等
│   │       │   ├── api/              # route handlers（含 next-auth）
│   │       │   └── healthz/          # health check endpoint
│   │       ├── components/           # app 共用元件（如 VirtualizedTable）
│   │       ├── constants/            # app 共用常數 / enums
│   │       ├── features/             # feature modules
│   │       ├── hooks/                # app-level hooks（含 Zustand stores）
│   │       ├── hooks-api/            # TanStack Query API hooks（依 feature 分目錄）
│   │       ├── hooks-ws/             # WebSocket hooks
│   │       ├── mockApis/             # Mockoon mock server 設定（選用，port 3002）
│   │       ├── styles/               # 全域樣式
│   │       ├── types/                # app-level 型別
│   │       └── utils/                # app-level utils
│   └── lumiture-ai-e2e/              # Playwright E2E 測試
├── libs/                             # 跨 app 共用 lib（tsconfig paths 引用，無 package.json）
│   ├── types/                        # @shared/types — 純型別
│   ├── utils/                        # @shared/utils — runtime helpers
│   ├── hooks/                        # @shared/hooks — 通用 React hooks
│   └── lumiture-ui/                  # @lumiture-ui — design system + theme + SvgIcon
├── deploy/lumiture-ai/               # Dockerfile / Cloud Build / Helm chart
├── nx.json                           # Nx workspace 設定
├── tsconfig.base.json                # 共用 compilerOptions + path aliases
├── pnpm-workspace.yaml               # workspaces：apps/*、libs/*
└── package.json                      # root：所有依賴 + nx scripts
```

架構細節與團隊規範見 [.claude/instructions/](.claude/instructions/)。

## Git 工作流程

### Commit 格式（commitlint 於 `commit-msg` hook 檢查）

```
<type>: <description> #<ticket-id>
```

Types：`feat` / `fix` / `refactor` / `chore` / `test` / `docs`。範例：`feat: add WebSocket reconnection logic #LT-2166`

### Pre-push hook（Husky）

push 前會依序執行，任一步失敗即中止：

1. `pnpm format:all`（Prettier 格式化寫入）
2. `pnpm type-check:all`
3. `pnpm lint:all`（warning 視為失敗）
4. `pnpm test-ci:all`

### 分支模型

- **`main`** — release 分支；`release/vX.Y.Z` 或 `hotfix/vX.Y.Z` 合入後，GitHub Actions 自動打 tag、發 Release，並開 backport PR 回 `develop` 與 `staging`
- **`develop`** / **`staging`** — 長期整合分支
- Feature 分支以 ticket 命名（`LT-XXXX`）；`release/*`、`hotfix/*`、`backport/*` 前綴是自動化流程的觸發條件，不可亂用

### 安裝 VSCode extensions（建議）

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Nx Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
- 選用：[Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)、[Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
