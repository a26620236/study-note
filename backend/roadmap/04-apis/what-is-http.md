# What is HTTP?

## 簡介

HTTP (Hypertext Transfer Protocol) transmits hypertext over the web using request-response model. Defines message formatting and server-browser communication. Stateless protocol where each request is independent. Forms foundation of web communication, often used with HTTPS for encryption.

## 學習資源

### 文章

#### 1. What is HTTP?
> 原文：https://www.cloudflare.com/en-gb/learning/ddos/glossary/hypertext-transfer-protocol-http/

⚠️ 此網站暫時無法完整訪問

**主要概念：**

HTTP (HyperText Transfer Protocol) 是網際網路上用於傳輸超文本的應用層協議，是 World Wide Web 的基礎。

| 特性 | 說明 |
|------|------|
| **協議類型** | 請求-響應協議 (Request-Response Protocol) |
| **運作層級** | OSI 模型的應用層 (Application Layer) |
| **端口** | 預設使用 80 (HTTP) 或 443 (HTTPS) |
| **狀態特性** | 無狀態協議 (Stateless) |

**核心功能：**

- **客戶端-服務器通信**：瀏覽器發送請求，服務器返回響應
- **資源定位**：通過 URL 定位和訪問網路資源
- **方法定義**：支持 GET、POST、PUT、DELETE 等 HTTP Methods
- **標頭傳遞**：通過 Headers 傳遞元數據和配置信息

**HTTP vs HTTPS：**

| 比較項目 | HTTP | HTTPS |
|---------|------|-------|
| **安全性** | 未加密，數據明文傳輸 | 使用 SSL/TLS 加密 |
| **端口** | 80 | 443 |
| **證書** | 不需要 | 需要 SSL 證書 |
| **SEO** | 較低排名 | 較高排名 |

---

#### 2. Overview of HTTP
> 原文：https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview

## 1. 主要概念和定義

### 什麼是 HTTP？
**HTTP**（HyperText Transfer Protocol）是一種用於獲取資源（如 HTML 文件）的協議，是網路上所有數據交換的基礎。

| 特性 | 說明 |
|------|------|
| **類型** | 客戶端-服務器協議 |
| **運作層級** | 應用層協議 |
| **傳輸方式** | 基於 TCP 或 TLS-加密 TCP 連接 |
| **通信方式** | 單個消息交換（非數據流） |

### 核心角色

#### 用戶代理（User-Agent）
- 代表用戶執行操作的工具
- 主要由 Web 瀏覽器承擔
- **瀏覽器永遠是請求的發起方**，從不是服務器

#### Web 服務器
- 按客戶端請求提供文檔
- 可能是單個虛擬機或多個共享負載的服務器
- 可以託管多個服務器軟體實例

#### 代理（Proxies）
- 位於客戶端和服務器之間的計算機和機器
- 在應用層運作的稱為「代理」
- **代理可能的功能：**
  - 快取（公共或私有）
  - 過濾（防病毒、家長控制）
  - 負載均衡
  - 身份驗證
  - 日誌記錄

## 2. 核心功能和特性

### HTTP 的基本特性

| 特性 | 詳細說明 |
|------|---------|
| **簡單性** | 設計為人類可讀，降低學習難度 |
| **可擴展性** | 透過 HTTP headers 可輕鬆擴展和實驗 |
| **無狀態性** | 兩個請求之間無連結，但支持 HTTP Cookies 建立會話 |
| **連接管理** | 依賴 TCP 的可靠性，支持持久連接和管道化 |

### HTTP 可控制的功能

#### 1. **快取（Caching）**
- 服務器可指示代理和客戶端快取文檔
- 控制快取時間長短
- 客戶端可指示代理忽略已存儲文檔

#### 2. **放寬同源限制（Relaxing Origin Constraint）**
- 預防窺探和隱私侵害
- HTTP headers 可在服務器端放寬限制
- 允許文檔成為多個域名資源的組合

#### 3. **身份驗證（Authentication）**
- 保護特定頁面只供特定用戶訪問
- 方式：
  - `WWW-Authenticate` headers
  - HTTP Cookies 建立特定會話

#### 4. **代理和隧道（Proxy and Tunneling）**
- 處理位於內部網絡的服務器和客戶端
- 跨越網絡屏障

#### 5. **會話管理（Sessions）**
- 使用 HTTP Cookies 連結請求與服務器狀態
- 應用場景：電子商務購物車、網站配置

## 3. HTTP 流程和消息結構

### HTTP 請求-響應流程

```
1. 開啟 TCP 連接
   ↓
2. 發送 HTTP 消息
   ↓
3. 讀取服務器響應
   ↓
4. 關閉或重用連接以進行後續請求
```

### HTTP 請求（Request）的結構

請求包含以下元素：

```
GET / HTTP/1.1
Host: developer.mozilla.org
Accept-Language: fr
```

| 元素 | 說明 |
|------|------|
| **HTTP 方法** | GET、POST、OPTIONS、HEAD 等動詞或名詞 |
| **資源路徑** | 去除協議和域名的 URL 路徑 |
| **HTTP 版本** | HTTP/1.1、HTTP/2 等 |
| **Headers（可選）** | 傳達額外信息的頭部 |
| **Body（可選）** | 某些方法（如 POST）包含的資源內容 |

### HTTP 響應（Response）的結構

```
HTTP/1.1 200 OK
Date: Sat, 09 Oct 2010 14:28:02 GMT
Server: Apache
Content-Type: text/html
Content-Length: 29769

<!doctype html>…（29769 字節的網頁內容）
```

| 元素 | 說明 |
|------|------|
| **HTTP 版本** | 遵循的協議版本 |
| **狀態碼** | 指示請求是否成功及原因 |
| **狀態消息** | 狀態碼的簡短非權威說明 |
| **Headers** | 響應頭部信息 |
| **Body（可選）** | 獲取的資源內容 |

## 4. 重要的技術細節

### HTTP 版本演進

| 版本 | 主要改進 |
|------|---------|
| **HTTP/1.0** | 基礎版本，引入 HTTP headers |
| **HTTP/1.1** | 引入持久連接和管道化（pipelining） |
| **HTTP/2** | 消息嵌入二進制幀結構，支持多重化（multiplexing） |

### 連接管理

#### HTTP/1.0 的問題
- 每個請求-響應對都需開啟新的 TCP 連接
- 效率低下

#### HTTP/1.1 的改進
- **持久連接**：使用 `Connection` header 控制
- **管道化**：多個請求無需等待響應

#### HTTP/2 的優化
- **多重化**：在單一連接中多重化請求
- 保持連接溫暖，提高效率

### 傳輸層基礎

- HTTP 依賴 **TCP**（可靠傳輸協議）
- UDP 不可靠，故不適用
- 新興協議：**QUIC**（基於 UDP，更高效可靠）

## 5. 基於 HTTP 的 API

### Fetch API
- 最常用的基於 HTTP 的 API
- 用於從 JavaScript 發送 HTTP 請求
- 取代舊的 `XMLHttpRequest` API

### Server-Sent Events
- 單向服務
- 允許服務器通過 HTTP 向客戶端發送事件
- 使用 `EventSource` 接口
- 客戶端自動轉換消息為 `Event` 對象

## 6. 總結

HTTP 是一種**簡單、可擴展、無狀態但支持會話**的協議，具有以下優勢：

✅ 人類可讀的消息格式
✅ 強大的擴展機制（headers）
✅ 靈活的性能優化（快取、壓縮、多重化）
✅ 完善的安全控制機制

**即使 HTTP/2 增加了複雜性，基本消息結構自 HTTP/1.0 以來保持一致，便於調試和維護。**

---

#### 3. HTTP/3 From A To Z: Core Concepts
> 原文：https://www.smashingmagazine.com/2021/08/http3-core-concepts-part1/

⚠️ 此網站暫時無法完整訪問

**主要概念：**

HTTP/3 是 HTTP 協議的最新版本，建立在 QUIC (Quick UDP Internet Connections) 傳輸協議之上，而非傳統的 TCP。

## 1. HTTP/3 核心概念

### 為什麼需要 HTTP/3？

| HTTP 版本 | 傳輸協議 | 主要問題 |
|----------|---------|---------|
| **HTTP/1.1** | TCP | 隊頭阻塞 (Head-of-Line Blocking) |
| **HTTP/2** | TCP | 仍存在 TCP 層級的隊頭阻塞 |
| **HTTP/3** | QUIC (UDP) | 解決隊頭阻塞，提升性能 |

### QUIC 協議特性

**核心優勢：**

1. **連接建立更快**
   - 0-RTT 或 1-RTT 握手
   - TCP + TLS 需要 2-3 RTT
   - 大幅降低延遲

2. **消除隊頭阻塞**
   - 每個 Stream 獨立處理
   - 單一 Stream 的封包遺失不影響其他 Stream

3. **連接遷移 (Connection Migration)**
   - 支持網路切換（Wi-Fi 切換到 4G）
   - 使用 Connection ID 而非 IP:Port

4. **內建加密**
   - TLS 1.3 整合到協議中
   - 預設加密所有連接

## 2. 技術架構

### HTTP/3 堆疊結構

```
┌─────────────────────┐
│   HTTP/3 (應用層)    │
├─────────────────────┤
│   QUIC (傳輸層)      │
├─────────────────────┤
│   UDP (網路層)       │
└─────────────────────┘
```

對比傳統：

```
┌─────────────────────┐
│   HTTP/1.1 或 HTTP/2 │
├─────────────────────┤
│   TLS               │
├─────────────────────┤
│   TCP               │
├─────────────────────┤
│   IP                │
└─────────────────────┘
```

### Stream 與 Multiplexing

- **HTTP/2 問題**：多個 Stream 共享一個 TCP 連接，一個封包遺失會阻塞所有 Stream
- **HTTP/3 解決方案**：QUIC 在傳輸層實現 Stream 隔離

## 3. 使用方式和最佳實踐

### 啟用 HTTP/3

**服務器端：**
- Nginx：需要編譯 QUIC 支持
- Caddy：原生支持 HTTP/3
- Cloudflare、Fastly 等 CDN：已預設啟用

**客戶端：**
- Chrome、Firefox、Safari：現代瀏覽器已支持
- 使用 Alt-Svc header 進行協議協商

### 協議協商

```http
HTTP/1.1 200 OK
Alt-Svc: h3=":443"; ma=2592000
```

表示服務器支持 HTTP/3，客戶端可在後續請求使用。

## 4. 重要技術細節

### 封包格式

| 特性 | TCP | QUIC |
|------|-----|------|
| **連接識別** | 4-tuple (IP + Port) | Connection ID |
| **加密** | TLS 層 | 內建於 QUIC |
| **流控制** | 全連接級別 | Stream 級別 |
| **錯誤恢復** | 重傳整個 Segment | 重傳特定 Frame |

### 性能優化

1. **0-RTT 恢復**
   - 客戶端可在握手前發送應用數據
   - 適合重複訪問的場景

2. **靈活的壅塞控制**
   - 可在用戶空間實現
   - 更新不需修改內核

3. **Forward Error Correction (FEC)**
   - 部分 QUIC 實現支持 FEC
   - 減少重傳需求

### 挑戰與限制

⚠️ **需注意的問題：**

- **UDP 封鎖**：某些網路會封鎖或限制 UDP 流量
- **CPU 開銷**：QUIC 在用戶空間實現，增加 CPU 使用
- **中間盒問題**：部分防火牆、負載均衡器尚未完全支持
- **除錯困難**：加密連接使網路診斷更複雜

---

#### 4. Everything you need to know about HTTP
> 原文：https://www3.ntu.edu.sg/home/ehchua/programming/webprogramming/HTTP_Basics.html

⚠️ 此網站暫時無法完整訪問

**HTTP 基礎完整指南**

## 1. HTTP 協議基礎

### 什麼是 HTTP？

HTTP (HyperText Transfer Protocol) 是一種基於請求-響應模型的無狀態協議，用於分散式、協作式超媒體信息系統。

**協議特性：**

| 特性 | 說明 |
|------|------|
| **無狀態** | 每個請求獨立，服務器不保留之前的請求信息 |
| **基於文本** | 請求和響應都是人類可讀的文本格式 |
| **可擴展** | 通過 Headers 和 Methods 易於擴展 |
| **媒體獨立** | 可傳輸任何類型的數據（text, image, video 等） |

## 2. HTTP Request Methods

### 常用 HTTP 方法

| Method | 用途 | 是否有 Body | 冪等性 | 安全性 |
|--------|------|------------|-------|-------|
| **GET** | 獲取資源 | ❌ | ✅ | ✅ |
| **POST** | 提交數據/創建資源 | ✅ | ❌ | ❌ |
| **PUT** | 更新/替換資源 | ✅ | ✅ | ❌ |
| **DELETE** | 刪除資源 | ❌ | ✅ | ❌ |
| **PATCH** | 部分更新資源 | ✅ | ❌ | ❌ |
| **HEAD** | 獲取 Headers（不含 Body） | ❌ | ✅ | ✅ |
| **OPTIONS** | 查詢支持的方法 | ❌ | ✅ | ✅ |

### GET vs POST 詳細比較

```
GET /search?q=http&lang=zh HTTP/1.1
Host: example.com
```

```
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json

{"name": "John", "email": "john@example.com"}
```

| 特性 | GET | POST |
|------|-----|------|
| **參數位置** | URL query string | Request Body |
| **參數長度** | 受 URL 長度限制（~2048 字符） | 無限制 |
| **緩存** | 可被緩存 | 預設不緩存 |
| **書籤** | 可加入書籤 | 不可加入書籤 |
| **安全性** | 參數暴露於 URL | 參數在 Body 中 |
| **用途** | 獲取數據 | 提交數據 |

## 3. HTTP Status Codes

### 狀態碼分類

| 範圍 | 類別 | 說明 |
|------|------|------|
| **1xx** | Informational | 請求已接收，繼續處理 |
| **2xx** | Success | 請求成功處理 |
| **3xx** | Redirection | 需要進一步操作完成請求 |
| **4xx** | Client Error | 客戶端錯誤 |
| **5xx** | Server Error | 服務器錯誤 |

### 常見狀態碼

**2xx 成功：**
- `200 OK`：請求成功
- `201 Created`：資源已創建
- `204 No Content`：成功但無返回內容

**3xx 重定向：**
- `301 Moved Permanently`：永久重定向
- `302 Found`：臨時重定向
- `304 Not Modified`：資源未修改，使用緩存

**4xx 客戶端錯誤：**
- `400 Bad Request`：請求語法錯誤
- `401 Unauthorized`：需要身份驗證
- `403 Forbidden`：服務器拒絕請求
- `404 Not Found`：資源不存在
- `405 Method Not Allowed`：方法不被允許

**5xx 服務器錯誤：**
- `500 Internal Server Error`：服務器內部錯誤
- `502 Bad Gateway`：網關錯誤
- `503 Service Unavailable`：服務暫時不可用
- `504 Gateway Timeout`：網關超時

## 4. HTTP Headers

### Request Headers

**常用 Request Headers：**

```http
GET /api/data HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json
Accept-Language: zh-TW,zh;q=0.9,en;q=0.8
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Cookie: session_id=abc123
Authorization: Bearer eyJhbGc...
```

| Header | 說明 |
|--------|------|
| **Host** | 目標服務器域名（必需） |
| **User-Agent** | 客戶端信息 |
| **Accept** | 可接受的內容類型 |
| **Accept-Language** | 可接受的語言 |
| **Accept-Encoding** | 可接受的編碼方式 |
| **Authorization** | 身份驗證憑證 |
| **Cookie** | 存儲的 Cookie |
| **Referer** | 來源頁面 URL |

### Response Headers

**常用 Response Headers：**

```http
HTTP/1.1 200 OK
Date: Mon, 23 Mar 2026 12:00:00 GMT
Server: nginx/1.18.0
Content-Type: application/json; charset=utf-8
Content-Length: 1234
Content-Encoding: gzip
Cache-Control: max-age=3600
Set-Cookie: session_id=xyz789; HttpOnly; Secure
Access-Control-Allow-Origin: *
```

| Header | 說明 |
|--------|------|
| **Date** | 響應生成時間 |
| **Server** | 服務器軟體信息 |
| **Content-Type** | 內容類型 |
| **Content-Length** | 內容長度（字節） |
| **Content-Encoding** | 內容編碼方式 |
| **Cache-Control** | 緩存控制 |
| **Set-Cookie** | 設置 Cookie |
| **Location** | 重定向目標 URL |

## 5. HTTP 消息格式

### Request 格式

```
Request-Line (方法 URI 協議版本)
Header1: value1
Header2: value2
...
(空行)
Message Body (可選)
```

**範例：**

```http
POST /api/login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 29

username=john&password=secret
```

### Response 格式

```
Status-Line (協議版本 狀態碼 狀態描述)
Header1: value1
Header2: value2
...
(空行)
Message Body
```

**範例：**

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 45

{"status": "success", "token": "abc123xyz"}
```

## 6. 實用技術細節

### URL 結構

```
https://www.example.com:443/path/to/resource?key1=value1&key2=value2#section
│     │  │              │   │                │                      │
協議   域名             端口  路徑              查詢字符串              片段
```

### Content-Type 常見值

| Content-Type | 用途 |
|--------------|------|
| `text/html` | HTML 文件 |
| `text/plain` | 純文本 |
| `application/json` | JSON 數據 |
| `application/xml` | XML 數據 |
| `application/x-www-form-urlencoded` | 表單數據（預設） |
| `multipart/form-data` | 文件上傳 |
| `image/jpeg`, `image/png` | 圖片 |

### 連接類型

**HTTP/1.0：**
- 預設：每個請求新建連接
- `Connection: keep-alive`：啟用持久連接

**HTTP/1.1：**
- 預設：持久連接 (persistent connection)
- `Connection: close`：關閉持久連接
- 支持管道化 (pipelining)

### 最佳實踐

1. **使用適當的 HTTP Method**
   - 遵循 RESTful 原則
   - GET 用於讀取，POST 用於創建

2. **合理使用 Status Codes**
   - 返回正確的狀態碼
   - 避免所有請求都返回 200

3. **善用 Headers**
   - `Cache-Control` 優化緩存
   - `Content-Type` 明確指定內容類型
   - `Authorization` 進行身份驗證

4. **安全考量**
   - 使用 HTTPS 加密傳輸
   - 設置 `HttpOnly` 和 `Secure` Cookie 標誌
   - 實施 CORS 政策控制跨域訪問

5. **性能優化**
   - 啟用 gzip 壓縮
   - 使用持久連接
   - 實施適當的緩存策略
   - 考慮升級到 HTTP/2 或 HTTP/3

### 影片

- [HTTP/1 to HTTP/2 to HTTP/3](https://www.youtube.com/watch?v=a-sBfyiXysI)
- [SSL, TLS, HTTPS Explained](https://www.youtube.com/watch?v=j9QmMEWmcfo)

### 其他資源

- [Full HTTP Networking Course](https://www.youtube.com/watch?v=2JYT5f2isg4)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
