# Cors

## 簡介

CORS (Cross-Origin Resource Sharing) is a browser security mechanism controlling cross-domain resource access. Uses HTTP headers and preflight requests to determine allowed origins. Extends Same-Origin Policy while preventing unauthorized access to sensitive data.

## 學習資源

### 文章

#### 1. Cross-Origin Resource Sharing (CORS)
> 原文：[https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

**CORS 的主要概念和定義**

**CORS（Cross-Origin Resource Sharing）** 是一種基於 HTTP header 的機制，允許伺服器表明哪些 **origins**（域名、協議或埠口）可以從瀏覽器載入資源。基於安全考慮，瀏覽器限制來自指令碼的跨源 HTTP 請求，`fetch()` 和 `XMLHttpRequest` 遵循 **同源政策（Same-Origin Policy）**，而 CORS 提供安全的跨源通信機制。

**CORS 的運作機制**

CORS 有三種主要請求類型：

1. **簡單請求（Simple Requests）**
   - 不觸發 preflight 的請求條件（需同時滿足）：
     - HTTP 方法：GET、HEAD、POST
     - Headers：只能使用 CORS-safelisted 的 headers
     - Content-Type：`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

2. **Preflight 請求**
   - 某些請求會先發送 OPTIONS 請求驗證伺服器權限
   - 觸發條件：使用 PUT、DELETE、PATCH 等方法，或自訂 Headers

   Preflight 流程：
   ```
   1️⃣ 瀏覽器發送 OPTIONS 請求
   2️⃣ 伺服器回應許可（包含 Access-Control-Allow-* headers）
   3️⃣ 瀏覽器發送實際請求
   ```

3. **認證請求（Requests with Credentials）**
   - 涉及 Cookie 或 HTTP Authentication 的請求
   - 必須設置 `credentials: "include"`
   - 回應必須包含 `Access-Control-Allow-Credentials: true`
   - **不能使用萬用字元 `*`**，必須指定具體 origin

**常見的 CORS Headers**

回應 Headers（伺服器設置）：
- `Access-Control-Allow-Origin`: 允許的源
- `Access-Control-Allow-Methods`: 允許的 HTTP 方法
- `Access-Control-Allow-Headers`: 允許的請求 headers
- `Access-Control-Allow-Credentials`: 是否允許認證
- `Access-Control-Expose-Headers`: 暴露給前端的 headers
- `Access-Control-Max-Age`: Preflight 快取時間（秒）

請求 Headers（瀏覽器自動發送）：
- `Origin`: 發送請求的源
- `Access-Control-Request-Method`: 實際請求的 HTTP 方法
- `Access-Control-Request-Headers`: 實際請求的 headers

**最佳實踐**

認證請求的注意事項：
- ❌ 錯誤：使用 `Access-Control-Allow-Origin: *` 搭配 credentials
- ✅ 正確：指定具體 origin，如 `Access-Control-Allow-Origin: https://example.com`

Cookie 相關：
- CORS 回應中的 `Set-Cookie` 受第三方 Cookie 政策影響
- 可使用 `SameSite` 屬性控制行為

---

#### 2. Understanding CORS
> 原文：[https://rbika.com/blog/understanding-cors](https://rbika.com/blog/understanding-cors)

**什麼是 CORS？**

當網站託管在 `localhost:8000`，其 JavaScript 嘗試向 `localhost:9000` 的伺服器發送請求時，會因為瀏覽器的 **同源政策（Same-Origin Policy）** 而失敗。CORS（Cross-Origin Resource Sharing）是一種基於 HTTP header 的機制，讓伺服器告訴瀏覽器哪些來源可以存取其資源。

**運作原理**

1. 瀏覽器發送跨源請求時，會包含 `Origin` header
2. 伺服器回應 `Access-Control-Allow-Origin` header
3. 若回應的值與請求的 Origin 匹配，瀏覽器允許存取；否則產生 CORS 錯誤

**Preflight 請求**
- 使用 GET、POST、HEAD **以外**的方法，或包含非標準 headers 的請求，必須先發送 preflight
- 瀏覽器先用 `OPTIONS` 方法發送 preflight 請求
- 伺服器需回應 `Access-Control-Allow-Origin` 和 `Access-Control-Allow-Methods`
- POST 不一定觸發 preflight（因為 CORS 出現前瀏覽器就已允許跨源 POST）

**如何修復 CORS 錯誤**

1. 檢查 Network tab 中伺服器的回應 headers
2. 確保 `Access-Control-Allow-Origin` 存在且值正確
3. 若需要 preflight，確認 `Access-Control-Allow-Methods` 包含使用的 HTTP 方法
4. 在伺服器端設定正確的 CORS headers

Express.js 範例：
```js
var express = require('express');
var cors = require('cors');
var app = express();

cors({ origin: 'http://localhost:8000' });

app.get('/api', function (req, res, next) {
  res.json({ msg: 'success' });
});
```

**常見誤解**
- CORS 錯誤**只發生在瀏覽器**中，Postman 或 curl 不會出現
- 這些工具發送的是頂層網路請求，不屬於跨源請求
- CORS 設定在伺服器端，但由**客戶端（瀏覽器）決定是否遵守**

### 影片

- [CORS in 100 Seconds](https://www.youtube.com/watch?v=4KHiSt0oLJ0)
- [CORS in 6 minutes](https://www.youtube.com/watch?v=PNtFSVU-YTI)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
