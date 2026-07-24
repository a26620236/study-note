# React 規範

## 元件設計

- 使用函數式組件與 Hooks
- 組件命名：PascalCase；組件檔案：PascalCase（如 `AIAnalysis.tsx`）
- 遵循單一職責原則，複雜邏輯提取到自訂 Hooks
- 為組件加上 `data-testid` 以便測試
- 避免 Props Drilling，設計合理的元件階層

### 元件來源優先順序

選用元件時依序檢查，有可用就停，不往下找：

1. **`@lumiture-ui`** — 優先使用 Lumiture UI 現有元件
2. **`apps/lumiture-ai/src/components/`** — 專案共用元件
3. **自行建立** — 以上皆無才新建

設計 plan 或撰寫實作時，若使用非 `@lumiture-ui` 的元件，必須附註來源：

- 取自 `apps/lumiture-ai/src/components/`：註記「取自 `apps/lumiture-ai/src/components/xxx`」
- 需新建：註記「`@lumiture-ui` 無此元件，需新建」

### `'use client'` 只標在 server→client 邊界

`'use client'` 是否需要，看的是**「有沒有被 Server Component 直接 import」，不是「有沒有用到 hook / 事件」**。被 Client Component import 的子元件早已在 client module graph 內，即使用了 `useState` / `useSession` 也**不需要**再標 `'use client'`（標了只是 no-op 冗餘）。

- **只在邊界檔案標**：被 Server Component（`page.tsx`、`XxxHydration.tsx`、當作 Suspense fallback 的 Skeleton 等）直接 import 的那一層 client 元件才標
- **leaf 元件不標**：只被其他 client 元件 import 的元件 / hook，一律不加
- 判斷方式：從 Server Component 往下追 import graph，第一個進入 client 的檔案就是邊界

## Hooks

- 遵循 [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- 自訂 Hook 命名以 `use` 開頭
- 確保 `useEffect`、`useMemo`、`useCallback` 的依賴陣列正確
- 適當使用 `useMemo`、`useCallback` 避免不必要的 re-render

## 狀態管理

- 合理使用狀態提升（State Lifting）
- 全域狀態 vs 區域狀態的選擇應恰當
- 避免 Context 過度使用或不足
- 保持一致的狀態更新方式

## 字串管理

- 元件內所有顯示用的字串**必須集中放在檔案頂層的 `const LABELS = { ... }` 物件**，不可直接硬寫在 JSX 裡。涵蓋範圍包含但不限於：
  - 按鈕文字
  - `<Tooltip title="...">`
  - `placeholder` / `defaultDisplayLabel`
  - 錯誤訊息、helperText
  - 標題、副標題
  - **JSX 文字節點**（`<Typography>WHERE</Typography>` 的 `WHERE`）
- `LABELS` 放在 interface / 子元件定義之後、export function 之前

```typescript
// ✅
const LABELS = {
  addValue: '+ Add Value',
  maxValuesReached: `Maximum ${MAX_VALUES} values reached.`,
};

// ❌
<Button>{`Maximum ${MAX_VALUES} values reached.`}</Button>
```

### 需要排版的文字一律用 `Markdown`

字串若需要 **粗體 / 斜體 / 換行 / bullet / 連結 / 顏色** 等任何排版，**必須以單行 template literal + `<Markdown>` 元件渲染**，不要手刻 `<Typography component="li">`、`<br/>` JSX 結構。

- 換行用 `<br />`、bullet 用 `\n-`、編號清單用 `\n1.`
- **嚴禁多行 template literal**：原始檔的縮排會被當成 markdown 內容處理（4 空白 = code block），導致排版跑掉
- 顏色 / 行內樣式用 `<span style="color: #...">...</span>`（搭配 `rehypeRaw`）
- 共用色碼或語意化排版要在 `Box` / `Typography` 父層用 `sx` 控制（如 `color: 'primary.main'`、`'& ul': { pl: 3 }`），不要寫死在字串裡

```typescript
// ✅ 單行，用 \n- 與 <br />
const LABELS = {
  note: `Please Note:\n- This tag will be hidden while **inactive**.\n- The **Tag Key Name** is locked.`,
  hint: `Step 1: select scope.<br/>Step 2: confirm.`,
};

<Box sx={{ color: 'primary.main', '& ul': { m: 0, pl: 3 } }}>
  <Markdown>{LABELS.note}</Markdown>
</Box>

// ❌ 多行 template literal —— 縮排會破壞 markdown
const LABELS = {
  note: `Please Note:

  - This tag will be hidden while **inactive**.
  - The **Tag Key Name** is locked.`,
};

// ❌ 手刻 ul/li + 多個 Typography
<Box>
  <Typography>Please Note:</Typography>
  <ul>
    <Typography component="li"><Markdown>...</Markdown></Typography>
    <Typography component="li"><Markdown>...</Markdown></Typography>
  </ul>
</Box>
```

## 指定使用元件

| 場景                    | 使用元件           | 來源                                                     |
| ----------------------- | ------------------ | -------------------------------------------------------- |
| 水平排列（flex row）    | `HStack`           | `@lumiture-ui`                                           |
| 垂直排列（flex column） | `VStack`           | `@lumiture-ui`                                           |
| 資料表格                | `VirtualizedTable` | `apps/lumiture-ai/src/components/table/VirtualizedTable` |

- **flex 排版**：使用 `HStack` / `VStack`，不直接寫 `display: 'flex'` + `flexDirection` 的 sx prop
  - 元件支援的樣式**優先透過 props 傳入，不用 `sx`**
  - ✅ `<HStack gap={1} alignItems="center">...</HStack>`
  - ❌ `<HStack sx={{ gap: 1, alignItems: 'center' }}>...</HStack>`
  - ❌ `<Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>...</Box>`
- **Table**：一律使用 `VirtualizedTable`，禁止自行實作 table 或使用其他 table 元件

## 效能

- 避免不必要的 re-render
- 適當使用 `useMemo`、`useCallback`、`React.memo`
