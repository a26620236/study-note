# NoSQL databases

## 簡介

NoSQL databases handle unstructured, semi-structured, or rapidly changing data with flexible schemas. Four types: Document stores (MongoDB, CouchDB), Key-value stores (Redis, Riak), Column-family (Cassandra, HBase), and Graph databases (Neo4j, Neptune). Used for high scalability, flexibility, and performance applications.

## 學習資源

### 文章

#### 1. NoSQL Explained
> 原文：https://www.mongodb.com/nosql-explained

**主要概念**

NoSQL 數據庫是一種以非關聯表格格式存儲數據的數據庫系統。與傳統的關聯型數據庫不同，NoSQL 提供了更靈活的數據存儲方式。

**NoSQL vs SQL（關聯型數據庫）**

| 特性 | NoSQL | SQL |
|------|-------|-----|
| 數據結構 | 靈活的 Schema | 固定的 Schema |
| 存儲格式 | JSON、文檔、鍵值對等 | 表格關係 |
| 擴展方式 | 水平擴展（Horizontal Scaling） | 垂直擴展（Vertical Scaling） |
| 查詢方式 | 多樣化（MQL、API等） | SQL 語言 |

**NoSQL 的主要優勢**

✅ **靈活的 Schema** - 無需預先定義固定的數據結構，支持動態添加字段
✅ **水平擴展性** - 輕鬆分布式存儲和處理，支持在多個服務器間自動分區
✅ **查詢性能** - 由於數據模型優化，查詢速度快
✅ **開發人員友善** - 文檔型 NoSQL 的數據結構映射到主流編程語言

**四大主要類型**

| 類型 | 特點 | 最佳用途 |
|------|------|---------|
| **文檔型（Document）** | 存儲 JSON/BSON 文檔 | 通用應用、複雜數據結構 |
| **鍵值型（Key-Value）** | 簡單的鍵值對存儲 | 大量簡單查詢、快速查找 |
| **寬列型（Wide-Column）** | 按列族組織數據 | 大規模數據、可預測的查詢模式 |
| **圖型（Graph）** | 專注於數據關係 | 關係分析、社交網絡、推薦系統 |

**CAP 定理**

分布式數據庫系統最多只能滿足以下三個特性中的兩個：
- **C (Consistency)** - 一致性：所有節點同時看到相同數據
- **A (Availability)** - 可用性：系統持續可用
- **P (Partition Tolerance)** - 分區容錯性：網絡分區時系統繼續運行

**最終一致性（Eventual Consistency）**

在分布式數據庫中，當數據更新發生時，不是立即所有節點都同步，但最終所有節點將反映相同的更新。

**主要應用領域**

- 人工智能：向量搜索、文本分析
- 現代化轉型：替換遺留系統
- 支付系統：交易處理
- 無服務器開發：彈性部署
- 遊戲開發：玩家數據存儲
- 智能搜索：全文搜索引擎
- 邊界和移動：本地數據存儲

**按行業分類**

金融服務、電信、醫療健康、零售、公共部門、製造業

---

### 影片

- [How do NoSQL Databases work](https://www.youtube.com/watch?v=0buKQHokLK8)
- [SQL vs NoSQL Explained](https://www.youtube.com/watch?v=ruz-vK8IesE)
- [Explore top posts about NoSQL](https://app.daily.dev/tags/nosql?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
