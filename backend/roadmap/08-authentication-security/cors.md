# Cors

## 簡介

CORS (Cross-Origin Resource Sharing) is a browser security mechanism controlling cross-domain resource access. Uses HTTP headers and preflight requests to determine allowed origins. Extends Same-Origin Policy while preventing unauthorized access to sensitive data.

## 學習資源

### 文章

#### 1. Cross-Origin Resource Sharing (CORS) - MDN
> 原文：[https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

**基本概念**

CORS 是一個基於 HTTP header 的機制，允許伺服器指示哪些來源（origin）可以跨域存取資源。瀏覽器會先發送 "preflight" 請求來檢查伺服器是否允許實際請求。

**三種請求類型**

**1. Simple Requests（簡單請求）**
- 允許的方法：GET、HEAD、POST
- 允許的 Content-Type：`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`
- 不觸發 preflight

**2. Preflighted Requests（預檢請求）**
- 複雜請求會先發送 OPTIONS 請求確認可行性
- 使用自訂 headers 或非標準 Content-Type 會觸發

**3. Credentialed Requests（認證請求）**
- 包含 cookies 或 HTTP 認證
- 必須設定 `credentials: "include"`
- 不能使用 wildcard (`*`) 作為 `Access-Control-Allow-Origin`

**重要 CORS Headers**

| Header | 說明 |
|--------|------|
| `Access-Control-Allow-Origin` | 指定允許的 origin |
| `Access-Control-Allow-Methods` | 允許的 HTTP 方法 |
| `Access-Control-Allow-Headers` | 允許的自訂 headers |
| `Access-Control-Allow-Credentials` | 是否允許 credentials |
| `Access-Control-Max-Age` | Preflight 快取時間 |

---

#### 2. Understanding CORS
> 原文：[https://rbika.com/blog/understanding-cors](https://rbika.com/blog/understanding-cors)

**CORS 運作原理**

瀏覽器預設會阻止跨來源請求。伺服器可以透過 CORS header 告訴瀏覽器哪些來源被允許存取其資源。

**基本流程：**
1. 瀏覽器在跨來源請求中包含 Origin header
2. 伺服器回應 Access-Control-Allow-Origin header
3. 若兩者相符，瀏覽器允許存取；不符則阻止請求

**Preflight 預檢請求**

使用非標準 HTTP 方法或特殊 header 的請求需要預檢。瀏覽器會先發送 OPTIONS 方法的預檢請求，伺服器需回應：
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`

**重要提醒**

CORS 錯誤僅在瀏覽器中發生。Postman 或 curl 不會遇到此問題，因為它們不進行跨來源請求檢查。

### 影片

- [CORS in 100 Seconds](https://www.youtube.com/watch?v=4KHiSt0oLJ0)
- [CORS in 6 minutes](https://www.youtube.com/watch?v=PNtFSVU-YTI)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
