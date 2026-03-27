# Cookie-Based Authentication

## 簡介

Cookie-based authentication maintains user sessions by storing session IDs in browser cookies. Server stores session data and uses cookies as keys. Simple to implement and browser-native, but vulnerable to CSRF attacks and challenging for cross-origin requests.

## 學習資源

### 文章

#### 1. How does cookie based authentication work?
> 原文：[https://stackoverflow.com/questions/17769011/how-does-cookie-based-authentication-work](https://stackoverflow.com/questions/17769011/how-does-cookie-based-authentication-work)（450+ 票最高讚答案）

**Cookie-Based Authentication 六步驟流程**

**Step 1：用戶註冊**
客戶端發送 HTTP 請求，包含用戶名和密碼

**Step 2：伺服器處理註冊**
伺服器對密碼進行雜湊後，將用戶名和雜湊密碼存入資料庫（絕不儲存明文密碼）

**Step 3：用戶登入**
客戶端再次發送 HTTP 請求，包含用戶名和密碼

**Step 4：伺服器驗證登入**
伺服器從資料庫查詢用戶名，對提交的密碼雜湊後與資料庫中的雜湊值比較。若不符，回傳 401 狀態碼拒絕訪問

**Step 5：伺服器生成 Access Token**
驗證通過後，生成唯一識別用戶 session 的 access token：
- 儲存到資料庫（關聯到該用戶）
- 附加到回應的 Cookie 中（設置過期時間）

**Step 6：客戶端發送請求**
此後每次請求，Cookie（含 access token）自動附加。伺服器從 Cookie 取出 token，與資料庫比對，符合則授予訪問

> **重要**：登出時必須清除 Cookie！

**Cookie 基礎概念（補充）**

Cookie 本質上是一個字典項目，有 key 和 value。瀏覽器在每次請求時自動附加對應域名的 Cookie。**Signed Cookie（加密 Cookie）** 是伺服器對 key-value 加密，只有伺服器能解讀，提高安全性。Cookie 只會被發送到設置它的域名（及允許的子域名），絕不會跨域發送。

---

#### 2. Session vs Token Authentication
> 原文：[https://www.section.io/engineering-education/token-based-vs-session-based-authentication/](https://www.section.io/engineering-education/token-based-vs-session-based-authentication/)

（此 URL 已永久重定向至 webscale.com/blog/，原文已無法訪問）

---

#### 3. Cookies vs LocalStorage vs SessionStorage
> 原文：[https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id](https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id)

**LocalStorage vs Cookies 安全比較**

**LocalStorage 儲存 JWT**
- 優點：純 JavaScript 實作，方便與第三方 API 整合；可配合 `Authorization: Bearer` header
- 缺點：**對 XSS 攻擊脆弱**——攻擊者可透過 JavaScript 存取 token；第三方套件（React、Vue、Google Analytics）都可能注入惡意腳本

**Cookies（httpOnly）儲存 JWT**
- 優點：設置 `httpOnly` flag 後 JavaScript 無法存取；自動附加到 HTTP 請求
- 缺點：4KB 大小限制；無法用於需要 Authorization header 的 API；**對 CSRF 攻擊脆弱**

**推薦方案（Option 3）：Access Token 放記憶體 + Refresh Token 放 httpOnly Cookie**

1. 認證成功後：access token 放在回應 body，refresh token 放 httpOnly + secure + SameSite=strict 的 Cookie
2. Access token 只存在 JavaScript 變數中（頁面刷新後消失）
3. Token 過期時呼叫 `/refresh_token`，refresh token 透過 Cookie 自動帶入

**OWASP 建議**：「不要將 session ID 儲存在 localStorage，因為資料永遠可被 JavaScript 存取。Cookies 可以用 httpOnly flag 來降低這種風險。」

### 影片

- [Session vs Token Authentication in 100 Seconds](https://www.youtube.com/watch?v=UBUNrFtufWo)
- [How do cookies work?](https://www.youtube.com/watch?v=rdVPflECed8)

### 其他資源

- [HTTP Cookies - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
