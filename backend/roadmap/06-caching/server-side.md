# Server side

## 簡介

Server-side caching improves performance by storing frequently accessed data in server memory, reducing repeated data retrieval. Speeds up response times and reduces database load. Caches query results, HTML fragments, API responses using tools like Redis, Memcached, and framework caching.

## 學習資源

### 文章

#### 1. Server-side caching and Client-side caching
> 原文：[https://www.codingninjas.com/codestudio/library/server-side-caching-and-client-side-caching](https://www.codingninjas.com/codestudio/library/server-side-caching-and-client-side-caching)
> （原 URL 已永久重定向至 https://www.naukri.com/code360/library/server-side-caching-and-client-side-caching，頁面需 JavaScript 渲染，無法讀取）

---

#### 2. Caching strategies
> 原文：[https://medium.com/@genchilu/cache-strategy-in-backend-d0baaacd2d79](https://medium.com/@genchilu/cache-strategy-in-backend-d0baaacd2d79)

**快取容量規劃（80/20 法則）**

快取遵循 80/20 法則：約 20% 的物件佔 80% 的訪問量。例如 1000 萬日活用戶、每位用戶 500KB 元數據，快取最熱的 20% 需約 100GB 儲存空間。

**快取叢集（Cache Clustering）**

當單一 VM 無法容納快取需求時，需要分散式叢集。簡單的模數雜湊在擴容時會導致大量資料重新映射；**Consistent Hashing（一致性雜湊）** 可在新增/移除節點時最小化資料遷移量。

**替換策略（Replacement Policies）**

| 策略 | 說明 |
|------|------|
| **FIFO** | 丟棄最舊的快取項目 |
| **LFU** | 移除訪問頻率最低的項目 |
| **LRU** | 移除最近最少使用的項目（最常見） |

**更新策略（Update Policies）**

| 策略 | 機制 | 權衡 |
|------|------|------|
| **Write-through（寫穿）** | 同時更新 DB 和快取 | 強一致性；寫入延遲較高 |
| **Write-around（寫繞）** | 只更新 DB；快取失效 | 首次讀取必然 cache miss |
| **Write-back（寫回）** | 先更新快取，延遲寫入 DB | 吞吐量高；有資料丟失風險 |

---

#### 3. Local vs Distributed Caching
> 原文：[https://redis.io/glossary/distributed-caching/](https://redis.io/glossary/distributed-caching/)

**分散式快取 (Distributed Caching) 的定義**

分散式快取是一種在多個機器或節點上存儲和檢索經常訪問的數據的技術，以提高系統性能並降低延遲。

**快取的兩種類型**

**本地快取 (Local Caching)**
- 在單一機器或應用程式內存儲數據
- 適用於數據檢索限於單一機器或數據量相對較小的場景
- 例如：瀏覽器快取、應用級別快取

**分散式快取 (Distributed Caching)**
- 在網路中多個機器或節點上存儲數據
- 對於需要跨多個伺服器或地理位置分佈的應用程式至關重要
- 確保數據可在需要的地方快速獲得

**分散式快取的優勢**

| 優勢 | 說明 |
|------|------|
| **可擴展性** | 流量增加時可輕鬆添加新的快取伺服器 |
| **容錯性** | 一個快取伺服器失敗時，請求可轉向其他伺服器 |
| **性能** | 數據存儲在更靠近用戶的位置，減少檢索時間 |

**關鍵組件**

**快取伺服器**
- 在多個節點上存儲臨時數據
- 可獨立運作
- 單點故障時可轉移請求

**數據分割與複製策略**
- **一致性雜湊 (Consistent Hashing)**：確保數據均勻分佈，新增或移除伺服器時最小化數據轉移
- **虛擬節點 (Virtual Nodes)**：處理快取伺服器容量不同的情況
- **複製策略**：主從複製或點對點複製

**熱門分散式快取解決方案**

| 方案 | 特性 |
|------|------|
| **Redis** | 開源、內存中數據結構存儲，支援多種數據結構 |
| **Memcached** | 通用分散式內存快取系統，設計簡潔但強大 |
| **Hazelcast** | 內存中數據網格，提供快取、消息傳遞和計算功能 |
| **Apache Ignite** | 內存計算平台，支援 ACID 事務 |

**實施最佳實踐**

| 實踐 | 說明 |
|------|------|
| **快取驅逐** | 實施 LRU 或 TTL 策略保持快取新鮮性 |
| **數據一致性** | 確保快取與主資料源同步 |
| **監控** | 定期檢查快取命中率和缺失率 |
| **可擴展性** | 設計基礎設施以支援簡單的節點擴展 |

### 影片

- [Explore top posts about Web Development](https://app.daily.dev/tags/webdev?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
