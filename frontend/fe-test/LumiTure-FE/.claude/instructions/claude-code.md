# Claude Code 使用規範

## 語言

- 使用繁體中文回答（程式碼註解、文件內容可保留英文）
- 技術術語維持英文

## 程式碼修改

- 優先使用 Edit 工具修改現有檔案
- 避免不必要的重構
- 保持現有的程式碼風格一致性
- 修改前先閱讀相關檔案

### pnpm check 是完成的標準

任何程式碼修改（不論大小）完成後，**一律執行 `pnpm check` 並修正所有 error 與 warning，才算完成**。零 error、零 warning 是唯一的通過標準。

### pnpm check 常見錯誤修正方向

- `no-non-null-assertion`：移除 `!`，改用型別收窄或 early return
- `promise-function-async`：回傳 Promise 的函數加 `async`
- `promise/avoid-new`：不使用 `new Promise`，改用 `async/await`
- `return-await`：在需要的 context 下用 `return await`

### 改名 / 全域替換的強制盤點

任何改名、rename、全域替換操作，動手前必須先 grep 完整盤點所有受影響位置：

- 不要假設「應該只差一個 s」「規則應該都一樣」就動手，必須先列出所有 case 確認沒有 exception
- 盤點範圍包含：型別定義、interface、schema、變數 / 函數名稱、測試 fixture、字串形式的值、外部文件（spec、mock data、api-spec.md）
- 盤點完畢才可開始修改，禁止邊改邊找

### 完成前對齊 spec

修改 form / API / 業務邏輯後，除了 `pnpm check` 通過外，**必須回頭比對 `pr-plan/<LT-XXXX>/spec/` 內的 feature-spec、api-spec**，確認實作符合 spec 規格。不能只跑 lint 就回報完成。

當 feature-spec 跟 api-spec 衝突時，**以 api-spec 為準**（最終對接是按 api-spec）。

## 規範衝突處理

若使用者要求的任務**違反 CLAUDE.md 中定義的團隊規範**（包含架構規範、命名規範、禁止行為等），必須：

1. 明確指出違反的是哪條規範
2. 說明可能的影響
3. 詢問使用者是否確認要繼續

確認後才執行，不得直接修改。

## 任務處理

- 使用 TodoWrite 追蹤複雜任務，完成每個小任務後立即標記
- 不要批量標記多個任務

## 禁止行為

- ❌ 不建立不必要的新檔案
- ❌ 不過度設計或添加未要求的功能
- ❌ 不在未閱讀檔案前建議修改
- ❌ 不使用 `any` 型別
- ❌ 不使用 `as` 強制轉型（除非絕對必要）
- ❌ 不忽略 TypeScript 錯誤
