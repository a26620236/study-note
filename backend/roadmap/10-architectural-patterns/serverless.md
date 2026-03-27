# Serverless

## 簡介

Serverless computing lets developers build applications without managing server infrastructure. Cloud providers handle scaling and maintenance while developers deploy event-triggered functions. Billing based on actual usage. Platforms: AWS Lambda, Google Cloud Functions, Azure Functions.

## 學習資源

### 文章

#### 1. Serverless - IBM
> 原文：[https://www.ibm.com/think/topics/serverless](https://www.ibm.com/think/topics/serverless)

**什麼是 Serverless Computing**

Serverless 是「讓開發者無需管理伺服器基礎設施即可構建和運行應用程式的應用開發和執行模型」。Serverless 並非「沒有伺服器」，而是伺服器由雲服務提供商（CSP）管理。

**與其他模型比較**

| 面向 | Serverless | PaaS / 容器 / VM |
|------|------------|------------------|
| **資源供應時間** | 毫秒級 | 分鐘到小時 |
| **管理負擔** | 無 | 輕到重 |
| **擴展** | 自動（含縮減到零） | 需要配置 |
| **計費** | 按每 100 毫秒計費 | 按小時/天計費 |
| **無狀態性** | 內建 | 需要設計 |

**優點**
- **提升開發者生產力**：專注於代碼，不管理基礎設施
- **按使用計費**：只為執行付費，無空閒容量費用
- **多語言支持**：可用任何語言或框架
- **降低延遲**：代碼可在靠近用戶的位置運行

**缺點**
- **控制減少**：將伺服器控制移交給第三方 CSP
- **供應商鎖定**：不同 CSP 的功能不兼容
- **冷啟動**（Cold Start）：影響初始請求的性能
- **調試複雜**：開發者缺乏對底層基礎設施的可見性
- **長任務成本高**：不適合長時間運行的任務

**主要用例**
- 微服務架構支持
- API 後端
- 數據處理（音頻、圖像、視頻）
- 大規模並行計算（Map 操作）
- 流處理工作負載
- AI/ML 工作負載

#### 2. AWS Serverless
> 原文：[https://aws.amazon.com/serverless/](https://aws.amazon.com/serverless/)

**三大特性**
- **自動擴展**：從零到峰值需求自動擴展
- **按使用計費**：資源利用自動優化，不為過度供應付費
- **簡化開發**：內建服務集成降低配置複雜性

**核心服務分類**

| 類別 | AWS 服務 |
|------|---------|
| **計算** | Lambda、Fargate |
| **集成** | EventBridge、Step Functions、SQS、SNS、API Gateway |
| **數據存儲** | DynamoDB、Aurora Serverless、S3、Neptune Serverless |

### 影片

- [Serverless Computing in 100 Seconds](https://www.youtube.com/watch?v=W_VV2Fx32_Y&ab_channel=Fireship)
- [Explore top posts about Serverless](https://app.daily.dev/tags/serverless?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
