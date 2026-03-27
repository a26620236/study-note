# Profiling Performance

## 簡介

Performance profiling analyzes system behavior to identify bottlenecks and optimization opportunities. Collects data on CPU, memory, I/O operations, and execution times. Provides insights into code performance, highlighting slow operations for targeted improvements and enhanced responsiveness.

## 學習資源

### 文章

#### 1. How to Profile SQL Queries for Better Performance - Servebolt
> 原文：[https://servebolt.com/articles/profiling-sql-queries/](https://servebolt.com/articles/profiling-sql-queries/)

**什麼是 SQL Query Profiling**

SQL 查詢分析「是一種分析資料庫查詢、評估其性能並識別潛在問題的方法」。慢查詢顯著影響用戶體驗和 TTFB（Time to First Byte）——搜尋引擎用於排名的指標。

**為什麼重要**

Web 應用程式每個頁面加載可能運行 10-100 個資料庫查詢，即使一個低效查詢也會降低整體性能。

**七種分析方法**

| 方法 | 說明 |
|------|------|
| **EXPLAIN EXTENDED** | 顯示查詢執行詳情、使用的索引和行檢查 |
| **EXPLAIN ANALYZE** | 返回實際執行指標，包括運行時間和檢查的行數 |
| **Slow Query Log** | 內建功能，記錄超過時間閾值的查詢 |
| **Visual Explain Plans** | MySQL Workbench 中的查詢執行圖形樹形結構 |
| **MySQL Tuner** | 推薦性能改進的命令行腳本 |
| **Third-Party Profilers** | Percona Toolkit 等工具提供高級功能 |
| **Monitoring Tools** | Prometheus、Grafana、Nagios 用於實時追蹤 |

**關鍵優化技術**：**索引（Indexing）** — 為頻繁查詢的數據創建數據結構指針，大幅減少全表掃描，對 WordPress 插件尤為重要

### 影片

- [Performance Profiling](https://www.youtube.com/watch?v=MaauQTeGg2k)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
