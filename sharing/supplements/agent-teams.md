# Agent Teams

## 什麼是 Agent Teams？

Agent Teams 是 **Claude Code** 的實驗性多代理協作機制。一個任務由多個 Claude 實例（agents）同時執行，各自擁有獨立的 context window，並透過共享任務清單協調分工，最後由一個 Team Lead 整合所有結果。

**Claude Cowork** 也能使用 Agent Teams，因為 Cowork 底層整合了 Claude Code 的代理能力，本質上是同一套機制透過不同介面呈現：

| | Claude Code | Claude Cowork |
|---|---|---|
| 介面 | 終端機 CLI | Desktop GUI |
| Agent Teams | ✓ 需手動啟用 | ✓ 透過 Claude Code 整合取得 |
| 目標用戶 | 開發者 | 知識工作者 |

---

## 核心概念

### 單代理 vs. Agent Teams

| | 單代理 | Agent Teams |
|---|---|---|
| 執行方式 | 依序完成每個子任務 | 多個代理同時平行執行 |
| 速度 | 受 context 長度限制 | 約為單代理的 1/N 時間 |
| Token 消耗 | 基準 | 約 N 倍（N = 代理數） |
| 適合任務 | 有依賴順序的工作 | 可平行切分的工作 |

---

## 架構

```
使用者
  │
  ▼
Team Lead（主代理）
  │  ← 協調分工、整合結果
  ├── Sub-Agent 1  →  執行任務 A
  ├── Sub-Agent 2  →  執行任務 B
  └── Sub-Agent 3  →  執行任務 C
        │
        ▼
   Shared Task List（共享任務清單）
   ← 代理認領任務，避免重複執行 →
```

### 三個角色說明

**Team Lead**
- 接收使用者指令，將任務拆解成子任務
- 將子任務寫入共享清單
- 等待所有代理完成後，整合輸出結果
- 使用者可直接與 Team Lead 對話

**Sub-Agents**
- 從共享清單認領未被分配的任務
- 各自擁有獨立的 context window（互不干擾）
- 完成後將結果回傳 Team Lead
- 使用者也可直接和個別 Sub-Agent 溝通

**Shared Task List**
- 所有代理都能讀寫的清單
- 透過「認領」機制防止兩個代理重複做同一件事
- 類似多人協作的 Kanban board

---

## 適合 vs. 不適合的任務

### 適合 Agent Teams
- 任務可以切分成**彼此獨立**的工作項目
- 每個子任務需要閱讀大量資料（避免單一 context 塞滿）
- 需要「平行假設驗證」（如多方向 debug）

**範例：**
- 同時分析 5 份報告 → 5 個代理各讀一份
- 平行實作 3 個不同功能模組
- 競爭對手研究（每個代理研究一家公司）

### 不適合 Agent Teams
- 任務有嚴格的執行順序（B 必須在 A 之後）
- 任務很小、幾分鐘內能完成
- 預算有限（Token 消耗會成倍增加）

---

## 啟用方式

Agent Teams 預設關閉，需手動開啟：

```json
// settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "true"
  }
}
```

或設定環境變數：

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=true
```

---

## 費用注意

每個 Sub-Agent 各自維護一個完整的 context window，Token 用量隨代理數量等比增加：

| 代理數 | 預估 Token 消耗倍數 |
|--------|-----------------|
| 1 | 1x（基準） |
| 2 | ~2x |
| 4 | ~3–4x |
| 8 | ~7–8x |

建議只在任務規模大、可明顯節省時間時才啟用。
