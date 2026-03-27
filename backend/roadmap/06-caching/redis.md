# Redis

## 簡介

Redis is an open-source, in-memory data structure store supporting strings, lists, sets, hashes, and sorted sets. Used for caching, session management, real-time analytics, and message brokering. Offers persistence, replication, clustering, and low-latency high-throughput performance.

## 學習資源

### 文章

#### 1. Redis Data Types Explained
> 原文：[https://redis.io/docs/latest/develop/data-types/](https://redis.io/docs/latest/develop/data-types/)（原 URL `/docs/data-types/` 已改為新路徑）

**Redis 核心資料類型**

| 類型 | 說明 | 用途 |
|------|------|------|
| **Strings** | 最基本的資料類型，字節序列 | 快取 |
| **Lists** | 依插入順序排序的字串列表 | 佇列 |
| **Sets** | 無序的唯一字串集合，O(1) 操作 | 去重、集合運算 |
| **Hashes** | 欄位-值對的記錄類型（類似 HashMap） | 物件儲存 |
| **Sorted Sets** | 帶分數的有序唯一字串集合 | 排行榜 |
| **Streams** | 只能追加的日誌結構，記錄事件順序 | 事件處理 |
| **Geospatial Indexes** | 地理位置索引，支援半徑/邊界查詢 | 位置服務 |
| **Bitmaps** | 對字串執行位元運算 | 統計標誌位 |
| **Bitfields** | 在字串中高效編碼多個計數器 | 緊湊計數 |
| **JSON** | 結構化的層級陣列與鍵值物件 | 文檔儲存 |
| **Vector Sets** | 高維向量資料，支援相似度搜尋（HNSW 演算法） | ML / 推薦系統 |

**概率性資料類型（近似但高效）**

| 類型 | 功能 |
|------|------|
| **HyperLogLog** | 估計集合的基數（元素數量） |
| **Bloom Filter** | 檢查元素是否存在於集合中 |
| **Cuckoo Filter** | 類似 Bloom Filter，效能權衡不同 |
| **t-digest** | 從資料流估計百分位數 |
| **Top-K** | 估計資料點在值流中的排名 |
| **Count-min Sketch** | 估計資料點在值流中的頻率 |

**時間序列**

- **Time Series**：儲存和查詢帶時間戳的資料點

### 影片

- [Redis in 100 Seconds](https://www.youtube.com/watch?v=G1rOthIU-uo)
- [Redis Tutorial for Beginners](https://www.youtube.com/watch?v=jgpVdJB2sKQ)
- [Explore top posts about Redis](https://app.daily.dev/tags/redis?ref=roadmapsh)

### 其他資源

- [Visit Dedicated Redis Roadmap](https://roadmap.sh/redis)
- [Redis Crash Course](https://www.youtube.com/watch?v=XCsS_NVAa1g)
- [Redis](https://redis.io/)
- [Redis Documentation](https://redis.io/docs/latest/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
