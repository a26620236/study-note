# DGraph

## 簡介

DGraph is a distributed, fast, and scalable graph database. It's designed to handle large amounts of data and complex relationships between data points. DGraph uses GraphQL as its query language, allowing developers to retrieve and manipulate data in a graph structure easily. It's built for production environments, offering features like ACID transactions, high availability, and horizontal scalability.

## 學習資源

### 文章

#### 1. Dgraph, what is a graph database anyway?
> 原文：https://medium.com/@JalalOkbi/dgraph-what-is-a-graph-database-anyway-8b6c22fb1eeb

**什麼是圖形資料庫？**

圖形資料庫基於圖論運作，將實體建模為**頂點（Vertices）**，並以**邊（Edges）**連接它們。與傳統 SQL 的表格 JOIN 不同，邊具有語義意義，可攜帶權重與屬性。

**圖形資料庫 vs 關聯式資料庫**

| 比較項目 | SQL 資料庫 | 圖形資料庫 |
|---------|-----------|-----------|
| **關注點** | 資料本身的內容 | 實體之間的關係 |
| **查詢複雜關係** | 需要複雜遞迴查詢 | 原生支援，效率高 |
| **適用場景** | 結構化數據管理（如銀行帳戶） | 複雜關係查詢（如社交網路） |

圖形資料庫最適合的使用場景：
- 企業組織層級結構
- 供應鏈優化
- 網路管理系統
- 社交推薦系統

**關於 Dgraph**

Dgraph 是 GitHub 上星數最高的圖形資料庫，由 Dgraph Labs 以 Go 語言開發的開源專案，目標是讓大型科技公司使用的圖形資料庫技術普及化。

| 特性 | 說明 |
|------|------|
| **水平可擴展 & 分散式** | 資料分割於多台機器，提升吞吐量 |
| **GraphQL 啟發的查詢語言** | 原生針對圖形模式優化的資料庫查詢 |
| **分散式 ACID 事務** | 跨資料庫分片的資料有效性保證 |
| **HTTP & gRPC 協議** | 廣泛支援的連接選項 |
| **一致性複製** | 跨節點的資料可靠性 |
| **全文搜尋、地理與正則表達式搜尋** | 內建進階查詢功能 |

---

### 影片

- [What is Dgraph?](https://www.youtube.com/watch?v=7oufmZ0xbds)
- [Learn Dgraph in 20 minutes (Graph Database) quick tutorial](https://www.youtube.com/watch?v=roHj5G4vM9Q)

### 其他資源

- [Dgraph](https://docs.hypermode.com/dgraph/overview)
- [dgraph](https://github.com/dgraph-io/dgraph)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
