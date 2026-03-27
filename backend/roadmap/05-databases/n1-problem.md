# N plus one problem

## 簡介

The N+1 problem occurs when an application retrieves a list then performs additional queries for each item's related data. Results in inefficient query multiplication (1 + N queries instead of optimized joins). Severely impacts performance with larger datasets. Solved through query optimization, joins, or batching techniques.

## 學習資源

### 文章

#### 1. In Detail Explanation of N+1 Problem
> 原文：https://medium.com/doctolib/understanding-and-fixing-n-1-query-30623109fe89

**定義**

N+1 查詢問題發生在程式碼執行 N 個額外的資料庫查詢，而這些查詢本可在初始查詢中一次完成。

> "N+1 查詢問題發生在你的程式碼執行了 N 個額外的查詢語句，來獲取本可在執行主查詢時一併獲得的資料。"

**問題結構**

可拆解為三個層次：

- **1 個查詢**：初始資料庫請求（取得主要資料）
- **N 個查詢**：針對第一個查詢每筆結果觸發的額外請求
- **影響**：隨資料庫呼叫倍增而導致嚴重的效能降級

**直觀比喻**

就像烤蛋糕時，廚房材料存放在閣樓。與其一次把所有材料搬下來，你卻為每樣材料單獨跑一趟。這種低效率正是 N+1 查詢的運作方式——多次資料庫請求，而非一次整合查詢。

**實際場景**

取得帶有關聯資料的記錄時，開發者常先取得父記錄，再對每筆子記錄關係個別執行查詢，造成不必要的資料庫負擔。

---

#### 2. What is the N+1 Problem
> 原文：https://planetscale.com/blog/what-is-n-1-query-problem-and-how-to-solve-it

**主要概念**

N+1 Query 指的是資料庫查詢的效率問題，最主要的症狀是執行了許多查詢：
- **第一個查詢 (1)**：取得記錄列表
- **後續查詢 (N)**：對每筆記錄各執行一次查詢
- **結果**：共執行 N+1 次查詢

**問題案例**

不良做法（N+1 問題）：
```
第一步：SELECT * FROM categories;     (1 個查詢)
第二步：對每個分類執行：
        SELECT id, name FROM items
        WHERE category_id = ?         (N 個查詢)
```

**性能結果**：執行時間 1.4 秒，總查詢數 18 次

**優化做法（使用 JOIN）**

```sql
SELECT
    c.id AS category_id,
    c.name AS category_name,
    i.id AS item_id,
    i.name AS item_name
FROM categories c
LEFT JOIN items i ON c.id = i.category_id
ORDER BY c.name, i.name;
```

**性能結果**：執行時間 0.16 秒，快 10 倍

**解決方案對比**

| 指標 | N+1 查詢 | 優化查詢 |
|------|---------|---------|
| 查詢次數 | 18 次 | 1 次 |
| 執行時間 | 1.4 秒 | 0.16 秒 |
| 行讀取 | 13,889 列 | 834 列 |

**最佳實踐**

1. 使用 JOIN：將多個查詢合併成單一複雜查詢
2. 建立資料結構：在應用層整理查詢結果
3. 讓資料庫負責：讓 DB 伺服器執行繁重工作

**識別 N+1 問題**

- Laravel 應用：`Model::preventLazyLoading(!app()->isProduction());`
- PlanetScale Insights：監控查詢執行次數、讀取行數、執行時間
- 識別徵兆：「讀取遠多於返回的列數」表示可能存在 N+1 問題

---

#### 3. Solving N+1 Problem: For Java Backend Developers
> 原文：https://dev.to/jackynote/solving-the-notorious-n1-problem-optimizing-database-queries-for-java-backend-developers-2o0p

**N+1 問題定義**

應用程式先執行 1 次查詢取得物件列表，再針對列表中每個物件各執行 1 次查詢以取得相關資料。若有 N 筆資料，就會產生 N+1 次資料庫查詢。

**三大成因**

| 成因 | 說明 |
|------|------|
| **Lazy Loading** | ORM 框架預設延遲載入，相關資料僅在存取時才從資料庫抓取 |
| **低效查詢** | 開發者在迴圈中逐筆查詢相關資料 |
| **缺乏批次取得** | 未充分利用 ORM 的 batch fetching 功能 |

**六大優化策略**

1. **Eager Loading（預先載入）** - 在查詢時主動載入相關資料
2. **Batch Fetching（批次取得）** - 一次查詢多筆物件的相關資料
3. **DTO Projections（資料傳輸物件投影）** - 僅查詢所需欄位
4. **Caching（快取）** - 將常用資料存放於記憶體
5. **Pagination & Filtering（分頁和篩選）** - 限制單次查詢的資料筆數
6. **Query Optimization（查詢最佳化）** - 定期檢視和優化資料庫查詢

**重要注意事項**

⚠️ **Eager Loading 的限制**：在 JPA 中，宣告 `@ManyToOne(fetch = FetchType.EAGER)` 不保證執行單一 SQL JOIN 語句，仍可能導致 N+1 問題。

**解決方案**：應在查詢層級明確指定載入策略，如：
- JOIN FETCH
- Entity Graphs
- Projections

---

### 影片

- [SQLite and the N+1 (no) problem](https://www.youtube.com/watch?v=qPfAQY_RahA)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
