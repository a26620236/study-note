# MySQL

## 簡介

MySQL is an open-source RDBMS known for speed, reliability, and ease of use. Supports SQL, transactions, indexing, and stored procedures. Widely used for web applications, integrates with many languages, and part of LAMP stack. Maintained by Oracle with large community support.

## 學習資源

### 文章

#### 1. MySQL for Developers
> 原文：https://planetscale.com/courses/mysql-for-developers/introduction/course-introduction

**課程概述**

PlanetScale 提供的免費 MySQL 教學，目標為幫助開發者掌握資料庫設計和優化的實務能力。適合初學者和需要進修者，針對應用層開發者設計。

**四大主要模組**

| 模組 | 內容重點 | 課程數 |
|------|---------|--------|
| **Schema 設計** | 資料類型、欄位選擇、遷移策略 | 13 堂 |
| **Indexing** | B+ 樹、主鍵、複合索引、全文搜尋 | 17 堂 |
| **Query 優化** | EXPLAIN 分析、JOIN、CTE、視窗函數 | 20 堂 |
| **實務案例** | MD5 雜湊、分頁、地理搜尋等 | 13 堂 |

**Schema 設計三大原則**

1. **選擇最小的資料型別** - 節省儲存和提升查詢速度
2. **選擇最簡單的型別** - 使用適當型別反映資料特性
3. **準確反映現實** - nullable 屬性應符合實際需求

**Integer 資料類型範圍**

| 型別 | 位元組 | 範圍（無符號） |
|------|--------|---------------|
| TINYINT | 1 | 0-255 |
| SMALLINT | 2 | 0-65,535 |
| MEDIUMINT | 3 | 0-16,777,215 |
| INT | 4 | 0-4,294,967,295 |
| BIGINT | 8 | 0-18,446,744,073,709,551,615 |

**Decimal 資料類型選擇**

| 情境 | 建議型別 | 特性 |
|------|---------|------|
| 財務/精確值 | DECIMAL | 固定精度，完全準確 |
| 科學計算 | FLOAT/DOUBLE | 近似值，效率更高 |
| 更高精度 | DOUBLE | 比 FLOAT 更精準 |

**最佳實踐**

- 更快的資料存取：緊湊的結構減少搜尋時間
- 高效的索引建立：較小的記憶體占用
- 課程採用實作導向，以 TablePlus 客戶端進行即時演示

---

#### 2. MySQL Tutorial
> 原文：https://www.mysqltutorial.org/

**網站概述**

MySQL Tutorial 是一個綜合學習平台，幫助開發者和資料庫愛好者快速、輕鬆且有趣地掌握 MySQL。提供從基礎到進階的系統化教學內容。

**學習路徑分類**

| 類別 | 主要內容 |
|------|--------|
| **入門指南** | MySQL 安裝、連線、範例資料庫載入 |
| **基礎教學** | SELECT、WHERE、JOIN、GROUP BY 等查詢操作 |
| **進階主題** | Stored Procedures、Triggers、Views、Indexes、JSON |
| **資料庫管理** | 安全性、維護、備份和復原 |
| **程式語言整合** | PHP、Python、Node.js、Java、Perl 連接方式 |
| **函數教學** | 聚合、日期、字串、正規表達式、窗口函數 |

**資料管理涵蓋範圍**

- **查詢操作**：SELECT、ORDER BY、DISTINCT、WHERE、JOIN、Subquery
- **資料操作**：INSERT、UPDATE、DELETE、TRUNCATE
- **表格管理**：CREATE、ALTER、DROP、臨時表、Generated Columns
- **資料型態**：INT、VARCHAR、DATETIME、ENUM、BLOB 等
- **約束條件**：PRIMARY KEY、FOREIGN KEY、UNIQUE、CHECK

**建議學習流程**

1. 初級階段：完成五步驟入門指南建立本地資料庫
2. 中級階段：學習基礎查詢和資料操作
3. 進階階段：探索 Stored Procedures 和 Triggers
4. 實戰階段：使用特定程式語言與 MySQL 互動

**進階功能**

- **Window Functions** - 用於分析和排序操作
- **JSON 支持** - 原生 JSON 資料型態和函數
- **Full-Text Search** - 全文搜尋能力
- **ROLLUP 和 INTERSECT/EXCEPT** - 複雜資料聚合

**特色學習資源**

- 實作範例：所有教學均包含實際可執行的代碼
- 互動練習：提供 TryIt 功能進行即時實驗
- 參考工具：MySQL Cheat Sheet 快速查閱

---

### 影片

- [MySQL Complete Course](https://www.youtube.com/watch?v=5OdVJbNCSso)
- [Explore top posts about MySQL](https://app.daily.dev/tags/mysql?ref=roadmapsh)

### 其他資源

- [MySQL](https://www.mysql.com/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
