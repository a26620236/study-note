# Circuit Breaker

## 簡介

Circuit breaker pattern protects systems from failures by temporarily stopping operations when overloaded. Has three states: closed (normal), open (stopped operations), and half-open (testing recovery). Prevents cascading failures in distributed systems.

## 學習資源

### 文章

#### 1. The Circuit Breaker Pattern - Aerospike
> 原文：[https://aerospike.com/blog/circuit-breaker-pattern/](https://aerospike.com/blog/circuit-breaker-pattern/)

**什麼是 Circuit Breaker 模式**

Circuit Breaker 是一種設計模式，通過監控服務交互並在失敗時停止流量，防止分散式系統中的級聯故障——類似於電器電路斷路器保護電器設備。

**三大狀態**

| 狀態 | 說明 |
|------|------|
| **Closed（關閉）** | 請求正常傳遞到服務 |
| **Open（開路）** | 流量被阻塞，電路因過多失敗而「跳閘」 |
| **Half-Open（半開）** | 允許有限的測試請求驗證服務是否恢復 |

**工作機制**

在滾動時間窗口內追蹤失敗次數。當失敗次數超過閾值，「電路跳閘，停止對失敗服務的流量」。如果半開狀態的測試請求成功，斷路器關閉；失敗則重新開路。

**主要優勢**
- **防止負載放大**：阻止在中斷期間的連接循環和資源耗盡
- **避免亞穩態故障**：打破失敗自我延續的反饋循環
- **啟用優雅降級**：應用程式通過回退機制（重試、死信佇列等）處理異常
- **減少級聯故障**：將問題隔離以防止全系統中斷

#### 2. Circuit Breaker Pattern - Azure Architecture Center
> 原文：[https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

**適用場景**
- 防止對可能失敗的遠端服務進行過多調用
- 基於實時失敗信號進行智能流量路由
- 防止慢速依賴拖垮服務級別目標（SLO）

**不適用場景**
- 訪問本地私有資源（斷路器增加不必要開銷）
- 作為業務邏輯中的異常處理替代
- 已有完善重試算法的場景
- 訊息驅動/事件驅動架構（通常有內建失敗隔離機制）

**與 Retry 模式的區別**：Retry 模式期望操作最終成功後重試；Circuit Breaker 防止應用程式執行可能失敗的操作。兩者可以組合使用。

- [Circuit Breaker - AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_mitigate_interaction_failure_graceful_degradation.html)

### 影片

- [What is the Circuit Breaker Pattern?](https://www.youtube.com/watch?v=ADHcBxEXvFA)
- [Back to Basics: Static Stability Using a Circuit Breaker Pattern](https://www.youtube.com/watch?v=gy1RITZ7N7s)

### 其他資源

- [Circuit Breaker - Azure Architecture Patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
- [Resilience4j - Circuit Breaker Library for Java](https://github.com/resilience4j/resilience4j)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
