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
> 原文：[https://developers.google.com/web/fundamentals/security/csp](https://developers.google.com/web/fundamentals/security/csp)

⚠️ 此網站重定向到 web.dev（未單獨整理）

### 影片

- [Content Security Policy Explained](https://www.youtube.com/watch?v=-LjPRzFR5f0)
- [Explore top posts about Security](https://app.daily.dev/tags/security?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
