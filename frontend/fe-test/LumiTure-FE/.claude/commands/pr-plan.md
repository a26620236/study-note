---
description: 基於 feature-spec + api-spec + Figma，產出 new feature 的架構設計方案（不寫實作）
---

# Feature Plan

本 command 只產出**架構設計方案**，不寫實作 code。目標：在動手前，讓架構經過充分思考、與既有 codebase 對齊、並讓使用者能在短時間內審閱。

---

## 前置階段：確認任務類型與收集資訊

### 0.1 詢問任務類型

使用 **AskUserQuestion** 工具，詢問：

> 「這是簡單任務還是複雜任務？」
>
> - **簡單任務**：改一個功能、修一個 bug、加一個小元件等
> - **複雜任務**：跨多個檔案的新 feature，對應一個 LT-XXXX ticket

---

### 路徑 A：簡單任務

使用 **AskUserQuestion** 工具，顯示一個不限字數的輸入框：

> 「請描述你要做的事（可以盡量具體，不限字數）：」

取得描述後，跳過 0.2–0.4 的資料夾建立與前置檢查，直接進入 **Step 1** 開始設計。

---

### 路徑 B：複雜任務

#### 0.2 掃描與詢問 LT ticket

1. 先執行以下指令，掃描 `pr-plan/` 下已有的 LT-XXXX 資料夾：

   ```bash
   find pr-plan -maxdepth 1 -type d -name "LT-*"
   ```

2. 用**一次** AskUserQuestion 同時問以下三題（全部放進同一個 `questions` 陣列）：

   **題目 1 — LT Ticket 編號**

   > 「這個 feature 對應的 LT ticket 編號？（例：LT-3111）」
   > 選項：列出掃描到的資料夾名稱（若無既有資料夾，Other 讓使用者自行輸入；不需手動加「輸入新的 ticket 編號」選項，工具已自動附上 Other）

   **題目 2 — Figma URLs**（複雜任務才問）

   > **先檢查 `pr-plan/<LT-XXXX>/figma/figma-frames.md` 是否已存在**：
   >
   > - 若**已存在**：直接從該檔案讀取所有 URL，**跳過此題**，不再詢問使用者
   > - 若**不存在**：照常詢問：
   >   「Figma URLs（可多個，每條 URL 需帶 node-id）」
   >   - 使用者應一次貼上整個 flow 所有需要的 frame URL（空狀態、填充態、error、各子頁、特殊欄位展開態…）
   >   - 若只給一個 URL，善意提醒：「這個 flow 只有這一個 frame 嗎？其他狀態 / 子頁 / error 態的 frame 請一併提供」

   **題目 3 — 其他注意事項**（選填）

   > 「其他注意事項？（技術約束、偏好技術選型、設計特殊規格等，不填視為無）」

#### 0.3 建立資料夾結構

取得 ticket 編號後，**立即**建立以下結構（已存在則略過，不覆蓋內容）：

```bash
mkdir -p pr-plan/<LT-XXXX>/spec
mkdir -p pr-plan/<LT-XXXX>/figma
```

- `spec/`：使用者放置 `feature-spec.md`、`api-spec.md` 等規格文件
- `figma/`：Figma frame 規格文件（`figma-frames.md`）存放目錄

若資料夾為**新建**，告知使用者：

```
📁 已建立資料夾：pr-plan/<LT-XXXX>/
  └── spec/    ← 請將所有規格文件（.md）放入此資料夾，檔名不限
  └── figma/   ← figma-frames.md（frame 規格文件）存放於此

請放好 spec 文件後告訴我，才能繼續。
```

**暫停並等待使用者確認**，不自動往下執行。

#### 0.4 前置檢查

使用者確認後，依序檢查，**任一失敗則終止流程**：

- `pr-plan/<LT-XXXX>/spec/` 目錄存在且**至少有一個 `.md` 檔案**（非空）
- 透過 **Figma MCP** 成功讀取**每一個**提供的 URL 對應節點（確認 Figma 已開啟且啟用 Dev Mode MCP Server）。任一節點讀取失敗都算前置失敗

終止訊息範例：

```
❌ 無法開始 Feature Plan，缺少以下項目：
  - pr-plan/<LT-XXXX>/spec/ 目錄不存在或無任何 .md 檔案
  - Figma MCP 無法讀取以下 URL：
      · <URL 1>
      · <URL 2>

請補齊後重新執行 /pr-plan。
```

---

## Step 1/3：建立設計基準（理解約束）

**並行**執行以下讀取，不互相依賴：

1. **團隊/專案規範**：`.claude/instructions.md` + `CLAUDE.md`
2. **Feature 規格**（依任務類型）：
   - **簡單任務**：無需讀取 spec，直接依使用者描述設計
   - **複雜任務**：用 `ls pr-plan/<LT-XXXX>/spec/` 列出所有檔案，**全部讀取**，不限檔名。使用者放什麼就讀什麼，視為規格的一部分，不可忽略
3. **Figma 節點樹（所有 URL）**（複雜任務）：**對所有 Figma URL**（來源：0.2 第 2 題使用者輸入，或 `pr-plan/<LT-XXXX>/figma/figma-frames.md` 中每個 `**URL:**` 行），透過 Figma MCP 逐一取得：
   - `get_metadata`（節點層級、命名、大小）
   - `get_screenshot`（視覺狀態）
   - 兩者**都要**，缺一不可 —— metadata 告訴你結構、screenshot 告訴你狀態
   - 讀取時用平行呼叫（一次送多個 tool call）加速
   - **截圖限制說明**：`get_screenshot` 回傳的是 inline base64 圖片，只存在於對話 context，Figma MCP **不提供可下載的 URL 或檔案路徑**，因此無法透過 `Write` 或 `Bash` 工具將截圖寫入磁碟。這是工具層限制，不是流程疏失。
     - 截圖雖無法自動落地，仍**必須在主對話中呼叫 `get_screenshot`**（不可在 sub-agent 呼叫），讓截圖顯示在對話中供使用者直接查看
   - **讀完所有 frame 後，必須將結果寫入 `pr-plan/<LT-XXXX>/figma/figma-frames.md`**，格式如下：

     ```markdown
     # <LT-XXXX> Figma Frames

     ## #<編號> — <frame 名稱>（<狀態描述>）

     **URL:** <原始 Figma URL>

     ### <區塊名稱一>（例：標題 / Chart / 表格 / 控制列 / 底部按鈕 / Loading 狀態 / 差異 等）

     - <規格條列>

     ### <區塊名稱二>

     - <規格條列>

     ---
     ```

     - 每個 frame 一個段落，依使用者提供的順序排列
     - URL 使用使用者原始貼上的網址（含 node-id 參數），讓讀者可一鍵跳回 Figma
     - URL 之後**按照畫面區塊**拆成多個 `###` 子標題（例：標題列、控制列、表格、底部按鈕），每個子標題下條列該區塊的 UI 規格
     - 規格聚焦於可實作的細節：欄位名稱、顯示條件、互動行為、文字格式、顏色語意（紅/綠/藍）、Disabled 條件等
     - 若某 frame 只是另一個 frame 的局部差異，用「### 差異（相對於 #XX）」+ 「### 其餘結構」描述

   - 讀完後在腦中建立一張對照表：每個 frame 對應哪個**流程階段 / 狀態 / 子頁**（create? edit? empty? filled? error? 某欄位展開態?）
   - 這些 frame 合起來才是完整 flow，**少讀一張就可能漏掉設計要點**（例：漏看填充態會錯過 Value Card 的內部結構；漏看 error 態會錯過驗證訊息的 UI 位置）
   - 不是抄 UI 細節，是理解元件層級、狀態轉換、與不同狀態間的差異

4. **參考實作**：`src/app/(main)/usage-optimization/rightsizing/`

### 觀察參考實作時必須回答

- **rightsizing 頂層有哪些並列資料夾？**（例：`components/ hooks/ utils/ constants/ settings/` + `page.tsx`）→ 這**就是**你 feature 的頂層布局，不准增刪
- **rightsizing/settings 頂層有哪些並列資料夾？**（例：`components/ hooks/ utils/ zod/ constants/ settings/` + `page.tsx`）→ 如果你的 feature 是類似 settings 這種表單子頁，**完全複製這層結構**
- **Create/Edit 共用頁時，rightsizing 用什麼方式判斷？**（答：同路由 + `searchParams` + `status === Draft`）→ 不准自作主張拆成 `/new` 和 `/[id]/edit` 兩個路由
- 元件拆分粒度？（一個元件 = 一個資料夾 + 多個子檔）
- Data fetching hook 命名模式？（例：`useRightsizingData`、放 `src/hooks-api/<feature>/`）
- Client state 放哪？（例：`useRightsizingStore`）
- Pure function 放哪？（`utils/`）
- 常數放哪？（`constants/`）

---

## Step 2/3：套用設計原則（必須遵守）

### 元件設計

- **Figma 只是參考**：讀細節是為了理解「頁面元件層級與抽象」，不是照節點樹切
- **先搜再造（依序，有可用就停）**：
  1. `@lumiture-ui` — 優先使用 Lumiture UI 現有元件
  2. `src/components/` — 專案共用元件
  3. 自行建立 — 以上皆無才新建
  - 方案中若使用非 `@lumiture-ui` 的元件，必須在關鍵檔案清單或實作說明附註來源（「取自 `src/components/xxx`」或「`@lumiture-ui` 無此元件，需新建」）
- **複雜元件拆分**：超過單一職責就切分，每層都要有清楚命名與邊界

### SSR / Hydration 規範（每個頁面必須遵守）

每個有 API 的頁面固定三層結構，全部放在 `components/<FeatureName>/` 資料夾下：

```
components/
└── FeatureName/
    ├── FeatureNameHydration.tsx   ← async Server Component，負責 prefetchQuery
    ├── FeatureName.tsx            ← 'use client' 主組件
    └── FeatureNameSkeleton.tsx    ← Suspense fallback
└── FeatureNameTable/              ← 其他子元件各自獨立資料夾
└── FeatureNameFilter/
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

**Skeleton**：

- 每個主要元件都要有對應的 `XxxSkeleton`
- 一個頁面通常組合 2 個以上 Skeleton（如 `<SummarySkeleton />` + `<TableSkeleton />`）

### 子頁面（Next.js App Router 規則）

- 專案使用 Next.js App Router，**資料夾即路由**
- 子頁面（如 settings）直接放在 feature 目錄下成為子路由：
  ```
  <feature>/
  ├── page.tsx
  └── settings/
      ├── page.tsx
      ├── components/
      ├── hooks/
      ├── utils/
      ├── constants/
      └── zod/
  ```
- 子頁面本身也是一個完整的 feature 結構，有自己的 components / hooks / utils / zod / constants

### 檔案結構（硬性對齊 rightsizing，不得發揮）

> ⚠️ **這是過去犯錯最常踩的雷**。設計方案時，以下三條是硬規則：

1. **頂層資料夾必須與 rightsizing / rightsizing/settings 完全一致**：僅能是 `components/` / `hooks/` / `utils/` / `constants/` / `zod/` / `<sub-page>/` + `page.tsx`。**不准新增中間層**（如 `_form/`、`_shared/`、`form/`、`logic/`）來做「邏輯分組」
2. **若真的要為某個主元件做命名空間，只能用 `components/<MainComponent>/`**（一個元件一個資料夾），絕不和 `components/` 並列成兄弟目錄
3. **Create / Edit / 新增 / 編輯 共用同一個概念頁時，不准拆成兩個路由**。必須對齊 rightsizing/settings：同路由 + `searchParams` 判斷 + `status === Draft` 區分新舊

**優先放在 feature 目錄下**：只有確定多個 feature 會共用的東西，才抽到外層的 `components/`、`hooks/`、`utils/`。

**自我檢查**：寫出檔案清單後，把每一條路徑拿去跟 `src/app/(main)/usage-optimization/rightsizing/` 的真實結構比對。出現 rightsizing 沒有的「命名風格」（底線前綴資料夾、抽象分組名、並列於 components 的邏輯資料夾）**一律砍掉**。

**判斷原則**：當你猶豫「要不要多一層 / 換個命名 / 拆兩個路由」時 —— rightsizing 沒有就不要做。個人偏好（REST 風格、邏輯分組美感、命名整齊）**不是** feature-plan 的設計輸入。

### hooks-api 規範

新 feature 的 API hooks 一律放在 `src/hooks-api/<feature>/`，遵守以下規範：

**命名**：

| 操作   | Hook 命名             | 範例                         |
| ------ | --------------------- | ---------------------------- |
| GET    | `useGet[Resource]`    | `useGetRightsizingSettings`  |
| POST   | `usePost[Resource]`   | `usePostRightsizingSettings` |
| PUT    | `usePut[Resource]`    | `usePutRightsizingSettings`  |
| DELETE | `useDelete[Resource]` | `useDeleteAWSResources`      |
| PATCH  | `usePatch[Resource]`  | `usePatchRecommendAction`    |

**GET hook 必須額外 export**（供 Hydration Server Component 使用）：

- `[resource]QueryKey`（工廠函式，供 `prefetchQuery` 和 `invalidateQueries` 使用）
- `[resource]QueryFn`（供 `prefetchQuery` 的 `queryFn` 使用）

```typescript
export const getXxxQueryKey = (param?: string) => ['/xxx', param].filter(Boolean);
export const xxxQueryFn = async (headers: RawAxiosRequestHeaders, param?: string) => { ... };
export const useGetXxx = (param?: string, options?: UseQueryOptions<XxxResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery({ queryKey: getXxxQueryKey(param), queryFn: ..., enabled: hasToken, ...options });
};
```

**Mutation hook（POST / PUT / DELETE / PATCH）**：

- 無需 export queryFn
- `mutationKey` 需包含操作類型（`'create'`、`'update'`、`'delete'`）
- 接受 `UseMutationOptions<Success, AxiosError, Payload>` 供呼叫方傳入 `onSuccess`、`onError` 等回調

**型別**：

- Response 包在 `ResponseGenerics<T>` 中
- Payload / Response 型別定義在 `[domain].type.ts` 或 hook 檔案內 export
- 禁止使用 `any`，錯誤型別用 `AxiosError`

**目錄結構**：

```
src/hooks-api/<feature>/
├── index.ts              ← export * from 所有 hooks 與 types
├── [domain].type.ts      ← 業務實體型別
├── useGet[Resource].ts
├── usePost[Resource].ts
├── usePut[Resource].ts
└── useDelete[Resource].ts
```

### 資料流設計

- API 資料用 **TanStack Query hooks** 取得，**禁止 props drilling**
- Loading / Error 狀態在適當層級處理（靠近使用的元件）
- Server state（TanStack Query）與 Client state（Zustand / local state）分開
- Zustand store 雖使用 Zustand，本質是 hook，**放在 `hooks/` 目錄下**（如 `hooks/useXxxStore.ts`）

### 表單設計

- 統一使用 `react-hook-form` + `zod`
- Schema 定義放在 `zod/[feature].schema.ts`
- 表單 hook 放在 `hooks/useXxxForm.ts`
- 成功 / 失敗通知統一使用 `popSuccessToast` / `popErrorToast`

### 業務邏輯

- **純商業邏輯** → 抽成 pure function → 放 `<feature>/utils/`
- Pure function 比 hook 好測

### 不確定就問

- 規格不清 → 用 **AskUserQuestion** 問清楚
- **禁止腦補**規格未提及的行為

### 規範衝突提示

若使用者的需求（feature spec、注意事項）與 `CLAUDE.md` 定義的團隊規範有衝突，**不可直接照做**，應在產出 plan 前告知使用者：

```
⚠️ 發現規範衝突

需求描述：<描述 spec / 注意事項的要求>
目前團隊規範：<引用 CLAUDE.md 的對應規則>

請確認：
1. 更新團隊規範後，plan 依新規範設計
2. 維持現有規範，調整 plan 方向
```

### 注意事項優先級

若使用者在 0.1 第 3 題填寫了「其他注意事項」，該內容**視為最高優先**的設計約束，凌駕於參考實作（`rightsizing/`）的慣例。範例：

- 使用者填寫「不要用 Zustand」→ 所有方案都不能出現 Zustand store
- 使用者填寫「必須與 xxx feature 共用某 hook」→ 方案必須展示如何共用

---

## Step 3/3：產出架構設計方案

將設計文件寫入：

- **複雜任務**：`pr-plan/<LT-XXXX>/<LT-XXXX>-plan.md`
- **簡單任務**：直接在對話中輸出，不建立檔案

提供 **2–3 種推薦架構**，每種包含下列五個部分：

### A. 架構圖（文字樹狀版）

```
<FeatureName> (page.tsx)
├── <FeatureName>Summary      ── useFeatureData()
├── <FeatureName>Filter       ── useFeatureStore() [client state]
├── <FeatureName>Table        ── useFeatureData()
│   ├── <FeatureName>TableCell
│   └── <FeatureName>TableRow
└── <FeatureName>DetailDialog ── useFeatureDetail(id)
```

### B. 關鍵檔案清單

| 路徑                               | 職責                            |
| ---------------------------------- | ------------------------------- |
| `hooks/useXxxData.ts`              | TanStack Query 主資料           |
| `hooks/useXxxStore.ts`             | Zustand filter / selection 狀態 |
| `utils/calculateSavings.ts`        | 純計算函數                      |
| `components/XxxTable/XxxTable.tsx` | 表格容器                        |

### C. 關鍵 sudo code（只展示介面，不展示實作）

```typescript
// hook signature
function useXxxData(): {
  data: XxxData[];
  isLoading: boolean;
  error: Error | null;
};

// component props
interface XxxTableProps {
  data: XxxData[];
  onRowClick: (id: string) => void;
}

// data flow
Page → useXxxData → <Table data={...} /> → useXxxStore (filter) → filtered rows
```

### D. 優缺點比較

| 面向     | 方案 A | 方案 B | 方案 C |
| -------- | ------ | ------ | ------ |
| 可讀性   | ★★★    | ★★     | ★★★★   |
| 維護性   | ★★★    | ★★★★   | ★★     |
| 可擴充性 | ★★     | ★★★★   | ★★★    |

### E. 推薦方案與理由

一句話點出最推薦哪一種，以及為什麼適合此 feature。

---

### F. 各元件 / Hook 實作說明（必填）

推薦方案確定後，**對每一個新增的元件與 hook** 各寫一個段落，說明：

- **Props**：props interface（欄位名稱 + 型別 + 用途）
- **內部狀態**：`useState` / `useReducer` 管理什麼
- **資料來源**：呼叫哪個 hook、queryKey 如何構成
- **關鍵邏輯**：非 trivial 的計算或條件（例：合併 segment、排序規則、disabled 條件）
- **使用的 MUI 元件**：主要用哪幾個（例：`Table`、`Dialog`、`Tooltip`）

格式範例：

```markdown
### `XxxComponent`

- **Props**：`{ data: XxxData[]; onSelect: (id: string) => void }`
- **內部狀態**：`searchKeyword: string`（前端 filter 用）
- **資料來源**：`useGetXxx(payload)`，payload 由 formContext 取得後轉換
- **關鍵邏輯**：items > 10 時合併為「Other (n more)」；disabled 當 isLoading = true
- **MUI 元件**：`Table`、`TableRow`、`Tooltip`
```

此段落是實作者的「施工說明書」，**不可省略**。

---

## 完成摘要

```
═══════════════════════════════════════════════════════════
✅ Feature Plan 完成！

Feature:  <feature-name>
方案數:   <N> 種
推薦:     方案 <X> — <一句話理由>

📄 src/<feature-name>/feature-plan.md
═══════════════════════════════════════════════════════════
```

---

## 禁止行為

1. **禁止開始寫實作** — 本 command 只產出設計文件
2. **禁止照 Figma 節點樹直接當元件切分依據** — 那是視覺層級，不是邏輯層級
3. **禁止腦補 spec 未提及的行為** — 不確定先問
4. **禁止重複造輪子** — 動手前先搜 `lumiture-ui/` / shared / 既有 features
5. **禁止跳過參考實作的觀察** — 必須先讀過 `rightsizing/` 才能開始設計
6. **禁止只讀第一個 Figma URL 就開始設計** — 使用者可能提供多個 URL 涵蓋完整 flow，必須**全部讀完**才進入 Step 3。漏讀任一個都算前置未完成
7. **禁止發明 rightsizing 不存在的資料夾命名** — 不准用 `_form/`、`_shared/`、`form/`、`logic/` 這類邏輯分組資料夾與 `components/` 並列。照搬 rightsizing 的扁平結構就對了
8. **禁止基於個人偏好變更路由設計**
9. **禁止省略「各元件 / Hook 實作說明」段落** — 每個新增的元件與 hook 都必須有 Props / 狀態 / 資料來源 / 關鍵邏輯 / MUI 元件說明，缺任一不算完成 — Create/Edit 共用同一頁時，照 rightsizing/settings 用單一路由 + searchParams 判斷；不准因「REST 比較好看」擅自拆成 `/new` + `/[id]/edit`

---

## 注意事項

1. 前置階段用 AskUserQuestion **一次**問完所有設定，問完後自動執行
2. 所有文件產出使用**繁體中文**（技術術語保留英文）
3. 架構方案以「使用者短時間內能看懂」為最高優先
4. 遇到 spec 缺漏或矛盾，優先問清楚而非自行補完
