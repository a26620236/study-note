---
description: 根據 LT-XXXX-task.md 實作指定 Phase 的所有任務
---

# PR Implement

本 command 從當前 branch 自動找到對應的 plan / task 文件，執行指定 Phase 的實作。

---

## 前置階段：確認來源文件

### 1. 自動偵測 LT ticket

從當前 branch 名稱擷取 LT 編號（格式：`LT-XXXX`）：

```bash
git branch --show-current
```

### 2. 尋找文件

確認 `pr-plan/<LT-XXXX>/` 下的文件狀態：

| 狀態                                        | 處理方式                                      |
| ------------------------------------------- | --------------------------------------------- |
| `LT-XXXX-plan.md` ✅ + `LT-XXXX-task.md` ✅ | 正常執行                                      |
| `LT-XXXX-plan.md` ✅，無 task               | 詢問是否先執行 `/pr-task-breakdown`（見下方） |
| 無 plan                                     | 終止流程                                      |

**無 plan 時終止**：

```
❌ 無法開始實作：
  - pr-plan/<LT-XXXX>/<LT-XXXX>.plan.md 不存在

請先執行 /pr-plan 產出架構設計方案。
```

**有 plan 無 task 時**，使用 **AskUserQuestion** 詢問：

> 「找不到 LT-XXXX-task.md，是否要先執行 /pr-task-breakdown 產出任務切分？」
>
> - 是，先產出 task → 執行 /pr-task-breakdown 後繼續
> - 否，直接依 plan 實作 → 跳至「選擇 Phase」

### 3. 找不到 LT 編號或資料夾時

使用 **AskUserQuestion** 請使用者手動輸入 plan 路徑，並確認是否有對應 task 文件。

---

## 選擇 Phase

讀取 `LT-XXXX-task.md`，解析所有 Phase，動態產生選項：

使用 **AskUserQuestion** 詢問：

> 「要實作哪個 Phase？」
>
> 選項：
>
> - Phase 1 — <Phase 名稱>（若已完成則標示 ✅）
> - Phase 2 — <Phase 名稱>
> - ...
> - All — 依序執行所有 Phase
> - Other — 其他事項

已完成的 Phase 仍列出，但標示 ✅ 供參考。

**選 Other 時**：**不使用 AskUserQuestion**，改為直接在對話中回覆：

> 「請描述你想要做的事，或直接貼上程式碼、指定行號，我會依照你的說明開始實作。」

等待使用者在下一則對話訊息中說明需求，收到後依照相同流程執行：

1. 先讀取所有文件（見下方「讀取文件」）
2. 依使用者描述的內容實作
3. 完成後執行 `pnpm check`，修正所有錯誤直到通過
4. 完成摘要改為描述做了什麼事情（不更新 task.md，除非使用者明確要求）

---

## 實作流程

### 1. 讀取文件

並行讀取：

- `pr-plan/LT-XXXX/` 底下所有檔案（feature-spec、api-spec 及其他參考資料）
- `LT-XXXX-plan.md`（理解整體架構與技術決策）
- `LT-XXXX-task.md`（確認任務範圍與順序）
- `CLAUDE.md`（團隊規範，含所有 @import 子檔案）

> `pr-plan/LT-XXXX/` 底下的 spec 與參考資料是實作的第一手依據，遇到 plan / task 描述不夠詳細時，優先回頭查這些文件，而非自行腦補。

### 2. 實作

依任務順序逐一實作，嚴格遵守 `CLAUDE.md` 定義的所有規範。

**選 All 時**：依 Phase 1 → Phase N 順序一口氣跑完，不中途暫停確認。

### 3. 每個檔案完成後的 CLAUDE.md 自我 review

每寫完一個檔案，立刻對照 CLAUDE.md 規範做一次自我檢查，**不能只靠 `pnpm check`**：

- **Enum / 型別**：有 union string literal 就問「這應該是 `as const` + Enum 後綴嗎？」
- **命名**：PascalCase Enum 後綴、UPPER_SNAKE_CASE 常數、camelCase 函數 / 變數
- **邏輯**：early return、no magic string、no single-letter var
- **其他**：對照 CLAUDE.md 中所有規範項目，確認無遺漏

### 4. 跑 pnpm check

無論是實作 Phase、Other、或任何程式碼修改，完成後一律執行並修正所有錯誤：

```bash
pnpm check
```

必須零 error、零 warning。有錯誤立即修正直到通過。

### 5. 更新 task.md

`pnpm check` 通過後，自動將已完成的 Phase 標題加上 `✅`：

```markdown
## ✅ Phase 1 — API 層

## ✅ Phase 2 — Schema / Constants

## Phase 3 — 頁面骨架 ← 尚未完成
```

---

## ⚠️ 改名 / 全域替換前的強制盤點

任何改名、rename、全域替換操作，動手前必須先 grep 完整盤點所有受影響位置：

```bash
grep -rn "<舊名稱>" src/ --include="*.ts" --include="*.tsx"
```

確認清單包含：型別定義、interface、schema、變數 / 函數名稱、測試檔案描述字串、字串形式的值。

**盤點完畢才可開始修改，禁止邊改邊找。**

---

## 完成摘要

```
═══════════════════════════════════════════════════════════
✅ 實作完成，pnpm check 通過！

Phase： <執行的 Phase，如 Phase 1 / All>
任務數：<N> 個
═══════════════════════════════════════════════════════════
```

---

## 禁止行為

1. **禁止在沒有 plan 的情況下執行** — plan 是最低門檻
2. **禁止跳過 pnpm check** — 無論是實作 Phase、Other、或任何程式碼修改，完成後一律執行並修正所有錯誤
3. **禁止在未讀取檔案前修改** — 修改前必須先讀取目標檔案的現有內容
4. **禁止腦補未提及的實作** — 嚴格依照 task 與 plan 的內容實作，不自行擴充
5. **禁止在未完整盤點前執行改名** — 改名前必須先 grep 確認所有受影響位置
