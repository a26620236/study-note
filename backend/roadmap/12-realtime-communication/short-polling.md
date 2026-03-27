# Short Polling

## 簡介

Short polling sends periodic requests to server at regular intervals to check for updates. Simple to implement and HTTP-compatible but inefficient due to frequent requests and latency. Contrasts with long polling and WebSockets. Used when real-time requirements are less stringent.

## 學習資源

### 文章

#### 1. Amazon SQS Short and Long Polling
> 原文：[https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html)

**Short Polling vs Long Polling 比較**

| 面向 | Short Polling | Long Polling |
|------|---------------|--------------|
| **伺服器覆蓋** | 部分伺服器（隨機加權） | 所有伺服器 |
| **回應時間** | 立即回應（即使無訊息） | 等待訊息（最多 20 秒） |
| **空回應** | 頻繁出現 | 減少或消除 |
| **成本** | 較高（更多請求） | 較低（更少請求） |
| **設置方式** | `WaitTimeSeconds = 0`（默認） | `WaitTimeSeconds > 0` |

**何時使用 Short Polling**
- 需要立即回應
- 成本低於延遲的重要性
- 訊息非常頻繁到達

**何時使用 Long Polling**
- 降低成本優先
- 空回應是問題
- 可接受最多 20 秒延遲
- 想高效查詢所有可用訊息

**注意**：Long Polling 最大等待時間為 **20 秒**

### 影片

- [Short Polling vs Long Polling vs WebSockets](https://www.youtube.com/watch?v=ZBM28ZPlin8)


---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
