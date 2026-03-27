# CDN (Content Delivery Network)

## 簡介

CDN (Content Delivery Network) delivers website assets from geographically closer servers to improve performance and availability. Services like CloudFlare, AWS CloudFront, and Akamai reduce bandwidth, add caching layers, and enhance security through global server networks.

## 學習資源

### 文章

#### 1. CloudFlare - What is a CDN? | How do CDNs work?
> 原文：[https://www.cloudflare.com/en-ca/learning/cdn/what-is-a-cdn/](https://www.cloudflare.com/en-ca/learning/cdn/what-is-a-cdn/)

**什麼是 CDN（Content Delivery Network）**

CDN 是地理上分散的伺服器群組，將內容快取在靠近終端用戶的位置。CDN 讓 HTML、JavaScript、樣式表、圖片和影片等資源能夠快速傳輸。今天大多數 Web 流量都通過 CDN 提供，包括 Facebook、Netflix、Amazon 等主要網站。

**四大主要優勢**

| 優勢 | 說明 |
|------|------|
| **縮短載入時間** | 將內容分發到更近的 CDN 伺服器，訪客體驗更快的頁面載入 |
| **降低頻寬成本** | 透過快取減少源站需提供的資料量，降低託管成本 |
| **提高可用性與冗餘** | 分散式特性讓 CDN 能處理更大流量，抵禦硬體故障 |
| **增強安全性** | 提供 DDoS 緩解、改善 TLS/SSL 憑證管理等安全優化 |

**運作機制**

CDN 在不同網路之間的交換點（IXP）放置伺服器，降低傳輸成本與時間。

1. **快取（Caching）**：在全球戰略位置的資料中心快取靜態內容
2. **動態加速**：負載均衡、SSD 等硬體/軟體優化；檔案壓縮減少傳輸量
3. **可靠性**：Anycast 路由在資料中心故障時自動轉移流量；智慧故障轉移確保服務不中斷

**CDN vs Web 主機**

CDN 不託管內容，無法取代 Web 主機。它在網路邊緣快取內容，改善效能。Web 主機儲存原始檔案，CDN 讓這些檔案對全球用戶更易存取。

---

#### 2. AWS - CDN
> 原文：[https://aws.amazon.com/what-is/cdn/](https://aws.amazon.com/what-is/cdn/)

**什麼是 CDN（Content Delivery Network）**

CDN 是「連接多個伺服器的網絡，加快數據密集型應用的網頁加載速度」。當使用者造訪網站時，內容會從地理位置較近的 CDN 伺服器傳輸，而非遠端的原始伺服器。

**核心目的**

減少延遲（Latency）是 CDN 的主要功能。它在客戶端與網站伺服器之間引入中介伺服器，降低網絡流量、減少頻寬消耗並改善應用程式體驗。

**主要優勢**

- **降低頁面加載時間**：減少跳出率，提升使用者停留時間
- **減少頻寬成本**：通過快取優化降低原始伺服器的資料傳輸需求
- **提高內容可用性**：分散流量負載，防止伺服器當機
- **增強安全性**：應對 DDoS 攻擊，分散大流量到多個伺服器

**運作機制**

CDN 通過以下三種方式運作：
1. **快取（Caching）**：在全球多個地點建立接入點（POP）儲存靜態內容
2. **動態加速（Dynamic Acceleration）**：優化動態內容的傳輸路徑
3. **邊緣運算（Edge Computing）**：在邊緣伺服器執行運算任務

**應用場景**

- 高速內容傳遞
- 即時串流影音
- 支持大量並發使用者
- 多平台內容交付

**AWS 解決方案**

Amazon CloudFront 提供 450+ 全球分散的接入點，具備：
- 自動網絡映射
- DDoS 防護
- 與 AWS 服務深度整合

### 影片

- [What is Cloud CDN?](https://www.youtube.com/watch?v=841kyd_mfH0)
- [What is a CDN and how does it work?](https://www.youtube.com/watch?v=RI9np1LWzqw)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
