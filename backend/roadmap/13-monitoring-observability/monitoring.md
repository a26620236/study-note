# Monitoring

## 簡介

Monitoring involves continuously collecting, analyzing, and alerting on metrics, logs, and traces from applications and infrastructure. It helps detect issues early, understand performance bottlenecks, and ensure system reliability. Key tools include Prometheus for metrics collection, Grafana for dashboards and visualization, and distributed tracing tools like Jaeger or Zipkin.

## 學習資源

### 文章

#### 1. Monitoring Distributed Systems - Google SRE Book
> 原文：[https://sre.google/sre-book/monitoring-distributed-systems/](https://sre.google/sre-book/monitoring-distributed-systems/)

**四個黃金訊號（Four Golden Signals）**

Google 建議對面向用戶的系統重點關注四個指標：

| 訊號 | 說明 |
|------|------|
| **Latency（延遲）** | 服務請求所需時間，需區分成功請求和失敗請求的延遲 |
| **Traffic（流量）** | 需求強度（如每秒請求數） |
| **Errors（錯誤）** | 失敗請求的比率（明確失敗或隱性失敗） |
| **Saturation（飽和度）** | 服務「有多滿」，強調最受限資源 |

**監控方法**

| 方法 | 說明 |
|------|------|
| **Black-box Monitoring** | 測試用戶實際體驗的外部行為，適合偵測活躍問題 |
| **White-box Monitoring** | 檢查內部指標，能夠偵測即將發生的故障 |

**症狀 vs 原因**

有效監控需區分「什麼壞了」（症狀）和「為什麼」（原因）。這個區分防止雜訊，因為「某人的症狀是另一人的原因」在分層系統中很常見。

**高品質告警的標準**
- 偵測到其他方式無法發現的、緊急且可操作的條件
- 指示實際用戶影響
- 值得智能人工響應（而非機械反應）
- 解決新問題

**設計原則**：監控系統應保持簡單易懂，避免過於複雜的依賴層次結構。「每個告警都應該是可操作的」。

- [Top Monitoring Tools](https://thectoclub.com/tools/best-application-monitoring-software/)

### 影片

- [Prometheus and Grafana Tutorial for Beginners](https://www.youtube.com/watch?v=9TJx7QTrTyo)
- [Grafana Explained in 5 Minutes](https://www.youtube.com/watch?v=lILY8eSspEo)
- [Explore top posts about Monitoring](https://app.daily.dev/tags/monitoring?ref=roadmapsh)

### 其他資源

#### Prometheus
> 原文：[https://prometheus.io/docs/introduction/overview/](https://prometheus.io/docs/introduction/overview/)

Prometheus 是「最初在 SoundCloud 構建的開源系統監控和警報工具包」，現由 Cloud Native Computing Foundation 維護。

**核心特性**
- 帶有指標名稱和標籤的多維數據模型
- PromQL 查詢語言
- 通過 HTTP Pull-based 指標收集
- 支持服務發現和靜態配置

**架構組件**

| 組件 | 說明 |
|------|------|
| **Prometheus Server** | 抓取和儲存時間序列數據的核心組件 |
| **Client Libraries** | 應用程序儀器化工具 |
| **Push Gateway** | 支持短期任務的指標 |
| **Exporters** | 第三方服務的適配器 |
| **Alertmanager** | 告警處理系統 |

**優勢**：在微服務世界中，「對多維數據收集和查詢的支持是其特別優勢」。在動態架構中的可靠性監控方面表現出色。

- [Grafana Documentation](https://grafana.com/docs/grafana/latest/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
