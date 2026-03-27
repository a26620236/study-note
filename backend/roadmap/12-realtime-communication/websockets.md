# Web sockets

## 簡介

WebSockets enable full-duplex, real-time communication over a single persistent connection between client and server. Unlike HTTP's request-response cycles, allows continuous bidirectional data exchange. Ideal for live chat, gaming, and real-time updates with low-latency communication.

## 學習資源

### 文章

#### 1. Introduction to WebSockets - TutorialsPoint
> 原文：[https://www.tutorialspoint.com/websockets/index.htm](https://www.tutorialspoint.com/websockets/index.htm)

**什麼是 WebSockets**

WebSockets 讓「伺服器和客戶端之間能夠進行雙向通訊，雙方可以同時通訊和交換數據」。這是全雙工（Full Duplex）協議，與傳統 HTTP 有根本不同。

**核心特性**

| 特性 | 說明 |
|------|------|
| **雙向** | 客戶端和伺服器可以同時通訊 |
| **全雙工** | 支持連續、同步的數據交換 |
| **持久連接** | 單一 TCP 連接保持開放，無需重複建立 |
| **低延遲** | 比輪詢效率更高，適合實時應用 |

**與 HTTP 的差異**

HTTP 遵循請求/回應模式（一次一個方向），WebSocket 建立後允許持久的雙向通訊。

**主要學習主題**：連接開啟和關閉、事件處理和錯誤管理、訊息發送/接收機制、JavaScript API 實現、安全性考慮

**先決條件**：基本 JavaScript 知識和 HTTP 協議理解

### 影片

- [A Beginners Guide to WebSockets](https://www.youtube.com/watch?v=8ARodQ4Wlf4)
- [How Web Sockets Work](https://www.youtube.com/watch?v=G0_e02DdH7I)

### 其他資源

- [Socket.io Library Bidirectional and Low-latency Communication for Every Platform](https://socket.io/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
