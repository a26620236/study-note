# Backend Development

## 簡介

Backend development focuses on the server-side logic of a web application, handling data storage, processing, and security. It involves building and maintaining the infrastructure that powers the user-facing frontend, ensuring seamless communication between the client and the database. This includes tasks like creating APIs, managing databases, and implementing authentication and authorization mechanisms.

## 學習資源

### 文章

#### 1. What is backend? A comprehensive intro to server-side development
> 原文：https://alokai.com/blog/what-is-backend

**Backend 的定義**

Backend（伺服器端）是任何網路應用程式的骨幹。它負責伺服器、應用程式和資料庫的運作，確保前端能正常發揮功能。Backend 處理商業邏輯、資料庫互動、身份驗證等核心功能。

**Backend 的主要職責**
- **資料庫互動**：存儲、檢索和管理應用程式使用的資料
- **伺服器邏輯**：執行伺服器端指令碼並管理應用程式工作流程
- **應用程式工作流程**：確保應用程式平順運行，處理使用者請求並返回適當回應

**Backend 的關鍵組件**

| 組件 | 說明 |
|------|------|
| **伺服器 (Servers)** | 管理來自客戶端的請求、處理並返回回應，充當使用者與資料的橋樑 |
| **資料庫 (Databases)** | MySQL、PostgreSQL、MongoDB、Redis 等，存儲和管理資料 |
| **APIs** | 應用程式介面，前後端之間的橋樑，實現無縫通訊和資料交換 |

**Backend 開發的重要性**

1. **應用程式功能與效能**：確保應用程式即使在高用戶負載下也能高效運作
2. **資料完整性與安全性**：保護敏感資料、驗證使用者身份、防止安全威脅
3. **可擴展性**：處理增長的使用者群、流量和交易

**Backend vs Frontend**

| 面向 | Frontend | Backend |
|------|----------|---------|
| **焦點** | UI/UX | 伺服器、應用程式、資料庫 |
| **技術** | HTML、CSS、JavaScript、React | Python、Java、Ruby、Node.js |
| **職責** | 建立介面、響應式設計 | 伺服器邏輯、資料庫管理、API 整合 |
| **資料處理** | 接收並展示資料 | 處理資料、管理業務邏輯 |

**Backend 開發語言與框架**

**程式語言**
- **Python**：簡單易讀，適合快速原型設計和資料驅動應用
- **Java**：可擴展可靠，適合企業級應用（銀行、電商平台）
- **Ruby**：語法簡潔，搭配 Ruby on Rails 快速開發
- **PHP**：成熟穩定，廣泛用於 CMS 和電商平台

**框架與工具**
- **Spring**：企業級應用綜合框架
- **Django**：Python 框架，強調安全性和快速開發
- **Ruby on Rails**：開發友善，適合新創公司
- **Node.js**：使用 JavaScript，適合實時應用和微服務

**從開發到部署**

**部署流程**
1. 設置伺服器：配置虛擬機、容器或無伺服器平台
2. 連接資料庫：確保資料庫安全、可擴展且完整整合
3. API 整合：配置 API 處理實時流量

**雲端服務的優勢**
- 自動擴展，應對流量波動
- 託管資料庫服務，簡化運維
- 內建監控工具（AWS CloudWatch、Google Cloud Monitoring）

---

#### 2. What is Back-End Architecture?
> 原文：https://www.codecademy.com/article/what-is-back-end-architecture

**後端架構的定義**

後端是指運行在伺服器上的代碼，負責接收來自用戶端的請求，並發送適當的資料回應。其中包含資料庫，用於持久存儲應用程式的所有數據。

**前端 vs. 後端**

| 層級 | 執行位置 | 主要技術 |
|------|---------|---------|
| **前端** | 用戶端瀏覽器 | HTML、CSS、JavaScript |
| **後端** | 伺服器 | 伺服器應用、資料庫 |

**後端架構的三大主要組件**

**1. 伺服器 (Server)**
- 是一部監聽傳入請求的電腦
- 任何連接到網路的電腦都可作為伺服器
- 開發時常使用本機電腦作為伺服器

**2. 應用程式 (App)**

伺服器運行的應用包含以下功能：
- **Routing（路由）**：根據 HTTP verb 和 URI 配對來處理請求
- **Middleware（中間件）**：在接收請求和發送回應之間執行的代碼
  - 可修改請求物件
  - 查詢資料庫
  - 處理傳入請求

常用框架：Express、Ruby on Rails

**3. 資料庫 (Database)**

主要功能：
- 以持久方式存儲資料
- 減少伺服器 CPU 記憶體負載
- 確保伺服器故障時資料不會遺失

**Web API 的角色**

Web API 是後端創建的介面，包括：
- 可處理的請求類型（由定義的路由決定）
- 用戶端可預期接收的回應類型

**優點**：一個 Web API 可為多個不同的前端應用提供數據

**常見伺服器回應類型**
- HTML 文件
- JSON 格式的資料
- HTTP 狀態碼（如 404 Not Found）

**請求-回應循環的原則**
- ✓ 伺服器通常無法主動發起回應
- ✓ 每個請求都需要回應
- ✓ 每個請求只能發送一個回應

### 影片

- [Backend web development - a complete overview](https://www.youtube.com/watch?v=XBu54nfzxAQ)
- [How The Backend Works](https://www.youtube.com/watch?v=4r6WdaY3SOA)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
