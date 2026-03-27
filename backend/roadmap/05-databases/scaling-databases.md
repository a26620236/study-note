# Scaling Databases

## 簡介

Scaling databases adapts them to handle more data and users efficiently through vertical scaling (upgrading hardware) or horizontal scaling (adding servers). Key techniques include sharding and replication to maintain robustness as databases grow.

## 學習資源

### 文章

#### 1. Strategies for Scaling Databases: A Comprehensive Guide
> 原文：https://medium.com/@anil.goyal0057/strategies-for-scaling-databases-a-comprehensive-guide-b69cda7df1d3

**概述**

資料庫擴展策略因應系統對資料儲存與效能的需求增長，以下整理四大核心策略。

**策略一：Caching（快取）**

將頻繁存取的資料暫存於記憶體，減少資料庫負載。

適用場景：
- **Read-Heavy 工作負載**：減少讀取密集操作的資料庫命中次數
- **高頻資料存取**：加速短時間內頻繁使用的資料集
- **複雜查詢結果**：快取耗時的計算結果

AWS 解決方案：
- **Amazon ElastiCache**：支援 Redis 和 Memcached 的全託管記憶體快取
- **Amazon DynamoDB Accelerator (DAX)**：DynamoDB 讀取效能提升最多 10 倍
- **AWS CloudFront**：邊緣節點快取靜態和動態內容

注意：Cache Invalidation（快取失效管理）是難點，需謹慎設計。

---

**策略二：Vertical Scaling（垂直擴展）**

升級現有伺服器硬體（CPU、RAM、儲存空間）。

| 優點 | 缺點 |
|------|------|
| 實作簡單 | 受實體硬體上限限制 |
| 低網路延遲 | 升級時通常需要停機 |
| 適合非分散式系統 | 高效能伺服器成本指數增長 |
| | 單點故障風險 |

---

**策略三：Read Replicas（讀取副本）**

建立多個主資料庫的副本，分擔讀取流量並保持同步。

核心概念：
- **Failover**：主庫故障時，副本可提升為新主庫
- **Eventual Consistency（最終一致性）**：因複製延遲，副本讀取為最終一致
- **Strong Consistency（強一致性）**：通過同步複製實現，主庫等待副本確認後才完成寫入

適用場景：讀取密集型應用、報表/分析工作、跨地理區域部署、高可用備援。

與 Caching 的比較：快取提供更快的記憶體存儲，但若讀取操作無法從快取獲益，讀取副本是更佳選擇。

---

**策略四：Sharding（分片）**

將大型資料集分割為多個片段，分散於多台伺服器。

| 優點 | 缺點 |
|------|------|
| 查詢效能提升 | 實作複雜，需仔細規劃 |
| 多伺服器容量擴展 | 資料分佈不均問題 |
| 故障隔離（僅影響單片） | 跨片 JOIN 困難 |
| 可針對個別分片垂直擴展 | 可能需要資料反正規化 |

分片演算法選擇：Range-based、Hash-based、Directory-based。

SQL vs NoSQL Sharding：NoSQL 資料庫天生為分片設計，靈活性更高；關聯式資料庫分片面臨跨片 JOIN 和多記錄事務的挑戰。

---

**策略五：Multi-Master Replication（多主複製）**

多個主節點同時處理讀寫操作，並自動解決衝突。

衝突解決策略：
- **Last Write Wins (LWW)**：以最新寫入為準
- **Version Vectors**：比較版本號決定優先級
- **Application-Level**：業務邏輯決定結果
- **Distributed Locking**：防止同時寫入同一資料

---

**選擇策略的考量因素**

| 需求 | 建議策略 |
|------|---------|
| 讀取密集 | Caching 或 Read Replicas |
| 寫入密集 | Sharding 或 Multi-Master |
| 超大型資料庫 | Sharding |
| 低延遲需求 | Caching 或地理分散副本 |
| 強一致性需求 | Vertical Scaling 或 Sharding |
| 高可用性需求 | Read Replicas 或 Sharding |
| 預算有限 | Horizontal Scaling 更具成本效益 |

---

#### 2-4. 其他擴展策略文章
> 包含：Horizontal vs. Vertical Scaling、Database Sharding、Database Replication

**擴展策略概述**：
- **Vertical Scaling（垂直擴展）**：升級硬體資源
- **Horizontal Scaling（水平擴展）**：增加伺服器節點
- **Sharding**：數據分片技術
- **Replication**：數據複製策略

📝 建議參考原文獲取詳細內容

---

### 影片

- [Database Scaling Strategies for Beginners](https://www.youtube.com/watch?v=dkhOZOmV7Fo)
- [Database Sharding and Partitioning](https://www.youtube.com/watch?v=wXvljefXyEo)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
