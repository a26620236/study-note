# JWT

## 簡介

JWT (JSON Web Token) securely transmits information as JSON objects with three parts: header (token type/algorithm), payload (claims/data), and signature (integrity verification). Used for authentication and authorization in web/mobile apps. Compact, self-contained, and HTTP header-friendly.

## 學習資源

### 文章

#### 1. What is JWT?
> 原文：[https://www.akana.com/blog/what-is-jwt](https://www.akana.com/blog/what-is-jwt)（已重定向至 https://www.perforce.com/blog/aka/what-is-jwt）

**什麼是 JWT（JSON Web Token）**

JWT 是「用於在兩方之間安全共享訊息的開放標準」。每個 JWT 包含一組編碼的 JSON 物件聲明，並經過加密簽名防止篡改。

**JWT 結構（三段，以點分隔：xxxxx.yyyyy.zzzzz）**

| 部分 | 內容 |
|------|------|
| **Header（JOSE）** | Token 類型（JWT）和簽名算法 |
| **Payload** | Claims（聲明）——關於實體和元數據的陳述，通常不超過十幾個欄位；常見欄位：issuer、subject、audience、expiration |
| **Signature** | 使用共享密鑰或私鑰對 header + payload 簽名，確保完整性 |

**驗證流程**

發行者創建並簽署 JWT → 客戶端在 API 請求中傳遞 → 接收方驗證簽名是否與 header + payload 匹配 → 若有效，根據 claims 決定是否授權

**最常見用途**：OAuth Bearer Token——作為數位憑證，授予特定 API 資源的訪問權限

---

#### 2. JWT Security Best Practices
> 原文：[https://curity.io/resources/learn/jwt-best-practices/](https://curity.io/resources/learn/jwt-best-practices/)

**核心觀念**：JWT 是訊息格式，不是協議；安全性取決於如何使用和驗證，而不是 JWT 本身

**關鍵最佳實踐清單**

**1. 始終完整驗證 JWT**
接收到 JWT 的服務必須驗證——包括內部網路服務間通信。驗證項目：簽名、issuer（iss）、audience（aud）。

**2. 避免在前端 Channel 傳遞含敏感資料的 JWT**
ID token 是 JWT，應避免在其中放敏感資料；建議 UI 客戶端呼叫 userinfo endpoint 獲取用戶資料，而非從 ID token 讀取。

**3. 算法安全**
- 驗證 token 時，檢查 `alg` claim 是否在允許清單中（allowlist 優於 denylist）
- 絕對不允許 `none` 算法（表示未簽名的 JWT）
- 推薦算法：EdDSA 或 ES256（橢圓曲線）；廣泛支援選 RS256；避免對稱金鑰（HS256）

**4. 始終驗證 Issuer（iss）**
確保 token 來自預期的授權伺服器，防止攻擊者發送偽造 JWT 並讓你下載惡意金鑰。

**5. 始終驗證 Audience（aud）**
伺服器應拒絕不包含自己在 aud 中的 token，防止 token 被其他資源伺服器誤用。

**6. 不要混用 Access Token 和 ID Token**
兩者用途不同：ID token 給客戶端用，access token 給 API 用。不可互換。

**7. 使用短效期 Token**
Token 一旦發出很難撤銷。建議 access token 有效期設為分鐘至小時，不要設為天或月。使用 `exp`、`nbf`、`iat` 等時間 claims 控制。

**8. 使用非對稱簽名金鑰**
非對稱金鑰（公/私鑰）比對稱金鑰更安全——對稱金鑰所有方共享，任一方都能發行 token。

**9. 不要用 JWT 做 Session**
JWT 不適合作為 session 機制，這樣做會降低安全性。應使用傳統的 session cookie 和集中式 session 管理。

**10. 使用 JWKS 端點動態獲取金鑰**
從授權伺服器的 JWKS endpoint 動態下載公鑰，支援金鑰輪替而不中斷服務。

### 影片

- [What Is JWT and Why Should You Use JWT](https://www.youtube.com/watch?v=7Q17ubqLfaM)
- [Node.js JWT Authentication Tutorial](https://www.youtube.com/watch?v=mbsmsi7l3r4)
- [Explore top posts about JWT](https://app.daily.dev/tags/jwt?ref=roadmapsh)

### 其他資源

- [jwt.io Website](https://jwt.io/)
- [RFC 7519 - JSON Web Token Standard](https://datatracker.ietf.org/doc/html/rfc7519)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
