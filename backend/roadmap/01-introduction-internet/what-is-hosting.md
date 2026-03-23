# Hosting

## 簡介

Hosting provides server space and resources for storing and delivering websites over the internet. Types include shared hosting, VPS, dedicated hosting, and cloud hosting with scalable resources. Services include infrastructure, domain registration, security, and technical support for reliable website availability.

## 學習資源

### 文章

#### 1. What is the difference between Webpage, Website, Web server, and search engine?
> 原文：https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/Pages_sites_servers_and_search_engines

**四個關鍵概念的差異**

| 概念 | 定義 | 特點 |
|------|------|------|
| **Web page（網頁）** | 可在瀏覽器中顯示的單一文件 | 使用 HTML 編寫，包含 CSS、JavaScript、媒體資源，具有唯一 URL |
| **Website（網站）** | 多個相互連結的網頁集合 | 共享同一 domain name，通常有首頁，頁面間有導航連結 |
| **Web server（網頁伺服器）** | 託管和提供網站的電腦 | 可同時託管多個網站，當使用者請求時傳送網頁檔案給瀏覽器 |
| **Search engine（搜尋引擎）** | 幫助使用者尋找網頁的特殊 Web service | 本身是一個網站，提供查詢功能，如 Google、Bing |

**Browser vs Search engine 常見混淆**

| 項目 | Browser | Search engine |
|------|---------|---------------|
| **性質** | 軟體程式 | Web service（網站） |
| **功能** | 取得並顯示網頁 | 幫助尋找網頁 |
| **例子** | Firefox、Chrome、Safari | Google、Bing |

**圖書館類比**
- Web server = 圖書館
- Website = 圖書館的不同區域（科學、數學、歷史等）
- Web page = 每個區域中的書籍
- Search engine = 圖書館索引目錄

**網頁運作基本流程**
1. 在 Browser 中輸入網址（URL）
2. Browser 向 Web server 發送 HTTP 請求
3. Web server 回傳 HTTP 回應（HTML 檔案）
4. Browser 解析 HTML，發現需要更多資源
5. 發送額外的 HTTP 請求（CSS、JavaScript、圖片等）
6. Browser 接收所有資源後解析和渲染
7. 顯示最終結果給使用者

---

#### 2. What is a web server?
> 原文：https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_web_server

**Web Server 的兩個層面**

**硬體層面**
- 儲存 Web Server 軟體和網站檔案（HTML、圖像、CSS、JavaScript 等）
- 連接到網際網路
- 支持與其他設備的數據交換

**軟體層面**
- HTTP Server：理解 URLs 和 HTTP 協議的軟體
- 接收使用者請求，傳送網站內容到瀏覽器

**基本運作流程**
```
瀏覽器發送 HTTP 請求
        ↓
Web Server 接收請求
        ↓
搜尋請求的檔案
        ↓
找到 → 傳送檔案內容
找不到 → 返回 404 錯誤
```

**Static vs Dynamic Web Server**

| 類型 | 組成 | 特點 | 適用場景 |
|------|------|------|----------|
| **Static（靜態）** | 基本伺服器 | 直接提供儲存的檔案，簡單易設置 | 適合初學者 |
| **Dynamic（動態）** | Static Server + Application Server + Database | 可動態生成/處理內容，技術複雜度高 | MDN、Wikipedia |

**Web Server 的主要功能**

1. **託管檔案（Hosting Files）**
   - 存儲所有網站檔案：HTML、圖像、CSS、JavaScript、字體、影片
   - 專業託管服務優勢：高可用性、持續連接、專用 IP、專人維護

2. **HTTP 通信（Communicating through HTTP）**
   - HTTP 特性：Textual（純文字）、Stateless（無狀態）
   - 客戶端發送請求 → 伺服器回應

3. **內容處理（Content Processing）**
   - 檢查 URL 是否對應現有檔案
   - 存在 → 發送內容
   - 不存在 → 檢查是否需動態生成
   - 都不行 → 返回 404 Not Found

**關鍵要點**
- Web Server 同時處理硬體和軟體層面的功能
- HTTP 是無狀態、純文字的通信協議
- 靜態網站最容易設置，適合開始
- 動態網站提供更多功能但需更複雜技術

### 影片

- [What is Web Hosting and How Does It Work?](https://www.youtube.com/watch?v=H8oAvyqQwew)
- [Different Types of Web Hosting Explained](https://www.youtube.com/watch?v=AXVZYzw8geg)
- [Where to Host a Fullstack Project on a Budget](https://www.youtube.com/watch?v=Kx_1NYYJS7Q)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
