# Long Polling

## 簡介

Long polling technique where server holds client requests instead of sending empty responses. Server waits for specified period for new data, responding immediately when available or after timeout. Client then immediately re-requests, creating continuous request-response cycles.

## 學習資源

### 文章

#### 1. Long Polling - javascript.info
> 原文：[https://javascript.info/long-polling](https://javascript.info/long-polling)

**什麼是 Long Polling**

Long Polling 是一種在不使用 WebSocket 或 Server-Sent Events 等專用協議的情況下維持持久伺服器連接的技術。

**工作原理（循環）**
1. 瀏覽器向伺服器發送請求
2. 伺服器保持連接開放，直到有訊息可用
3. 伺服器用訊息回應
4. 瀏覽器立即發送新請求

**與普通輪詢的比較**

| 普通輪詢（Short Polling） | Long Polling |
|--------------------------|--------------|
| 請求間隔可長達 10 秒的訊息延遲 | 消除訊息延遲 |
| 即使無訊息也浪費伺服器資源 | 減少不必要請求 |
| 實現簡單 | 同樣相對容易實現 |

**限制**
- 後端必須高效處理多個同時掛起的連接（Node.js 比 PHP/Ruby 更適合）
- 每條訊息是單獨的請求（含標頭、認證開銷）

**最適場景**：訊息稀少時。訊息頻繁時，WebSocket 或 SSE 更有效率。

### 影片

- [What is Long Polling?](https://www.youtube.com/watch?v=LD0_-uIsnOE)


---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
