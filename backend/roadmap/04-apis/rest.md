# REST

## 簡介

REST API is an architectural style using standard HTTP methods (GET, POST, PUT, DELETE) to interact with URI-represented resources. It's stateless, requiring complete request information, uses HTTP status codes, and typically communicates via JSON/XML. Popular for simplicity and scalability.

## 學習資源

### 文章

#### 1. What is a REST API?
> 原文：[https://www.redhat.com/en/topics/api/what-is-a-rest-api](https://www.redhat.com/en/topics/api/what-is-a-rest-api)

**REST 定義**

REST（Representational State Transfer）是一組關於如何建構 Web API 的**架構約束**，不是協議也不是標準。當客戶端透過 RESTful API 發出請求時，會將資源狀態的「表示」傳送給請求方。

**常見的回應格式**
- JSON（最受歡迎，語言無關且人機可讀）
- HTML、XLT、Python、PHP、純文本

**RESTful API 的六大約束**

| 約束 | 說明 |
|------|------|
| **Client-Server** | 客戶端與伺服器分離，透過 HTTP 管理請求 |
| **Stateless** | 無狀態通訊，每個請求獨立且不保存客戶端資訊 |
| **Cacheable** | 回應可被快取，優化客戶端-伺服器互動 |
| **Uniform Interface** | 統一介面，包含：資源可識別、透過表示操作資源、自描述訊息、HATEOAS |
| **Layered System** | 分層系統（安全、負載均衡等），客戶端不可見 |
| **Code-on-Demand**（可選） | 伺服器可向客戶端發送可執行程式碼 |

**REST vs SOAP**
- SOAP 有特定要求（XML 訊息、內建安全和事務合規），較慢且沉重
- REST 是一組可按需實作的指南，更快速、輕量、可擴展
- REST 適合 IoT 和行動應用開發

---

#### 2. Best practices for RESTful web API design
> 原文：[https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)

**RESTful API 設計核心原則**

RESTful web API 遵循 REST 架構原則，實現無狀態、鬆耦合的客戶端與服務接口。主要原則：
- **平台獨立性**：使用 HTTP 標準協議，支援 JSON/XML 等資料格式
- **鬆耦合**：客戶端和服務可獨立演化，互不依賴內部實作

**RESTful API 設計概念**

| 概念 | 說明 |
|------|------|
| **URI** | 唯一識別資源的路徑 (如 `/orders/1`) |
| **Resource Representation** | 資源的編碼格式 (JSON/XML) |
| **Uniform Interface** | 使用標準 HTTP 動詞 (GET/POST/PUT/DELETE) |
| **Stateless** | 每個請求獨立，不保留狀態 |
| **Hypermedia Links** | 回應包含相關資源連結 (HATEOAS) |

**Resource URI 設計規範**

- 使用名詞而非動詞：`/orders` ✅ vs `/create-order` ❌
- 使用複數名詞表示集合：`/customers` 表示客戶集合
- 保持 URI 簡潔：避免超過 3 層深度
- 避免鏡像資料庫結構：API 應抽象化內部實作

**HTTP 方法約定**

| 方法 | 集合 (/customers) | 單一項目 (/customers/1) |
|------|------------------|----------------------|
| **GET** | 檢索所有項目 | 檢索單一項目 |
| **POST** | 創建新項目 | Error |
| **PUT** | 批量更新 | 更新或創建項目 |
| **DELETE** | 移除所有項目 | 移除單一項目 |

**重要特性**

- **Idempotent（冪等性）**：PUT 和 DELETE 應為冪等操作
- **狀態碼使用**：201 Created、404 Not Found、409 Conflict
- **非同步處理**：長時間操作返回 202 Accepted，提供狀態查詢端點
- **分頁與篩選**：使用 query parameters (`limit`, `offset`, `filter`)
- **版本控制**：URI 版本、Query string、Header 或 Media type 版本控制

**HATEOAS 實作**

回應包含可用操作的超連結：
```json
{
  "orderID":3,
  "links": [
    {"rel":"customer", "href":"/customers/3", "action":"GET"},
    {"rel":"self", "href":"/orders/3", "action":"PUT"}
  ]
}
```

---

#### 3. Roy Fielding's dissertation chapter, Representational State Transfer (REST)
> 原文：[https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
> 替代來源：[REST APIs must be hypertext-driven](https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven)

⚠️ 原始論文 URL 已無法訪問（403 Forbidden），以下整理自 Fielding 本人的部落格文章

**Fielding 對 REST API 的核心規則**

Fielding 強調：如果 API 不是由超文本驅動應用狀態（HATEOAS），就**不能稱為 REST API**。

**真正的 REST API 必須遵守的規則：**

1. **協議無關**：不依賴單一通訊協議，任何使用 URI 識別的協議元素都必須允許任何 URI scheme
2. **不修改通訊協議**：不應包含對標準協議的任何更動（填補未定義細節除外）
3. **以 Media Type 為中心**：幾乎所有描述工作應專注於定義用於表示資源和驅動應用狀態的 media type
4. **不固定資源名稱或層級結構**：伺服器必須自由控制其命名空間，透過 media type 和 link relation 指導客戶端建構 URI
5. **無「型別化」資源**：客戶端唯一關心的型別是當前表示的 media type 和標準化的 relation name
6. **僅需初始 URI 進入**：客戶端只需知道初始 URI（書籤）和一組標準化 media type，此後所有狀態轉換都由伺服器提供的超連結選擇驅動

**常見誤解**
- 許多所謂的「REST API」其實是 RPC（如只是基於 HTTP 的介面）
- 如果客戶端需要帶外資訊（out-of-band information）才能使用 API，那就不是 REST

---

#### 4. Learn REST: A RESTful Tutorial
> 原文：[https://restapitutorial.com/](https://restapitutorial.com/)

**REST 的主要概念**

REST (Representational State Transfer) 是一種革命性的 API 設計方式，使系統間能夠無縫通訊。

**學習路徑**
- **入門階段**：REST 基礎概念
- **核心內容**：HTTP Methods、Resource Naming、Idempotence
- **進階應用**：Advanced API Design、Generative AI 整合

**最佳實踐**
- **安全性**：健全的 authentication、authorization 和 governance
- **設計質量**：強調 API 架構的可靠性和效能
- **文檔完整性**：完整文檔的 API 對 GenAI 交付業務價值至關重要

### 影片

- [What is a REST API?](https://www.youtube.com/watch?v=-mN3VyJuCjM)
- [REST API Best Practices – REST Endpoint Design](https://www.youtube.com/watch?v=1Wl-rtew1_E)
- [Explore top posts about REST API](https://app.daily.dev/tags/rest-api?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
