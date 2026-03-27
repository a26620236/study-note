# CQRS

## 簡介

CQRS (Command Query Responsibility Segregation) separates read and write operations for data stores. Commands handle modifications, queries handle retrieval. Allows independent scaling and optimization of read/write sides, improving performance in complex systems but adding complexity.

## 學習資源

### 文章

#### 1. CQRS - Martin Fowler
> 原文：[https://martinfowler.com/bliki/CQRS.html](https://martinfowler.com/bliki/CQRS.html)

**什麼是 CQRS**

CQRS（Command Query Responsibility Segregation）意指「使用不同的模型來更新信息，而非使用同一模型來讀取信息」。

**核心概念**
- **Command 模型**：處理更新/寫入操作
- **Query 模型**：處理數據讀取/查詢操作
- 兩種模型可以在不同進程或獨立硬件上運行，甚至使用不同資料庫

**適用場景**
1. **複雜領域**：分離讀寫邏輯降低整體複雜性
2. **高性能系統**：讀寫請求量差異大，允許獨立擴展

**Martin Fowler 的重要警告**

> CQRS 是一個重大的思維跳躍，大多數情況不適合使用。對整個系統應用 CQRS 會增加不必要的複雜性。

應僅在特定系統部分（bounded context）使用，而非整個系統。

#### 2. CQRS Pattern - microservices.io
> 原文：[https://microservices.io/patterns/data/cqrs.html](https://microservices.io/patterns/data/cqrs.html)

**問題背景**

微服務架構中，各服務擁有獨立資料庫，查詢需要跨多個服務時難以實現。Event Sourcing 使數據讀取更加複雜。

**解決方案**

創建專用的只讀視圖資料庫（針對特定查詢優化）。系統通過消費「數據擁有服務發布的 Domain Events」來維護這個副本。

**優勢**
- 支持多個反規範化的高性能視圖
- 更好的關注點分離，命令和查詢模型更簡單
- 對 Event Sourcing 系統至關重要

**劣勢**
- 架構複雜性增加
- 可能出現代碼重複
- 複製延遲（最終一致性視圖）

- [CQRS and Event Sourcing](https://www.eventstore.com/blog/why-use-cqrs)

### 影片

- [Learn CQRS Pattern in 5 minutes!](https://www.youtube.com/watch?v=eiut3FIY1Cg)
- [CQRS and Event Sourcing Explained](https://www.youtube.com/watch?v=mjFiRFJuMRs)

### 其他資源

- [CQRS Pattern - Azure Architecture Center](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
