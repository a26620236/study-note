# Relational Databases

## 簡介

Relational databases organize data into structured tables with rows and columns, using SQL for querying. Enforce data integrity through keys and constraints, handle complex queries and transactions efficiently. Examples: MySQL, PostgreSQL, Oracle. Used for structured data storage and strong consistency.

## 學習資源

### 文章

#### 1. Relational Databases - IBM
> 原文：https://www.ibm.com/cloud/learn/relational-databases

**核心特性**

Relational Database 提供結構化方式，以行列形成表格來組織資料，同時維持資料一致性與完整性。Database Schema 定義並組織關聯資料庫內的資料，確保資料品質與完整性。

**核心優勢**：
- 結構化資料組織
- 資料一致性保障
- 完整性維護
- 標準化查詢語言

---

#### 2. 51 Years of Relational Databases
> 原文：https://learnsql.com/blog/codd-article-databases/

**Edgar F. Codd 與關聯式資料庫的誕生**

Edgar F. Codd 是英國數學家兼電腦科學家，二戰期間擔任英國皇家空軍飛行員。1959年移居美國，在 IBM 紐約擔任程式設計師，參與 IBM 7090 大型電腦及 STRETCH 專案開發。1967年轉調至 IBM 聖荷西研究中心，致力於關聯式資料庫研究。

**革命性論文**

1970年6月，Codd 在《美國計算機協會通訊》(ACM Communications) 發表論文《大型共享資料庫的關聯式資料模型》，僅11頁的論文用淺顯易懂的語言闡述了革命性概念。此貢獻使他於1981年獲得圖靈獎（計算機科學的最高榮譽）。

**革新前的資料庫環境**

1960年代主流的資料庫模型存在重大問題：
- **Network Model（網路模型）**：記錄以圖形結構相連
- **Hierarchical Model（階層式模型）**：記錄以樹狀結構相連

這些模型的檢索方式必須從根節點開始遍歷整個樹/圖結構，需要具備程式設計專業知識，且任何資料結構變更都需修改相關程式，缺乏彈性。

**關聯式模型的核心創新**

Codd 以數學「關係」(relation) 概念為基礎，提出更具彈性的資料組織方式：

表格結構特性：
- Codd 的「關係」在現代術語稱為「表格」(tables)
- 具有：名稱、具名欄位、統一資料型別
- 資料以列 (rows) 形式儲存，每列包含所有欄位的值

查詢語言 - Relational Algebra：
- Codd 提出的操作集合可組合使用
- 演變為現代 SQL 語法
- 將複雜程式碼簡化為簡潔的查詢語句

**商業化發展歷程**

初期推廣（1970年）：
- IBM 內部對論文的接受度不高，因為公司已有成功的 IMS 階層式資料庫
- 擔心新產品會損害既有營收

System R 計畫（1974年）：
- IBM 正式啟動研究專案探索 Codd 的理論
- 該專案決定了後續關聯式資料庫的設計標準

SQL 的誕生：
- Don Chamberlin 和 Ray Boyce 參考 Codd 的理論創造 SQL
- Chamberlin 回憶："首次接觸關聯式資料模型時豁然開朗。複雜的 DBTG 程式碼可簡化為幾行 SQL"

商業化成功（1970年代末）：
- DB2 成為 IBM 的旗艦資料庫
- 1979年 Oracle 資料庫發布（原 Relational Software 公司）
- Ingres 問世（PostgreSQL 的前身）

**對現代資料庫的影響**

主導地位確立：
- 1980年代後期成為 ISO/ANSI 標準
- 統治 1980-1990 年代的資料庫市場
- 迄今仍是重要的資料技術基礎

廣泛應用：
- 所有主流資料庫均基於此模型：PostgreSQL、MS SQL Server、MySQL 等
- 現代 IT 產業和商業決策系統的基礎

SQL 的持久生命力：
- 簡單易學的查詢語言推動非技術人員使用資料庫
- 至今仍為全球最重要的資料庫查詢標準
- SQL 人才持續高需求，是提升薪酬和職業機會的關鍵技能

---

#### 3. Intro To Relational Databases - Udacity Course
> 原文：https://www.udacity.com/course/intro-to-relational-databases--ud197

**課程概述**

Udacity 提供的免費線上課程，教授關聯式資料庫的基礎知識，學習 SQL 基礎知識及如何將 Python 代碼連接到關聯式資料庫。

**課程內容大綱**

課程共4個單元：

1. **資料與表格**
   - 關聯式數據組織原則
   - 表格、查詢、聚合、鍵和聯接

2. **SQL 基礎要素**
   - 使用 SELECT 和 INSERT 語句
   - 讀寫資料庫表中的數據

3. **Python DB-API**
   - Python 資料庫 API 使用
   - 修復資料庫相關的常見錯誤

4. **深入 SQL**
   - 創建標準化資料表設計
   - 使用鍵聲明表格間的關係
   - 從資料中得出結論

**適合對象**

適合想學習資料庫基礎知識的初學者，無需先前技術經驗，但需具備流利的英文能力。

---

### 影片

- [What is Relational Database](https://youtu.be/OqjJjpjDRLc)
- [Explore top posts about Backend Development](https://app.daily.dev/tags/backend?ref=roadmapsh)

### 其他資源

- [Databases and SQL](https://www.edx.org/course/databases-5-sql)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
