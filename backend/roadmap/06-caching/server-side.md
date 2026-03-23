# Server side

## 簡介

Server-side caching improves performance by storing frequently accessed data in server memory, reducing repeated data retrieval. Speeds up response times and reduces database load. Caches query results, HTML fragments, API responses using tools like Redis, Memcached, and framework caching.

## 學習資源

### 文章

#### 1. Server-side caching and Client-side caching
> 原文：[https://www.codingninjas.com/codestudio/library/server-side-caching-and-client-side-caching](https://www.codingninjas.com/codestudio/library/server-side-caching-and-client-side-caching)

⚠️ 此網站重定向到其他域名

---

#### 2. Caching strategies
> 原文：[https://medium.com/@genchilu/cache-strategy-in-backend-d0baaacd2d79](https://medium.com/@genchilu/cache-strategy-in-backend-d0baaacd2d79)

⚠️ 此網站無法訪問（403 Forbidden）

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
