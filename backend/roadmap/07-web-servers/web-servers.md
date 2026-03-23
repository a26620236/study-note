# Web Servers

## 簡介

Web servers handle client requests and serve web content like HTML pages and images. Process HTTP/HTTPS requests, interact with databases, and send responses. Popular servers include Apache, Nginx, and IIS. Essential for hosting websites, managing traffic, and providing SSL/TLS security.

## 學習資源

### 文章

#### 1. What is a Web Server? - Mozilla
> 原文：[https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_web_server](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_web_server)

**什麼是 Web Server**

Web Server 可指**硬體或軟體**，或兩者的結合：

**硬體層面**
- 儲存 Web 伺服器軟體與網站檔案（HTML、圖片、CSS、JavaScript 等）
- 連接到網際網路，與其他設備進行實體資料交換

**軟體層面**
- **HTTP Server**：理解 URL 和 HTTP 協議的軟體
- 接收並處理瀏覽器請求
- 透過 HTTP 傳遞託管網站的內容

**Web Server 的主要功能**

**託管檔案（Hosting Files）**
- 儲存網站所有需要的檔案：HTML 文件、圖片、CSS、JavaScript、字型、視頻等

**使用專業 Web 託管的優勢：**
- 高可用性（持續運作）
- 穩定的網際網路連線
- 固定 IP 位址（Dedicated IP Address）
- 專業維護管理

**透過 HTTP 通訊（Communicating through HTTP）**

HTTP（Hypertext Transfer Protocol）特性：
- **文本型**（Textual）：所有命令為明文且易讀
- **無狀態**（Stateless）：伺服器與用戶端不記憶前次通訊

**靜態與動態內容的差異**

| 類型 | 組成 | 特點 |
|------|------|------|
| **靜態 Web Server** | 電腦（硬體）+ HTTP Server（軟體）| 直接返回已存在的檔案，不進行處理 |
| **動態 Web Server** | 靜態伺服器 + Application Server + Database | 伺服器在回傳內容前進行處理或從資料庫產生內容 |

**Web Server 運作流程**

1. 瀏覽器發送 HTTP 請求 + URL
2. HTTP Server 檢查請求的 URL
3. 搜尋對應檔案
4. 若找到 → 讀取並處理；若未找到 → 生成動態內容或回傳 404 錯誤
5. 透過 HTTP 回傳給瀏覽器

---

#### 2. What is a Web Server? - Hostinger
> 原文：[https://www.hostinger.co.uk/tutorials/what-is-a-web-server](https://www.hostinger.co.uk/tutorials/what-is-a-web-server)

**定義**

Web Server 是一台電腦，用來儲存、處理和傳遞網站檔案到使用者的網頁瀏覽器。它由硬體和軟體兩部分組成：硬體連接網際網路以交換資料，軟體則包含 HTTP Server 來處理請求。

**運作原理（Client-Server 模式）**

1. 瀏覽器透過 DNS 將網域名稱轉換為 IP 位址
2. 瀏覽器傳送 HTTP 請求至 Web Server
3. HTTP Server 接收並處理請求，搜尋相關資料
4. Server 回傳檔案至瀏覽器並交付給使用者

**兩種類型**

- **Static Web Server**：傳送不變的檔案，適合部落格和作品集
- **Dynamic Web Server**：使用應用程式和資料庫，根據使用者互動更新內容，適合社群媒體和電商平台

**主要功能特性**

- **File Logging**：追蹤事件和活動記錄
- **Authentication**：驗證使用者身份
- **Bandwidth Limiting**：控制資料傳輸速度
- **Load Balancing**：分散多台伺服器的流量
- **Uptime Guarantee**：業界標準為 99.9%

**常見 Web Server**

- Apache HTTP Server（市占率超過 31%）
- NGINX
- Microsoft IIS
- Lighttpd

### 影片

- [Web Server Concepts and Examples](https://youtu.be/9J1nJOivdyw)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
