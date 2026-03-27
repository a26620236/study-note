# ACID

## 簡介

ACID represents four database transaction properties: Atomicity (all-or-nothing execution), Consistency (valid state maintenance), Isolation (concurrent transaction separation), and Durability (permanent commit survival). These principles ensure reliable data processing and integrity in database systems, crucial for financial and e-commerce applications.

## 學習資源

### 文章

#### 1. What is ACID Compliant Database?
> 原文：https://retool.com/blog/whats-an-acid-compliant-database/

**主要概念和定義**

ACID 是資料庫事務 (Transaction) 的四項核心原則：

| 原則 | 定義 | 說明 |
|------|------|------|
| **Atomicity** | 原子性 | 交易要麼完全發生，要麼根本不發生 |
| **Consistency** | 一致性 | 確保交易前後資料保持一致 |
| **Isolation** | 隔離性 | 多個交易可同時進行而不互相干擾 |
| **Durability** | 耐久性 | 交易成功後對系統故障具有抵抗力 |

**常見交易錯誤類型**

- **Dirty Reads（髒讀）**：未提交的資料被其他交易讀取，導致顯示錯誤資訊
- **Non-Repeatable Reads（不可重複讀）**：同一交易內的兩次讀取顯示不同結果
- **Phantom Reads（幻讀）**：交易讀取資料後，其他交易插入新資料，導致第二次讀取顯示新增資料

**ACID 實現機制**

鎖定系統 (Locking)：
```
交易開始 → 獲取鎖定 → 執行操作 → 提交或中止 → 釋放鎖定
```

**NoSQL 與 BASE 模型**

NoSQL 資料庫採用較寬鬆的 BASE 標準：
- **Basic Availability**：資料庫大部分時間可用
- **Soft-State**：節點間不一定時刻一致
- **Eventual Consistency**：資料最終會達到一致狀態

---

#### 2. What is ACID Compliance?: Atomicity, Consistency, Isolation
> 原文：https://fauna.com/blog/what-is-acid-compliance-atomicity-consistency-isolation（Fauna 公司已於 2024 年關閉，此 URL 永久失效）

**ACID 合規性的重要性**

ACID 合規性是評估資料庫可靠性的關鍵標準，對於金融、電商等需要資料精確性的應用至關重要。

**四大特性深入解析**

**Atomicity（原子性）**

事務中所有操作要麼全部成功，要麼全部回滾，絕無中間狀態。

```
範例：銀行轉帳
  借方帳戶 -$100   ←  若任一步驟失敗
  貸方帳戶 +$100   ←  整個事務皆回滾
```

**Consistency（一致性）**

每次事務執行後，資料庫必須保持在一個合法的狀態，不違反任何預定義的規則（約束、觸發器、cascade 規則）。

- 帳戶餘額不可為負數
- 外鍵關係保持完整性
- 唯一性約束不被破壞

**Isolation（隔離性）**

並行執行的事務互不干擾，每個事務看到的資料就如同沒有其他事務在同時執行。

| 隔離問題 | 說明 |
|---------|------|
| **Dirty Read** | 讀取到其他事務未提交的資料 |
| **Non-Repeatable Read** | 同一事務內兩次讀取結果不同 |
| **Phantom Read** | 同一事務內查詢結果集出現新增或刪除的行 |

**Durability（持久性）**

事務一旦提交，其結果永久保存，即使系統崩潰也不會丟失。通常通過寫入日誌（Write-Ahead Log, WAL）和持久化儲存來實現。

**ACID vs BASE**

現代分散式系統有時採用 BASE 模型（放寬 ACID 限制以換取可擴展性）：

| | ACID | BASE |
|-|------|------|
| **一致性** | 強一致性 | 最終一致性 |
| **可用性** | 相對較低 | 高可用 |
| **適用場景** | 金融、醫療等關鍵系統 | 社交媒體、內容分發 |
| **代表資料庫** | PostgreSQL、MySQL | Cassandra、DynamoDB |

---

#### 3. A Beginner's Guide to ACID and Database Transactions
> 原文：https://vladmihalcea.com/a-beginners-guide-to-acid-and-database-transactions/

**事務的定義**

事務是一組讀寫操作的集合，只有當所有包含的操作都成功時，整個事務才會成功。每條 SQL 語句都必須在事務範圍內執行。

**ACID 四大特性**

| 特性 | 定義 | 說明 |
|------|------|------|
| **Atomicity** | 原子性 | 全或無操作，將多個操作轉化為不可分割的工作單位 |
| **Consistency** | 一致性 | 約束強制執行，確保每個已提交的事務都滿足所有約束條件 |
| **Isolation** | 隔離性 | 並發控制，隱藏未提交的狀態變化 |
| **Durability** | 持久性 | 永久記錄，成功提交的事務永久改變系統狀態 |

**隔離級別**

SQL 標準定義四個隔離級別：

| 隔離級別 | Dirty Read | Non-repeatable Read | Phantom Read |
|---------|-----------|-------------------|--------------|
| READ_UNCOMMITTED | ✓ 允許 | ✓ 允許 | ✓ 允許 |
| READ_COMMITTED | ✗ 防止 | ✓ 允許 | ✓ 允許 |
| REPEATABLE_READ | ✗ 防止 | ✗ 防止 | ✓ 允許 |
| SERIALIZABLE | ✗ 防止 | ✗ 防止 | ✗ 防止 |

**主流數據庫默認隔離級別**

| 數據庫 | 默認級別 |
|------|---------|
| Oracle | READ_COMMITTED |
| MySQL | REPEATABLE_READ |
| SQL Server | READ_COMMITTED |
| PostgreSQL | READ_COMMITTED |

**最佳實踐**

- 避免自動提交模式，明確定義事務邊界
- READ_COMMITTED 通常是最佳選擇
- 根據業務需求權衡性能與一致性
- 考慮使用悲觀鎖或樂觀鎖機制應對高並發場景

---

### 影片

- [ACID Explained: Atomic, Consistent, Isolated & Durable](https://www.youtube.com/watch?v=yaQ5YMWkxq4)
- [ACID Transactions (Explained by Example)](https://www.youtube.com/watch?v=pomxJOFVcQs)

### 其他資源

- [Database System Concepts - Silberschatz, Korth, Sudarshan](https://db-book.com/)
- [PostgreSQL Tutorial on Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
