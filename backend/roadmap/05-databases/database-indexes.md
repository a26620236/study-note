# Database Indexes

## 簡介

Database indexes are data structures that speed up data retrieval by creating references to table data without full table scans. Include B-tree, bitmap, and hash types. Enhance query performance but increase storage requirements and slow down writes due to index maintenance.

## 學習資源

### 文章

#### 1. What is a Database Index?
> 原文：https://www.codecademy.com/article/sql-indexes

**主要概念**

索引是一個指向表格中資料的指標，類似書本末尾的索引功能。它們在資料庫背景中運作，加速查詢過程。

**核心特性**

| 特性 | 說明 |
|------|------|
| **自動更新** | 新增唯一鍵值時自動更新 |
| **不可見** | 使用者無法看見索引，僅用於加速搜尋 |
| **靈活性** | 可建立非鍵值欄位的自訂索引 |

**建立索引語法**

```sql
CREATE INDEX <index_name>
ON <table_name> (column1, column2, ...)
```

**重要提醒**

⚠️ 更新含索引的表格比無索引的表格耗時更長，因此應僅在頻繁搜尋的欄位上建立索引。

---

#### 2. How Do Database Indexes Work?
> 原文：https://planetscale.com/blog/how-do-database-indexes-work

**工作原理**

- 在未建立索引的情況下，資料通常以 heap（堆）的形式儲存，是無序的行的集合
- 索引建立新的表格，包含被索引的欄位值和指向原始記錄的指標
- 索引以 **binary tree**（二元樹）形式有序儲存和組織

**效能差異**

| 情景 | 複雜度 | 時間 |
|------|--------|------|
| 無索引全表掃描 | O(N/2) | 5-6秒 |
| 具有索引查詢 | O log(n) | <1秒 |

**三大索引類型**

1. **Keys（鍵）**
   - MySQL 中的非唯一索引
   - 適用於「名字」或「位置」等欄位

2. **Unique Indexes（唯一索引）**
   - 無兩個相同的非 NULL 值
   - 值必須有序排列
   - 可用於強制執行欄位唯一性

3. **Text Indexes（文本索引）**
   - 使用 FULLTEXT 限制詞建立
   - 適用於 CHAR、VARCHAR 或 TEXT 欄位
   - 支援自然語言搜尋、布林搜尋、查詢擴展搜尋

**Index-Only Scan（覆蓋索引）**

當查詢所需的值完全包含在索引中時，無需進行表格查找，直接從索引返回結果。

**建立索引完整語法**

```sql
CREATE [type] INDEX index_name ON table_name (column_name)
```

支援的索引類型：UNIQUE、FULLTEXT、SPATIAL
存儲方式：BTREE 或 HASH

**最佳實踐與注意事項**

- 只為需要重複執行的查詢建立索引
- 過多索引會占用存儲空間並減慢 INSERT 查詢
- 使用 `EXPLAIN` 語句分析索引使用情況
- MySQL 最多支援 16 個欄位的索引

---

#### 3. Use the Index, Luke! - A Guide to Database Performance for Developers
> 原文：https://use-the-index-luke.com/

**指南概述**

Use The Index, Luke 是一本由 Markus Winand 撰寫的免費網路版 SQL 索引指南，專為開發人員設計。核心理念：「SQL indexing is the most effective tuning method—yet it is often neglected during development」

**涵蓋的資料庫系統**

- Oracle (11g-26ai)
- MySQL (5.5-9.6)
- PostgreSQL (9.0-17)
- SQL Server (2008R2-2025)
- IBM Db2 LUW (10.5-12.1)

**索引結構**

| 組件 | 說明 |
|------|------|
| Leaf Nodes | 雙向連結串列結構 |
| B-Tree | 平衡樹架構 |
| Index Key | 精確查詢與範圍搜尋 |

**主要教學主題**

- 索引剖析與葉節點運作
- WHERE 子句優化策略
- 連接操作（Join）效能
- 資料聚集與排序分組
- 部分結果分頁查詢
- INSERT/DELETE/UPDATE 影響

**開發者最佳實踐**

- 使用 Bind Variables 提升安全性與效能
- 避免在 WHERE 子句中使用函數
- 適當使用 Concatenated Keys（多欄索引）
- 利用 Partial Indexes 索引選定列

**常見反模式需避免**

- 日期型別的隱藏轉換
- 數值字串的型別混用
- 過度複雜的邏輯條件

**關鍵優化技術**

- Indexed ORDER BY（管道化排序）
- Indexed GROUP BY（管道化分組）
- Index Filter Predicates（用於 LIKE 調優）

---

### 影片

- [Database Indexing Explained](https://www.youtube.com/watch?v=-qNSXK7s7_w)
- [How do SQL Indexes Work](https://www.youtube.com/watch?v=fsG1XaZEa78)
- [Explore top posts about Database](https://app.daily.dev/tags/database?ref=roadmapsh)

### 其他資源

- [PostgreSQL - Indexes](https://www.postgresql.org/docs/current/indexes.html)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
