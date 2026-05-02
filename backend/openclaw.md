# OpenClaw（龍蝦 AI）

## 簡介

OpenClaw 是 2026 年最火紅的開源 AI Agent 框架，由奧地利開發者 **Peter Steinberger**（PSPDFKit 創辦人）於 2025 年 11 月發布。它不只是聊天機器人，而是具備「行動力」的 AI 代理人 — 能直接操控你的電腦、讀寫檔案、執行程式碼、管理 Email，形同一位 24 小時不休息的數位員工。

> 2026 年工程師圈的問候語從「你用哪個大模型？」變成了「**你養龍蝦了嗎？**」

**名稱演變：** Clawdbot → Moltbot（2026/01/27，因 Anthropic 商標爭議改名）→ OpenClaw（2026/01/30 定名）

**爆紅數據：**
- GitHub Star 數：短短數月突破 **27 萬**+
- 超過 200 萬人次造訪
- 直接導致 Apple Mac mini M4 缺貨（工程師用來 24 小時跑 Agent）

---

## 一、OpenClaw 核心概念

### 1.1 它和 ChatGPT 有什麼不同？

| 特性 | 傳統聊天機器人（ChatGPT） | AI Agent（OpenClaw） |
|------|-------------------------|---------------------|
| 互動方式 | 一問一答 | 自主規劃、多步驟執行 |
| 能力邊界 | 限於對話框內 | 可操控電腦、瀏覽器、API |
| 記憶 | 對話結束即遺忘 | 持久記憶，跨對話累積 |
| 工具使用 | 有限 plugin | 透過 MCP 連接 500+ 工具 |
| 運行位置 | 雲端 | **本地端**（你的電腦） |
| 自主性 | 被動回應 | 主動執行任務鏈 |

### 1.2 定位：AI Agent 的「作業系統」

```
┌─────────────────────────────────────────────────┐
│                 使用者（你）                       │
│          透過通訊平台下達自然語言指令               │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              OpenClaw Gateway                    │
│          （中央控制平面，Port 18789）              │
│    ┌──────────┬──────────┬──────────────┐       │
│    │ Control  │ WebChat  │   Channel    │       │
│    │   UI     │ 介面     │   Router     │       │
│    └──────────┴──────────┴──────────────┘       │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   ┌─────────┐ ┌────────┐ ┌────────┐
   │  Agent  │ │ Tools  │ │ Model  │
   │ 理解意圖 │ │ MCP    │ │  LLM   │
   │ 規劃步驟 │ │ 連接   │ │ 推理   │
   └─────────┘ └────────┘ └────────┘
```

---

## 二、三層解耦架構

OpenClaw 採用「**代理 — 工具 — 模型**」三層分離設計：

### 2.1 架構總覽

| 層級 | 角色 | 說明 |
|------|------|------|
| **Gateway** | 中央控制平面 | 管理 Session、Channel 路由、工具分發、事件處理 |
| **Node** | 設備執行端 | 在本地端實際執行操作（檔案系統、瀏覽器、Shell） |
| **Channel** | 消息接入層 | 接入 WhatsApp、Telegram、Slack、Discord 等 50+ 通訊平台 |

三層透過 **WebSocket 總線** 通信，彼此解耦。

### 2.2 Agent — Tools — Model

```
┌──────────────────────────────────────────┐
│            Agent Layer（代理層）            │
│   理解使用者意圖 → 拆解任務 → 規劃步驟      │
└────────────────────┬─────────────────────┘
                     │ 呼叫工具
                     ▼
┌──────────────────────────────────────────┐
│           Tools Layer（工具層）             │
│   透過 MCP 協議連接外部服務與資料來源         │
│   Gmail / Slack / GitHub / PostgreSQL    │
│   瀏覽器 / 檔案系統 / Shell / API         │
└────────────────────┬─────────────────────┘
                     │ 調用推理
                     ▼
┌──────────────────────────────────────────┐
│           Model Layer（模型層）             │
│   實際進行推理運算的 LLM                    │
│   Claude / GPT / DeepSeek / Gemini      │
└──────────────────────────────────────────┘
```

---

## 三、記憶體系統

OpenClaw 的殺手級特色之一 — **持久記憶**，分為三個層級：

| 記憶層級 | 儲存位置 | 用途 | 類比 |
|---------|---------|------|------|
| **Short-Term Memory** | Redis | 當前對話上下文 | 工作桌面上的便條紙 |
| **Working Memory** | PostgreSQL | 任務進行中的狀態 | 筆記本裡的待辦清單 |
| **Knowledge Memory** | Vector DB（Qdrant / Pinecone） | 長期知識、歷史偏好 | 你的大腦長期記憶 |

**效果：** 你上週告訴龍蝦的偏好，下週它還記得。跨對話、跨任務持續累積對你的理解。

---

## 四、Skill 系統（技能包）

### 4.1 什麼是 Skill？

Skill 是 OpenClaw 的擴展單元，每個 Skill 是一個資料夾，包含 `SKILL.md` 元資料檔和工具使用指令。

```
my-skill/
├── SKILL.md          # 元資料：名稱、描述、使用方式
├── tools/            # MCP 工具定義
└── prompts/          # 提示詞模板
```

**優先級順序：** Workspace Skills > Global Skills > Bundled Skills

### 4.2 ClawHub — Skill 市集

類似 npm 或 VS Code Extension Marketplace，ClawHub 提供超過 5,400+ 個社群技能包：

| 分類 | Skill 數量 | 代表性 Skill |
|------|-----------|-------------|
| **Coding Agents & IDEs** | 1,184 | Code Review、Refactor Agent |
| **Web & Frontend** | 919 | Agent Browser（最高評分） |
| **Data & Analytics** | 600+ | SQL Agent、Data Pipeline |
| **DevOps & Infra** | 500+ | K8s Manager、CI/CD Agent |
| **Communication** | 400+ | Email Drafter、Meeting Notes |

### 4.3 安全注意事項（ClawHavoc 事件）

2026 年 1 月底，安全研究機構發現 ClawHub 上有 **341 個惡意 Skill** 透過仿冒名稱散布，內藏反向 Shell 腳本。

**因應措施：**
- 2026/02/07 與 VirusTotal 合作建立自動掃描機制
- 移除 2,419 個可疑 Skill
- 新增 Skill 簽章驗證機制

> 安裝 Skill 前務必確認來源可信度，類似 npm 套件的供應鏈攻擊風險。

---

## 五、MCP 整合（Model Context Protocol）

MCP 是 OpenClaw 連接外部工具的核心協議：

```
OpenClaw Agent
     │
     │ MCP 協議（標準化工具呼叫介面）
     │
     ├── Gmail MCP Server → 讀寫 Email
     ├── Slack MCP Server → 發送訊息
     ├── GitHub MCP Server → 管理 PR / Issue
     ├── PostgreSQL MCP Server → 查詢資料庫
     ├── Chrome DevTools MCP → 操控瀏覽器
     ├── File System MCP → 讀寫檔案
     └── ... 500+ 工具
```

**設定方式：** 瀏覽 MCP Server 目錄 → 提供 API Key 或 OAuth 憑證 → 用自然語言描述自動化流程，不需要寫整合程式碼。

---

## 六、工程師如何用 OpenClaw 輔助軟體開發

### 6.1 開發場景應用

| 場景 | 說明 | 實際用途 |
|------|------|---------|
| **Code Review** | Agent 自動審查 PR | 針對 commit 或 PR 跑程式碼審查，產出改善建議 |
| **自動化重構** | 跨文件批量修改 | 大規模 rename、模式遷移、框架升級 |
| **Bug 調查** | 自主閱讀日誌 + 程式碼 | 分析 error log → 定位問題檔案 → 提出修復方案 |
| **測試生成** | 自動撰寫測試案例 | 讀取原始碼 → 產生單元 / 整合測試 |
| **文件生成** | 自動產出技術文件 | 讀取程式碼 → 產出 API 文件、架構說明 |
| **CI/CD 管理** | 監控 Pipeline | 偵測失敗 → 分析原因 → 嘗試修復或通知 |
| **資料庫操作** | 透過 SQL Agent | 自然語言查詢資料庫、產生報表 |
| **瀏覽器自動化** | Agent Browser | 操作瀏覽器填表單、擷取資料、錄製效能追蹤 |

### 6.2 典型開發工作流

```
工程師（透過 Slack / Terminal）
    │
    │  「幫我 review 昨天的 PR #142，
    │    特別注意安全性和效能問題」
    │
    ▼
OpenClaw Agent
    │
    ├── 1. 透過 GitHub MCP 拉取 PR #142 的 diff
    ├── 2. 分析每個檔案的變更
    ├── 3. 用 LLM 做安全性 / 效能分析
    ├── 4. 在 PR 上留下 review comments
    └── 5. 透過 Slack 回報：「Review 完成，發現 2 個潛在問題」
```

### 6.3 Coding Plan 方案

OpenClaw 典型用法是 7×24 小時全天運行，各大 LLM 廠商推出專屬 Coding Plan：

| 方案 | 特色 | 適用場景 |
|------|------|---------|
| **Anthropic Coding Plan** | Claude 模型最佳化 | 複雜推理、長程式碼理解 |
| **OpenAI Coding Plan** | GPT 系列 | 通用開發任務 |
| **DeepSeek Coding Plan** | 性價比高 | 成本敏感的團隊 |

> 根據任務特點自由切換模型 — 簡單任務用便宜模型，複雜推理切換高階模型。

---

## 七、生態系統變體

針對不同場景，社群發展出多個輕量變體：

| 變體 | 語言 | 特色 | 適用場景 |
|------|------|------|---------|
| **OpenClaw**（本體） | Node.js | 功能最完整 | 標準部署 |
| **NanoClaw** | — | 安全沙箱，約 400MB 記憶體 | 企業安全環境 |
| **PicoClaw** | Go | 更輕量 | 資源受限裝置 |
| **ZeroClaw** | Rust | 啟動 < 10ms | 高效能需求 |
| **NullClaw** | Zig | 記憶體 < 1MB | 極致輕量 / 嵌入式 |

---

## 八、安裝與部署

### 8.1 基本安裝（Node.js）

```bash
# 前置需求：Node.js 18+
npm install -g openclaw

# 啟動 Gateway
openclaw start

# 預設 Control UI：http://localhost:18789
```

### 8.2 Docker 部署（推薦）

```bash
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/data \
  -e LLM_PROVIDER=anthropic \
  -e LLM_API_KEY=your-api-key \
  openclaw/openclaw:latest
```

### 8.3 Windows 部署（WSL2 + Docker）

```bash
# 1. 啟用 WSL2
wsl --install

# 2. 安裝 Docker Desktop（啟用 WSL2 後端）

# 3. 在 WSL2 中執行 Docker 部署
docker run -d --name openclaw ...
```

---

## 九、安全與風險

### 9.1 主要風險

| 風險 | 說明 | 防禦建議 |
|------|------|---------|
| **Skill 供應鏈攻擊** | 惡意 Skill 植入後門 | 只安裝可信來源、檢查 Skill 簽章 |
| **過度權限** | Agent 擁有系統完整控制權 | 使用沙箱環境（NanoClaw）、限制檔案系統存取範圍 |
| **API Key 洩漏** | 環境變數中的 Key 被存取 | 使用 Secret Manager、最小權限原則 |
| **Prompt Injection** | 惡意內容注入指令 | 輸入過濾、分離信任層級 |
| **資料外洩** | 本地資料被送往外部 LLM | 使用本地模型（Ollama）或企業 API |

### 9.2 最佳實踐

- **最小權限原則**：只授予 Agent 完成任務所需的最少權限
- **沙箱運行**：生產環境使用 NanoClaw 或 Docker 隔離
- **審計日誌**：開啟完整操作日誌，定期 review Agent 行為
- **敏感資料隔離**：不要讓 Agent 存取含有機密的目錄
- **模型選擇**：涉及機密資料時考慮使用本地模型

---

## 十、OpenClaw vs 其他 AI Agent 工具

| 特性 | OpenClaw | Claude Code | GitHub Copilot | Cursor |
|------|----------|-------------|----------------|--------|
| **定位** | 通用 AI Agent | 開發者 CLI Agent | 程式碼補全 + Agent | AI IDE |
| **運行位置** | 本地 | 本地 | 雲端 | 本地 + 雲端 |
| **開源** | ✓（MIT） | ✗ | ✗ | ✗ |
| **通訊平台整合** | 50+ 平台 | Terminal | IDE 內 | IDE 內 |
| **非開發任務** | ✓（Email、排程等） | ✗ | ✗ | ✗ |
| **MCP 支援** | 500+ 工具 | ✓ | 有限 | ✓ |
| **記憶系統** | 三層持久記憶 | 檔案式 Memory | ✗ | 有限 |
| **適合場景** | 全方位自動化 | 軟體開發 | 程式碼撰寫 | 程式碼撰寫 |

---

## 學習資源

### 文章
- [OpenClaw 完整介紹 — Ai.com.tw](https://ai.com.tw/openclaw-complete-introduction/)
- [OpenClaw Architecture & Setup Guide](https://vallettasoftware.com/blog/post/openclaw-2026-guide)
- [OpenClaw + MCP 終極指南](https://skywork.ai/skypage/en/ultimate-guide-openclaw-mcp/2037093913304317952)
- [ClawHub 精選 Skill 推薦：9 大職能場景](https://tenten.co/learning/clawhub-skills-pick/)
- [OpenClaw 34 個場景全拆解](https://zhuanlan.zhihu.com/p/2012240792371098520)
- [OpenClaw Wikipedia](https://en.wikipedia.org/wiki/OpenClaw)

### 影片
- [OpenClaw + Chrome DevTools MCP 實戰](https://medium.com/@tentenco/openclaw-chrome-devtools-mcp-how-to-give-your-local-agent-full-browser-control-a4e7c723a649)

### 官方資源
- [GitHub — openclaw/openclaw](https://github.com/openclaw/openclaw)
- [ClawHub Skill 市集](https://github.com/VoltAgent/awesome-openclaw-skills)

---

> 整理自多方技術文件，涵蓋 OpenClaw 核心架構、Skill 系統、MCP 整合、開發場景應用及安全實踐（2026/04）
