# SOAP

## 簡介

SOAP (Simple Object Access Protocol) is a structured message protocol for exchanging information between systems and applications. SOAP APIs are developed in formal, structured ways. Messages can be carried over various protocols including HTTP.

## 學習資源

### 文章

#### 1. What is SOAP? REST vs SOAP - AWS
> 原文：[https://aws.amazon.com/what-is/soap-vs-rest/](https://aws.amazon.com/what-is/soap-vs-rest/)
> 替代來源：[https://aws.amazon.com/compare/the-difference-between-soap-rest/](https://aws.amazon.com/compare/the-difference-between-soap-rest/)

⚠️ 原始 URL 已失效（404），以下整理自 AWS 替代頁面

**SOAP vs REST 概述**

SOAP 和 REST 是兩種不同的 API 設計方式。SOAP 高度結構化並使用 XML 格式；REST 更靈活，支援多種資料格式。

**共同點**
- 都定義應用程式間資料請求的規則和標準
- 都使用 HTTP 協議交換資訊
- 都支援 SSL/TLS 加密通訊

**SOAP 相關標準**

| 標準 | 功能 |
|------|------|
| **WS-Security** | 安全措施，使用 token 識別 |
| **WS-Addressing** | 路由資訊作為 metadata |
| **WS-ReliableMessaging** | 標準化錯誤處理 |
| **WSDL** | 描述 Web Service 的範圍和功能 |

**SOAP vs REST 關鍵差異**

| 面向 | SOAP | REST |
|------|------|------|
| **本質** | 協議（Protocol） | 架構風格（Architecture Style） |
| **設計** | 暴露操作（函數） | 暴露資料（資源） |
| **傳輸協議** | 任何協議（HTTP/TCP/ICMP） | 僅 HTTPS |
| **資料格式** | 僅 XML | JSON、XML、HTML、純文本 |
| **效能** | 訊息較大，速度較慢 | 訊息較小且可快取，速度較快 |
| **可擴展性** | 困難（有狀態） | 容易（無狀態） |
| **安全性** | WS-Security 額外開銷 | HTTPS 無額外開銷 |
| **可靠性** | 內建錯誤處理 | 需自行重試 |

**何時選擇 SOAP**
- 整合或擴展已有 SOAP 的**遺留系統**
- 需要 **WS-Security** 的內部企業 API
- 需要 **ACID 合規**的場景（如金融交易）

**何時選擇 REST**
- **現代應用**（行動端、微服務、容器化）
- **公開 API**（需要靈活性和可擴展性）
- 對效能和快取有要求的場景

---

#### 2. SOAP vs REST - Red Hat
> 原文：[https://www.redhat.com/en/topics/integration/whats-the-difference-between-soap-rest](https://www.redhat.com/en/topics/integration/whats-the-difference-between-soap-rest)

**核心差異**
- SOAP 是 W3C 維護的**官方協議**
- REST 是一組**架構原則**（非協議）

**REST 特點**
- 請求透過 HTTP 發送，回應支援 HTML、XML、純文本、JSON 等格式
- JSON 最受青睞（語言無關、輕量、人機可讀）
- 比 SOAP 更靈活、更容易設定
- RESTful 應用需遵循 6 項架構指南：Client-Server、Stateless、Cacheable、Uniform Interface、Layered System、Code-on-Demand

**SOAP 特點**
- 設計初衷：讓不同語言、不同平台的應用程式互相通訊
- 內建合規標準（安全性、ACID），適合企業場景但增加複雜度
- 請求可透過 HTTP、SMTP、TCP 等多種協議傳輸
- 回應**必須是 XML 文件**
- 回應不可被瀏覽器快取

**SOAP 相關規範**
- **WS-Security**：透過 token 標準化訊息安全
- **WS-ReliableMessaging**：標準化不可靠基礎設施上的錯誤處理
- **WS-Addressing**：將路由資訊作為 metadata 封裝在 SOAP headers 中
- **WSDL**：描述 Web Service 的功能和端點

**總結**
- REST 輕量，適合 IoT、行動應用、Serverless
- SOAP 提供內建安全和事務合規，適合企業需求但較沉重
- 許多公開 API（如 Google Maps API）遵循 REST

---

#### 3. SOAP Web Services Tutorial for Beginners
> 原文：[https://www.guru99.com/soap-simple-object-access-protocol.html](https://www.guru99.com/soap-simple-object-access-protocol.html)

**SOAP 的主要概念和定義**

SOAP（Simple Object Access Protocol）是一種基於 XML 的協議，用於透過 HTTP 存取網路服務。其核心目的是解決不同程式語言開發的應用程式之間的資料交換問題。

**主要特點**
- 建立在 XML 和 HTTP 基礎之上
- 提供跨程式語言、跨平台的標準規範
- 由 W3C 聯盟推薦使用

**SOAP 的優勢**
- 輕量級的資料交換協議
- 平台獨立且作業系統獨立
- 無需特殊設定即可在網路上運行
- 解決傳統 RPC 通訊的限制（語言相依性、非標準協議、防火牆問題）

**SOAP Message 結構**

SOAP Message 由以下必要元件組成：

| 元件 | 必要性 | 說明 |
|------|-------|------|
| **Envelope** | 必須 | 根元素，封裝所有 SOAP 訊息內容 |
| **Header** | 可選 | 包含驗證憑證或複雜資料型別定義 |
| **Body** | 必須 | 包含實際的服務呼叫和回應資料 |
| **Fault** | 可選 | 錯誤回應元素（faultCode、faultString 等） |

**通訊流程**
1. 用戶端將程序呼叫資訊封裝成 SOAP 訊息（Marshalling）
2. 使用 HTTP 協議傳輸
3. 伺服器解析訊息並返回相應回應（Demarshalling）

**實作方式**

使用框架（如 ASP.Net）建立 ASMX 網路服務：
- 透過 `[WebMethod]` 屬性標記可被呼叫的方法
- 自動產生 WSDL 文件
- 展示對應的 SOAP 請求和回應訊息結構

### 影片

- [REST vs SOAP](https://www.youtube.com/watch?v=_fq8Ye8kodA)
- [SOAP vs REST vs GraphQL vs gRPC](https://www.youtube.com/watch?v=4vLxWqE94l4)

### 其他資源

- [W3C SOAP Specification](https://www.w3.org/TR/soap12/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
