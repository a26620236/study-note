---
description: 管理 git worktree 的建立（-open）與刪除（-close）
---

# Worktree 管理工具

根據 `$ARGUMENTS` 決定執行 `-open`（建立）或 `-close`（刪除）流程。

**範例：**

- `/worktree -open` → 建立新 worktree（會詢問 branch name）
- `/worktree -close` → 刪除目前所在的 worktree

---

## -open 流程

### 步驟 1：詢問 branch name

用 AskUserQuestion 詢問：

> 請輸入新 branch 的名稱（例如：`feature/LT-XXXX-description`）

### 步驟 2：取得目前專案路徑

```bash
pwd
```

### 步驟 3：建立 worktree

以 branch name 為資料夾名稱，在**上一層目錄**建立 worktree，從 `origin/develop` 分出去：

```bash
git worktree add -b <branch-name> ../<branch-name> origin/develop
```

若 `origin/develop` 不存在，改用 `origin/main`。

### 步驟 4：用 Cursor 開啟新視窗

```bash
cursor ../<branch-name>
```

完成後告知使用者 worktree 路徑與 branch name。

---

## -close 流程

### 步驟 0：確認目前 worktree

```bash
git worktree list
pwd
```

確認目前所在位置。若目前是**主要 worktree**（`.git` 所在的那個，即 `git worktree list` 第一行），**停止流程**：

> ❌ 目前位於主要 worktree，不可刪除。請先切換到要刪除的 worktree 目錄。

---

### 步驟 1：檢查 unstaged / untracked 變更

```bash
git status --porcelain
```

若有任何輸出，**停止流程**：

> ❌ 有尚未 commit 的變更（unstaged 或 untracked），請先處理後再刪除 worktree。

---

### 步驟 2：確認 commits 已推上 remote

```bash
git branch --show-current
```

```bash
git log origin/<branch-name>..HEAD --oneline 2>/dev/null
```

若有輸出（unpushed commits），或 remote tracking branch 不存在，**停止流程**：

> ❌ 有尚未推上 remote 的 commits，請先執行 `git push` 後再刪除 worktree。

---

### 步驟 3：確認已開出 PR

```bash
gh pr list --head <branch-name> --state open
```

若無 open PR，**停止流程**：

> ❌ 此 branch 尚未建立 PR，請先建立 PR 後再刪除 worktree。

---

### 步驟 4：刪除 worktree

取得主要 worktree 路徑（`git worktree list` 第一行的路徑），從主要 worktree 執行刪除：

```bash
git -C <main-worktree-path> worktree remove <current-worktree-path>
```

完成後：

> ✅ Worktree `<branch-name>` 已成功刪除，資料夾已移除。
