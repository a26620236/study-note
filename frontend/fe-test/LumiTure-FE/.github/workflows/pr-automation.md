# CI: PR Automation

當 PR 事件觸發時，自動執行 Slack 通知、指派 assignee / reviewer，以及 Notion Ticket 連結。

## 觸發條件

| 事件          | `slack-notify` | `assign-and-review` | `notion-link` |
| ------------- | -------------- | ------------------- | ------------- |
| `opened`      | 執行           | 執行                | 執行          |
| `reopened`    | 跳過           | 執行                | 執行          |
| `synchronize` | 跳過           | 跳過                | 執行          |

## Job 1：slack-notify

透過 Slack Incoming Webhook 發送 PR 通知，僅在 PR **首次建立**時觸發。

使用 Slack [Block Kit](https://api.slack.com/block-kit) 組裝訊息：

| Block   | 內容                        |
| ------- | --------------------------- |
| Header  | 🔀 New Pull Request         |
| Section | Author + PR Title（含連結） |

若 Slack API 回應非 2xx，透過 `core.setFailed` 標記 workflow 失敗。

## Job 2：assign-and-review

在 PR **首次建立**或**重新開啟**時，自動指派負責人與審查者。

1. **Assignee**：將 PR 作者設為 assignee
2. **Reviewer**：從固定 FE reviewer 清單（`zonghan0323`、`zackweng-cm`）請求審查，並**排除作者本人**；清單過濾後為空則略過

## Job 3：notion-link

自動提取 PR 中的 Ticket ID 並連結對應的 Notion 頁面。

### 流程

1. **提取 Ticket ID**：從所有 commit messages 和 branch 名稱中，以正則 `lt-\d+` 抓取並去重
2. **查詢 Notion**：對每個 Ticket ID 呼叫 Notion Data Source API，取得頁面 URL 和標題
3. **更新 PR description**：將 Notion 連結寫入 `### ⭐️ Notion Ticket` 區塊

### `NOTION_DATA_SOURCE_ID` 補充

Notion API（`2025-09-03` 版本起）`database_id` 和 `data_source_id` 是不同概念：

- **`database_id`**：Notion database 本身的 ID
- **`data_source_id`**：database 下的子資源 ID，查詢端點 `/v1/data_sources/{id}/query` 要求此 ID

取得方式：

- **API**：`GET /v1/databases/{database_id}` → 回應中 `data_sources` 陣列
- **Notion UI**：database 設定 → Manage data sources → Copy data source ID

## Secrets 設定

所有 secrets 需在 GitHub repo **Settings → Secrets and variables → Actions** 中設定。

| Secret                  | 用途                       | 設定方式                                                                                                                |
| ----------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `SLACK_WEBHOOK_URL`     | Slack Incoming Webhook URL | [Slack API: Apps](https://api.slack.com/apps) → Incoming Webhooks → Add New Webhook to Workspace → 複製 URL             |
| `NOTION_TOKEN`          | Notion API 授權 token      | [Notion Integrations](https://www.notion.so/my-integrations) → 建立或選擇 Integration → 複製 Internal Integration Token |
| `NOTION_DATA_SOURCE_ID` | Notion Data Source ID      | 見上方「NOTION_DATA_SOURCE_ID 補充」                                                                                    |

## 參考資料

- [Slack Incoming Webhooks](https://api.slack.com/messaging/webhooks)
- [Slack Block Kit](https://api.slack.com/block-kit)
- [Data source - Notion Docs](https://developers.notion.com/reference/data-source)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
