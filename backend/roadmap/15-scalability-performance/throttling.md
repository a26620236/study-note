# Throttling

## 簡介

Throttling controls the rate of request processing to prevent system overload by setting limits on requests per time period. Manages resource consumption, ensures fair usage, maintains stability, and protects against abuse. Commonly used in APIs, networks, and databases.

## 學習資源

### 文章

#### 1. Throttling Requests - AWS Well-Architected Framework
> 原文：[https://docs.aws.amazon.com/wellarchitected/2022-03-31/framework/rel_mitigate_interaction_failure_throttle_requests.html](https://docs.aws.amazon.com/wellarchitected/2022-03-31/framework/rel_mitigate_interaction_failure_throttle_requests.html)

**什麼是 Throttling**

Throttling（節流）是一種緩解模式，當需求超過定義的容量限制時拒絕請求。被拒絕的請求返回節流訊息，通知客戶端退出或以較慢速率重試。

**為什麼使用**
- **保護系統容量**：服務設計為處理已知容量（通過負載測試確定），節流防止超載
- **防止級聯故障**：控制請求到達速率，防止系統過載
- **提升可靠性**：AWS Well-Architected Framework 可靠性支柱的組成部分

**節流技術**

| 技術 | 說明 |
|------|------|
| **Amazon API Gateway** | 提供內建的請求節流方法 |
| **Amazon SQS** | 緩衝請求，為非同步處理平滑請求速率 |
| **Amazon Kinesis** | 緩衝和減輕適當工作負載的節流需求 |

**最佳實踐**
1. 通過負載測試確定請求容量限制
2. 實時追蹤請求到達速率
3. 超過限制時返回適當的節流信號（HTTP 429）
4. 在客戶端重試邏輯中實施**指數退避和抖動（Exponential Backoff and Jitter）**
5. 結合**優雅降級（Graceful Degradation）**策略
6. 考慮非同步處理以減少節流需求

**相關模式**：錯誤重試和指數退避、優雅降級、超時和重試

### 影片

- [Throttling vs Debouncing](https://www.youtube.com/watch?v=tJhA0DrH5co)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
