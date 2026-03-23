# Memcached

## 簡介

Memcached is a distributed memory-caching system that speeds up dynamic websites by caching data and objects in RAM. Provides large distributed hash table across multiple machines with LRU eviction. Applications layer requests in RAM before falling back to slower backing stores.

## 學習資源

### 文章

#### 1. Memcached Tutorial
> 原文：[https://www.tutorialspoint.com/memcached/index.htm](https://www.tutorialspoint.com/memcached/index.htm)

**Memcached 是什麼**

Memcached 是一個開源、高效能、分散式的記憶體物件快取系統（open source, high-performance, distributed memory object caching system）。它是一種用於提升系統效能的快取解決方案。

**主要特性和優勢**

- **開源架構**：免費且社群支持
- **高效能**：利用記憶體（RAM）進行快速資料存取
- **分散式設計**：支援多機器部署
- **物件快取**：能夠快取各類資料物件

**使用場景**

適用於需要建立和部署高度可擴展且效能導向的系統，特別是需要提升資料存取速度的應用程式。

**基本操作**

教學涵蓋以下核心操作：
- **資料操作**：Set（設定）、Add（新增）、Replace（替換）、Append（附加）、Prepend（前置）、CAS（檢查並設定）
- **檢索命令**：Get（獲取）、Delete（刪除）、Incr/Decr（遞增/遞減）
- **統計功能**：Stats（統計）、Stats Items、Stats Slabs、Stats sizes

**學習前置知識**

需要具備基本資料結構知識。

### 影片

- [Redis vs Memcached](https://www.youtube.com/watch?v=Gyy1SiE8avE)

### 其他資源

- [memcached/memcached](https://github.com/memcached/memcached#readme)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
