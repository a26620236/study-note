---
description: 根據當前變更產出符合規範的 commit message
---

# PR Commit Msg

偵測當前 git 變更，根據團隊 commit 規範產出 commit message。**不自動 commit、不自動 push。**

---

## 執行流程

### 1. 取得變更

先檢查是否有 staged changes：

```bash
git diff --staged --name-only
git diff --staged
```

若**有 staged changes**：只針對 staged 的檔案產出 message。

若**沒有 staged changes**：改看所有未 commit 的變更：

```bash
git diff --name-only
git diff
git status
```

若完全沒有任何變更，提示：

```
❌ 沒有任何變更，無法產出 commit message。
```

### 2. 取得 Ticket Number

從當前 branch 名稱擷取 LT 編號：

```bash
git rev-parse --abbrev-ref HEAD
```

branch 含 `LT-XXXX` → 使用該編號；否則不加 ticket。

### 3. 產出 Commit Message

依照 `CLAUDE.md` 的 commit 規範：

```
<type>: <description> #<ticket-id>
```

**Types 判斷規則**：

| Type       | 使用時機                         |
| ---------- | -------------------------------- |
| `feat`     | 新增功能、新元件、新頁面         |
| `fix`      | 修正 bug、錯誤行為               |
| `refactor` | 重構（不影響行為）               |
| `chore`    | 設定檔、build 工具、非功能性雜項 |
| `test`     | 新增或修改測試                   |
| `docs`     | 文件、註解、README               |

**Description 規則**：

- 使用英文、**祈使句**（`add` 不是 `added`、`fix` 不是 `fixed`）
- 說明 WHAT changed，不是 HOW
- 小寫開頭

**Ticket 規則**：

- branch 含 `LT-XXXX` → 加 `#LT-XXXX`
- 無法擷取 → 不加 ticket

**判斷範例**：

| 變更內容               | Message                                                   |
| ---------------------- | --------------------------------------------------------- |
| 新增 UserTable 元件    | `feat: add UserTable component #LT-3111`                  |
| 修正日期格式顯示錯誤   | `fix: correct date format display #LT-3111`               |
| 把邏輯移到 custom hook | `refactor: extract filter logic to useXxxFilter #LT-3111` |
| 更新 pr-plan command   | `chore: update pr-plan design principles #LT-3111`        |

### 4. 輸出結果

直接在對話中輸出 commit message，供使用者複製使用：

```
📝 Commit Message：

<type>: <description> #LT-XXXX
```

若變更涵蓋多個獨立範疇，輸出多條建議並說明各自對應哪些檔案：

```
📝 建議拆成 2 個 commits：

1. feat: add xxx component #LT-XXXX
   → src/components/Xxx/

2. chore: update pr-plan command #LT-XXXX
   → .claude/commands/
```

---

## 禁止行為

1. **禁止自動執行 git commit** — 只產出 message，不動 git
2. **禁止自動 push** — 使用者自行決定何時 push
