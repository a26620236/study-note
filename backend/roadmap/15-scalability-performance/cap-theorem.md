# CAP Theorem

## 簡介

CAP Theorem states distributed systems can only guarantee two of three properties: Consistency (same data across nodes), Availability (system responds to requests), and Partition tolerance (operates despite network failures). Guides distributed system design decisions and database selection.

## 學習資源

### 文章

#### 1. What is CAP Theorem? - BMC
> 原文：[https://www.bmc.com/blogs/cap-theorem/](https://www.bmc.com/blogs/cap-theorem/)

**三個屬性**

| 屬性 | 說明 |
|------|------|
| **Consistency（一致性）** | 所有讀取都獲得最新的寫入，或返回錯誤 |
| **Availability（可用性）** | 所有讀取都包含數據，但可能不是最新的 |
| **Partition Tolerance（分區容忍性）** | 儘管網絡故障，系統繼續運行 |

**CAP 定理的核心主張**

在分散式資料庫中，網路分區（Partition）是不可避免的，因此系統必須在**一致性**和**可用性**之間做出選擇：

**CP 系統**（一致性 + 分區容忍）

| 特性 | 說明 |
|------|------|
| **行為** | 優先準確數據而非響應性 |
| **示例** | MongoDB、Redis、HBase |
| **適用** | 銀行、庫存系統 |

**AP 系統**（可用性 + 分區容忍）

| 特性 | 說明 |
|------|------|
| **行為** | 優先響應性而非保證準確性 |
| **示例** | Cassandra、DynamoDB、Cosmos DB |
| **適用** | 電商購物車 |

**現代視角**

CAP 定理原始提出者 Eric Brewer 後來澄清，該定理「比最初呈現的更不是二元的」。現代系統專注於「最大化對特定應用有意義的一致性和可用性組合」，而非嚴格選擇兩個。

- [An Illustrated Proof of the CAP Theorem](https://mwhittaker.github.io/blog/an_illustrated_proof_of_the_cap_theorem/)
- [Perspectives on the CAP Theorem](https://github.com/user-attachments/files/18232157/Brewer2.pdf)
- [CAP Theorem and its applications in NoSQL Databases](https://www.ibm.com/uk-en/cloud/learn/cap-theorem)

### 影片

- [What is CAP Theorem?](https://www.youtube.com/watch?v=_RbsFXWRZ10)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
