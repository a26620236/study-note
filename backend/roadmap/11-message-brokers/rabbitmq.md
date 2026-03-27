# RabbitMQ

## 簡介

RabbitMQ is an open-source message broker using AMQP for asynchronous communication between distributed systems. Enables message queuing, routing, durability, and acknowledgments. Supports various messaging patterns (pub/sub, request/reply, point-to-point). Used for high-throughput enterprise messaging.

## 學習資源

### 文章

#### 1. RabbitMQ Tutorials
> 原文：[https://www.rabbitmq.com/getstarted.html](https://www.rabbitmq.com/getstarted.html)

**什麼是 RabbitMQ**

RabbitMQ 是 VMware Tanzu 開發的 Message Broker，讓應用程式通過可靠的訊息系統進行非同步通訊，支持多種程式語言和協議。

**支持的協議**
- AMQP 0-9-1（RabbitMQ 默認協議）
- RabbitMQ Streams
- AMQP 1.0

**七大訊息模式（Tutorials 覆蓋）**

| 模式 | 說明 |
|------|------|
| **Hello World** | 基本訊息發送 |
| **Work Queues** | 任務分發給多個工作者（競爭消費者） |
| **Publish/Subscribe** | 同時廣播訊息給多個接收者 |
| **Routing** | 根據條件選擇性傳遞訊息 |
| **Topics** | 基於模式的訊息過濾 |
| **RPC** | 請求/回覆交互 |
| **Publisher Confirms** | 可靠的訊息發布與確認 |

**支持的語言**：Python、Java、Kotlin、Ruby、PHP、C#、JavaScript、Go、Elixir、Swift、Rust 等

### 影片

- [RabbitMQ Tutorial - Message Queues and Distributed Systems](https://www.youtube.com/watch?v=nFxjaVmFj5E)
- [RabbitMQ in 100 Seconds](https://m.youtube.com/watch?v=NQ3fZtyXji0)
- [Explore top posts about RabbitMQ](https://app.daily.dev/tags/rabbitmq?ref=roadmapsh)

### 其他資源

- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
