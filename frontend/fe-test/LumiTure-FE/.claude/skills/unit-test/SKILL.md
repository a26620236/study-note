---
name: unit-test
description: Generate unit tests following best practices for the project (Vitest + React + TypeScript). Use when writing, generating, or reviewing unit tests.
---

# Unit Test 規範

為指定的檔案或函式撰寫 unit test，遵循以下 best practices。

## Instructions

1. 先閱讀目標檔案的完整內容，理解其邏輯與依賴關係。
2. 根據以下規範撰寫測試。
3. 撰寫完成後依序執行以下驗證，**全部通過才算完成**：
   - `pnpm vitest --run <test-file-path>` — 確認所有測試通過
   - `pnpm type-check` — 確認無 TypeScript 型別錯誤
   - `pnpm lint --max-warnings 0` — 確認無 ESLint 錯誤或警告
4. 如有錯誤，逐一修正後重新執行驗證，直到全部通過。

> 專案已啟用 `globals: true`，不需要 import `describe`、`it`、`expect`。

---

## 命名與結構

測試檔放在目標檔案同目錄的 `__tests__/` 下，命名 `<原檔名>.test.ts`：

```
src/utils/
  ├── __tests__/
  │     └── formatter.test.ts   ← import { fn } from '../formatter'
  └── formatter.ts
```

`describe` 使用被測試的函式名稱；`it` 使用 `should ...` 句型，依情境用巢狀 `describe` 分群：

```typescript
describe('calculateDiscount', () => {
  describe('when type is percentage', () => {
    it('should apply percentage to total', () => { ... });
    it('should cap at maximum allowed value', () => { ... });
  });
});
```

---

## 撰寫原則

**結構遵循 AAA（Arrange → Act → Assert）：**

```typescript
it('should return filtered items when filter is applied', () => {
  const items = [
    { id: 1, active: true },
    { id: 2, active: false },
  ]; // Arrange
  const result = filterActiveItems(items); // Act
  expect(result).toEqual([{ id: 1, active: true }]); // Assert
});
```

**核心規則：**

- 測試行為（輸入→輸出），不測實作細節（內部呼叫方式）
- 每個 `it` 只驗證一個行為；測試之間互相獨立，用 `beforeEach` 重設狀態
- 先測邊界條件（null、空陣列、異常輸入），再測正常路徑
- 測試中不寫邏輯（`if`/`for`/`switch`），多組輸入寫成獨立的 `it`

**✅ 應該測：** 純函式輸入輸出、邊界條件、條件分支、資料轉換、Custom hooks、關鍵業務邏輯

**❌ 不該測：** 第三方套件行為（MUI / TanStack Query）、TypeScript 型別、無邏輯的 props 傳遞、CSS 樣式、常數定義

**Assertion 使用具體 matcher，避免模糊斷言：**

```typescript
// ✅
expect(items).toHaveLength(3);
expect(callback).toHaveBeenCalledWith('arg1');

// ❌
expect(result).toBeTruthy();
expect(!!value).toBe(true);
```

---

## 測試資料：Factory Function

```typescript
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: '1',
    name: 'Test User',
    role: 'viewer',
    ...overrides,
  };
}

it('should display admin badge', () => {
  const admin = createMockUser({ role: 'admin' });
  // ...
});
```

- 只包含與測試相關的欄位，使用有意義的值
- 避免引用外部大型 fixture 檔

---

## 重用來源檔的常數

**測試的期望值若已存在於來源檔（如 `LABELS`、訊息字串、預設值），優先把來源檔的常數 `export` 並 `import` 使用，不要在測試中重新定義一份。**

```typescript
// ❌ 在測試中複製字串 — 文案改動時測試會漏改、變成兩處要維護
const DEFAULT_MESSAGE = 'Unable to verify your account. Please try again.';

it('should fall back to default', () => {
  expect(getOAuthErrorMessage('unknown')).toBe(DEFAULT_MESSAGE);
});

// ✅ 從來源檔 export，測試端 import 使用
// 來源檔
export const LABELS = { default: 'Unable to verify your account...' } as const;

// 測試檔
import { LABELS } from '../getOAuthErrorMessage';
it('should fall back to default', () => {
  expect(getOAuthErrorMessage('unknown')).toBe(LABELS.default);
});
```

**命名原則：**

- 來源檔常數的命名以「**在來源檔內讀起來自然**」為準，不要為了測試端可讀性去改名（例如把 `LABELS` 改成 `OAUTH_ERROR_MESSAGES`）
- 若測試端覺得名稱不夠清楚，用 `import { LABELS as OAUTH_ERROR_MESSAGES } from '...'` 在 import 處重新命名即可
- 來源檔不該被測試端的偏好污染

---

## Mocking

**只 mock 有副作用的外部依賴**（API call、toast UI、瀏覽器 API），不 mock 純函式或資料轉換。

### 不需要 mock 的 barrel（已驗證可在 Vitest jsdom 環境正常載入）

| Barrel       | 說明                                                          |
| ------------ | ------------------------------------------------------------- |
| `@hooks-api` | 包含 hooks、enum、const、types，全部可直接 import             |
| `@utils`     | 包含純函式（`parseUrl`、`formatRelativeTime` 等），無載入問題 |
| `@constants` | 純常數，無副作用                                              |

> **歷史背景**：過去曾擔心 barrel import 會連帶載入 React hooks / JSX 導致測試環境炸掉，因此用 `vi.mock('@hooks-api', () => ({...}))` 手動模擬 enum/const 值。經實測確認 Vitest 的 Vite-based transform 不會觸發這些副作用，**不需要 mock barrel 來避免載入問題**。

### 什麼時候該 mock

```typescript
// ✅ Mock 有副作用的函式（toast UI）
vi.mock('@utils', () => ({
  popSuccessToast: vi.fn(),
  popErrorToast: vi.fn(),
}));

// ✅ Mock API service
vi.mock('@services/userService', () => ({
  fetchUser: vi.fn(),
}));
```

### 什麼時候不該 mock

```typescript
// ❌ 不要 mock enum/const — 直接 import 真實值
vi.mock('@hooks-api', () => ({
  Granularity: { Day: '0', Month: '1' },
  AWSGroupBy: { Organization: 0 },
}));

// ✅ 直接 import
import { Granularity, AWSGroupBy } from '@hooks-api';

// ❌ 不要 mock 純函式
vi.mock('@utils', () => ({ parseUrl: vi.fn() }));

// ✅ 直接使用真實函式
import { parseUrl } from '@utils';

// ❌ 不要 mock date-fns / date-fns-tz — 用 TZ=UTC + fake timers
vi.mock('date-fns-tz', () => ({ toZonedTime: ... }));

// ✅ vitest.config.ts 已設定 env: { TZ: 'UTC' }，搭配 fake timers 即可
vi.useFakeTimers();
vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));
```

### Mock 的使用規範

```typescript
beforeEach(() => {
  vi.restoreAllMocks();
});

// 同步 mock
it('should return null when not found', () => {
  vi.mocked(fetchUser).mockReturnValue(null);
  expect(getUserProfile('1')).toBeNull();
});

// 非同步 mock
it('should return null when API fails', async () => {
  vi.mocked(fetchUser).mockRejectedValue(new Error('Network error'));
  const result = await getUserProfile('1');
  expect(result).toBeNull();
});
```

Mock 的註解說明「**為什麼**這樣 mock」，而非描述「做了什麼」：

```typescript
// 隔離 toast 副作用，避免在測試環境中觸發實際的 toast UI
vi.mock('@utils', () => ({
  popSuccessToast: vi.fn(),
  popErrorToast: vi.fn(),
}));
```

---

## TypeScript 型別規範

測試程式碼須遵循專案的 TypeScript 規範，不得因「只是測試」而降低標準。

**禁止 `as` 直接轉型；優先使用 `satisfies`，必要時透過 `unknown` 雙重轉型：**

```typescript
// ❌ 直接轉型 — 隱藏潛在型別問題
const config = {} as InternalAxiosRequestConfig;

// ✅ 優先使用 satisfies — 保留型別檢查
const config = { headers: {} } satisfies Partial<InternalAxiosRequestConfig>;

// ✅ 刻意繞過時，透過 unknown 明確表達意圖
const el = { href: '', click: vi.fn() } as unknown as HTMLAnchorElement;
```

**型別匯入使用 `import type`；避免 `typeof import()` 語法（ESLint 禁止）：**

```typescript
// ✅
import type * as SomeModule from 'some-module';

// ❌
const original = await importOriginal<typeof import('some-module')>();
```
