# Caching

## 簡介

Caching stores frequently accessed data in faster locations to improve performance by reducing latency and server load. It operates at browser, application, and database levels using strategies like LRU and time-based expiration. Balances speed gains with data consistency challenges.

## 學習資源

### 文章

#### 1. What is Caching - AWS
> 原文：[https://aws.amazon.com/caching/](https://aws.amazon.com/caching/)

**什麼是 Caching（快取）**

Caching 是一個高速資料儲存層，用來保存常用資料的子集合，使未來對該資料的請求能更快被提供。根據 AWS 文件說明："快取的主要目的是通過減少對底層較慢儲存層的需求來提高資料檢索效能"。

**核心特性：**
- 使用 RAM（隨機存取記憶體）等高速硬體儲存
- 通常儲存暫時性資料，與永久性資料庫不同
- 犧牲容量換取速度

**主要優勢**

| 優勢 | 說明 |
|------|------|
| **性能提升** | RAM 和記憶體內引擎支持高請求率和 IOPS |
| **成本降低** | 減少對高負載資料庫的依賴，降低基礎設施成本 |
| **低延遲** | 相比傳統磁碟儲存，提供顯著的低延遲性能 |
| **可擴展性** | 支持大規模讀取密集型工作負載 |

**Caching 的層級和類型**

| 層級 | 用途 | 技術方案 |
|------|------|---------|
| **用戶端快取** | 加速網站內容檢索 | HTTP Cache Headers、瀏覽器快取 |
| **DNS 快取** | 網域名稱解析 | Amazon Route 53 |
| **Web 層快取** | Web/App 伺服器加速 | CloudFront、ElastiCache for Redis/Memcached |
| **應用層快取** | 應用效能優化 | 應用框架、Key/Value 儲存 |
| **資料庫快取** | 減少查詢延遲 | ElastiCache、資料庫緩衝區 |

**常見策略**
- **Cache Hit**：請求的資料存在於快取中
- **Cache Miss**：請求的資料不在快取中
- **TTL（Time to Live）管理**：控制快取資料的過期時間

**最佳實踐**
- 使用記憶體引擎實現高可用
- 確保被快取資料的有效性和準確性
- 快取應作為中央層獨立運行
- 讓多個消費者共享中央快取

---

#### 2. Caching - Cloudflare
> 原文：[https://www.cloudflare.com/learning/cdn/what-is-caching/](https://www.cloudflare.com/learning/cdn/what-is-caching/)

**什麼是 Caching（快取）**

Caching 是將檔案副本儲存在快取（臨時儲存位置）的過程，以便更快地存取。技術上，快取是任何臨時儲存檔案或資料副本的位置。Web 瀏覽器快取 HTML、JavaScript 和圖片以加快網站載入速度；DNS 伺服器快取 DNS 記錄以加速查詢；CDN 伺服器快取內容以降低延遲。

**瀏覽器快取**

每次用戶載入網頁，瀏覽器需下載大量資料。為縮短載入時間，瀏覽器快取大部分網頁內容，儲存在設備硬碟上。TTL（Time to Live）控制內容被快取的時間；TTL 到期或硬碟快取滿時，快取內容被清除。

**CDN 快取**

CDN 在更靠近終端用戶的代理伺服器（PoP）上快取內容。當用戶請求內容時，CDN 從源站獲取後保存副本，後續請求直接從快取提供（Cache Hit）。若快取中無請求內容則為 Cache Miss，CDN 伺服器會向源站請求並快取結果。

**其他快取類型**

- **DNS 快取**：DNS 伺服器儲存最近的查詢結果，無需再次查詢名稱伺服器即可回應
- **搜尋引擎快取**：快取常出現在搜尋結果中的網頁，即使網站暫時無法訪問也能回應查詢

---

#### 3. Caching Strategies and How to Choose the Right One
> 原文：[https://codeahoy.com/2017/08/11/caching-strategies-and-how-to-choose-the-right-one/](https://codeahoy.com/2017/08/11/caching-strategies-and-how-to-choose-the-right-one/)

**五大 Caching 策略**

**1. Cache-Aside（旁路快取）**
- **工作原理：** 應用程式直接與快取和資料庫互動，先查詢快取，未命中時才向資料庫查詢
- **優點：** 適合讀取密集型工作負載，快取故障時系統仍可運作
- **缺點：** 快取與資料庫可能不一致，需使用 TTL 或主動失效處理

**2. Read-Through（讀穿快取）**
- **工作原理：** 快取與資料庫內聯，快取命中失敗時自動從資料庫載入資料
- **優點：** 適合讀取密集場景，邏輯簡潔
- **缺點：** 首次讀取必然快取命中失敗，快取資料模型必須與資料庫相同

**3. Write-Through（寫穿）**
- **工作原理：** 資料先寫入快取，再同步寫入資料庫，兩個寫入操作完成後才返回
- **優點：** 保證快取與資料庫一致性，無需快取失效管理
- **缺點：** 增加寫入延遲

**4. Write-Around（寫繞）**
- **工作原理：** 資料直接寫入資料庫，僅讀取的資料進入快取
- **優點：** 適合寫一次、少讀或不讀的場景，避免快取填充無用資料
- **應用：** 實時日誌、聊天訊息

**5. Write-Back（寫回/寫延遲）**
- **工作原理：** 應用寫入快取立即返回，快取異步更新資料庫
- **優點：** 寫入效能最佳，適合寫入密集型，支持批量寫入
- **缺點：** 快取故障可能導致資料永久丟失

**策略選擇矩陣**

| 策略 | 讀型 | 寫型 | 一致性 | 適用場景 |
|------|------|------|--------|---------|
| Cache-Aside | 延遲載入 | 直寫DB | 弱 | 讀取型應用 |
| Read-Through | 自動載入 | 直寫DB | 弱 | 讀取型應用 |
| Write-Through | 自動載入 | 同步更新 | 強 | 混合型 |
| Write-Around | 延遲載入 | 直寫DB | 弱 | 少讀應用 |
| Write-Back | 自動載入 | 異步更新 | 中 | 寫入型應用 |

**選擇建議：**
- 讀取密集 → Cache-Aside 或 Read-Through
- 寫入密集 → Write-Back + Read-Through
- 低讀取頻率 → Write-Around + Read-Through

---

#### 4. Top Caching Strategies Explained
> 原文：[https://blog.bytebytego.com/p/top-caching-strategies](https://blog.bytebytego.com/p/top-caching-strategies)

**讀取策略（Read Strategies）**

**1. Cache Aside（旁路快取）**
- 應用程式直接管理快取和資料庫的互動
- 檢查快取是否存在所需資料，如未命中則從資料庫讀取並更新快取
- **優勢：** 簡單靈活
- **劣勢：** 首次讀取較慢

**2. Read Through（讀穿快取）**
- 快取層負責管理資料庫互動，應用程式只與快取互動
- 快取負責檢查並從資料庫更新資料
- **優勢：** 應用程式邏輯簡化
- **劣勢：** 需要更複雜的快取實現

**寫入策略（Write Strategies）**

**1. Write Through（寫穿）**
- 資料同時寫入快取和資料庫，I/O 完成後才返回確認
- **優勢：** 資料一致性強
- **劣勢：** 寫入延遲較高

**2. Write Around（寫繞）**
- 資料僅寫入資料庫，I/O 完成後立即返回確認
- **優勢：** 寫入速度快
- **劣勢：** 快取命中率可能降低

**3. Write Back（寫回/寫延遲）**
- 資料先寫入快取，非同步將資料寫入資料庫，I/O 完成即刻返回
- **優勢：** 最高效能
- **劣勢：** 資料遺失風險較高

**策略組合：** 多種策略可組合使用以達到最優效果

### 影片

- [Cache Systems Every Developer Should Know](https://www.youtube.com/watch?v=dGAgxozNWFE)
- [Caching Complete Tutorial for Beginners](https://www.youtube.com/watch?v=1XJG34mewts)

### 其他資源

- [Redis University - Introduction to Redis Data Structures](https://redis.io/university/courses/ru101/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
