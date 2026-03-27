# Horizontal/Vertical Scaling

## 簡介

Horizontal scaling (scaling out/in) adds/removes resource instances like servers to distribute workload across multiple nodes for performance and redundancy. Vertical scaling (scaling up/down) increases/decreases single instance resources (CPU, memory, storage) but has hardware capacity limits.

## 學習資源

### 文章

#### 1. Horizontal vs Vertical Scaling
> 原文：[https://touchstonesecurity.com/horizontal-vs-vertical-scaling-what-you-need-to-know/](https://touchstonesecurity.com/horizontal-vs-vertical-scaling-what-you-need-to-know/)

**水平擴展（Horizontal Scaling / Scale Out/In）**

添加或移除資源實例（如伺服器），將工作負載分散到多個節點，提升性能和冗餘性。

**垂直擴展（Vertical Scaling / Scale Up/Down）**

增加或減少單一實例的資源（CPU、記憶體、存儲），但受硬體容量上限限制。

**比較**

| 面向 | 水平擴展 | 垂直擴展 |
|------|---------|---------|
| **方式** | 增加更多機器/節點 | 升級現有機器的硬體 |
| **上限** | 理論上無限（受成本限制） | 受硬體最大規格限制 |
| **複雜性** | 需要負載均衡、分散式系統設計 | 更簡單，應用程式通常無需修改 |
| **停機時間** | 通常無需停機 | 通常需要重啟/停機 |
| **成本** | 線性增長，可根據需求調整 | 大型硬體費用昂貴 |
| **故障容忍** | 高（多個實例） | 低（單點故障） |
| **適合場景** | 微服務、無狀態服務、Web 伺服器 | 資料庫、有狀態應用 |

**現代最佳實踐**：雲端架構通常優先考慮水平擴展，搭配自動擴展（Auto Scaling）根據需求動態調整實例數量。

### 影片

- [Vertical Vs Horizontal Scaling: Key Differences You Should Know](https://www.youtube.com/watch?v=dvRFHG2-uYs)
- [System Design 101](https://www.youtube.com/watch?v=Y-Gl4HEyeUQ)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
