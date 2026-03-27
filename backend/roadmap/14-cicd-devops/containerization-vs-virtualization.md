# Containerization vs. Virtualization

## 簡介

Virtualization creates VMs with separate OS instances on hypervisors, offering strong isolation but using more resources. Containerization shares OS kernel for lighter, faster-starting containers ideal for microservices. VMs provide better security isolation; containers offer efficiency and scalability.

## 學習資源

### 文章

#### 1. Containerization vs. Virtualization - Middleware.io
> 原文：[https://middleware.io/blog/containerization-vs-virtualization/](https://middleware.io/blog/containerization-vs-virtualization/)

**什麼是虛擬化（Virtualization）**

使用軟體創建在實體硬體分離層上運行的虛擬資源。Hypervisor 在一台機器上管理多個獨立作業系統。

**什麼是容器化（Containerization）**

將應用程式與依賴項打包到共享主機作業系統核心的隔離單元，實現輕量級部署，無需獨立作業系統。

**主要差異比較**

| 面向 | 虛擬化 | 容器化 |
|------|--------|--------|
| **隔離** | 完全隔離主機 OS | 部分隔離，共享 OS 核心 |
| **資源使用** | 每個實例需獨立 OS，較重 | 輕量，資源開銷最小 |
| **部署速度** | 較慢，資源密集 | 通過 Docker/Kubernetes 快速部署 |
| **OS 兼容性** | 同一主機支持不同 OS | 需要相似的主機 OS 版本 |
| **安全性** | 更強的安全隔離 | OS 核心安全風險較高 |
| **擴展性** | 擴展較慢 | 更好的效率和可擴展性 |

**優劣勢**

**虛擬化優勢**：完整 OS 自主性、廣泛兼容性、成熟的生態系統
**虛擬化劣勢**：高 RAM/CPU 需求、擴展較慢、單體架構

**容器化優勢**：更小的佔用空間、更快的部署、支持微服務
**容器化劣勢**：OS 核心安全風險、採用複雜性仍在演進

**何時使用**

| 使用容器化 | 使用虛擬化 |
|-----------|-----------|
| 最大化應用程式密度 | 運行單體工作負載 |
| 部署雲原生應用 | 託管遺留應用程式 |
| 微服務架構 | 隔離開發環境 |

**最佳實踐**：結合使用兩者以優化基礎設施效率和容量。

### 影片

- [Virtual Machine (VM) vs Docker](https://www.youtube.com/watch?v=a1M_thDTqmU)
- [Explore top posts about Containers](https://app.daily.dev/tags/containers?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
