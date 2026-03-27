# Twelve-Factor Apps

## 簡介

Twelve-Factor App methodology provides principles for building scalable, maintainable cloud applications. Key factors: single codebase, explicit dependencies, environment config, stateless processes, port binding, dev/prod parity, log streams, and graceful shutdown for portability and deployment ease.

## 學習資源

### 文章

#### 1. The Twelve-Factor App
> 原文：[https://12factor.net/](https://12factor.net/)

**十二因素**

| 因素 | 原則 |
|------|------|
| **1. Codebase** | 一個版本控制的代碼庫，多個部署 |
| **2. Dependencies** | 明確聲明並隔離依賴 |
| **3. Config** | 將配置儲存在環境中 |
| **4. Backing Services** | 將支援服務作為附加資源處理 |
| **5. Build, Release, Run** | 嚴格分離建置和運行階段 |
| **6. Processes** | 以一個或多個無狀態進程執行應用程式 |
| **7. Port Binding** | 通過端口綁定導出服務 |
| **8. Concurrency** | 通過進程模型橫向擴展 |
| **9. Disposability** | 快速啟動和優雅關閉最大化健壯性 |
| **10. Dev/Prod Parity** | 保持開發、預發布和生產環境盡可能相似 |
| **11. Logs** | 將日誌作為事件流處理 |
| **12. Admin Processes** | 以一次性進程運行管理/管理任務 |

- [An illustrated guide to 12 Factor Apps](https://www.redhat.com/architect/12-factor-app)

### 影片

- [Every Developer NEEDS To Know 12-Factor App Principles](https://www.youtube.com/watch?v=FryJt0Tbt9Q)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
