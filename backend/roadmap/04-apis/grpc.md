# gRPC

## 簡介

gRPC is a high-performance, open-source RPC (Remote Procedure Call) framework. Allows programs to execute procedures on remote computers like local functions. Developers don't need to handle remote interaction details, and client/server can use different programming languages.

## 學習資源

### 文章

#### 1. What Is GRPC?
> 原文：[https://www.wallarm.com/what/the-concept-of-grpc](https://www.wallarm.com/what/the-concept-of-grpc)

**gRPC 定義與概述**

gRPC 是一個現代化的開源 RPC（Remote Procedure Call）框架，用於建構高效能的可擴展 API。由 Google 於 2015 年開發推出，2017 年成為 CNCF 孵化項目，被 Netflix、Square、IBM、Cisco、Dropbox 等科技大廠採用。

**核心技術概念**

1. **Protocol Buffers（Protobuf）**
   - Google 開發的序列化協議
   - 相比 JSON/XML 性能更優
   - 資料轉換為二進制格式，CPU 資源消耗少
   - 編碼訊息體積小，傳輸速度快
   - 適合行動設備等低效能環境

2. **HTTP/2 協議**
   - 二進制分幀層（Binary Framing Layer）
   - 多路複用能力
   - 單一 TCP 連接支援多個請求/回應

3. **資料流類型**
   - **伺服器資料流 RPC**：客戶端發送單一請求，接收伺服器持續回傳的資料序列
   - **客戶端資料流 RPC**：客戶端發送資料序列，伺服器處理後回傳單一回應
   - **雙向資料流 RPC**：客戶端與伺服器相互傳送訊息序列，各流獨立運作

**主要特性與優勢**
- 二進制訊息格式減少網路傳輸量
- HTTP/2 多路複用提升效率
- Protobuf 序列化速度快
- 支援長期運行的資料流通訊
- 自動產生客戶端程式庫

---

#### 2. gRPC 官方網站
> 原文：[https://grpc.io/](https://grpc.io/)

**核心功能和特性**

- **簡單服務定義**：使用 Protocol Buffers 進行二進位序列化
- **跨語言支援**：自動生成多種程式語言的客戶端和伺服器程式碼
- **高效能擴展**：支援每秒百萬級別的 RPC 請求
- **雙向串流**：HTTP/2 傳輸協議基礎上的完整實現
- **內建認證**：插件式的可配置認證機制
- **負載平衡**：支援可插拔的負載均衡策略
- **可觀測性**：包含追蹤和健康檢查功能

**支援語言**：Go、C++、Java、Python 等多種語言

**核心用途**
- 資料中心內部及跨資料中心的服務連接
- 連接裝置、行動應用與後端服務
- 分散式運算的最後一哩路

### 影片

- [What Is GRPC?](https://www.youtube.com/watch?v=hVrwuMnCtok)
- [Explore top posts about gRPC](https://app.daily.dev/tags/grpc?ref=roadmapsh)

### 其他資源

- [gRPC Website](https://grpc.io/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
