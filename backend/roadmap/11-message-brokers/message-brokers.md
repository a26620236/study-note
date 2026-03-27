# Message Brokers

## 簡介

Message brokers facilitate communication between distributed systems by routing and delivering messages. Enable asynchronous messaging, decoupling producers from consumers. Include features like queuing, load balancing, persistence, and acknowledgment. Popular examples: Kafka, RabbitMQ, ActiveMQ.

## 學習資源

### 文章

#### 1. What is a Message Broker? - IBM
> 原文：[https://www.ibm.com/think/topics/message-brokers](https://www.ibm.com/think/topics/message-brokers)

**什麼是 Message Broker**

Message Broker 是「讓應用程式、系統和服務能夠通訊和交換資訊的軟體」。它可以驗證、儲存、路由和傳送訊息到適當目的地，依賴訊息佇列（Message Queue）實現可靠儲存和保證傳遞。

**兩大訊息分發模型**

| 模型 | 說明 |
|------|------|
| **Point-to-Point（點對點）** | 訊息佇列的一對一關係，發送方和接收方之間的直接訊息 |
| **Publish/Subscribe（發布/訂閱）** | 每條訊息的生產者發布到主題，訂閱該主題的消費者都能接收 |

**Message Broker vs REST API**

REST API 使用 HTTP 進行同步通訊，需要雙方同時可用；Message Broker 支持非同步通訊，發送方無需等待接收方處理後才繼續。

**Message Broker vs Event Streaming Platform**

Event Streaming 平台（如 Kafka）比 Message Broker 提供更大的可擴展性，但確保訊息傳遞的功能較少，更適合大吞吐量場景。

**Message Broker vs ESB（企業服務匯流排）**

ESB 是在企業規模 SOA 中使用的架構模式，功能複雜但昂貴；Message Broker 是「輕量級」替代方案，提供類似的訊息路由功能但結構更簡單。

**主要使用場景**
- **金融交易和支付處理**：確保支付只發送一次
- **電商訂單處理和履行**：確保訂單可靠處理
- **保護高度敏感數據**：在傳輸和靜止時保護數據

### 影片

- [Introduction to Message Brokers](https://www.youtube.com/watch?v=57Qr9tk6Uxc)
- [Kafka vs RabbitMQ](https://www.youtube.com/watch?v=_5mu7lZz5X4)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
