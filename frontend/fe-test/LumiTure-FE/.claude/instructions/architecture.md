# 專案架構規範

## Monorepo 結構

本 repo 為 **Nx + pnpm workspace monorepo**：

```
LumiTure-FE/
├── apps/
│   ├── lumiture-ai/          ← Next.js 16 主 app（原本散在 root 的業務 code 集中於此）
│   │   └── src/              ← 業務 code（app router / components / hooks / hooks-api 等）
│   └── lumiture-ai-e2e/      ← Playwright E2E 測試
├── libs/                     ← 跨 app 共用 lib（透過 tsconfig paths 直接引用，無 package.json）
│   ├── types/                ← 共用型別（`@shared/types`，純 type-only export）
│   ├── utils/                ← 共用 utils（`@shared/utils`，含 runtime helpers）
│   ├── hooks/                ← 共用 React hooks（`@shared/hooks`）
│   └── lumiture-ui/          ← Design system + theme（`@lumiture-ui`、`@lumiture-ui/theme`、`@lumiture-ui/SvgIcon`）
├── nx.json                   ← Nx workspace 設定
├── tsconfig.base.json        ← 共用 compilerOptions（含 `@shared/*` / `@lumiture-ui` paths）
└── package.json              ← root：repo 級工具 + nx scripts
```

> ⚠️ 所有 `src/...` 路徑指引一律指 `apps/lumiture-ai/src/...`。

### libs 規範

- **引用方式**：一律透過 tsconfig paths，不走 npm 解析（lib 無 `package.json`）
- **命名規則**：
  - 通用共用層用 `@shared/*` namespace（`@shared/utils` / `@shared/types` / `@shared/hooks`）
  - Design system 例外用品牌前綴 `@lumiture-ui`，含三個 entry：`@lumiture-ui`（元件）、`@lumiture-ui/theme`（MUI theme）、`@lumiture-ui/SvgIcon`（品牌 / 平台 logo）
- **各 lib 內容定位**：
  - `libs/types`：純型別（API response generics、共用 base types）。`src/index.ts` 必須用 `export type *`
  - `libs/utils`：跨 app 共用 runtime utils（formatter、toast trigger、storage helper 等）
  - `libs/hooks`：純通用 React hooks（不依賴 next-auth、業務 store、hooks-api）
  - `libs/lumiture-ui`：Design system 元件 + theme + SVG icon，**只放 design-system primitive**，layout pattern 等業務 helper 一律留在 app `components/`
- **App-specific 不要塞進 libs**：API client、auth header、Next.js server-only helper、業務 hook（依賴 next-auth / hooks-api）、layout pattern 等留在 `apps/lumiture-ai/src/`
- **測試位置**：lib 測試放在 `libs/<name>/test/`（與 src 分離），不與 `apps/` 內的 `__tests__/` colocate 風格混淆
- **新增 lib**：複製現有 `libs/utils` 結構（`project.json` + `tsconfig.json` / `tsconfig.lib.json` / `tsconfig.spec.json` + `vitest.config.mts` + `eslint.config.mjs`），並在 `tsconfig.base.json` 的 `paths` 補上 alias

## 檔案結構（硬性對齊 lumitag）

> ⚠️ 以下三條是硬規則，不得因個人偏好發揮：

1. **頂層資料夾必須與 `apps/lumiture-ai/src/app/(main)/(organization-settings)/lumitag/` 完全一致**：僅能是 `components/` / `hooks/` / `utils/` / `constants/` / `zod/` / `types/` / `<sub-page>/` + `page.tsx`。**不准新增中間層**（如 `_form/`、`_shared/`、`form/`、`logic/`）
   - **`types/`**：lumitag 本身沒有此資料夾，但允許 feature 視需要新增，內含純型別檔（不放 runtime code）。**使用前提**：只放 `@hooks-api` **尚未定義**的型別（feature 專屬的 form-state / view-model / 組合型別等）。若型別已在 `@hooks-api` 定義（API response / payload / domain entity），一律**直接 import 使用**，不可在 feature 的 `types/` 重新定義或 re-export；可引用 `@hooks-api` 的 base 型別再行組合（如 `Record<Budget['period'], FormBudget>`）。
   - **對比 `zod/`**：`zod/` 只放真正含 `z.*` 的 schema 檔（及其 `z.infer` 型別）；手寫的 domain / form 型別放 `types/`，不要用 `.schema.ts` 命名混充。
2. **為主元件做命名空間，只能用 `components/<MainComponent>/`**（一個元件一個資料夾），不與 `components/` 並列成兄弟目錄
3. **Create / Edit 共用同一概念頁時，不准拆成兩個路由**。必須對齊 lumitag/settings：同路由 + `searchParams` 判斷（例：`searchParams.tagId` 有值為 edit、無值為 create）

子頁面（如 settings）直接放在 feature 目錄下成為子路由，有自己完整的 `components/` / `hooks/` / `utils/` / `zod/` / `constants/` / `types/`。

**優先放在 feature 目錄下**：只有確定多個 feature 會共用的東西，才抽到外層的 `components/`、`hooks/`、`utils/`。

## SSR / Hydration 規範

每個有 API 的頁面固定三層結構，全部放在 `components/` 資料夾下：

```
components/
└── FeatureName/
    ├── FeatureNameHydration.tsx   ← async Server Component，負責 prefetchQuery
    ├── FeatureName.tsx            ← 'use client' 主組件
    └── FeatureNameSkeleton.tsx    ← Suspense fallback
```

**page.tsx 固定寫法**（Server Component，不加 `'use client'`）：

```typescript
export default function FeaturePage() {
  return (
    <Suspense fallback={<FeatureNameSkeleton />}>
      <FeatureNameHydration />
    </Suspense>
  );
}
```

- 有 `searchParams` 時宣告成 `async function`，接收 `searchParams: Promise<{ xxx?: string }>`

**XxxHydration.tsx 固定寫法**（async Server Component）：

- `getServerSession(authOptions)` 取 session
- `getServerAuthHeaders()` 取 headers
- `new QueryClient()` + `Promise.all([queryClient.prefetchQuery(...)])` 並發預加載
- 回傳 `<HydrationBoundary state={dehydrate(queryClient)}><Xxx /></HydrationBoundary>`
- **只有頁面完全沒有 API 才不需要 Hydration**

**Skeleton**：每個主要元件都要有對應的 `XxxSkeleton`；一個頁面通常組合 2 個以上 Skeleton。
