# Observability

## 簡介

Observability monitors system internal state through external outputs like metrics, logs, and traces. Involves collecting, analyzing, and visualizing data for performance insights, anomaly detection, and troubleshooting. Enables proactive management and rapid issue response.

## 學習資源

### 文章

#### 1. Observability and Instrumentation - New Relic
> 原文：[https://newrelic.com/blog/best-practices/observability-instrumentation](https://newrelic.com/blog/best-practices/observability-instrumentation)

**什麼是 Observability**

Observability（可觀察性）指「根據系統輸出（指標、日誌、追蹤）理解系統內部狀態的能力」，實現跨應用和服務的完整可見性。

**什麼是 Instrumentation**

Instrumentation（儀器化）是將監控代碼嵌入應用程式和基礎設施以收集可觀察性數據的過程。它讓系統能夠生成理解行為所需的訊號。

**兩者關係**

Instrumentation 是實現 Observability 的機制。沒有適當的儀器化代碼，系統就無法產生實現可見性所需的數據。

**為什麼重要**
- 在問題影響用戶前快速偵測和解決
- 理解分散式架構中的系統性能
- 將技術指標與業務結果相關聯
- 通過全面可見性減少故障排除時間

**四大核心組件**

| 組件 | 說明 |
|------|------|
| **Metrics（指標）** | 系統性能的數值測量 |
| **Logs（日誌）** | 詳細的事件記錄 |
| **Traces（追蹤）** | 跨服務的分散式事務路徑 |
| **OpenTelemetry** | 跨語言和平台收集儀器化數據的標準化框架 |

### 其他資源

- [DataDog Docs](https://docs.datadoghq.com/)
- [AWS CloudWatch Docs](https://aws.amazon.com/cloudwatch/getting-started/)
- [Sentry Docs](https://docs.sentry.io/)

### 影片

- [What is observability?](https://www.youtube.com/watch?v=--17See0KHs)
- [Explore top posts about Observability](https://app.daily.dev/tags/observability?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
