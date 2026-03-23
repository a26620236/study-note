# Internet

## 簡介

The internet is a global network of interconnected computers using TCP/IP protocols. Requests travel through ISPs to DNS servers for domain-to-IP translation, then route across networks via routers to destination servers. Enables dynamic, decentralized global communication.

## 學習資源

### 文章

#### 1. How does the Internet Work?
> 原文：https://cs.fyi/guide/how-does-internet-work

**網際網路的基本概念**
- "網際網路是網路的網路"，由多個相互連接的電腦網路組成
- 1960年代由美國國防部開發，目的是創建可抵禦核攻擊的分散通訊網路
- 全球互連的路由器網路，負責在裝置間導引流量

**資料傳輸流程**
1. 資料被分割成小型封包
2. 封包從裝置發送到路由器
3. 路由器檢查封包並轉發到下一個路由器
4. 過程持續直到封包到達目的地

**重要技術概念**

| 概念 | 說明 |
|------|------|
| **IP 位址** | 分配給網路上每個裝置的唯一識別碼（如 192.168.1.1） |
| **Domain Name** | 人類可讀的網站名稱（如 google.com） |
| **DNS** | 將域名轉譯為 IP 位址的系統 |
| **HTTP/HTTPS** | 客戶端與伺服器間的資料傳輸協定；HTTPS 提供加密 |
| **SSL/TLS** | 透過憑證與加密提供安全通訊 |
| **Port** | 用於識別裝置上執行的特定應用或服務 |
| **Socket** | IP 位址與 Port 號碼的組合，代表通訊端點 |

**關鍵協定**
- **IP (Internet Protocol)**：負責將封包路由到正確目的地
- **TCP (Transmission Control Protocol)**：確保封包可靠且按順序傳輸

---

#### 2. The Internet Explained
> 原文：https://www.vox.com/2014/6/16/18076282/the-internet
> ⚠️ 此網站無法訪問

---

#### 3. How Does the Internet Work? (Stanford)
> 原文：http://web.stanford.edu/class/msande91si/www-spr04/readings/week1/InternetWhitepaper.htm

**網際網路架構**
- 採用階層式架構：NSP（骨幹網路）→ NAP/MAE（互連點）→ ISP → 本地網路（LAN）
- 每台連接的電腦都需要唯一的 IP位址，格式為 nnn.nnn.nnn.nnn（每個數字介於0-255）

**TCP/IP 協定堆疊**（四層模型）

| 層級 | 功能 |
|------|------|
| 應用層 | HTTP、SMTP、FTP 等應用協定 |
| TCP 層 | 透過埠號將資料路由到正確應用 |
| IP 層 | 以 IP 位址將封包路由到目標電腦 |
| 硬體層 | 將二進位資料轉換為網路信號 |

**封包傳輸流程**
1. 應用層資料進入協定堆疊
2. 長訊息被分割成可管理的「封包」
3. TCP層添加來源/目的埠號
4. IP層添加來源/目的IP位址
5. 硬體層將資料轉換為電子信號
6. 透過ISP的路由器轉發
7. 經過多個路由器和骨幹網路
8. 抵達目標電腦後逆向解包

**DNS（網域名稱服務）**
- 將網域名稱（如 www.example.com）轉換為 IP 位址
- 分佈式資料庫系統，採用階層結構，逐級查詢

**TCP vs IP 特性**
- **TCP**：連接導向、可靠的位元流服務，確保資料完整性、傳送確認、正確順序
- **IP**：不可靠的無連接協定，僅負責封包的獨立傳送和基於目標位址的路由

**常用埠號**
- FTP: 20/21
- Telnet: 23
- SMTP: 25
- HTTP: 80

---

#### 4. Introduction to Internet
> 原文：/guides/what-is-internet
> ⚠️ 相對路徑，無法直接訪問

### 影片

- [How does the Internet work?](https://www.youtube.com/watch?v=x3c1ih2NJEg)
- [How does the internet work? (Full Course)](https://www.youtube.com/watch?v=zN8YNNHcaZc)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
