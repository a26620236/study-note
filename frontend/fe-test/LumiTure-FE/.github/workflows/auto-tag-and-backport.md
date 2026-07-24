# CI: Auto Tag, Release & Backport

## 觸發條件

當 `release/*` 或 `hotfix/*` branch 的 PR 被 **merge 進 `main`** 時自動觸發。

僅 close PR（未 merge）不會觸發。

## 實作方式

兩個 step：先以 `actions/create-github-app-token@v1` 產生 GitHub App token，再用 `actions/github-script@v7` 帶此 token 以 JavaScript 完成所有邏輯。

## 流程步驟

### Step 1：提取版號

1. 從 PR 的 source branch 名稱（`head.ref`）取得版號
2. 移除 `release/` 或 `hotfix/` prefix
3. 自動補上 `v` prefix（同時支援 `release/v1.12.0` 和 `release/1.12.0`）
4. 用正則驗證 semver 格式（`v{major}.{minor}.{patch}`），不合法則中止 workflow

| Branch 名稱       | 提取結果  |
| ----------------- | --------- |
| `release/v1.12.0` | `v1.12.0` |
| `release/1.12.0`  | `v1.12.0` |
| `hotfix/v1.12.1`  | `v1.12.1` |
| `hotfix/1.12.1`   | `v1.12.1` |

### Step 2：建立 Git Tag

1. 透過 Octokit（`git.createRef`）在 merge commit 上建立 tag
2. Tag 指向的是 PR merge 進 `main` 時產生的 merge commit SHA
3. 若 tag 已存在（API 回 422），跳過並繼續後續步驟

### Step 3：發布 GitHub Release

1. 透過 Octokit（`repos.createRelease`）基於已建立的 tag 發布 Release
2. 使用 `generate_release_notes: true`，GitHub 會自動根據上一個 tag 到此 tag 之間的 PR 產生 "What's Changed" 內容
3. 若建立失敗，記錄 warning 並繼續後續步驟

### Step 4 & 5：建立 Backport PR

對 `develop` 和 `staging` 各建立一個 backport PR：

1. 先檢查是否已有 open 的 backport PR，已存在則跳過
2. 從 merge commit 建立新 branch（例如 `backport/v1.12.0-to-develop`）
3. 透過 Octokit（`pulls.create`）用新 branch 開 PR 到 target branch
4. PR title 格式：`[Backport] Main(v1.12.0) to Dev`
5. 若建立失敗（例如兩個 branch 沒有差異），記錄 warning 並繼續處理下一個 target

使用獨立 branch 而非直接從 `main` 開 PR，是因為 backport 可能有 conflict 需要在 branch 上修復，不應修改 `main`。

兩個 target branch 的處理互相獨立，其中一個失敗不影響另一個。

## 使用到的 Secrets

透過 GitHub App 產生 installation token，存取 GitHub API（建立 tag、發布 Release、建立 PR）。

| Secret                     | 用途                             |
| -------------------------- | -------------------------------- |
| `LUMITURE_BOT_APP_ID`      | GitHub App 的 App ID             |
| `LUMITURE_BOT_PRIVATE_KEY` | GitHub App 的 private key（PEM） |

### 為什麼使用 GitHub App token 而非 GITHUB_TOKEN？

**問題**：使用預設的 `GITHUB_TOKEN` 創建的 PR **不會觸發其他 workflows**（GitHub 的安全機制，避免無限循環）。

**影響**：Backport PR 創建後，CI 檢查不會自動執行，需要手動 reopen PR 才會觸發。

**解決方案**：以 GitHub App 產生的 installation token 創建的 PR 會正常觸發 CI workflows，且 token 為短期自動簽發、**不會過期失效**，比 PAT 更穩定且符合 GitHub 最佳實踐。

**參考文檔**：[Triggering a workflow from a workflow](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow)

## Permissions

| Permission             | 用途                                             |
| ---------------------- | ------------------------------------------------ |
| `contents: write`      | 推送 git tag、發布 Release、建立 backport branch |
| `pull-requests: write` | 建立 backport PR                                 |

## Edge Cases

| 情況                        | 處理方式                                            |
| --------------------------- | --------------------------------------------------- |
| PR close 但未 merge         | `if` 條件過濾，不觸發                               |
| 非 release/hotfix branch    | `if` 條件過濾，不觸發                               |
| Branch name 沒有 `v` prefix | 自動補上                                            |
| 版號格式不合法              | `core.setFailed` 中止 workflow                      |
| Tag 已存在                  | Warning + 跳過，繼續發布 Release 和建立 backport PR |
| Release 建立失敗            | Warning + 跳過，繼續建立 backport PR                |
| 已有 open 的 backport PR    | Warning + 跳過                                      |
| 建立 PR 失敗（如無差異）    | Warning + 繼續處理下一個 target                     |

---

## ⚠️ GitHub App 維護

本 workflow 透過 GitHub App 在每次執行時自動簽發短期 installation token，**不需定期更新 token**。需要維護的是 App 本身的設定與 private key。

### App token 的優點

- ✅ 每次 workflow 執行自動簽發，**token 不會過期失效**
- ✅ 由 App 身分創建的 PR 可正常觸發 CI workflows
- ✅ 更穩定可靠，符合 GitHub 最佳實踐

### 需要維護的項目

**1. App 安裝與權限**

- App 需安裝於 repo `CloudMile-Product/LumiTure-FE`
- Repository permissions 至少包含：
  - Contents: `Read and write`
  - Pull requests: `Read and write`

**2. Private key（`LUMITURE_BOT_PRIVATE_KEY`）**

private key 本身不會過期，但若外洩或需輪替時：

1. 前往 GitHub App 設定頁 → **Private keys** → **Generate a private key**，下載新的 `.pem`
2. 前往 https://github.com/CloudMile-Product/LumiTure-FE/settings/secrets/actions
3. 更新 `LUMITURE_BOT_PRIVATE_KEY`（貼上整份 PEM 內容）
4. 必要時一併確認 `LUMITURE_BOT_APP_ID` 是否正確

### 檢查狀態

- 前往 https://github.com/CloudMile-Product/LumiTure-FE/actions 查看 workflow 執行結果
- 若 `Generate GitHub App token` step 失敗，多半是 App ID / private key 設定錯誤或 App 權限不足
