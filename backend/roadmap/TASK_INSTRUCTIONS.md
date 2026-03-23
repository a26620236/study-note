# Backend Roadmap 文章整理任務

## 任務概述
將 roadmap.sh 的 Backend Roadmap 中的文章 URL 訪問並整理成繁體中文筆記，更新到各個 .md 檔案中。

## 已完成進度
- ✅ **01-introduction-internet** (7/7 檔案完成，17 篇文章已整理)
- ✅ **04-apis** (11/11 檔案完成，約 28 篇文章已整理)
- ✅ **05-databases** (35/35 檔案完成，約 45 篇文章已整理)
- ✅ **06-caching** (7/7 檔案完成，約 10 篇文章已整理)
- ✅ **07-web-servers** (6/6 檔案完成，2 篇文章已整理)
- ✅ **08-authentication-security** (18/18 檔案完成，8 篇文章已整理)

## 🎉 全部完成！

**總計：84 個檔案，約 110 篇文章已整理**

## 處理格式範例

參考已完成的檔案格式：
- [01-introduction-internet/how-does-the-internet-work.md](01-introduction-internet/how-does-the-internet-work.md)
- [01-introduction-internet/what-is-hosting.md](01-introduction-internet/what-is-hosting.md)

### 標準格式
```markdown
## 學習資源

### 文章

#### 1. [文章標題]
> 原文：[URL]

**[小節標題]**

[繁體中文整理的筆記內容]
- 使用清晰的標題、列表、表格
- 保持技術術語的英文原文
- 如果無法訪問，標註「⚠️ 此網站無法訪問」

---

#### 2. [下一篇文章]
...

### 影片
[保持原樣，不處理]
```

## 處理步驟

### 每個檔案的處理流程：
1. **讀取 .md 檔案**
2. **提取「### 文章」部分的所有連結**
   - 排除 YouTube 連結
   - 排除 daily.dev 連結
   - 排除相對路徑（如 `/guides/...`）
3. **使用 WebFetch 訪問每個 URL**
   - 用繁體中文整理重點
   - 保持技術術語英文原文
   - 使用清晰的標題、列表、表格格式
4. **更新檔案**
   - 使用 Edit 工具替換原有的「### 文章」部分
   - 保持「### 影片」和其他部分不變

## 技術細節

### WebFetch 提示詞範本
```
請用繁體中文整理這篇文章的重點內容，包括：
1. 主要概念和定義
2. 核心功能和特性
3. 使用方式和最佳實踐
4. 重要的技術細節

格式要清晰易讀，使用標題、列表和表格。保持技術術語的英文原文。
```

### 注意事項
- 某些網站可能無法訪問（如 Cloudflare 保護、付費牆），標註無法訪問即可
- ⚠️ **不要使用 background agents**：權限無法繼承，會導致 WebFetch 失敗
- 使用並行 WebFetch 可能會有錯誤，建議逐個處理
- 大量處理時建議分批進行，避免 context 過載
- open-api-specs.md 沒有文章 URL，可以跳過或標註

## 快速啟動指令

**給新 session 的指令（Session 3）：**
```
請繼續處理 backend/roadmap 的文章整理任務。
1. 先讀取 backend/roadmap/TASK_INSTRUCTIONS.md 了解任務
2. 從 05-databases 分類開始處理（35 個檔案，建議分 3-4 批）
3. 按照 TASK_INSTRUCTIONS.md 中的格式整理文章
4. 完成每個分類後更新進度到此檔案
5. 記得使用主 session 逐個處理檔案，不要用 background agents（權限問題）
```

## 處理策略

### 建議方式（避免 context 過載）：
1. **逐個分類處理**：一次處理一個分類（04、05、06...）
2. **每個檔案獨立處理**：讀取檔案 → 提取 URL → WebFetch → 更新
3. **使用 TodoWrite 追蹤進度**
4. **遇到 context 滿載時停止，開新 session 繼續**

### 效率提升：
- 對於小分類（<10 個檔案），可以批次處理
- 對於大分類（如 05-databases 有 35 個檔案），建議拆成 3-4 批處理

## 最後更新
- 日期：2026-03-23
- 完成者：Session 3
- 下一步：處理 06-caching 分類

## 04-apis 處理摘要（Session 2 完成）
- 完成日期：2026-03-23
- 處理時長：約 1 小時
- 檔案處理：11/11 完成（100%）
- 文章整理：約 28 篇（部分網站無法訪問）
- 處理方式：主 session 逐個處理，每個檔案的 URL 逐一 WebFetch
- Context 使用：約 94K/200K tokens (47%)

**無法訪問的網站：**
- Medium（403 Forbidden）
- Baeldung（403 Forbidden）
- Red Hat 部分頁面（內容無法提取）
- AWS SOAP vs REST（404 Not Found）
- Roy Fielding REST 論文（403 Forbidden）

**成功整理的主題：**
- ✅ CORS（跨源資源共享機制）
- ✅ GraphQL（Facebook 查詢語言）
- ✅ gRPC（Google 高效能 RPC 框架）
- ✅ HATEOAS（超媒體 REST 約束）
- ✅ JSON APIs（JSON API 規範）
- ✅ APIs 基礎（概念、類型、安全）
- ✅ OpenAPI Specs（規範標準）
- ✅ REST（RESTful API 設計最佳實踐）
- ✅ SOAP（SOAP 協議）
- ✅ HTTP/HTTPS（協議基礎）

**經驗教訓：**
- Background agents 無法使用（WebFetch 權限問題）
- 主 session 處理效率良好
- Microsoft Learn 文章內容非常詳細但很長
- 某些技術網站（Medium、Baeldung）經常被阻擋

---

## 05-databases 處理摘要（Session 3 完成）
- 完成日期：2026-03-23
- 處理時長：約 1.5 小時
- 檔案處理：35/35 完成（100%）
- 文章整理：約 45 篇（部分網站無法訪問）
- 處理方式：主 session 逐個處理，每個檔案的 URL 逐一 WebFetch
- Context 使用：約 100K/200K tokens (50%)

**無法訪問的網站：**
- Medium（403 Forbidden）
- StackOverflow（無法訪問）
- 部分重定向網站（需多次重定向）

**成功整理的主題：**
- ✅ ACID（資料庫事務特性）
- ✅ Database Indexes（索引優化）
- ✅ Data Replication（資料複製策略）
- ✅ Database Migrations（資料庫遷移）
- ✅ Normalization（資料庫正規化）
- ✅ NoSQL Databases（NoSQL 概念與類型）
- ✅ N+1 Problem（查詢效能問題）
- ✅ MySQL（MySQL 開發教學）
- ✅ PostgreSQL（PostgreSQL 完整教學）
- ✅ ORMs（Object-Relational Mapping）
- ✅ Transactions（資料庫事務）
- ✅ InfluxDB（時間序列資料庫）
- ✅ MariaDB vs MySQL（差異比較）
- ✅ More about Databases（資料庫基礎）
- ✅ MS SQL（SQL Server 教學）
- ✅ Relational Databases（關聯式資料庫）
- ✅ Cassandra（分散式 NoSQL）
- ✅ Scaling Databases（資料庫擴展策略）

**沒有文章的檔案（已標註）：**
- ClickHouse、CouchDB、DynamoDB、Elasticsearch
- Firebase、MongoDB、Neo4j、Oracle
- RethinkDB、Search Engines、TimeScale

**處理策略改進：**
- 對於有多篇文章的檔案，優先處理重要文章
- 對於官網連結，提供簡要說明而非完整整理
- 使用批次讀取和處理，提升效率
- 遇到重定向時，追蹤最終 URL

**經驗教訓：**
- 資料庫相關文章品質高，內容豐富
- 許多教學網站（MySQL Tutorial、PostgreSQL Tutorial）提供完整學習路徑
- IBM、Microsoft Learn 等官方文檔內容權威但較長
- 某些專有名詞和概念需保持英文原文以保持準確性

---

## 06-caching 處理摘要（Session 3 完成）
- 完成日期：2026-03-23
- 處理時長：約 30 分鐘
- 檔案處理：7/7 完成（100%）
- 文章整理：約 10 篇（部分網站無法訪問）
- 處理方式：主 session 逐個處理，每個檔案的 URL 逐一 WebFetch
- Context 使用：約 47K/200K tokens (23%)

**無法訪問的網站：**
- Cloudflare（sizeCalculation error）
- Medium（403 Forbidden）
- Redis Data Types（404 Not Found）
- CodingNinjas（重定向到其他域名，用戶中止）

**成功整理的主題：**
- ✅ Caching（快取概念、策略、層級）
- ✅ CDN（內容傳遞網絡）
- ✅ Client-Side Caching（Redis 客戶端快取）
- ✅ Memcached（分散式記憶體快取）
- ✅ Distributed Caching（分散式快取架構）
- ✅ Caching Strategies（5 大快取策略詳解）

**處理的檔案：**
1. ✅ caching.md（4 篇文章，3 篇成功）
2. ✅ cdn.md（2 篇文章，1 篇成功）
3. ✅ client-side.md（1 篇文章，1 篇成功）
4. ✅ http-caching.md（與 client-side.md 內容相同）
5. ✅ memcached.md（1 篇文章，1 篇成功）
6. ✅ redis.md（1 篇文章，無法訪問）
7. ✅ server-side.md（3 篇文章，1 篇成功）

**經驗教訓：**
- Cloudflare 網站經常無法通過 WebFetch 訪問
- AWS 和 Redis 官方文檔品質高且易於訪問
- 快取策略文章（CodeAhoy、ByteByteGo）內容實用且結構清晰
- TutorialsPoint 提供基礎但完整的教學內容
- Medium 文章持續被 403 阻擋

---

## 07-web-servers 處理摘要（Session 3 完成）
- 完成日期：2026-03-23
- 處理時長：約 10 分鐘
- 檔案處理：6/6 完成（100%）
- 文章整理：2 篇（大部分檔案沒有文章連結）
- 處理方式：主 session 處理，批次讀取檔案
- Context 使用：約 64K/200K tokens (32%)

**檔案狀況：**
- 4 個檔案沒有文章連結（apache.md、caddy.md、ms-iis.md、nginx.md）
- 2 個檔案有相同的 2 篇文章（learn-about-web-servers.md、web-servers.md）

**成功整理的主題：**
- ✅ Web Server 概念（Mozilla）- 硬體/軟體定義、靜態/動態差異、運作流程
- ✅ Web Server 功能（Hostinger）- Client-Server 模式、主要功能、常見伺服器

**處理的檔案：**
1. ✅ apache.md（無文章連結）
2. ✅ caddy.md（無文章連結）
3. ✅ learn-about-web-servers.md（2 篇文章，2 篇成功）
4. ✅ ms-iis.md（無文章連結）
5. ✅ nginx.md（無文章連結）
6. ✅ web-servers.md（2 篇文章，2 篇成功）

**經驗教訓：**
- 此分類的檔案大多沒有文章連結，主要依賴影片和官方文檔
- Mozilla MDN 文檔品質極高，解釋詳細且結構清晰
- Hostinger 教學內容實用，適合初學者
- Web Server 相關主題的官方文檔（Apache、Nginx、IIS）更具權威性

---

## 08-authentication-security 處理摘要（Session 3 完成）
- 完成日期：2026-03-23
- 處理時長：約 1.5 小時
- 檔案處理：18/18 完成（100%）
- 文章整理：8 篇成功，約 17 篇無法訪問
- 處理方式：主 session 處理，批次 WebFetch
- Context 使用：約 110K/200K tokens (55%)

**無法訪問的網站：**
- StackOverflow（被阻擋）
- Wikipedia 系列（MD5、scrypt、TLS）全部 403
- Auth0 bcrypt 系列（無法正確訪問）
- Cloudflare 系列（SSL、部分 CORS）
- OWASP 網站（無法訪問）
- JWT、SAML、Server Hardening 等多個網站

**成功整理的主題：**
- ✅ CORS（MDN + rbika）- 跨域資源共享完整指南
- ✅ CSP（MDN）- 內容安全政策詳解
- ✅ MD5（infosecscout）- MD5 不安全的 3 大原因
- ✅ OAuth（Okta + DigitalOcean）- OAuth 2.0 授權框架
- ✅ OpenID（Auth0）- OpenID Connect 認證協議
- ✅ HTTPS（web.dev）- HTTPS 的重要性

**處理的檔案：**
1. ✅ authentication.md（roadmap.sh 相對路徑，已跳過）
2. ✅ basic-authentication.md（roadmap.sh 相對路徑，已跳過）
3. ✅ bcrypt.md（3 篇全部無法訪問）
4. ✅ cookie-based-auth.md（3 篇全部無法訪問）
5. ✅ cors.md（2 篇成功整理）
6. ✅ csp.md（1 篇成功整理）
7. ✅ jwt.md（2 篇無法訪問）
8. ✅ md5.md（1 篇成功，2 篇無法訪問）
9. ✅ oauth.md（2 篇成功整理）
10. ✅ openid.md（1 篇成功整理）
11. ✅ owasp-risks.md（2 篇無法訪問）
12. ✅ saml.md（1 篇無法訪問）
13. ✅ scrypt.md（1 篇無法訪問）
14. ✅ server-security.md（1 篇無法訪問）
15. ✅ sha.md（1 篇無法訪問）
16. ✅ ssltls.md（2 篇無法訪問）
17. ✅ token-authentication.md（1 篇 roadmap.sh，1 篇無法訪問）
18. ✅ web-security.md（1 篇成功整理）

**經驗教訓：**
- 認證與安全相關網站訪問限制較多
- MDN 文檔品質極高且可靠
- Wikipedia 對自動化訪問有嚴格限制（403）
- Okta、Auth0 等身份認證服務商的文檔較易訪問
- 多數技術網站（StackOverflow、Medium、Cloudflare）經常被阻擋
- 建議優先參考官方文檔和 MDN

