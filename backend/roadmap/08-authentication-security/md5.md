# MD5

## 簡介

MD5 (Message-Digest Algorithm 5) produces 128-bit hash values as 32-character hexadecimal strings. Once popular for data integrity and passwords, now considered cryptographically broken due to collision vulnerabilities. Largely replaced by secure alternatives like SHA-256.

## 學習資源

### 文章

#### 1. Wikipedia - MD5
> 原文：[https://en.wikipedia.org/wiki/MD5](https://en.wikipedia.org/wiki/MD5)

**MD5 的定義與運作**

MD5（Message-Digest Algorithm 5）是由 Ronald Rivest 於 1991 年設計的密碼學雜湊函數，1992 年作為 RFC 1321 正式規範。它將任意長度的訊息處理成固定的 **128 位元** 雜湊值，以 **32 個十六進位字符** 表示。

**算法流程**：訊息切割為 512 位元區塊 → 經過 4 輪共 16 次操作（使用非線性函數、模數加法和位元旋轉）→ 輸出 128 位元 hash

**安全漏洞**

| 漏洞類型 | 說明 |
|---------|------|
| **碰撞攻擊** | 2004 年研究證明 MD5 不具碰撞抵抗性；2.6 GHz 電腦可在數秒內找到碰撞 |
| **單區塊碰撞** | 2010 年實現；現代 GPU 每秒可計算數百萬次雜湊 |
| **實際利用** | 2008 年：研究者利用 MD5 碰撞偽造 X.509 憑證；2012 年：Flame 惡意軟件利用 MD5 弱點偽造數位簽名 |

**現況**

2008 年，CMU 軟體工程研究所結論：MD5「在密碼學上已損壞，不適合繼續使用」。美國政府應用現已要求使用 SHA-2 家族算法。儘管如此，截至 2019 年 MD5 仍廣泛用於非密碼學應用（如內容管理系統的密碼雜湊）。

---

#### 2. What is MD5?
> 原文：[https://www.techtarget.com/searchsecurity/definition/MD5](https://www.techtarget.com/searchsecurity/definition/MD5)

（此網站需 JavaScript 渲染，瀏覽器存取被拒絕，無法讀取內容）

---

#### 3. Why is MD5 not safe?
> 原文：[https://infosecscout.com/why-md5-is-not-safe/](https://infosecscout.com/why-md5-is-not-safe/)

**MD5 不安全的 3 大原因**

**1. 暴力破解攻擊速度快**
- MD5 演算法執行速度很快，容易被暴力破解
- 現代電腦每秒可嘗試數十億個密碼組合
- 即使是複雜密碼，最多也只需幾天就能破解

**2. 線上字典資料庫龐大**
- 存在超過 1,150 億個密碼的巨大 MD5 雜湊資料庫
- 如果使用者密碼較簡短，很容易在這類資料庫中被找到
- 只有長度足夠的隨機密碼才能避免被收錄

**3. MD5 存在碰撞漏洞**
- "碰撞"指不同的文字產生相同的 hash 值
- MD5 的碰撞阻力較弱，安全性不足
- 這允許駭客推導出大量相關的密碼變體

**解決方案**

| 方法 | 說明 |
|------|------|
| **使用 Salt** | 在密碼前後添加長隨機字符串，增加複雜度 |
| **強制長密碼** | 要求至少 15 個字符，並包含大小寫和特殊符號 |
| **更換演算法** | 改用 password_hash()、bcrypt 或 scrypt 等更安全的函數 |

### 影片

- [How the MD5 hash function works](https://www.youtube.com/watch?v=5MiMK45gkTY)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
