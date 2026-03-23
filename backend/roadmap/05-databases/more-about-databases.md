# Databases

## 簡介

A database is a structured collection of useful data that serves as an organizational asset. A database management system (DBMS) is software designed to maintain and extract large data collections efficiently and timely.

## 學習資源

### 文章

#### 1. Oracle: What is a Database?
> 原文：https://www.oracle.com/database/what-is-database/

**主要概念**

數據庫是一個有組織的結構化信息集合，通常以電子方式儲存在計算機系統中。它由數據庫管理系統（DBMS）控制，結合應用程序形成完整的數據庫系統。

**DBMS 的主要職責**

| 功能類型 | 具體內容 |
|---------|--------|
| 數據管理 | 創建、編輯、維護文件和記錄 |
| 性能優化 | 監控、調整、備份和恢復 |
| 訪問控制 | 多用戶訪問管理和安全控制 |
| 數據查詢 | 支持 SQL 語言進行複雜查詢 |

**SQL（結構化查詢語言）**

SQL 是被幾乎所有關係型數據庫用來查詢、操縱和定義數據的編程語言。1970 年代由 IBM 開發，Oracle 作為主要貢獻者。

**數據庫 vs 電子表格**

| 特性 | 數據庫 | 電子表格 |
|------|------|--------|
| 設計用途 | 海量數據存儲 | 單用戶或小團隊 |
| 用戶規模 | 多用戶同時訪問 | 有限用戶 |
| 數據複雜度 | 支持複雜邏輯 | 簡單操作 |
| 數據量 | 大規模數據 | 中小規模數據 |

**主要數據庫類型**

傳統型：
- **關係型數據庫** - 行列表格結構，1980 年代主流
- **物件導向數據庫** - 使用物件表示信息
- **分佈式數據庫** - 多個位置文件，支持不同網絡

現代型：
- **NoSQL 數據庫** - 允許非結構化和半結構化數據存儲
- **圖數據庫** - 存儲實體及其關係
- **雲數據庫** - 私有/公有/混合雲平台
- **自驅動數據庫** - 使用機器學習自動化管理任務

**當前挑戰**

- 數據量急劇增長
- 數據安全威脅增加
- 實時訪問需求
- 基礎設施維護負擔
- 可擴展性限制

---

#### 2. Prisma.io: What are Databases?
> 原文：https://www.prisma.io/dataguide/intro/what-are-databases

**核心定義**

資料庫是用於組織和存儲數據以供未來處理、檢索或評估的邏輯結構。由 DBMS（資料庫管理系統）進行管理。

**資料儲存類型**

| 儲存類型 | 持久性 | 優勢 | 範例 |
|---------|-------|------|------|
| 磁碟儲存 | 是 | 資料長期保留 | MySQL |
| 記憶體儲存 | 否 | 操作速度快 | memcached |

**四大互動類型**

1. **資料定義（Data Definition）** - 創建、修改、移除資料結構定義
2. **資料更新（Update）** - 新增、修改、刪除資料（寫入操作）
3. **資料檢索（Retrieval）** - 提取儲存的資料（讀取操作）
4. **管理功能（Administration）** - 用戶管理、備份、性能監控

**資料庫的主要責任**

- **資料完整性保護** - 確保資料可靠檢索，採用 checksum 驗證和 write-ahead logs
- **性能要求** - 使用 indexing（索引）優化常見操作
- **並發訪問管理** - 支持多個用戶同時工作，實現記錄鎖定和 transactions
- **資料聚合和檢索** - 支持搜索、過濾、排序和計算

**應用領域**

- **網站和應用數據** - 存儲產品信息、庫存、用戶檔案
- **商業智能和分析** - 分析銷售趨勢、識別客戶
- **配置管理** - 儲存軟體配置值
- **日誌和事件收集** - 收集系統日誌、追蹤事件

**不同角色的工作方式**

- **資料架構師** - 負責資料庫系統的宏觀結構
- **DBA（資料庫管理員）** - 保持資料系統順利運行
- **應用開發者** - 開發與資料庫互動的應用
- **SRE 和運營專業人員** - 從基礎設施角度管理資料庫
- **資料分析師** - 執行讀取操作分析現有資料

**開發者最佳實踐**

- 使用 ORM（Object-Relational Mapper）轉換資料
- 採用 database migration（資料庫遷移）保持結構同步
- 限制應用的資料庫訪問權限
- 對用戶輸入進行清理防止注入攻擊

---

### 影片

- [Explore top posts about Backend Development](https://app.daily.dev/tags/backend?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
