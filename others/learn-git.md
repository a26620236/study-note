# Git 身份與認證設定

## 一、Git 身份設定（user.name / user.email）

### 1.1 設定層級與優先級

```
repo .git/config  >  全域 ~/.gitconfig  >  系統 /etc/gitconfig
（優先級高）                                    （優先級低）
```

- 全域設定：`git config --global user.name "xxx"`
- 單一 repo 設定：`git config user.name "xxx"`（不加 `--global`）

### 1.2 設定存放位置

| 層級 | 檔案位置 | 指令 |
|------|---------|------|
| repo | `.git/config`（每個 repo 各自的隱藏資料夾） | `git config user.name "xxx"` |
| 全域 | `~/.gitconfig` | `git config --global user.name "xxx"` |

如果 repo 的 `.git/config` 沒有設定 `[user]`，就會 fallback 到全域設定。

### 1.3 查看目前設定

```bash
# 查看當前 repo 的身份
git config user.name
git config user.email

# 查看全域設定
git config --global --list
```

### 1.4 GitHub Desktop

GitHub Desktop → Preferences（Mac）/ File → Options（Windows）→ Git 分頁可以設定全域的 name / email。

但**無法針對單一 repo 設定**，需要用命令列。

---

## 二、.git 隱藏資料夾

`.git` 是以 `.` 開頭的隱藏資料夾，存放 repo 的所有設定與版本歷史。

| 環境 | 顯示隱藏檔案方式 |
|------|----------------|
| macOS Finder | `Cmd + Shift + .` |
| VS Code | 檔案總管預設隱藏 `.git`，到 Settings 搜尋 `files.exclude` 關掉 |
| 終端機 | `ls -la` |

---

## 三、Git 遠端認證方式：SSH vs HTTPS

### 3.1 SSH 認證

**Remote URL 格式：**
```
git@github.com:user/repo.git
```

**原理：** 用 SSH 金鑰對（公鑰 + 私鑰）驗證身份，不需要帳密。

**多帳號方案 — SSH Config：**

在 `~/.ssh/config` 定義別名：

```
Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/personal-key    ← 個人帳號的私鑰

Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/work-key        ← 工作帳號的私鑰
```

這樣 remote URL 可以用別名區分帳號：

```
# 個人 repo
git@github-personal:user/repo.git   → 自動用 personal-key

# 工作 repo
git@github-work:company/repo.git    → 自動用 work-key
```

Git 看到 `github-personal` 時，SSH 會查 config，自動對應到 `github.com` + 正確的私鑰。

**SSH 私鑰權限：**

```
-rw-------  (600)
6 = 讀+寫（owner）
0 = 無權限（group）
0 = 無權限（others）
```

只有自己能讀寫。SSH 會強制檢查，權限太寬鬆會拒絕使用該金鑰。

### 3.2 HTTPS 認證

**Remote URL 格式：**
```
https://github.com/user/repo.git
```

**原理：** 用帳號 + Personal Access Token（PAT）認證。

**取得 PAT：**

GitHub → 頭像 → Settings → Developer settings → Personal access tokens → Generate new token

> 產生後只顯示一次，要複製保存。使用時當密碼輸入（不是 GitHub 密碼）。

**三種憑證管理方式：**

| 方式 | 每次都問帳密 | 安全性 | 多帳號 |
|------|------------|--------|--------|
| 什麼都不設 | 是 | 最安全但最麻煩 | 可以，每次手動選 |
| credential helper (Keychain) | 否，記住一組 | 安全 | 不方便，只存一組 |
| token 寫進 remote URL | 否 | token 明文存檔 | 可以，每個 repo 各自設 |

**方式一：每次手動輸入**

```bash
git clone https://github.com/user/repo.git
# Username: github帳號
# Password: ghp_xxxxxxxxxxxx（貼 PAT）
```

**方式二：credential helper（macOS Keychain）**

```bash
git config --global credential.helper osxkeychain   # macOS
git config --global credential.helper manager        # Windows
```

第一次輸入後 Keychain 會記住，之後不用再輸入。
但對同一個 `github.com` 只存一組憑證，多帳號會衝突（直接用已存的 token，不會再問你）。

**方式三：token 寫進 remote URL**

```bash
git remote set-url origin https://ghp_xxxx@github.com/user/repo.git
```

token 明文存在 `.git/config` 裡，每個 repo 可以設不同 token，不會衝突。
但安全性較差，token 過期後要手動更新每個 repo。

### 3.3 SSH vs HTTPS 比較

| | SSH | HTTPS |
|---|---|---|
| **認證方式** | 金鑰對 | 帳號 + PAT |
| **多帳號** | SSH config 別名，簡單 | Keychain 只存一組，麻煩 |
| **安全性** | 私鑰不在 repo 裡 | token 可能明文存檔 |
| **過期問題** | 金鑰不會過期 | PAT 有過期時間 |
| **適合場景** | 個人開發機 | CI/CD、一次性腳本 |

---

## 四、Merge Base 與 3-Way Merge

### 4.1 什麼是 Merge Base

Merge base 是兩個分支歷史中的**最近共同祖先 commit**。

Git merge **不是**直接拿兩個分支做 diff，而是做 **3-way merge**：

```
         (Merge Base)
              B
             / \
            /   \
           v     v
       branch1  branch2
```

Git 分別比較：
1. **B → branch1 改了什麼？**
2. **B → branch2 改了什麼？**

再把兩邊的改動合在一起。可以用以下指令查看 merge base：

```bash
git merge-base branch1 branch2
```

### 4.2 實際案例：Revert 後 Backport 不會重新引入

**情境：** dev 上有 commit A → merge 到 staging → staging merge 到 production → dev revert A → production backport 回 dev

```
dev:         ... → X → A → A'(revert) ── M(backport)
                        \                  /
staging:                 M1               /
                          \              /
production:                M2 → Y(hotfix)
```

執行 `git merge production`（在 dev 上）時：

| 比較對象 | A 的內容狀態 |
|---------|------------|
| **Merge Base（commit A）** | 有 A |
| **dev 端** | 有 A 但被 A' revert，淨效果 = 無 A |
| **production 端** | 有 A，未改動 = 與 base 相同 |

Git 的判斷：
- production 端與 base 相同 → production 沒有修改
- dev 端相對 base 移除了 A → dev 有修改（revert）
- **結果：採用 dev 端的版本（保留 revert），A 不會被重新帶入**

開 PR 也一樣，GitHub PR diff 用的是 `git diff <merge_base>...production`，只會顯示 production 相對於 merge base 的改動（例如 hotfix Y），A 的內容不會出現在 diff 中。

### 4.3 注意：Revert 後想重新引入需要 Revert the Revert

如果之後想在 dev 上重新引入 A 的功能，直接從包含 A 的分支 merge 是**沒用的**（Git 認為已經處理過了）。必須：

```bash
git revert <A' 的 commit hash>   # revert the revert
```

這是 Git 經典的 **"revert of a merge"** 陷阱。

test123
