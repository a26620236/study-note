# Domain-Driven Design

## 簡介

Domain-Driven Design (DDD) focuses on understanding business domains to inform software design. Emphasizes collaboration between technical and domain experts, creating ubiquitous language and bounded contexts. Uses entities, value objects, aggregates, and repositories for complex business logic.

## 學習資源

### 文章

#### 1. Domain-Driven Design - Redis
> 原文：[https://redis.io/glossary/domain-driven-design-ddd/](https://redis.io/glossary/domain-driven-design-ddd/)

**什麼是 DDD**

DDD 是「強調理解和建模業務領域的軟體開發哲學」，使軟體架構緊密對齊業務需求。由 Eric Evans 在 2003 年提出。

**核心原則**

| 原則 | 說明 |
|------|------|
| **Ubiquitous Language（通用語言）** | 開發者、領域專家和利益相關者使用的共享詞彙，貫穿討論和代碼 |
| **Model-Driven Design（模型驅動設計）** | 完善定義的領域模型作為業務領域的概念藍圖 |
| **Core Domain（核心域）** | 識別並專注於驅動業務運營和定義成功的核心業務領域 |
| **Iterative Collaboration（迭代協作）** | 技術和領域專家持續合作，隨業務演進精煉模型 |

**DDD 建構塊**

| 概念 | 定義 |
|------|------|
| **Bounded Contexts（限界上下文）** | 系統內特定領域模型適用的邏輯邊界，各有自己的通用語言 |
| **Entities（實體）** | 具有唯一持久身份的物件（如 CRM 中的客戶） |
| **Value Objects（值物件）** | 由屬性而非身份標識的物件，通常不可變（如地址、日期） |
| **Aggregates（聚合）** | 作為單一單元處理的實體和值物件的集群，通過聚合根維護一致性 |
| **Domain Events（領域事件）** | 領域內觸發跨系統動作的重要事件 |

**實施步驟**
1. 深入了解業務領域（與領域專家合作）
2. 創建捕獲核心實體和關係的領域模型
3. 建立通用語言
4. 定義限界上下文
5. 實現反映領域結構的代碼
6. 基於反饋迭代精煉

**互補方法**：CQRS、Event Sourcing、微服務（與 DDD 限界上下文配合良好）

**適用場景**：複雜業務邏輯領域；不適合簡單應用（複雜性開銷超過收益）

### 影片

- [Domain Driven Design: What You Need To Know](https://www.youtube.com/watch?v=4rhzdZIDX_k)
- [Explore top posts about Domain-Driven Design](https://app.daily.dev/tags/domain-driven-design?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
