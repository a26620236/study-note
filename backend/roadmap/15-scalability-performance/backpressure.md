# Backpressure

## 簡介

Backpressure is a flow control mechanism where receivers signal their capacity to senders, preventing system overload. It manages resource allocation, prevents memory overflows, and maintains responsiveness in reactive programming, message queues, and streaming systems.

## 學習資源

### 文章

#### 1. Backpressure - Awesome Architecture
> 原文：[https://awesome-architecture.com/back-pressure/](https://awesome-architecture.com/back-pressure/)

**什麼是 Backpressure**

Backpressure（背壓）是管理系統中數據流的機制，當處理能力有限時，通過阻止過多傳入數據防止過載。

**工作原理**

作為反饋機制：當系統飽和、無法以數據到達的速率處理時，Backpressure 向上游組件發出信號，讓它們減速或暫停傳輸。這防止佇列無限增長，維護系統穩定性。

**主要策略**

| 策略 | 說明 |
|------|------|
| **流量控制（Flow Control）** | 調節數據傳輸速率，確保下游系統不被上游生產者壓垮 |
| **佇列管理（Queue Management）** | 監控佇列深度，在資源耗盡前觸發背壓信號 |
| **優雅降級（Graceful Degradation）** | 允許系統溝通其容量限制，而非靜默丟棄數據或災難性失敗 |
| **訊息系統應用** | 在使用 Kafka、RabbitMQ 等訊息代理的非同步架構中，通過控制消費速率防止「佇列積壓災難」 |

**應用場景**：在分散式系統和響應式程式設計模式中尤為重要，是構建可擴展、具有韌性架構的基礎。

- [Backpressure explained — the flow of data through software](https://medium.com/@jayphelps/backpressure-explained-the-flow-of-data-through-software-2350b3e77ce7)
- [Handling Backpressure in Node.js Streams](https://nodejs.org/en/docs/guides/backpressuring-in-streams)

### 影片

- [What is Back Pressure](https://www.youtube.com/watch?v=viTGm_cV7lE)
- [Backpressure in Reactive Systems Explained](https://www.youtube.com/watch?v=Yb5OzHv-E6s)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
