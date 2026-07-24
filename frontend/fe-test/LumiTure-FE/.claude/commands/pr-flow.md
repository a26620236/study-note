---
description: 一鍵完成 commit → push → 建立 PR → 產生 PR description 的完整流程
---

# PR Flow

一口氣完成 **check → commit → push → 建立 PR → 產生 PR description**。每步自動偵測狀態，不需要時跳過。**不接受參數**，所有設定在前置階段一次問完。

---

## 前置階段：收集資訊

### 0.1 自動偵測環境

```bash
git rev-parse --abbrev-ref HEAD
git status --porcelain
git diff --staged && git diff
git rev-parse --abbrev-ref @{upstream} 2>/dev/null
git log origin/<branch>..HEAD --oneline 2>/dev/null
gh pr view --json number,url,title 2>/dev/null
gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'
```

### 0.2 提前終止檢查

若**同時**滿足以下條件，顯示訊息並**終止流程**：

- 無檔案變更（staged + unstaged + untracked 皆為空）
- 無未推送的 commits（分支與 remote base 無差異）

終止訊息：`ℹ️ 目前分支沒有任何改動，無需執行 PR Flow。`

### 0.3 一次詢問所有設定

先顯示偵測摘要，再用 AskUserQuestion **一次問完**（只問適用的）：

```
═══════════════════════════════════════════════════════════
🔄 PR Flow — 設定確認
═══════════════════════════════════════════════════════════
分支：<branch-name>
Ticket：<auto-detected or "未偵測到">

📋 即將執行的步驟：
  1. 🔍 Check — pnpm check + pnpm test-ci
  2. 📦 Commit — <N 個檔案變更（自動 stage）/ ⏭️ 跳過>
  3. 🚀 Push — <N 個 commits 待推送 / ⏭️ 跳過>
  4. 🔀 Create PR — <待建立 / ⏭️ 跳過（PR #X 已存在）>
  5. 📝 PR Description — 自動產生
───────────────────────────────────────────────────────────
```

需詢問的設定（共 4 題，AskUserQuestion 上限為 4 個問題）：

1. **Ticket Number**：永遠詢問。預設從分支名稱偵測，選項為「使用偵測到的 #TICKET」/「自訂」/「不加」。偵測不到時選項為「自訂」/「不加」
2. **Commit 模式**（有變更時）：「智能分組」/「單一 Commit」
3. **Base Branch**（需建立 PR 時）：確認偵測到的 base branch
4. **PR 類型 × PR Description**（合併為一題，需建立 PR 時）：「Draft + 產生 Desc」/「正式 + 產生 Desc」/「Draft + 跳過 Desc」/「正式 + 跳過 Desc」

> ⚠️ AskUserQuestion 最多 4 個問題，因此 PR 類型與 PR Description 合併為同一題，各自仍是獨立設定。

確認後依序自動執行，中途不再詢問（除非 push 失敗需處理）。

---

## Step 1/5: Check

`🔍 Step 1/5: Check`

依序執行 `pnpm check` → `pnpm test-ci`。任一失敗則顯示 `❌` 錯誤訊息並**終止流程**。

---

## Step 2/5: Commit

`📦 Step 2/5: Commit`

- **無變更**（staged + unstaged + untracked 皆為空）→ `ℹ️ 跳過` → Step 3

### 自動 Stage

將所有變更（unstaged + untracked）加入 staging area，排除 `.env` 等敏感檔案：

```bash
git add -A && git diff --staged --name-only
```

若 staging 後仍無 staged changes（例如只有 `.env` 被排除），`ℹ️ 跳過` → Step 3。

### 智能分組模式

分組規則同 `/commit-msg`：

- **分組依據**：目錄結構（`deploy/` → deploy、`src/features/X` → X、`.claude/` → claude）+ 變更類型（feat/fix/refactor/chore）
- **優先級**：version bump → 配置檔 → 功能模組 → 共用元件
- **原則**：邏輯相關同組、語意清楚、粒度適中
- **排除**：`.env` 敏感檔案

**Commit Message**：`<type>(<scope>): <description> [#TICKET]`

- Types：`feat` / `fix` / `refactor` / `docs` / `test` / `chore` / `perf` / `ci` / `build`
- Scope：從路徑推導（`deploy/helm/` → `helm`、`src/features/budget/` → `budget`、`src/components/` → `components`）
- 英文祈使句、≤ 72 字元、說明 WHAT not HOW
- 使用 HEREDOC 確保格式正確

先 `git reset HEAD` 清除 staging，再依分組逐一執行：`git add <files> && git commit -m "<msg>"`

### 單一 Commit 模式

所有已 staged 檔案一個 commit，格式同上。

### 摘要

顯示所有 commit hash + message。

---

## Step 3/5: Push

`🚀 Step 3/5: Push`

- **無未推送 commits** → `ℹ️ 跳過` → Step 4

因 Step 1 已跑過 check + test，所有 push 使用 `--no-verify` 跳過 pre-push hook。

```bash
# 新分支
git push -u origin <branch> --no-verify
# 已有 tracking
git push --no-verify
```

**Push 失敗**：詢問是否 `git push --force-with-lease --no-verify`。

---

## Step 4/5: 建立 PR

`🔀 Step 4/5: Create PR`

- **已有 PR** → `ℹ️ PR #X 已存在` → Step 5

使用前置階段確認的 base branch，從分支名稱 + commits 推導 PR title（≤ 70 字元）。

依前置階段選擇的 PR 類型決定指令：Draft PR 加上 `--draft` flag。

```bash
# 正式 PR
gh pr create --base <base> --title "<title>" --body "$(cat <<'EOF'
# Draft PR
gh pr create --base <base> --draft --title "<title>" --body "$(cat <<'EOF'
### ⭐️ What do I do in this PR

（Step 5 自動填入）

### ⭐️ Notion Ticket



### ⭐️ Notes



### ⭐️ Screenshots


EOF
)"
```

---

## Step 5/5: 產生 PR Description

`📝 Step 5/5: Generate PR Description`

```bash
gh pr view <number> --json body,title,headRefName
gh pr diff <number>
gh pr view <number> --json commits
```

分析 diff，產生**繁體中文**結構化描述（技術術語保持英文）：

- 編號列表、**粗體標題**：具體說明、子項目用縮排 `-`
- 變更類型：新增功能、Bug 修復、重構、效能優化、程式碼品質、依賴更新、測試、文件、樣式
- 特別注意：循環依賴、Import 路徑、常數提取、型別改善、Hook 重構、API 變更

範例：

```markdown
1. **新增 ESLint SonarJS 插件**：加入 `eslint-plugin-sonarjs` 與 `import/no-cycle` 規則。
2. **修正循環依賴**：
   - `lumiture-ui` 改為相對路徑 import。
```

**替換邏輯**（嚴格遵守）：

1. 先用以下指令取得現有 PR body，存入變數：
   ```bash
   EXISTING_BODY=$(gh pr view <number> --json body -q '.body')
   ```
2. 用 Python 切割 body，**逐字從現有 body 提取** prefix 與 suffix，絕對不自行重建：
   ```bash
   python3 - <<'PYEOF'
   import sys
   body = open('/tmp/pr_body.txt').read()
   marker_start = '### ⭐️ What do I do in this PR'
   marker_end   = '### ⭐️ Notion Ticket'
   idx_start = body.index(marker_start) + len(marker_start)
   idx_end   = body.index(marker_end)
   prefix = body[:idx_start]          # 包含 marker_start 標題本身
   suffix = body[idx_end:]            # 從 marker_end 開始到結尾（含 Notion Ticket 及之後所有內容）
   print(prefix)
   print()                            # marker_start 後的空行
   # ← 此處插入新產生的描述 ←
   print()                            # 新內容後的空行
   print(suffix, end='')
   PYEOF
   ```
   （實作時將 `EXISTING_BODY` 寫入 `/tmp/pr_body.txt`，再插入新描述）
3. `### ⭐️ Notion Ticket`、`### ⭐️ Notes`、`### ⭐️ Screenshots` 等區塊及其內容**必須逐字取自現有 body**，絕不重新建構
4. 用組合後的完整 body 執行更新，不需確認：`gh pr edit <number> --body "$(cat <<'EOF' ... EOF)"`

---

## 流程完成摘要

```
═══════════════════════════════════════════════════════════
🎉 PR Flow 完成！

🔍 Check:   通過
📦 Commit:  建立了 N 個 commits（或「已跳過」）
🚀 Push:    推送了 N 個 commits（或「已跳過」）
🔀 PR:      #<number> 已建立（Draft / 正式，或「已存在」）
📝 Desc:    PR description 已更新

🔗 <pr-url>
═══════════════════════════════════════════════════════════
```

---

## 錯誤處理

| 錯誤                          | 處理                                                    |
| ----------------------------- | ------------------------------------------------------- |
| `pnpm check` / `test-ci` 失敗 | 顯示錯誤，**終止流程**                                  |
| `gh` CLI 未認證               | 提示 `gh auth login`，終止                              |
| Push 失敗                     | 詢問 force push (`--force-with-lease --no-verify`)      |
| PR 建立失敗                   | 顯示已完成步驟，建議手動建立後執行 `/pr-description`    |
| Description 格式不符          | 找不到 `### ⭐️ What do I do in this PR` 時提示手動調整 |

## 注意事項

1. 不接受參數，前置階段用 AskUserQuestion 一次問完
2. 問完後自動執行，中途不再詢問（除 push 失敗）
3. 每步可獨立跳過，不影響後續
4. 使用 HEREDOC 確保 commit message / PR body 格式正確
5. PR description 繁體中文，技術術語英文
6. 排除 `.env` 敏感檔案
7. Ticket 規則：永遠詢問，使用者選擇 > 分支名稱偵測 > 不加
