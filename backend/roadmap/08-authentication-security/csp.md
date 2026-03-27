# Content Security Policy

## 簡介

CSP (Content Security Policy) prevents XSS and code injection attacks by specifying trusted content sources. Implemented via HTTP headers or meta tags, defining rules for scripts, stylesheets, images, and fonts. Reduces malicious code execution risk but requires careful configuration.

## 學習資源

### 文章

#### 1. MDN — Content Security Policy (CSP)
> 原文：[https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

**概述**

CSP 是一項安全機制，幫助防止 XSS、點擊劫持等威脅。通過 HTTP 標頭或 `<meta>` 標籤部署。

**四大主要用途**

**1. 控制資源載入（防止 XSS）**

使用 Fetch Directives 控制：
- `script-src`：JavaScript 來源
- `style-src`：CSS 來源
- `img-src`：圖片來源
- `default-src`：預設政策

**控制方法：**
- **Nonces**：伺服器為每次回應生成唯一隨機值
- **Hashes**：適用於靜態內容（SHA-256/384/512）
- **Location-based**：`'self'` 或指定主機名稱
- **Scheme-based**：只允許特定協議（如 HTTPS）

**2. Strict CSP（嚴格 CSP）**

推薦做法：
```http
Content-Security-Policy:
  script-src 'nonce-{RANDOM}';
  object-src 'none';
  base-uri 'none';
```

**3. 點擊劫持防護**

```http
Content-Security-Policy: frame-ancestors 'none'
```

**4. 升級不安全請求**

```http
Content-Security-Policy: upgrade-insecure-requests
```
自動將 HTTP 升級為 HTTPS。

**測試和部署**

使用 Report-Only 模式測試：
```http
Content-Security-Policy-Report-Only: policy
```

**最佳實踐**
- 避免 `unsafe-inline` 和 `unsafe-eval`
- 使用 Nonce 或 Hash 比 allowlist 更安全
- 定期檢查違規報告

---

#### 2. Google Devs — Content Security Policy (CSP)
> 原文：[https://developers.google.com/web/fundamentals/security/csp](https://developers.google.com/web/fundamentals/security/csp)（已重定向至 https://web.dev/articles/csp）

**CSP 的核心概念（web.dev 版）**

CSP 能「顯著降低現代瀏覽器中 XSS 攻擊的風險和影響」。Web 安全模型基於同源策略，但 XSS 攻擊通過注入惡意代碼繞過它。CSP 要求瀏覽器只執行/渲染來自明確批准來源的資源。

**HTTP Header 語法**

```http
Content-Security-Policy: directive source1 source2; directive2 source3
```

**主要指令（Directives）**

| 指令 | 控制範圍 |
|------|---------|
| `script-src` | JavaScript 執行來源 |
| `style-src` | CSS 樣式表來源 |
| `img-src` | 圖片來源 |
| `connect-src` | XHR、WebSocket、EventSource 連接 |
| `default-src` | 未指定指令的預設值 |
| `sandbox` | 應用類 iframe 的限制到頁面行為 |
| `report-uri` | 違規報告發送端點 |

**關鍵安全要求**

**內聯代碼限制**：CSP 預設禁止內聯腳本和樣式。開發者需將代碼移至外部文件，並將 event handler 改為 `addEventListener()`

**防止 eval**：`eval()`、`setTimeout([string])`、`setInterval([string])` 等函數被封鎖。應使用 `JSON.parse()` 替代 eval，並傳遞函數而非字串給計時函數

**允許的關鍵字**

- `'self'`：只允許當前來源
- `'none'`：不允許任何來源
- `'unsafe-inline'`：允許內聯代碼（有安全風險）
- `'unsafe-eval'`：允許動態代碼執行

**部署策略**：先使用 `Content-Security-Policy-Report-Only` header 在報告模式下監控違規，驗證策略後再切換為強制執行模式

### 影片

- [Content Security Policy Explained](https://www.youtube.com/watch?v=-LjPRzFR5f0)
- [Explore top posts about Security](https://app.daily.dev/tags/security?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
