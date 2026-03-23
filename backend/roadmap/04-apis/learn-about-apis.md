# APIs

## 簡介

API (Application Programming Interface) defines rules and protocols for software applications to communicate. Provides standardized access to functionalities without understanding internal workings. Includes endpoints, request methods (GET, POST, PUT), and data formats (JSON, XML).

## 學習資源

### 文章

#### 1. What is an API?
> 原文：[https://aws.amazon.com/what-is/api/](https://aws.amazon.com/what-is/api/)

**API 的基本概念**

API（Application Programming Interface）是兩個軟體元件使用一套定義和協議進行通訊的機制。遵循**客戶端-伺服器模式**：客戶端發送請求，伺服器提供回應。

**API 的主要類型**

| 類型 | 特徵 | 用途 |
|------|------|------|
| **SOAP APIs** | 使用 XML 格式交換訊息 | 傳統企業應用 |
| **RPC APIs** | 遠端程序呼叫 | 執行伺服器端函數 |
| **REST APIs** | 使用 HTTP 和標準方法（GET、POST 等） | 現代網路應用（最常見） |
| **WebSocket APIs** | 支援雙向通訊 | 即時資料更新 |

**按應用範圍分類**
- **Private APIs**：限企業內部使用
- **Public APIs**：開放供任何人使用
- **Partner APIs**：僅授權外部開發者存取
- **Composite APIs**：結合多個 API 以滿足複雜需求

**API 的主要優勢**

| 優勢 | 說明 |
|------|------|
| **整合** | 利用現有程式碼，加快開發速度 |
| **創新** | 透過 API 層面修改，無需重寫整個程式 |
| **擴展** | 跨平台提供服務 |
| **易於維護** | API 作為系統間的閘道，降低相互影響 |

**API 安全機制**

1. **Authentication Tokens（認證令牌）**：驗證使用者身份和權限
2. **API Keys（API 金鑰）**：識別進行 API 呼叫的程式，便於追蹤使用

**API 端點（Endpoints）**

API 端點是系統中資訊雙向傳遞的最終接觸點，包括伺服器 URL 和服務位置。
- 🔒 **安全性**：容易成為攻擊目標，需要監控
- ⚡ **效能**：高流量端點可能造成系統瓶頸

**API 開發的五個步驟**
1. **規劃**：使用 OpenAPI 等規範建立藍圖
2. **建置**：使用樣板程式碼製作原型
3. **測試**：檢查錯誤並進行安全性測試
4. **文件化**：提供詳細使用指南
5. **行銷**：在 API 市場上列出以獲利

**GraphQL**

專為 API 開發的查詢語言，相比 REST 的優勢是「給客戶端提供精確所需資料，不多不少」，使應用開發更快速。

**AWS 相關服務**
- **Amazon API Gateway**：完全託管的 API 管理服務
- **AWS AppSync**：專門用於 GraphQL API 的託管服務

### 影片

- [What is an API (in 5 minutes)](https://www.youtube.com/watch?v=ByGJQzlzxQg)
- [daily.dev API Feed](https://app.daily.dev/tags/rest-api)

### 其他資源

- [Visit the Dedicated API Design Roadmap](https://roadmap.sh/api-design)
- [Visit the Dedicated API Security Best Practices](https://roadmap.sh/api-security-best-practices)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
