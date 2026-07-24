# TypeScript 規範

## 型別安全

- 禁止使用 `any`，改用 `unknown` 或具體型別
- 禁止使用 `as` 強制轉型（除非絕對必要）
- 優先使用 `interface`，union type 才用 `type`
- Props 介面命名：`{ComponentName}Props`
- 使用原生 `enum`，不要用 obj `as const` 的方式寫。不加 `Enum` 後綴，enum 本身已是 value + type，不要額外定義同名 type alias

  ```typescript
  // ✅
  export enum Direction {
    Up = 'up',
    Down = 'down',
  }

  // ❌ 別再用 obj as const + 同名 type alias
  const DirectionEnum = { Up: 'up', Down: 'down' } as const;
  type Direction = (typeof DirectionEnum)[keyof typeof DirectionEnum];
  ```

- 簡單型別可定義在元件內；共用型別提取到 `types/` 資料夾；避免重複型別定義

## 命名規範

| 項目        | 規範                           |
| ----------- | ------------------------------ |
| 組件檔案    | PascalCase（`AIAnalysis.tsx`） |
| 一般檔案    | camelCase（`useWebSocket.ts`） |
| 測試檔案    | `*.test.ts` / `*.test.tsx`     |
| 路由資料夾  | kebab-case                     |
| 常數        | UPPER_SNAKE_CASE               |
| 函數 / 變數 | camelCase                      |

## Import 與模組化

- 解構 import：`import { Button, TextField, Box } from '@mui/material'`
- Import 順序：外部套件 → 內部模組 → 相對路徑
- 禁止使用 `React.xxx` 存取型別或元件，應直接具名 import
  - ✅ `import type { ReactNode } from 'react'`
  - ❌ `React.ReactNode`
- **禁止重複定義 `@hooks-api` 已有的常數或 Enum**：一律直接 import，不可在 feature 層自行重寫
  - ✅ `import { Operator } from '@hooks-api'`
- **`@hooks-api` 禁止 import feature 層的 constants**：避免 circular dependency
- **型別來源規則**：型別一律從定義它的源頭 import，不可在使用端重新定義
  - 若型別定義在 `@hooks-api`（hook 檔案內）→ 從 `@hooks-api` import
  - 若型別定義在 `constants/`（例如 Enum、domain entity）→ 保持從 `constants/` import，不需轉到 hooks-api 再 re-export
  - ✅ `import { SomeType } from '@hooks-api'` / `import { SomeEnum } from '@/constants/xxx'`
  - ❌ 在 feature 層重新 `type SomeType = ...`

## 程式碼邏輯與可讀性

- **優先使用 Early Return**，避免深層巢狀：

  ```typescript
  // ✅
  function processData(data: Data | null) {
    if (!data) return null;
    if (data.isEmpty) return [];
    return data.items.map((item) => transform(item));
  }
  ```

- Magic Number / String 應提取為常數（UPPER_SNAKE_CASE）
- 函數複雜度不應過高，保持一致的程式碼風格
- **禁止使用尚未廣泛支援的 runtime method**：專案無 polyfill 機制，使用 ES2020+ 新增的 Array / Object / String runtime method 前，必須先確認 MDN 瀏覽器相容性。語法糖（optional chaining、nullish coalescing 等）由 SWC 轉譯沒問題，但 runtime method（如 `Array.prototype.toSpliced`、`Object.hasOwn` 等）不會被自動 polyfill。
- **禁止使用單字母變數名稱**（`v`、`i`、`e` 等），callback 參數一律使用描述性名稱
  - ✅ `array.map((value, order) => ...)` / `array.filter((_, position) => ...)`
  - ❌ `array.map((v, i) => ...)` / `array.filter((_, i) => ...)`
- **解構優先**：避免重複寫物件路徑（`{ a: obj.a, b: obj.b }`），改用解構 + shorthand property

  ```typescript
  // ✅
  const { name, values } = detail.data;
  return { name, values };

  // ❌
  return { name: detail.data.name, values: detail.data.values };
  ```

- **TS function overload 通常是 over-engineering**：除非真的有強烈型別差異理由（例如不同輸入要對應到完全不同的 return type、且 caller 必須拿到精確型別），否則優先拆成多個獨立 function，呼叫端比較直覺。能拆兩個就不要寫 overload。
