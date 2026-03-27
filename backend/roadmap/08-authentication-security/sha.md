# SHA family

## 簡介

SHA (Secure Hash Algorithm) is a family of cryptographic hash functions generating fixed-size hash values for data integrity and security. Includes SHA-1 (weak, 160-bit), SHA-2 (stronger, 224-512 bits), and SHA-3 (latest with additional security features). Used for password storage and digital signatures.

## 學習資源

### 文章

#### 1. What is SHA?
> 原文：[https://www.encryptionconsulting.com/education-center/what-is-sha/](https://www.encryptionconsulting.com/education-center/what-is-sha/)

**什麼是 SHA（Secure Hash Algorithm）**

SHA 是 MD5 的修改版本，用於資料和憑證的雜湊。雜湊算法透過位元運算、模數加法和壓縮函數將輸入縮短為較小的固定格式。雜湊是**單向的**——一旦雜湊，結果的 hash digest 無法被解密（除非暴力破解）。

**雪崩效應（Avalanche Effect）**

SHA 的重要特性：即使輸入只改變一個字符，輸出的 hash 也完全不同。例如：
- "Heaven" → SHA-2 雜湊：`06b73bd57b3b938786daed820cb9fa4561bf0e8e`
- "heaven" → SHA-2 雜湊：`66da9f3b8d9d83f34770a14c38276a69433a535b`

這防止攻擊者從 hash digest 推測原始內容，並讓接收方知道訊息是否被竄改。

**SHA 的種類**

雖然常見 SHA-1、SHA-2、SHA-256、SHA-512、SHA-224、SHA-384 等名稱，實際上只有**兩個主要類型**：

| 版本 | 發布 | 輸出長度 | 狀態 |
|------|------|---------|------|
| **SHA-1** | 1993 | 160 位元 | **已棄用**（2017 年 Google 的「SHAttered」攻擊成功演示碰撞） |
| **SHA-2** | 2000s+ | 224–512 位元（SHA-256、SHA-512 等是 SHA-2 的子版本） | **目前標準** |
| **SHA-3** | 2015 | 可變 | 新標準，尚未廣泛取代 SHA-2 |

SHA-2 的較大位元長度（256–512 位元）提供更強的碰撞抵抗性，確保每個 hash digest 都有唯一值。自 2016 年起，所有數位簽名和憑證均要求使用 SHA-2。

**SHA 的主要用途**

- **SSL/TLS 憑證**：所有 SSL 憑證必須使用 SHA-2 雜湊
- **密碼儲存**：伺服器只需記住 hash 而非明文密碼
- **數位簽名**：SSH、S-MIME、IPSec
- **檔案完整性**：傳輸中的檔案被篡改時，hash digest 不會與原始值匹配
- **區塊鏈**：SHA-256 在比特幣挖礦中用於驗證交易

**SHA-3 的現況**

SHA-3 由 NIST 於 2015 年發布，但尚未成為行業標準，因為：
1. SHA-2 仍非常安全
2. 大多數組織當時正從 SHA-1 遷移到 SHA-2
3. SHA-3 在軟體上較慢（但在硬體上比 SHA-1/2 更快）

### 影片

- [SHA: Secure Hashing Algorithm](https://www.youtube.com/watch?v=DMtFhACPnTY)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
