# Bcrypt

## 簡介

Bcrypt is a secure password-hashing function based on Blowfish cipher with built-in salt protection. Features adaptive cost factor that increases difficulty over time to resist brute-force attacks. Produces 60-character hashes, widely used for secure password storage.

## 學習資源

### 文章

#### 1. Understanding bcrypt
> 原文：[https://auth0.com/blog/hashing-in-action-understanding-bcrypt/](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/)

**為什麼需要 bcrypt？**

SHA 家族雖然是密碼學函數，但設計目標是**計算速度快**——現代 GPU 每秒可計算數十億個 SHA-256 雜湊。速度快對密碼儲存是缺點，因為攻擊者能快速暴力破解。我們需要一個**故意設計得慢**的函數，且能隨硬體進步而調整難度。

**bcrypt 的設計**

bcrypt 由 Niels Provos 和 David Mazières 於 1999 年在 USENIX 發表，基於 Blowfish 密碼器設計：

- **"b"** = Blowfish，**"crypt"** = UNIX 密碼系統的雜湊函數名稱
- 核心利用 Blowfish 昂貴的金鑰設定階段（key setup phase）
- 使用 eksblowfish（expensive key schedule Blowfish）算法

**運作流程**

**第一階段**：使用 cost（工作因子）、salt 和密碼初始化 eksblowfish 狀態，執行耗費大量時間的金鑰派生（key derivation）

**第二階段**：以 `OrpheanBeholderScryDoubt`（192 位元魔術值）在 ECB 模式下加密 64 次，輸出包含 cost 和 128 位元 salt

結果雜湊值以 `$2a$`、`$2y$` 或 `$2b$` 為前綴，表示 bcrypt 版本

**Cost Factor（工作因子）**

Cost 是 bcrypt 的核心特性——可以調整以平衡安全性與效能：

```
cost: 10 → ~65ms
cost: 12 → ~255ms
cost: 14 → ~1015ms
cost: 20 → ~66779ms（66 秒！）
```

每增加 1，計算時間翻倍（指數成長）。OWASP 建議：讓函數在不影響用戶體驗的情況下盡量慢。

**內建 Salt 保護**

bcrypt **強制要求 salt**，每次產生的 salt 完全隨機，因此同一密碼每次雜湊結果都不同，有效防禦 rainbow table 攻擊。

**Node.js 實作（兩種技術）**

```javascript
// 技術 1：分開生成 salt 和 hash
const salt = await bcrypt.genSalt(saltRounds);
const hash = await bcrypt.hash(password, salt);

// 技術 2：自動生成 salt 和 hash（推薦）
const hash = await bcrypt.hash(password, saltRounds);

// 驗證密碼
const isMatch = await bcrypt.compare(inputPassword, storedHash);
```

**安全特性**

- **Preimage resistant**（抗前像攻擊）
- 鹽空間夠大，能抵禦預計算攻擊（如 rainbow table）
- **自適應成本**：可隨硬體進步增加 cost，保持安全性

---

#### 2. Password Hashing: Bcrypt, Scrypt and Argon2
> 原文：[https://stytch.com/blog/argon2-vs-bcrypt-vs-scrypt/](https://stytch.com/blog/argon2-vs-bcrypt-vs-scrypt/)

**密碼雜湊基礎**

雜湊（Hashing）是單向的，無法「解雜湊」；輸出是固定長度的 hash value。相同輸入永遠產生相同 hash，使服務可以驗證用戶身份而無需儲存明文密碼。

**雜湊參數對照**

| 參數 | 說明 |
|------|------|
| **Salt** | 追加到輸入的隨機字串，防禦字典攻擊和 rainbow table |
| **Work Factor / Cycles** | 雜湊迭代次數（cycles = 2^work factor），越高越難破解 |
| **Memory Hardness** | 所需 RAM/CPU 量，越高越難用硬體加速攻擊 |
| **Threads** | 並行執行緒數 |

**三大算法比較**

| 特性 | Argon2 | bcrypt | scrypt |
|------|--------|--------|--------|
| **發布年份** | 2015 | 1999 | 2009 |
| **Memory Hardness** | 極高 | 無 | 高 |
| **速度** | 較慢 | 可 < 1 秒 | 中等 |
| **參數** | 最多（threads, CPU, memory） | 只有 cost | CPU、記憶體 |
| **適合場景** | 離線金鑰派生 | Web 應用認證 | 抵抗硬體暴力破解 |

**選擇建議**

- **Argon2**：記憶體密集型場景，離線金鑰派生（Password Hashing Competition 2015 冠軍）
- **bcrypt**：Web 應用首選，雜湊時間可控在 1 秒以內
- **scrypt**：最大化抵抗硬體暴力破解（Stytch 的選擇）

---

#### 3. Why you should use BCrypt to hash passwords
> 原文：[https://www.freecodecamp.org/news/why-you-should-use-bcrypt-to-hash-passwords/](https://www.freecodecamp.org/news/why-you-should-use-bcrypt-to-hash-passwords/)

（此 URL 已返回 404，文章已從 FreeCodeCamp 移除）

### 影片

- [Bcrypt Explained](https://www.youtube.com/watch?v=O6cmuiTBZVs)
- [How To Store A Password](https://www.youtube.com/watch?v=8ZtInClXe1Q)
- [bcrypt explained](https://www.youtube.com/watch?v=AzA_LTDoFqY)

### 其他資源

- [bcrypt for Node.js](https://github.com/kelektiv/node.bcrypt.js)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
