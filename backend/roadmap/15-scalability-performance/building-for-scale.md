# Building for Scale

## 簡介

Scalability is a system's ability to handle growing workload by adding resources. Scalable architecture supports higher workloads without fundamental changes. Two approaches: on-premises (requires planning) or cloud (flexible, easy upgrades). Cloud offers more flexibility than on-premises infrastructure.

## 學習資源

### 文章

#### 1. Scalable Architecture - SentinelOne
> 原文：[https://www.sentinelone.com/blog/scalable-architecture/](https://www.sentinelone.com/blog/scalable-architecture/)

**什麼是 Scalable Architecture**

可擴展架構是「系統通過添加資源來處理增長工作負載的能力」，無需從根本上重新設計。

**四大核心原則**

| 原則 | 說明 |
|------|------|
| **無狀態性（Statelessness）** | 設計無狀態系統，讓負載均衡器可跨多個實例分配流量；狀態存放在專用數據層 |
| **鬆散耦合（Loose Coupling）** | 獨立子系統允許針對性修改，微服務架構的核心優勢 |
| **非同步處理（Async Processing）** | 使用訊息佇列和事件驅動模式解耦組件，防止速度差異造成的瓶頸 |
| **使用托管基礎設施** | 利用雲原生解決方案（托管 Kubernetes、分散式資料庫、物件存儲）減少運維負擔 |

**要避免的反模式**
- 預測遙遠的未來需求
- 大爆炸式發布（Big Bang releases）而非增量變更
- 依賴直覺而非數據
- 避免實驗

**關鍵支撐**：**可觀察性（Observability）** — 收集日誌、指標和追蹤，基於數據做出擴展決策。

### 影片

- [Scaling Distributed Systems - Software Architecture Introduction](https://www.youtube.com/watch?v=gxfERVP18-g)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
