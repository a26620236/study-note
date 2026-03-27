# Server Sent Events

## 簡介

Server-Sent Events (SSE) sends real-time updates from server to client over persistent HTTP connection. Enables efficient server push with automatic reconnection. Ideal for one-way communication like live notifications using simple text-based format and EventSource API.

## 學習資源

### 文章

#### 1. Server-Sent Events - MDN
> 原文：[https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

**什麼是 SSE**

SSE 讓伺服器在任意時刻向網頁推送數據，無需網頁主動請求。這反轉了傳統的請求/回應模型（客戶端發起 → 伺服器回應）。

**傳統 HTTP vs SSE**

| 傳統 | SSE |
|------|-----|
| 網頁 → 請求 → 伺服器（客戶端發起） | 伺服器 → 推送訊息 → 網頁（伺服器發起） |

**EventSource API**

```javascript
const eventSource = new EventSource('server-endpoint');

eventSource.onmessage = (event) => {
  console.log(event.data); // 處理伺服器數據
};

eventSource.onerror = () => {
  eventSource.close();
};
```

**主要特性**
- 單向通訊（伺服器 → 客戶端）
- 比輪詢更低的開銷
- 自動重新連接
- 可在 Web Workers 中使用

**最適合**：實時更新（動態消息、通知、即時數據）的單向通訊場景

**相關**：WebSockets（用於雙向通訊）

### 影片

- [Server-Sent Events | Postman Level Up](https://www.youtube.com/watch?v=KrE044J8jEQ&t=1s)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
