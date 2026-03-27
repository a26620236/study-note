# Monolithic Apps

## 簡介

Monolithic applications are single, cohesive units with tightly integrated components running as one service. Simplifies development and deployment but creates scalability and maintainability challenges. Changes require full system redeployment. Suitable for smaller applications; larger ones often transition to microservices.

## 學習資源

### 文章

#### 1. Pattern: Monolithic Architecture
> 原文：[https://microservices.io/patterns/monolithic.html](https://microservices.io/patterns/monolithic.html)

**什麼是 Monolithic Architecture**

將應用程式「結構化為單一可部署/可執行組件」，使用包含所有子領域的共享資料庫。所有操作保持在本地，消除分散式複雜性。

**優勢**
- 單一進程內的簡單交互（無網路開銷）
- 可使用 ACID 事務
- 組件間無運行時或設計時耦合

**劣勢**
- 難以理解大型複雜程式碼庫
- 隨應用增長，部署流水線變慢
- 單一技術堆疊限制靈活性
- 無法按操作特性分離擴展

**緩解策略**
- 將 Monolith 模組化為垂直切片
- 應用實體設計原則減少建置耦合
- 實施自動化合併佇列和增量建置

#### 2. Monolithic Architecture - Advantages & Disadvantages
> 原文：[https://datamify.medium.com/monolithic-architecture-advantages-and-disadvantages-e71a603eec89](https://datamify.medium.com/monolithic-architecture-advantages-and-disadvantages-e71a603eec89)

**優點**

| 優點 | 說明 |
|------|------|
| **簡單快速** | 所有源代碼在一個位置，易於理解、調試和部署 |
| **成本效益** | 早期階段最小化基礎設施開銷，適合驗證業務模型的 PoC |
| **統一橫切關注點** | 安全、日誌、監控等只需實現一次 |
| **團隊入職快** | 新開發者可快速掌握整個系統 |

**缺點**

| 缺點 | 說明 |
|------|------|
| **擴展困難** | 所有服務共用同一資料庫造成瓶頸，擴展需部署整個 Monolith |
| **開發速度下降** | 隨應用增長，CI/CD 流水線變慢，單一變更觸發完整測試週期 |
| **技術僵化** | 綁定於現有技術堆疊，框架升級影響所有服務 |
| **耦合與維護** | 代碼邊界隨時間模糊，形成「義大利麵條」代碼 |

**結論**：Monolithic 架構適合早期階段，但隨系統規模增長會出現問題，此時需考慮遷移至微服務。

### 影片

- [Monolithic vs Microservice Architecture](https://www.youtube.com/watch?v=NdeTGlZ__Do)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
