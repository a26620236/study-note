# Instrumentation, Monitoring, and Telemetry

## 簡介

Instrumentation embeds code to capture metrics, logs, and traces. Monitoring observes real-time metrics for anomalies and performance issues using dashboards and alerts. Telemetry automates data collection from distributed systems. Together they provide system health insights and proactive issue resolution.

## 學習資源

### 文章

#### 1. What is Instrumentation? - Wikipedia
> 原文：[https://en.wikipedia.org/wiki/Instrumentation_(computer_programming)](https://en.wikipedia.org/wiki/Instrumentation_%28computer_programming%29)

**什麼是 Instrumentation**

Instrumentation 是「修改軟體以便對其進行分析的行為」，通過改變源代碼或二進制代碼讓程序能夠被檢查。

**主要方法**

| 方法 | 說明 |
|------|------|
| **源碼/二進制代碼修改** | 直接修改程序代碼 |
| **執行環境介面** | 使用 JVMTI 等工具在程序啟動時進行儀器化 |

**主要用途**
- **性能分析（Profiling）**：在測試執行期間測量動態行為
- **事件日誌記錄**：捕獲故障和操作開始/結束點
- **持續時間測量**：追蹤操作所需時間
- **性能分析**：檢查難以靜態分析的屬性

**主要限制**
1. **執行覆蓋率**：只收集實際執行的代碼路徑的數據
2. **性能開銷**：增加程序執行時間，可能顯著影響性能

**相關技術**：Hooking、DTrace、Java Management Extensions (JMX)、動態重新編譯

- [What is Monitoring?](https://www.yottaa.com/performance-monitoring-backend-vs-front-end-solutions/)
- [What is Telemetry?](https://www.sumologic.com/insight/what-is-telemetry/)

### 影片

- [Observability vs. APM vs. Monitoring](https://www.youtube.com/watch?v=CAQ_a2-9UOI)
- [Explore top posts about Monitoring](https://app.daily.dev/tags/monitoring?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
