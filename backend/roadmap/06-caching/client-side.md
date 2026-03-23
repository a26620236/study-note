# Client Side Caching

## 簡介

Client-side caching stores data locally on user devices to improve performance and reduce server load. Uses HTTP caching headers, service workers, and local storage APIs. Reduces network traffic and load times but requires careful cache invalidation strategies.

## 學習資源

### 文章

#### 1. Client Side Caching - Redis
> 原文：[https://redis.io/docs/latest/develop/use/client-side-caching/](https://redis.io/docs/latest/develop/use/client-side-caching/)

**Client-Side Caching 的概念**

**Client-Side Caching** 是一種在客戶端應用程式中快取 Redis 伺服器資料的技術，目的是：
- 減少對 Redis 伺服器的請求
- 降低網路延遲
- 提升應用程式性能
- 減輕伺服器負擔

**Redis 的 Client-Side Caching 實作**

Redis 使用 **Server-Assisted Client-Side Caching** 的模式：
- **Invalidation 機制**：當資料在伺服器端更新時，伺服器主動通知客戶端
- **Tracking**：客戶端聲明追蹤特定鍵
- **Broadcast Mode 和 Opt-in Mode**：兩種通知模式

基本命令：
```
CLIENT TRACKING ON|OFF
CLIENT CACHING YES|NO
CLIENT TRACKING REDIRECT <client_id>
```

**使用優勢**

| 優勢 | 說明 |
|------|------|
| **性能提升** | 本地快取比網路請求快得多 |
| **延遲降低** | 避免往返 Redis 的延遲 |
| **成本效益** | 減少伺服器負載 |
| **自動失效** | 無需手動管理快取過期 |

**注意事項**

- 需要支援 Redis 6.0 以上版本
- 客戶端庫需要實作 Tracking 功能
- 記憶體使用需評估
- 適合讀多寫少的場景
- 需處理網路斷線情況

### 影片

- [Everything you need to know about HTTP Caching](https://www.youtube.com/watch?v=HiBDZgTNpXY)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
