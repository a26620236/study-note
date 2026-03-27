# SOA

## 簡介

SOA (Service-Oriented Architecture) uses reusable, loosely coupled services that interact over networks through standardized protocols like HTTP and XML. Each service performs specific business functions independently. Enables scalable, flexible, interoperable systems with modular development and easier integration.

## 學習資源

### 文章

#### 1. What is SOA? - AWS
> 原文：[https://aws.amazon.com/what-is/service-oriented-architecture/](https://aws.amazon.com/what-is/service-oriented-architecture/)

**什麼是 SOA**

SOA 是「使用稱為服務的軟體組件來創建業務應用程式的軟體開發方法」。服務跨平台和語言提供可重用的業務功能。

**核心原則**

| 原則 | 說明 |
|------|------|
| **互操作性** | 通過描述文件跨不同平台/語言工作 |
| **鬆散耦合** | 服務之間最小依賴，保持無狀態 |
| **抽象** | 實現細節對用戶隱藏，服務作為「黑盒」運作 |
| **粒度** | 每個服務處理一個離散業務功能 |

**主要組件**
1. **Service（服務）**：功能建置單元，包含實現、合約和介面
2. **Service Provider（服務提供者）**：創建和維護服務
3. **Service Consumer（服務消費者）**：向提供者請求服務
4. **Service Registry（服務登錄）**：可用服務的目錄

**限制**
- 共享資源導致可擴展性降低
- 依賴關係和複雜性增長
- 使用企業服務匯流排（ESB）時的單點故障

**SOA vs 微服務**

微服務是 SOA 的演進，提供更細粒度、數據複製而非共享、完全獨立性、輕量級 API，更適合現代雲環境。

#### 2. Reference Architecture Foundation for SOA - OASIS
> 原文：[http://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html](http://docs.oasis-open.org/soa-rm/soa-ra/v1.0/soa-ra.html)

**OASIS SOA 定義**

SOA 是「組織和利用分散式能力的範式，這些能力可能在不同所有權域的控制下」。服務作為連結業務需求與可用能力的機制。

**核心原則**
- **技術中立性**：獨立於特定技術，SOA 原則持久存在
- **節省性（Parsimony）**：只使用滿足需求的必要組件
- **關注點分離**：將利益相關者關注點分為不同視角

**三種架構視角**：參與（Participation）、實現（Realization）、所有權（Ownership）

### 影片

- [Service Oriented Architecture (SOA) Simplified](https://www.youtube.com/watch?v=PA9RjHI463g)
- [Explore top posts about Architecture](https://app.daily.dev/tags/architecture?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
