# Graceful Degradation

## 簡介

Graceful degradation ensures systems continue functioning when components or features are unavailable. In web development, applications remain functional even if browsers don't support certain features. Alternative to progressive enhancement for maintaining system reliability.

## 學習資源

### 文章

#### 1. What is Graceful Degradation? - HubSpot
> 原文：[https://blog.hubspot.com/website/graceful-degradation](https://blog.hubspot.com/website/graceful-degradation)

**什麼是 Graceful Degradation**

優雅降級是「即使部分功能不可用，網站或應用程式仍然可以被訪問」的設計方法。開發者優先為現代瀏覽器設計，然後為舊系統創建後備方案。

**實現步驟**
1. 建立堅固的基礎設計
2. 識別與舊瀏覽器/環境不兼容的功能
3. 開發有效的替代解決方案

**vs Progressive Enhancement（漸進增強）**

| 方法 | 方向 |
|------|------|
| **Graceful Degradation** | 從現代功能開始，向下支持舊系統（從上往下） |
| **Progressive Enhancement** | 從基本瀏覽器支持開始，為現代系統添加功能（從下往上） |

#### 2. Four Considerations for Graceful Degradation - New Relic
> 原文：[https://newrelic.com/blog/best-practices/design-software-for-graceful-degradation](https://newrelic.com/blog/best-practices/design-software-for-graceful-degradation)

**四大策略**

| 策略 | 說明 |
|------|------|
| **1. Shed the Workload（卸載工作負載）** | 當容量超限時丟棄低優先級請求，確保關鍵請求（如健康檢查）優先 |
| **2. Time Shift the Workload（時間轉移）** | 使用訊息佇列（Kafka、Pub/Sub）解耦請求生成和處理，非同步處理 |
| **3. Reduce Quality of Service（降低服務品質）** | 暫時限制功能或使用近似查詢，無需排隊即可服務所有請求 |
| **4. Add More Capacity（增加容量）** | 自動擴展基礎設施（VM、Kubernetes pods）處理峰值，但受資源池限制 |

**核心洞察**：SRE 和 DevOps 團隊必須「為系統中不可避免的工作負載模式和複雜故障模式做準備」，通過主動監控和容量規劃實現。

### 影片

- [Graceful Degradation - Georgia Tech](https://www.youtube.com/watch?v=Tk7e0LMsAlI)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
