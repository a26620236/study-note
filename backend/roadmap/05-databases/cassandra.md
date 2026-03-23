# Cassandra

## 簡介

Apache Cassandra is a highly scalable, distributed NoSQL database with masterless ring architecture and no single point of failure. Excels in write-heavy environments with high throughput and low latency. Uses wide column store model, ideal for big data applications.

## 學習資源

### 文章

#### 1. Cassandra - Quick Guide
> 原文：https://www.tutorialspoint.com/cassandra/cassandra_quick_guide.htm

**主要概念**

Apache Cassandra 是一個開源、分佈式資料庫，用於管理跨越全球的結構化大規模資料，提供高可用性且無單點故障。

**核心特性**

| 特性 | 說明 |
|------|------|
| Elastic scalability | 高度可擴展，可添加更多硬體 |
| Always on architecture | 無單點故障，持續可用 |
| Fast linear-scale performance | 線性可擴展性能 |
| Flexible data storage | 支援結構化、半結構化、非結構化資料 |
| Easy data distribution | 支援跨數據中心複製 |
| Fast writes | 快速寫入，支援海量資料存儲 |

**資料結構層次**

```
Cluster（集群）
  ├─ Keyspace（鍵空間）- 最外層容器
  │   ├─ Column Family（列族）- 類似表格
  │   │   └─ Row（行）
  │   │       └─ Column（列）- key/value + timestamp
```

**核心組件**

- **Node**：資料存儲位置
- **Data center**：相關節點集合
- **Commit log**：崩潰恢復機制
- **Mem-table**：記憶體駐留資料結構
- **SSTable**：磁碟檔案
- **Bloom filter**：快速查詢最佳化

**Keyspace 操作範例**

```cql
# 建立 Keyspace
CREATE KEYSPACE name WITH replication =
{'class':'SimpleStrategy', 'replication_factor':3};

# 修改 Keyspace
ALTER KEYSPACE name WITH replication =
{'class':'NetworkTopologyStrategy', 'replication_factor':3};

# 刪除 Keyspace
DROP KEYSPACE name;
```

**Batch 操作**

同時執行多個修改語句：

```cql
BEGIN BATCH
  INSERT INTO table ...;
  UPDATE table SET ...;
  DELETE FROM table ...;
APPLY BATCH;
```

**寫入流程**

1. 資料寫入 Commit log
2. 寫入 Mem-table
3. Mem-table 滿時刷新到 SSTable

**Cassandra vs RDBMS**

| 面向 | Cassandra | RDBMS |
|------|-----------|-------|
| 資料型別 | 非結構化 | 結構化 |
| 模式 | 靈活 | 固定 |
| 交易支持 | 無 | 有（ACID） |
| 擴展方式 | 水平擴展 | 垂直擴展 |
| 查詢語言 | CQL | SQL |

---

### 影片

- [Apache Cassandra - Course for Beginners](https://www.youtube.com/watch?v=J-cSy5MeMOA)
- [Explore top posts about Backend Development](https://app.daily.dev/tags/backend?ref=roadmapsh)

### 其他資源

- [Apache Cassandra](https://cassandra.apache.org/_/index.html)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
