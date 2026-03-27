# Kafka

## 簡介

Apache Kafka is a distributed event streaming platform for high-throughput, fault-tolerant data processing. Acts as message broker with publish/subscribe model. Features topics, partitions for parallel processing, and replication for fault tolerance. Ideal for real-time analytics and data integration.

## 學習資源

### 文章

#### 1. Apache Kafka Quickstart
> 原文：[https://kafka.apache.org/quickstart](https://kafka.apache.org/quickstart)

**什麼是 Kafka**

Kafka 是「分散式事件串流平台，可在多台機器上讀取、寫入、儲存和處理事件」。事件包括付款交易、位置更新、訂單、感測器資料等。

**核心組件**

| 組件 | 說明 |
|------|------|
| **Topics（主題）** | 事件的儲存容器，類似檔案系統中的資料夾 |
| **Producers（生產者）** | 向 Kafka 主題寫入事件的客戶端 |
| **Consumers（消費者）** | 從主題讀取事件的客戶端應用程式（可重複讀取，數據持久儲存） |
| **Brokers（代理）** | 接收生產者事件並以持久、容錯方式儲存的 Kafka 伺服器 |
| **Kafka Connect** | 在外部系統和 Kafka 主題之間導入/導出數據 |
| **Kafka Streams** | 實時事件處理的庫，支持聚合、窗口化、連接操作 |

#### 2. Kafka Streams Concepts - Confluent
> 原文：[https://docs.confluent.io/platform/current/streams/concepts.html](https://docs.confluent.io/platform/current/streams/concepts.html)

**什麼是 Kafka Streams**

Kafka Streams 是「構建流處理應用程式的庫，處理來自 Apache Kafka 的數據」。

**核心抽象**

| 抽象 | 說明 |
|------|------|
| **KStream** | 代表記錄流（每條記錄作為新增），同一個 key 的新記錄是獨立條目 |
| **KTable** | 代表變更日誌流（記錄作為更新），同一個 key 的新記錄覆蓋之前的值 |
| **GlobalKTable** | 廣播版本，所有應用實例都可用，支持不需要共同分區的高效連接 |

**時間語義**：支持事件時間（數據發生時）、處理時間（被處理時）、攝取時間（被儲存時）

**有狀態處理**：多數實際應用程式使用 Kafka 存儲層以容錯方式維護連接、聚合和窗口操作的狀態

### 影片

- [Apache Kafka Fundamentals](https://www.youtube.com/watch?v=B5j3uNBH8X4)
- [Kafka in 100 Seconds](https://www.youtube.com/watch?v=uvb00oaa3k8)
- [Explore top posts about Kafka](https://app.daily.dev/tags/kafka?ref=roadmapsh)

### 其他資源

- [Apache Kafka](https://kafka.apache.org/quickstart)
- [Apache Kafka Streams](https://docs.confluent.io/platform/current/streams/concepts.html)
- [Kafka Streams Confluent](https://kafka.apache.org/documentation/streams/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
