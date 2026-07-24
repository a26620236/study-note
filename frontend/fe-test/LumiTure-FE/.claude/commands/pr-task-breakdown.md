---
description: 根據 LT-XXXX-plan.md 產出實作任務切分（pr-task-breakdown）
---

# PR Task Breakdown

本 command 根據當前 branch 自動找到對應的 plan 文件，產出按 Phase 切分的實作任務清單。
每個 Phase 只說明「做什麼」，細節留給 plan。

---

## 前置階段：確認來源文件

### 1. 自動偵測 LT ticket

從當前 branch 名稱擷取 LT 編號（格式：`LT-XXXX`）：

```bash
git branch --show-current
```

範例：branch 為 `LT-3111-some-feature` → 擷取 `LT-3111`

### 2. 尋找對應 plan 文件

取得 LT 編號後，尋找：

```
pr-plan/<LT-XXXX>/<LT-XXXX>.plan.md
```

### 3. 找不到時

若找不到對應資料夾或 plan 文件，提示使用者手動輸入：

```
❌ 找不到對應的 plan 文件：
  - pr-plan/<LT-XXXX>/<LT-XXXX>.plan.md 不存在

請手動輸入 plan 文件的路徑：
```

使用 **AskUserQuestion** 工具顯示輸入框，取得路徑後讀取該文件。若仍不存在或為空，終止流程：

```
❌ 無法開始 Task Breakdown：
  - <路徑> 不存在或為空

請確認路徑後重新執行 /pr-task-breakdown。
```

---

## Step 1：理解 Plan

閱讀 plan 文件，提取以下資訊：

- **功能範圍**：包含哪些頁面 / 功能點
- **技術決策**：採用的套件、pattern、狀態管理方式
- **採用方案**：若 plan 有多個方案，確認最終選定的
- **關鍵檔案清單**：每個檔案的職責

---

## Step 2：切分 Phase

依「由底層往 UI 走」的原則切分 Phase，每個 Phase 對應一個獨立可驗收的里程碑：

| Phase   | 典型內容                                          |
| ------- | ------------------------------------------------- |
| Phase 1 | API 層（hooks-api）：型別、query / mutation hooks |
| Phase 2 | Schema / Constants / 純函數                       |
| Phase 3 | Form Hooks / 業務邏輯 Hooks                       |
| Phase 4 | 頁面骨架：page.tsx、Hydration、Skeleton           |
| Phase 5 | UI 元件（由外層往內層）                           |
| Phase 6 | 收尾：進階互動、edge case、polish                 |

> 實際 Phase 數與內容視 feature 複雜度調整，不強制六個。

---

## Step 3：產出 LT-XXXX-task.md

將任務清單寫入 plan 文件**同目錄**下的 `<LT-XXXX>.task.md`。

### 文件結構

```markdown
# <Feature Name> — 實作任務切分

> 依據 [LT-XXXX-plan.md](./LT-XXXX-plan.md) 切分。

---

## Phase 1 — <Phase 名稱>

<一到兩句話說明這個 Phase 要做什麼>

---

## Phase 2 — <Phase 名稱>

<一到兩句話說明這個 Phase 要做什麼>

---

...
```

### 撰寫原則

- 每個 Phase 只寫「做什麼」，不寫「怎麼做」
- 細節（型別、函式簽名、props 設計）留給 plan，不重複
- Phase 之間有明確的依賴順序（後一個 Phase 依賴前一個 Phase 的產出）

---

## 完成摘要

```
═══════════════════════════════════════════════════════════
✅ Task Breakdown 完成！

來源：  <LT-XXXX-plan.md 路徑>
輸出：  <LT-XXXX-task.md 路徑>
Phase： <N> 個（Phase 1 ~ Phase N）
═══════════════════════════════════════════════════════════
```

---

## 禁止行為

1. **禁止開始寫實作** — 本 command 只產出任務清單
2. **禁止腦補 plan 未提及的設計** — 任務內容必須有 plan 依據
3. **禁止把所有任務塞進同一個 Phase** — 每個 Phase 必須是獨立可驗收的里程碑
4. **禁止在 Phase 內寫詳細實作細節** — 一到兩句話說明做什麼即可
