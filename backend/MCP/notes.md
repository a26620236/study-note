# Model Context Protocol (MCP) 官方教學筆記

> 整理自 [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs/getting-started/intro)，共 4 大分類、14 篇文章。

## 目錄

- [Learning（學習）](#learning學習)
  - [What is the Model Context Protocol (MCP)?](#what-is-the-model-context-protocol-mcp)
  - [Architecture overview](#architecture-overview)
  - [Understanding MCP clients](#understanding-mcp-clients)
  - [Understanding MCP servers](#understanding-mcp-servers)
- [Development（開發）](#development開發)
  - [Build an MCP client](#build-an-mcp-client)
  - [Build an MCP server](#build-an-mcp-server)
  - [Connect to local MCP servers](#connect-to-local-mcp-servers)
  - [Connect to remote MCP Servers](#connect-to-remote-mcp-servers)
  - [SDKs](#sdks)
  - [Example Servers](#example-servers)
- [Security（安全）](#security安全)
  - [Understanding Authorization in MCP](#understanding-authorization-in-mcp)
  - [Security Best Practices](#security-best-practices)
- [Tools（工具）](#tools工具)
  - [MCP Inspector](#mcp-inspector)
  - [Example Clients](#example-clients)

---

## Learning（學習）

### What is the Model Context Protocol (MCP)?
> 原文連結：https://modelcontextprotocol.io/docs/getting-started/intro

MCP (Model Context Protocol) 是一個開源標準，用於連接 AI 應用程式與外部系統。

**核心概念**

MCP 讓 AI 應用程式（如 Claude 或 ChatGPT）能夠連接到資料來源（如本地檔案、資料庫）、工具（如搜尋引擎、計算器）和工作流程（如專門的 prompts）。可以把 MCP 想像成 AI 應用程式的 USB-C 接口——就像 USB-C 為電子裝置提供標準化連接方式，MCP 為 AI 應用程式提供連接外部系統的標準化方式。

**可實現的應用場景**

- Agents 可以存取 Google Calendar 和 Notion，作為更個人化的 AI 助理
- Claude Code 可以使用 Figma 設計生成完整的 Web 應用程式
- 企業聊天機器人可以連接組織內的多個資料庫，讓使用者透過聊天分析資料
- AI 模型可以在 Blender 上創建 3D 設計並使用 3D 印表機列印

**為什麼 MCP 很重要？**

根據生態系統中的不同角色，MCP 提供不同的價值：

- **開發者**：減少建構或整合 AI 應用程式時的開發時間和複雜度
- **AI 應用程式或 agents**：獲得存取資料來源、工具和應用程式生態系統的能力，增強功能並改善使用者體驗
- **終端使用者**：獲得更強大的 AI 應用程式，可以在必要時存取您的資料並代表您採取行動

**廣泛的生態系統支援**

MCP 是一個開放協定，獲得廣泛的 clients 和 servers 支援。AI 助理如 Claude 和 ChatGPT、開發工具如 Visual Studio Code、Cursor、MCPJam 等都支援 MCP——讓您可以一次建構，到處整合。

---

### Architecture overview
> 原文連結：https://modelcontextprotocol.io/docs/learn/architecture

本文概述 MCP 的架構，包括其範圍、核心概念，並提供範例展示各個核心概念。

**專案範圍**

MCP 包含以下專案：

- **MCP Specification**：概述 clients 和 servers 的實作需求規範
- **MCP SDKs**：不同程式語言的 SDK，實作 MCP 協定
- **MCP Development Tools**：開發工具，包括 MCP Inspector
- **MCP Reference Server Implementations**：參考實作的 MCP servers

注意：MCP 僅專注於 context 交換的協定——不規定 AI 應用程式如何使用 LLMs 或管理提供的 context。

**核心概念 - 參與者 (Participants)**

MCP 採用 client-server 架構：

- **MCP Host**：AI 應用程式，協調和管理一個或多個 MCP clients（如 Claude Code、Claude Desktop、Visual Studio Code）
- **MCP Client**：維持與 MCP server 連接的元件，為 MCP host 從 MCP server 取得 context
- **MCP Server**：提供 context 給 MCP clients 的程式

範例：Visual Studio Code 作為 MCP host，當連接到 Sentry MCP server 時，VSCode 執行時會實例化一個 MCP client 物件來維持連接。當隨後連接到另一個 MCP server（如本地檔案系統 server），VSCode 會實例化另一個 MCP client 物件來維持這個連接。

注意：MCP server 指的是提供 context 資料的程式，無論在哪裡運行。MCP servers 可以在本地或遠端執行。本地 MCP server 使用 STDIO transport（如 filesystem server），遠端 MCP server 使用 Streamable HTTP transport（如 Sentry MCP server）。

**核心概念 - 層級 (Layers)**

MCP 包含兩個層級：

1. **Data layer**：定義基於 JSON-RPC 的 client-server 通訊協定，包括生命週期管理和核心 primitives（tools、resources、prompts、notifications）
2. **Transport layer**：定義通訊機制和通道，包括特定於傳輸的連接建立、訊息框架和授權

概念上，data layer 是內層，transport layer 是外層。

**Data Layer 詳解**

Data layer 實作基於 JSON-RPC 2.0 的交換協定，定義訊息結構和語義。包括：

- **生命週期管理 (Lifecycle management)**：處理連接初始化、能力協商和連接終止
- **Server features**：讓 servers 提供核心功能，包括用於 AI 動作的 tools、用於 context 資料的 resources、用於互動模板的 prompts
- **Client features**：讓 servers 向 client 請求 LLM sampling、向使用者請求輸入、向 client 記錄訊息
- **Utility features**：支援額外能力，如用於即時更新的 notifications 和用於長時間運行操作的進度追蹤

**Transport Layer 詳解**

Transport layer 管理 clients 和 servers 之間的通訊通道和認證。處理連接建立、訊息框架和安全通訊。

MCP 支援兩種傳輸機制：

- **Stdio transport**：使用標準輸入/輸出流進行同一機器上本地程序之間的直接通訊，提供最佳性能，無網路開銷
- **Streamable HTTP transport**：使用 HTTP POST 進行 client-to-server 訊息傳遞，可選 Server-Sent Events 進行串流。支援遠端 server 通訊和標準 HTTP 認證方法，包括 bearer tokens、API keys 和自訂 headers。MCP 建議使用 OAuth 取得認證 tokens

Transport layer 將通訊細節從協定層抽象化，使所有傳輸機制都能使用相同的 JSON-RPC 2.0 訊息格式。

**Primitives（基本元件）**

MCP primitives 是 MCP 中最重要的概念。定義 clients 和 servers 可以彼此提供什麼。

MCP 定義三個 servers 可以公開的核心 primitives：

- **Tools**：AI 應用程式可以呼叫的可執行函式，用於執行動作（如檔案操作、API 呼叫、資料庫查詢）
- **Resources**：提供 contextual 資訊給 AI 應用程式的資料來源（如檔案內容、資料庫記錄、API 回應）
- **Prompts**：可重複使用的模板，幫助建構與 language models 的互動（如 system prompts、few-shot examples）

每個 primitive 類型都有相關的方法用於發現（`*/list`）、檢索（`*/get`）和在某些情況下執行（`tools/call`）。MCP clients 會使用 `*/list` 方法來發現可用的 primitives。這種設計允許列表動態變化。

具體範例：考慮一個提供資料庫 context 的 MCP server。它可以公開用於查詢資料庫的 tools、包含資料庫 schema 的 resource、以及包含與 tools 互動的 few-shot examples 的 prompt。

MCP 也定義 clients 可以公開的 primitives，讓 MCP server 作者建構更豐富的互動：

- **Sampling**：允許 servers 從 client 的 AI 應用程式請求 language model completions。當 server 作者想要存取 language model 但希望保持 model-independent 時很有用
- **Elicitation**：允許 servers 向使用者請求額外資訊。當 server 作者想要從使用者獲取更多資訊或請求確認動作時很有用
- **Logging**：讓 servers 向 clients 發送日誌訊息以進行除錯和監控

除了 server 和 client primitives，協定還提供跨領域的 utility primitives：

- **Tasks (實驗性)**：Durable execution wrappers，啟用延遲結果檢索和 MCP 請求的狀態追蹤（如昂貴的計算、工作流程自動化、批次處理、多步驟操作）

**Notifications（通知）**

協定支援即時通知以啟用 servers 和 clients 之間的動態更新。例如，當 server 的可用 tools 變更時（如新功能可用或現有 tools 被修改），server 可以發送 tool 更新通知以通知連接的 clients 這些變更。Notifications 作為 JSON-RPC 2.0 notification 訊息發送（不期望回應），讓 MCP servers 能夠向連接的 clients 提供即時更新。

---

### Understanding MCP clients
> 原文連結：https://modelcontextprotocol.io/docs/learn/client-concepts

MCP clients 由 host 應用程式實例化，用於與特定 MCP servers 通訊。Host 應用程式（如 Claude.ai 或 IDE）管理整體使用者體驗並協調多個 clients。每個 client 處理與一個 server 的直接通訊。

理解這個區別很重要：host 是使用者互動的應用程式，而 clients 是啟用 server 連接的協定級元件。

**核心 Client 功能**

除了使用 servers 提供的 context，clients 可能向 servers 提供幾個功能。這些 client 功能允許 server 作者建構更豐富的互動。

| 功能 | 說明 | 範例 |
|------|------|------|
| **Elicitation** | 讓 servers 在互動期間向使用者請求特定資訊，提供結構化方式按需收集資訊 | 預訂旅行的 server 可能會詢問使用者對機位、房型或聯絡號碼的偏好以完成預訂 |
| **Roots** | 允許 clients 指定 servers 應該專注於哪些目錄，透過協調機制傳達預期範圍 | 預訂旅行的 server 可能被授予存取特定目錄的權限，從中可以讀取使用者的行事曆 |
| **Sampling** | 允許 servers 透過 client 請求 LLM completions，啟用 agentic 工作流程。這種方法讓 client 完全控制使用者權限和安全措施 | 預訂旅行的 server 可能會將航班列表發送給 LLM，並請求 LLM 為使用者挑選最佳航班 |

**Elicitation（資訊請求）**

Elicitation 讓 servers 在互動期間向使用者請求特定資訊，創造更動態和響應式的工作流程。

Elicitation 提供結構化方式按需收集必要資訊。與其預先要求所有資訊或在資料缺失時失敗，servers 可以暫停操作以向使用者請求特定輸入。這創造了更靈活的互動，servers 適應使用者需求而非遵循僵化模式。

**Roots（目錄範圍）**

Roots 定義 server 操作的檔案系統邊界，允許 clients 指定 servers 應該專注於哪些目錄。Roots 是 clients 向 servers 傳達檔案系統存取邊界的機制。它們由檔案 URIs 組成，指示 servers 可以操作的目錄，幫助 servers 理解可用檔案和資料夾的範圍。

**Sampling（LLM 請求）**

Sampling 允許 servers 透過 client 請求 language model completions，在保持安全性和使用者控制的同時啟用 agentic 行為。Sampling 讓 servers 執行 AI 依賴的任務，而無需直接整合或支付 AI 模型。

---

### Understanding MCP servers
> 原文連結：https://modelcontextprotocol.io/docs/learn/server-concepts

MCP servers 是透過標準化協定介面向 AI 應用程式公開特定能力的程式。常見範例包括用於文件存取的檔案系統 servers、用於資料查詢的資料庫 servers、用於程式碼管理的 GitHub servers、用於團隊溝通的 Slack servers 和用於排程的行事曆 servers。

**核心 Server 功能**

Servers 透過三個構建塊提供功能：

| 功能 | 說明 | 範例 | 誰控制它 |
|------|------|------|---------|
| **Tools** | LLM 可以主動呼叫的函式，根據使用者請求決定何時使用。Tools 可以寫入資料庫、呼叫外部 APIs、修改檔案或觸發其他邏輯 | 搜尋航班<br/>發送訊息<br/>創建行事曆事件 | Model |
| **Resources** | 提供唯讀存取資訊以供 context 使用的被動資料來源，如檔案內容、資料庫 schemas 或 API 文件 | 檢索文件<br/>存取知識庫<br/>讀取行事曆 | Application |
| **Prompts** | 預建的指令模板，告訴 model 如何使用特定 tools 和 resources | 規劃假期<br/>總結我的會議<br/>起草電子郵件 | User |

**Tools（工具）**

Tools 讓 AI models 執行動作。每個 tool 定義具有類型化輸入和輸出的特定操作。Model 根據 context 請求 tool 執行。

**Resources（資源）**

Resources 提供結構化存取資訊，AI 應用程式可以檢索並作為 context 提供給 models。Resources 公開來自檔案、APIs、資料庫或 AI 需要理解 context 的任何其他來源的資料。

**Prompts（提示）**

Prompts 提供可重複使用的模板。它們允許 MCP server 作者為某個領域提供參數化 prompts，或展示如何最佳使用 MCP server。

---

## Development（開發）

### Build an MCP client
> 原文連結：https://modelcontextprotocol.io/docs/develop/build-client

本文介紹如何建立能夠整合所有 MCP servers 的 LLM 驅動 chatbot client。

**核心概念**

MCP client 是能夠連接 MCP servers 並與之通訊的應用程式。Client 負責：
- 建立與 server 的連接（透過 STDIO 或 HTTP transport）
- 列出並執行 server 提供的 tools
- 管理與 LLM（如 Claude）的對話流程
- 處理 tool calls 並將結果回傳給 LLM

---

### Build an MCP server
> 原文連結：https://modelcontextprotocol.io/docs/develop/build-server

本文透過建立天氣 server 範例，教學如何建立自己的 MCP server 並連接到 Claude for Desktop。

**核心 MCP 概念**

MCP servers 可提供三種主要能力：
1. **Resources**：類似檔案的資料，可被 clients 讀取（如 API 回應或檔案內容）
2. **Tools**：可被 LLM 呼叫的函式（需使用者批准）
3. **Prompts**：預先編寫的範本，幫助使用者完成特定任務

**重要：Logging 注意事項**

- **STDIO-based servers**：絕不能寫入 stdout（如 `print()`、`console.log()`），會破壞 JSON-RPC 訊息
- **HTTP-based servers**：可使用標準輸出 logging
- 最佳實踐：使用寫入 stderr 或檔案的 logging library

---

### Connect to local MCP servers
> 原文連結：https://modelcontextprotocol.io/docs/develop/connect-local-servers

本文說明如何透過連接本地 MCP servers 來擴展 Claude Desktop，實現檔案系統存取等強大整合功能。

**理解 MCP Servers**

MCP servers 是在電腦上執行的程式，透過標準化協定為 Claude Desktop 提供特定能力。每個 server 公開 tools，Claude 可使用這些 tools 執行操作（需使用者批准）。

---

### Connect to remote MCP Servers
> 原文連結：https://modelcontextprotocol.io/docs/develop/connect-remote-servers

本文說明如何連接 Claude 到遠端 MCP servers，透過網際網路託管的 tools 和資料來源擴展能力。

**理解 Remote MCP Servers**

Remote MCP servers 功能類似 local servers，但託管在網際網路上而非本地機器。它們公開 tools、prompts 和 resources，Claude 可用來代表你執行任務。

---

### SDKs
> 原文連結：https://modelcontextprotocol.io/docs/sdk

本文列出用於建立 Model Context Protocol 的官方 SDKs。SDKs 依功能完整性、協定支援和維護承諾分為不同等級。

**可用的 SDKs**

| SDK | Repository | Tier |
|-----|-----------|------|
| TypeScript | [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) | Tier 1 |
| Python | [modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk) | Tier 1 |
| C# | [modelcontextprotocol/csharp-sdk](https://github.com/modelcontextprotocol/csharp-sdk) | Tier 1 |
| Go | [modelcontextprotocol/go-sdk](https://github.com/modelcontextprotocol/go-sdk) | Tier 1 |
| Java | [modelcontextprotocol/java-sdk](https://github.com/modelcontextprotocol/java-sdk) | Tier 2 |
| Rust | [modelcontextprotocol/rust-sdk](https://github.com/modelcontextprotocol/rust-sdk) | Tier 2 |
| Swift | [modelcontextprotocol/swift-sdk](https://github.com/modelcontextprotocol/swift-sdk) | Tier 3 |
| Ruby | [modelcontextprotocol/ruby-sdk](https://github.com/modelcontextprotocol/ruby-sdk) | Tier 3 |
| PHP | [modelcontextprotocol/php-sdk](https://github.com/modelcontextprotocol/php-sdk) | Tier 3 |
| Kotlin | [modelcontextprotocol/kotlin-sdk](https://github.com/modelcontextprotocol/kotlin-sdk) | TBD |

---

### Example Servers
> 原文連結：https://modelcontextprotocol.io/examples

本文列出各種 Model Context Protocol (MCP) servers 範例，展示協定的能力和多功能性。

**Reference Implementations**

官方 reference servers 展示核心 MCP 功能和 SDK 使用方式：
- **Everything**：包含 prompts、resources 和 tools 的參考/測試 server
- **Fetch**：網頁內容抓取和轉換，提供高效的 LLM 使用
- **Filesystem**：具可設定存取控制的安全檔案操作
- **Git**：讀取、搜尋和操作 Git repositories 的工具
- **Memory**：基於 knowledge graph 的持久記憶系統

---

## Security（安全）

### Understanding Authorization in MCP
> 原文連結：https://modelcontextprotocol.io/docs/tutorials/security/authorization

**概述**

Model Context Protocol (MCP) 的 Authorization 機制用於保護 MCP server 的敏感資源和操作。MCP 使用標準化的 authorization flow，遵循 OAuth 2.1 規範。

**何時應該使用 Authorization**

雖然 Authorization 是可選的，但強烈建議在以下情況使用：
- Server 存取用戶特定資料
- 需要審計追蹤
- Server 授予需要用戶同意的 API 存取權限
- 企業環境下需要嚴格的存取控制
- 需要實現每個用戶的速率限制或使用追蹤

**Authorization Flow 步驟**

1. **初始握手**：Server 回應 401 Unauthorized，告知 client 如何取得 authorization 資訊
2. **Protected Resource Metadata 探索**：Client 獲取 PRM document
3. **Authorization Server 探索**：Client 取得 authorization server 的 endpoint 資訊
4. **Client 註冊**：預先註冊或動態註冊
5. **用戶授權**：用戶登入並授予權限
6. **發送已驗證的請求**：Client 使用 access token 向 MCP server 發送請求

---

### Security Best Practices
> 原文連結：https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices

本文件為 Model Context Protocol (MCP) 提供安全考量，主要識別 MCP 實作中的安全風險、攻擊向量和最佳實踐。

**主要攻擊向量與防護措施**

1. **Confused Deputy Problem（混淆代理問題）**
   - 防護：實作 per-client consent 和適當的安全控制

2. **Token Passthrough（Token 穿透）**
   - 防護：MCP servers 絕對不能接受任何非專門為其簽發的 tokens

3. **Server-Side Request Forgery (SSRF)**
   - 防護：強制使用 HTTPS、阻擋私有 IP 範圍、驗證 Redirect 目標

4. **Session Hijacking（Session 劫持）**
   - 防護：使用安全的 session IDs、將 session 綁定到用戶資訊

5. **Local MCP Server Compromise（本地 MCP Server 入侵）**
   - 防護：實作 pre-configuration consent、sandboxing

6. **Scope Minimization（Scope 最小化）**
   - 防護：實作漸進式、最小權限 scope 模型

---

## Tools（工具）

### MCP Inspector
> 原文連結：https://modelcontextprotocol.io/docs/tools/inspector

MCP Inspector 是一個互動式開發工具，專門用於測試和除錯 Model Context Protocol servers。

**主要功能**

1. **Server Connection Pane（連線面板）**：選擇連接 server 的 transport 方式
2. **Resources Tab（資源標籤）**：列出所有可用的 resources
3. **Prompts Tab（提示標籤）**：顯示可用的 prompt templates
4. **Tools Tab（工具標籤）**：列出可用的 tools
5. **Notifications Pane（通知面板）**：呈現從 server 記錄的所有日誌

**安裝與使用**

```bash
# 直接透過 npx 執行
npx @modelcontextprotocol/inspector <command>

# 檢查 npm 套件
npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem /path

# 檢查 PyPI 套件
npx @modelcontextprotocol/inspector uvx mcp-server-git --repository ~/code/repo
```

---

### Example Clients
> 原文連結：https://modelcontextprotocol.io/clients

此頁面展示支援 Model Context Protocol (MCP) 的應用程式。

**主要 Client 範例**

1. **Claude Desktop App**：提供全面的 MCP 支援，實現與本地工具和資料來源的深度整合
2. **Claude.ai**：Anthropic 的網頁版 AI 助理，提供遠端 servers 的 MCP 支援
3. **VS Code GitHub Copilot**：透過 agent mode 將 MCP 與 GitHub Copilot 整合
4. **Cursor**：AI 程式碼編輯器，在 Cursor Composer 中支援 MCP tools
5. **Cline**：VS Code 中的自主編碼代理
6. **Continue**：開源 AI 程式碼助理，內建支援 MCP Tools、Resources、Prompts 和 Apps
7. **Zed**：高效能程式碼編輯器，內建 MCP 支援
8. **ChatGPT**：OpenAI 的 AI 助理，為遠端 servers 提供 MCP 支援
9. **LM Studio**：跨平台桌面應用程式，用於在本地執行開源 LLMs

---

