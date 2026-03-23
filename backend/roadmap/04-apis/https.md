# HTTPS

## 簡介

HTTPS (Hypertext Transfer Protocol Secure) extends HTTP with SSL/TLS encryption for secure data transmission. Ensures confidentiality, integrity, and authenticity, protecting against interception and tampering. Essential standard for web applications handling sensitive user data.

## 學習資源

### 文章

#### 1. What is HTTPS?
> 原文：https://www.cloudflare.com/en-gb/learning/ssl/what-is-https/

**HTTPS 定義**

HTTPS（Hypertext Transfer Protocol Secure）是 HTTP 的安全版本，透過加密增強資料傳輸的安全性。任何需要登入憑證的網站都應使用 HTTPS。現代瀏覽器（如 Chrome）會將非 HTTPS 網站標記為「不安全」。

**HTTPS 運作原理**

使用 **TLS**（Transport Layer Security，前身為 SSL）加密協議，採用**非對稱公鑰基礎架構**：

| 金鑰類型 | 說明 |
|---------|------|
| **Private Key（私鑰）** | 由網站擁有者控制，存放於 Web Server，用於解密公鑰加密的資訊 |
| **Public Key（公鑰）** | 對所有人公開，用於加密與伺服器的通訊 |

**為什麼 HTTPS 重要**

- HTTP 傳輸的資料是**明文**，容易被攔截（如公共 Wi-Fi）
- HTTPS 加密後，即使封包被截獲也無法讀取
- 防止 ISP 等中間人在網頁中注入廣告等內容

**HTTPS vs HTTP**

| 比較項目 | HTTP | HTTPS |
|---------|------|-------|
| **Port** | 80 | 443 |
| **加密** | 無 | TLS/SSL |
| **安全性** | 明文傳輸 | 加密傳輸 |

**技術細節**

- HTTPS 並非獨立協議，而是**在 HTTP 上套用 TLS/SSL 加密**
- 連接時，網頁會發送 **SSL 憑證**（包含公鑰）
- 客戶端與伺服器進行 **SSL/TLS 握手**（Handshake）建立安全連線

---

#### 2. Why HTTPS Matters
> 原文：https://web.dev/articles/why-https-matters

##### 主要概念和定義

HTTPS (Hypertext Transfer Protocol Secure) 是 HTTP 的安全版本，即使網站不處理敏感通訊，也應該使用 HTTPS 保護所有網站。HTTPS 不僅為網站和用戶的個人資訊提供關鍵的安全性和資料完整性，也是許多新瀏覽器功能（特別是 Progressive Web Apps 所需功能）的必要條件。

##### 核心功能和特性

**1. 保護網站完整性 (Website Integrity)**
- 防止入侵者篡改網站與用戶瀏覽器之間的通訊
- 入侵者包括惡意攻擊者和合法但侵入性的公司（如在頁面中注入廣告的 ISP）
- 防止第三方插入可能破壞用戶體驗和造成安全漏洞的廣告
- 保護所有未受保護的資源（圖片、cookies、scripts、HTML）免於被利用

**2. 保護用戶隱私和安全 (User Privacy & Security)**
- 防止入侵者被動監聽網站與用戶之間的通訊
- 保護用戶的行為和身份資訊不被洩露
- 即使是看似無害的單次訪問，入侵者也可能從用戶的聚合瀏覽活動中推斷其行為和意圖
- 防止去匿名化 (de-anonymization) 攻擊
- 避免敏感資訊洩露（例如：員工閱讀未受保護的醫療文章可能無意中向雇主洩露健康狀況）

**3. Web 平台的未來 (Future of the Web)**
- 許多強大的新 web 平台功能需要 HTTPS：
  - 使用 `getUserMedia()` 拍照或錄音
  - 使用 Service Workers 實現離線應用體驗
  - 建構 Progressive Web Apps (PWAs)
- 許多舊 API 也正在更新為需要權限才能執行（如 Geolocation API）
- HTTPS 是新功能和更新功能的權限工作流程的關鍵組成部分

##### 使用方式和最佳實踐

- **全面採用**：保護所有網站，不僅限於處理敏感通訊的網站
- **完整覆蓋**：確保所有資源（圖片、腳本、樣式表等）都通過 HTTPS 載入
- **瀏覽器功能需求**：現代瀏覽器要求許多功能必須在 HTTPS 環境下運行

##### 重要的技術細節

- **入侵點**：攻擊可能發生在網路的任何位置，包括用戶設備、Wi-Fi 熱點或被入侵的 ISP
- **資源保護**：HTTPS 使入侵者更難獲取網站資源的訪問權限
- **常見誤解**：只有處理敏感通訊的網站才需要 HTTPS 是錯誤的觀念，每個未受保護的 HTTP 請求都可能洩露用戶的行為和身份資訊
- **權限系統**：HTTPS 是瀏覽器權限系統的基礎要求

---

#### 3. How HTTPS works (comic)
> 原文：https://howhttps.works/

##### 主要概念和定義

這是一個用漫畫形式解釋 HTTPS 工作原理的教育資源。透過角色 Certificat、Browserbird 和 Compugter 的冒險故事，說明為什麼 HTTPS 對 web 的未來至關重要，以及它如何運作。

##### 核心功能和特性

**漫畫系列章節 (Episodes)**：
1. **Why do we need HTTPS?** - 為什麼需要 HTTPS
2. **The keys** - 金鑰機制
3. **The handshake** - 握手過程
4. **HTTPS, SSL, TLS differences** - HTTPS、SSL、TLS 的差異
5. **Certificate Authorities** - 憑證授權機構

##### 使用方式和最佳實踐

- 適合初學者透過視覺化方式理解 HTTPS 的運作原理
- 使用故事和角色類比，使複雜的加密概念更容易理解
- 提供多語言版本（包含中文），適合不同語言背景的學習者

##### 重要的技術細節

- 以貓咪角色解釋 HTTPS 的工作原理
- 涵蓋從基礎概念到具體實作的完整流程
- 強調隱私保護的重要性（"Don't let the bad crabs get you"）
- 互動式學習體驗，適合視覺學習者

---

#### 4. HTTPS explained with carrier pigeons
> 原文：https://baida.dev/articles/https-explained-with-carrier-pigeons

##### 主要概念和定義

使用信鴿傳遞訊息的類比方式解釋 HTTPS 的工作原理。透過 Alice、Bob 和 Mallory（密碼學文獻中的標準角色）的故事，說明加密通訊的原理和演進。

##### 核心功能和特性

**1. 第一次簡單通訊 (First Naive Communication)**
- 類比 HTTP：Alice 透過信鴿傳送訊息給 Bob
- 問題：Mallory 可以攔截並修改訊息
- 這就是 **HTTP** 的運作方式（不安全）

**2. 對稱金鑰加密 (Symmetric Key Cryptography)**
- 使用秘密代碼（Caesar cipher 凱薩密碼）加密訊息
- 將字母移位 3 個位置（例如：D→A, E→B, F→C）
- "secret message" 加密後變成 "pbzobq jbppxdb"
- 問題：如何安全地交換金鑰？如果 Mallory 攔截包含金鑰的訊息，加密就失效了
- 這導致 **Man in the Middle Attack**（中間人攻擊）

**3. 非對稱金鑰加密 (Asymmetric Key Cryptography)**
- 使用「攜帶盒子的信鴿」類比
- 流程：
  1. Bob 送信鴿給 Alice
  2. Alice 送回一個帶開放鎖的盒子，但保留鑰匙
  3. Bob 把訊息放進盒子並鎖上，送給 Alice
  4. Alice 用鑰匙打開盒子讀取訊息
- 即使 Mallory 攔截信鴿，她也無法打開盒子（沒有鑰匙）
- **Public Key**（公鑰）= 盒子
- **Private Key**（私鑰）= 鑰匙

**4. 憑證授權機構 (Certification Authority)**
- 問題：Bob 如何確認盒子真的來自 Alice？
- 解決方案：引入 Ted（一個值得信賴的知名人士）
- Ted 會在確認身份後為 Alice 的盒子簽名
- 瀏覽器預先包含各種 Certification Authorities 的簽名
- 當首次連接網站時，因為信任 Ted，所以信任該網站的盒子

**5. 混合加密系統 (Hybrid Encryption)**
- 問題：攜帶盒子的信鴿比較慢
- 解決方案：
  - 使用非對稱加密（盒子方法）僅用於交換金鑰
  - 使用對稱加密（凱薩密碼）加密實際訊息
- 結合兩者優點：非對稱加密的可靠性 + 對稱加密的效率

##### 使用方式和最佳實踐

- 使用日常生活類比理解複雜的密碼學概念
- 適合非技術背景人員理解 HTTPS 的基本原理
- 循序漸進地介紹加密技術的演進過程

##### 重要的技術細節

- **Caesar cipher**（凱薩密碼）：最基本的對稱加密範例，實際應用中使用更複雜的演算法
- **Symmetric encryption**（對稱加密）：加密和解密使用相同的金鑰，速度快但金鑰交換是挑戰
- **Asymmetric encryption**（非對稱加密）：使用公鑰和私鑰對，安全但較慢
- **現實世界的實作**：
  - 雖然沒有真正的慢信鴿，但非對稱加密確實比對稱加密慢
  - 因此只用非對稱加密交換金鑰，實際資料傳輸使用對稱加密
- **Man in the Middle Attack**：攻擊者攔截並可能修改通訊內容的攻擊方式
- **Trust Chain**（信任鏈）：透過 Certification Authority 建立的信任機制

### 影片

- [HTTP vs HTTPS](https://www.youtube.com/watch?v=nOmT_5hqgPk)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
