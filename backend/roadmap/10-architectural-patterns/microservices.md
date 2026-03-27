# Microservices

## 簡介

Microservices architecture structures applications as loosely coupled, independently deployable services focused on specific business capabilities. Communicate via HTTP or messaging. Enables scalability, flexibility, diverse technologies, and continuous deployment but adds complexity in communication and orchestration.

## 學習資源

### 文章

#### 1. Pattern: Microservice Architecture
> 原文：[https://microservices.io/patterns/microservices.html](https://microservices.io/patterns/microservices.html)

**什麼是 Microservice Architecture**

將應用程式結構化為「一組鬆散耦合、可獨立部署/執行的組件，圍繞業務能力組織」。

**Dark Energy（傾向較小服務）vs Dark Matter（傾向較大服務）**

| Dark Energy（分散） | Dark Matter（集中） |
|---------------------|---------------------|
| 簡單組件更易維護 | 本地操作比分散式更簡單 |
| 團隊自主性 | 分散式操作可能效率低 |
| 快速部署流水線 | ACID 事務優於最終一致性 |
| 多技術堆疊靈活性 | 運行時耦合影響可用性 |

**優勢**
- 服務更簡單（每個服務擁有較少子域）
- 團隊可獨立開發和部署
- 技術堆疊靈活選擇

**劣勢**
- 複雜的分散式操作
- 最終一致性需求複雜
- 可能存在服務間運行時耦合

**相關模式**：Saga、CQRS、API Composition、Database per Service、API Gateway、Circuit Breaker

#### 2. What is Microservices? - SmartBear
> 原文：[https://smartbear.com/solutions/microservices/](https://smartbear.com/solutions/microservices/)

**六大特徵**

1. 多個可獨立部署組件
2. 圍繞業務能力組織
3. 簡單直接的路由機制
4. 分散式治理和資料管理
5. 內建故障韌性
6. 演進式設計靈活性

**主要優勢**
- 獨立部署不影響其他服務
- 快速隔離缺陷
- 跨業務單位可重用（如共用支付系統）
- 技術靈活性，無長期供應商綁定

**主要挑戰**
- 跨分散式系統的測試複雜性
- 服務間通訊開銷
- 管理眾多相互依賴組件的運維難度

**真實案例**：Netflix 和 Amazon 每天通過分散式後端服務處理數十億次 API 呼叫

- [Microservices 101](https://thenewstack.io/microservices-101/)
- [Articles about Microservices](https://thenewstack.io/category/microservices/)

### 影片

- [Microservices explained in 5 minutes](https://www.youtube.com/watch?v=lL_j7ilk7rc)
- [Explore top posts about Microservices](https://app.daily.dev/tags/microservices?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
