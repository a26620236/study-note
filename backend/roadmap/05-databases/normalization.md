# Database Normalization

## 簡介

Database normalization structures relational databases using normal forms to reduce data redundancy and improve integrity. Proposed by Edgar F. Codd, it organizes columns and tables to enforce proper dependencies through database constraints via synthesis or decomposition processes.

## 學習資源

### 文章

#### 1. What is Normalization in DBMS (SQL)? 1NF, 2NF, 3NF, BCNF Database with Example
> 原文：https://www.guru99.com/database-normalization.html

**主要概念**

數據庫正規化是一種設計技術，通過將大型表分解為較小、相互關聯的表，來減少數據冗餘。該過程旨在消除冗餘數據並確保數據邏輯存儲。

**核心目標**

- 消除重複數據
- 改善數據一致性
- 防止插入、更新和刪除異常
- 提高數據庫效率和可維護性

**六個正規形式層級**

| 正規形式 | 核心規則 | 應用場景 |
|---------|--------|--------|
| **1NF** | 每個單元格包含單一值，每條記錄唯一 | 基礎數據組織 |
| **2NF** | 基於 1NF，非鍵屬性完全依賴主鍵 | 移除部分依賴 |
| **3NF** | 基於 2NF，消除遞移依賴 | 實際應用中最常用 |
| **BCNF** | 3.5 正規形式，每個決定因素都是候選鍵 | 複雜多鍵場景 |
| **4NF** | 無多值依賴 | 多維數據 |
| **5NF** | PJNF，無損分解 | 理論層面 |
| **6NF** | 處理時間數據 | 尚未標準化 |

**First Normal Form (1NF) 實現步驟**

1. 確保每列包含原子值（不可分割）
2. 為每條記錄建立唯一標識符
3. 消除重複組

**Second Normal Form (2NF) 實現步驟**

1. 必須已達成 1NF
2. 建立單列主鍵
3. 將依賴於主鍵子集的數據分離到新表中
4. 使用外鍵建立表之間的關係

**Third Normal Form (3NF) 實現步驟**

1. 必須已達成 2NF
2. 移除遞移依賴（非鍵屬性間的依賴）
3. 創建額外表以分離相關數據

**關鍵概念**

- **Primary Key（主鍵）**：唯一標識表中的每條記錄，不能為 NULL
- **Foreign Key（外鍵）**：引用另一表的主鍵，確保參考完整性
- **Composite Key（複合鍵）**：由多列組成的主鍵

**異常類型和解決方案**

| 異常類型 | 定義 | 正規化如何解決 |
|---------|------|--------------|
| 插入異常 | 無法添加不完整記錄 | 分離獨立數據到新表 |
| 更新異常 | 更新未能完全同步 | 減少重複數據 |
| 刪除異常 | 刪除導致意外數據丟失 | 邏輯表分組 |

**實踐建議**

✅ 優點：
- 增進數據一致性
- 減少冗餘數據
- 改善查詢性能
- 降低異常風險

⚠️ 缺點：
- 增加複雜性
- 需要更多表連接（JOIN）
- 可能降低性能
- 需要專家知識

**行業標準**

在大多數實際應用中，正規化在第三正規形式達到最佳效果，即 3NF 通常足以滿足企業需求。

---

### 影片

- [Complete guide to Database Normalization in SQL](https://www.youtube.com/watch?v=rBPQ5fg_kiY)
- [Explore top posts about Database](https://app.daily.dev/tags/database?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
