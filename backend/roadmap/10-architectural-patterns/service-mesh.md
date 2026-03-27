# Service Mesh

## 簡介

Service mesh enhances communication, security, and management between microservices using intelligent proxies. Provides load balancing, service discovery, observability, and traffic management. Uses sidecar pattern where each microservice pairs with a proxy for independent network functionality management.

## 學習資源

### 文章

#### 1. What is a Service Mesh? - AWS
> 原文：[https://aws.amazon.com/what-is/service-mesh/](https://aws.amazon.com/what-is/service-mesh/)

**什麼是 Service Mesh**

Service Mesh 是「處理應用程式中服務間所有通訊的軟體層」，獨立於各服務代碼管理微服務通訊。

**核心組件**

| 組件 | 說明 |
|------|------|
| **Data Plane（數據平面）** | Sidecar 代理，攔截請求、建立加密通道、實現負載均衡 |
| **Control Plane（控制平面）** | 中央管理層，維護服務登錄、分發配置、聚合遙測數據 |

**主要功能**
- **服務發現**：自動偵測和登錄服務
- **負載均衡**：使用輪詢等算法分配請求
- **流量管理**：金絲雀部署、流量拆分、請求鏡像
- **安全性**：實施雙向 TLS 加密和授權策略
- **可觀察性**：提供指標、分散式追蹤和日誌

**工作原理**

Sidecar 代理攔截所有進出服務的流量，建立安全加密連接。控制平面動態配置代理行為，無需服務重啟或修改應用代碼。

**AWS 解決方案**：AWS App Mesh 是支持 ECS、EKS、Fargate 和 Kubernetes 的全託管 Service Mesh。

- [What is a Service Mesh (RedHat blog)?](https://www.redhat.com/en/topics/microservices/what-is-a-service-mesh)

### 影片

- [What is a Service Mesh?](https://www.youtube.com/watch?v=vh1YtWjfcyk)
- [Explore top posts about Service Mesh](https://app.daily.dev/tags/service-mesh?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
