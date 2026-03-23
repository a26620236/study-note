# Migrations

## 簡介

Database migrations are version-controlled incremental schema changes that modify database structure without affecting existing data. Ensure consistent, repeatable evolution across environments while maintaining compatibility. Executed using tools like Liquibase, Flyway, or ORM features.

## 學習資源

### 文章

#### 1. What are Database Migrations?
> 原文：https://www.prisma.io/dataguide/types/relational/what-are-database-migrations

**主要概念**

Database migrations 是針對 relational database 中物件結構進行修改的受控變更集合。這些工具幫助開發者以程式化方式管理資料庫 schema 的演變。

**核心目標**

- 使資料庫變更**可重複執行**
- 支援**團隊共享**
- 確保變更**可測試且無資料損失**

**Migration 系統的優勢**

| 優勢 | 說明 |
|------|------|
| **版本控制整合** | 變更可存入版本控制系統，追蹤歷史 |
| **可審查性** | 每項變更都能檢查、測試和調整 |
| **自動化支援** | 減少手動操作的大部分工作 |
| **環境一致性** | 同一套遷移檔可應用於多個資料庫系統 |

**兩大遷移策略**

1. **State-Based Migrations（狀態型）**
   - 建立描述完整資料庫最終狀態的檔案
   - 比較現有狀態與目標狀態
   - 自動產生變更操作檔案
   - 適合 schema 相對穩定的專案

2. **Change-Based Migrations（變更型）**
   - 從已知狀態逐步定義操作序列
   - 多個遷移檔依序堆疊
   - 內部追蹤哪些遷移已執行
   - 支援快速迭代開發

**開發階段最佳實踐**

1. 初始化空資料庫時產生首個遷移檔
2. 需求變化時立即定義 schema 變更
3. 與程式碼變更一併提交審查
4. 避免破壞性操作（改用「軟刪除」或重新命名）

**關鍵風險**

| 風險類型 | 原因 | 應對方式 |
|---------|------|---------|
| 資料遺失 | 工具產生錯誤假設 | 手動審查每個遷移檔 |
| 狀態不一致 | 資料庫外部被修改 | 維持唯一遷移來源 |
| 應用順序錯誤 | Change-based 需確切順序 | 維持完整遷移鏈 |

**工具選擇標準**

- 框架整合度：許多網頁框架包含內建遷移系統
- 工具成熟度：選擇維護活躍、社群支援強的方案
- 檔案格式可讀性：優先選擇 SQL 或專案語言撰寫的檔案
- 額外功能：回滾能力、遷移檢查、檔案壓縮等

**關鍵建議**

- 將 schema 變更視為與程式碼同等重要的變更
- 部署前務必在多個環境逐層驗證
- 保留完整備份以防遷移失敗
- 選擇與開發框架相容的遷移工具

---

### 影片

- [Database Migrations for Beginners](https://www.youtube.com/watch?v=dJDBP7pPA-o)


---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
