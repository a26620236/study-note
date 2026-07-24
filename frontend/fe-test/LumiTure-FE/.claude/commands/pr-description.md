---
description: 分析 PR diff 並自動產生/更新 description（只更新 'What do I do in this PR' 區塊）
argument-hint: [pr-number]
---

# PR Description Generator

分析 Pull Request 的程式碼變更（diff），自動產生結構化的 PR description，並**只更新 "What do I do in this PR" 區塊的內容**，保留其他部分。

## Input Context

User provided PR number (if any): `$ARGUMENTS`

## Instructions

### Step 1: 確定 PR 編號

1. 如果 `$ARGUMENTS` 有值（用戶提供了 PR 編號），使用該編號
2. 如果 `$ARGUMENTS` 為空，自動偵測當前分支的 PR：
   ```bash
   gh pr view --json number,url
   ```
3. 如果找不到 PR，提示用戶：
   ```
   ❌ 當前分支 (<branch-name>) 沒有對應的 PR。
   請指定 PR 編號：/pr-description <number>
   ```

### Step 2: 獲取 PR 資訊

執行以下指令來獲取必要資訊：

```bash
# 獲取現有的 PR description
gh pr view <number> --json body,title,headRefName

# 獲取 PR diff
gh pr diff <number>

# 獲取 commit messages（可選，用於補充 context）
gh pr view <number> --json commits
```

### Step 3: 分析程式碼變更

根據 diff 內容，識別並分類變更類型：

#### 常見變更類型

- **新增功能** - 新增檔案、新增 component、新增 API endpoint
- **Bug 修復** - 修正錯誤邏輯、修復 edge case
- **重構** (Refactor) - 程式碼結構改善、提取函式、移除重複程式碼
- **效能優化** - 減少 re-render、優化演算法
- **程式碼品質** - ESLint 修正、型別改善、移除 `any`
- **依賴更新** - package.json 變更
- **測試** - 新增或修改測試檔案
- **文件** - README、註解更新
- **樣式調整** - UI/UX 改善、CSS 變更

#### 特別注意

- 循環依賴修正 (Circular Dependency)
- Import 路徑變更（barrel import → 相對路徑）
- 常數提取
- 型別定義改善
- Error handling 改善
- Hook 重構
- API 相關變更

### Step 4: 產生 Description

根據分析結果，產生**繁體中文**的結構化描述：

#### 格式要求

- 使用編號列表（1, 2, 3...）
- 每個項目：**粗體標題**：具體說明
- 如果有子項目，使用縮排列表（-）
- 技術術語保持英文（如 ESLint、import、refactor、Hook）
- 清晰、簡潔、具體
- 避免模糊描述，要說明具體做了什麼

#### 範例輸出格式

```markdown
1. **新增 ESLint SonarJS 插件**：加入 `eslint-plugin-sonarjs` 與 `import/no-cycle` 規則，用以偵測認知複雜度、重複邏輯等問題。
2. **修正循環依賴（Circular Dependency）**：
   - `lumiture-ui` 內部元件從 `@lumiture-ui` barrel import 改為相對路徑 import。
   - `utils/api.ts` 與 `utils/auth.ts` 之間的循環依賴透過動態 import 與相對路徑解決。
3. **常數提取**：將 `PAPER_HEIGHT` 從 `RightsizingSummary.tsx` 移至 `rightsizing/constants.ts`。
4. **邏輯重構**：提取 `handleBadRequestError` 函式、精簡 `findFirstErrorPath` 遞迴邏輯、移除多餘的 `switch default`。
5. **小型清理**：`{icon && icon}` → `{icon}` 等冗餘表達式修正。
```

### Step 5: 替換 Description 區塊

1. 取得現有 PR body 並存入暫存檔：
   ```bash
   gh pr view <number> --json body -q '.body' > /tmp/pr_body.txt
   ```
2. 用 Python **逐字從現有 body 提取** prefix（含 `### ⭐️ What do I do in this PR` 標題）與 suffix（從 `### ⭐️ Notion Ticket` 到結尾），**絕不自行重建** suffix：
   ```bash
   python3 -c "
   body = open('/tmp/pr_body.txt').read()
   marker_start = '### ⭐️ What do I do in this PR'
   marker_end   = '### ⭐️ Notion Ticket'
   idx_start = body.index(marker_start) + len(marker_start)
   idx_end   = body.index(marker_end)
   prefix = body[:idx_start]   # 包含 marker_start 標題
   suffix = body[idx_end:]     # 從 marker_end 到結尾（含 Notion Ticket 及之後所有內容）
   open('/tmp/pr_prefix.txt', 'w').write(prefix)
   open('/tmp/pr_suffix.txt', 'w').write(suffix)
   "
   ```
3. 組合新 body：`prefix` + 空行 + 新描述 + 空行 + `suffix`（suffix **逐字取自現有 body**）
4. 確保 `### ⭐️ Notion Ticket`、`### ⭐️ Notes`、`### ⭐️ Screenshots` 及其內容完整保留

#### 結構示意

```
[prefix = 原有 body 中直到 What do I do 標題]

{新產生的描述}

[suffix = 原有 body 中從 Notion Ticket 標題到結尾，逐字保留]
```

**重要**：確保在新內容後和下一個標題前保留**一個空行**。

### Step 6: 顯示預覽並確認

在更新前：

1. 顯示新產生的 "What do I do in this PR" 內容
2. 顯示 PR 資訊（編號、標題、URL）
3. 詢問用戶：「是否要更新 PR #<number> 的 description？」
4. 等待用戶確認

### Step 7: 更新 PR

用戶確認後，執行：

```bash
gh pr edit <number> --body "$(cat <<'EOF'
<完整的新 PR body>
EOF
)"
```

**注意事項**：

- 使用 HEREDOC 確保正確處理換行和特殊字元
- 確保完整的 body 包含所有保留的部分
- 檢查是否有正確的空行分隔

### Step 8: 確認成功

更新後：

1. 顯示成功訊息：`✅ PR #<number> description 已更新`
2. 提供 PR URL 讓用戶查看結果

## 專案規範遵循

遵循 `CLAUDE.md` 的規範：

- ✅ 使用**繁體中文**撰寫 description
- ✅ 技術術語保持**英文**（ESLint, import, refactor, Hook, TypeScript, React 等）
- ✅ 清晰的結構化內容
- ✅ 具體說明變更內容，避免模糊描述
- ✅ 遵循專案的命名與程式碼規範

## 錯誤處理

### PR 不存在

```
❌ 找不到 PR #<number>，請確認 PR 編號是否正確。
```

### 當前分支沒有 PR

```
❌ 當前分支 (<branch-name>) 沒有對應的 PR。
請使用以下方式指定 PR 編號：/pr-description <number>
```

### 無法解析 Description 格式

如果現有 PR body 沒有標準格式（找不到 `### ⭐️ What do I do in this PR`），提示：

```
⚠️  PR description 格式不符合預期，無法自動替換區塊。
目前的 body 結構：
<顯示現有 body 的前幾行>

建議手動調整 PR description 格式後再試。
```

### gh CLI 未認證

```
❌ gh CLI 未認證，請先執行：gh auth login
```

## 使用範例

### 範例 1：自動偵測當前分支

```bash
# 在 LT-2887 分支上
/pr-description

→ 自動找到 PR #599
→ 分析 diff
→ 產生 description
→ 顯示預覽
→ 詢問確認
→ 更新 PR
→ ✅ 成功
```

### 範例 2：指定 PR 編號

```bash
/pr-description 599

→ 使用 PR #599
→ 分析 diff
→ 產生 description
→ 顯示預覽
→ 詢問確認
→ 更新 PR
→ ✅ 成功
```

## 注意事項

1. **只更新 "What do I do in this PR" 區塊**，不要動其他部分
2. **更新前務必顯示預覽並詢問用戶確認**，避免誤覆蓋
3. **使用繁體中文**，遵循專案規範
4. **具體且清晰**，不要寫模糊的描述（如「一些修改」、「優化代碼」）
5. **保持格式一致**，與現有 PR 的風格對齊
6. **保留所有空行**，確保 markdown 格式正確
7. **技術術語使用英文**，如 React, TypeScript, Hook, ESLint 等
