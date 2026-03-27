# Load Shifting

## 簡介

Load shifting manages computing workloads by redistributing load from peak to off-peak periods. Helps balance resource demand, optimize performance, and reduce costs through job rescheduling, region switching, and dynamic resource allocation. Enhances system reliability and infrastructure utilization.

## 學習資源

### 文章

**Load Shifting 的概念**

在計算和系統架構中，Load Shifting（負載轉移）是一種通過重新分配工作負載來優化系統資源的策略：

**主要方式**

| 方式 | 說明 |
|------|------|
| **時間轉移（Time Shifting）** | 將非緊急工作（如批次作業、報告生成）從高峰期轉移到離峰期 |
| **區域轉移（Region Shifting）** | 將工作負載轉移到資源更豐富或成本更低的地理區域 |
| **服務轉移（Service Shifting）** | 使用 CDN 等服務分擔原始伺服器的靜態內容交付負擔 |
| **動態資源分配** | 雲端環境中根據即時需求動態調整資源 |

**應用場景**
- **資料庫備份**：在凌晨低峰期執行備份，避免影響白天業務
- **批量數據處理**：排程大量數據處理任務在低流量時段執行
- **CDN**：將靜態資產分發到邊緣節點，減少來源伺服器負載
- **雲端彈性**：在需求低時縮減，在需求高時擴展或使用地理分散的資源

- [Load Shifting](https://en.wikipedia.org/wiki/Load_shifting)

### 影片

- [Load Shifting 101](https://www.youtube.com/watch?v=DOyMJEdk5aE)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
