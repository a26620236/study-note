# OWASP Security Risks

## 簡介

OWASP (Open Web Application Security Project) is an online community producing freely-available articles, methodologies, documentation, tools, and technologies for web application security.

## 學習資源

### 文章

#### 1. OWASP Top 10 Security Risks
> 原文：[https://cheatsheetseries.owasp.org/IndexTopTen.html](https://cheatsheetseries.owasp.org/IndexTopTen.html)

**OWASP Top 10（2021 版）**

OWASP Top 10 是針對開發者和 Web 應用安全的標準意識文件，代表最關鍵的 Web 應用安全風險。

| 排名 | 風險 | 相關防護重點 |
|------|------|-------------|
| **A01:2021** | **Broken Access Control（存取控制失效）** | 授權、IDOR 防護、CSRF 防護、交易授權 |
| **A02:2021** | **Cryptographic Failures（密碼學失敗）** | 加密儲存、TLS、HSTS、金鑰管理、Secrets 管理 |
| **A03:2021** | **Injection（注入攻擊）** | SQL 注入防護、LDAP 注入防護、XSS 防護、CSP、OS 命令注入防護 |
| **A04:2021** | **Insecure Design（不安全的設計）** | 威脅建模、濫用案例分析、攻擊面分析 |
| **A05:2021** | **Security Misconfiguration（安全配置錯誤）** | IaC 安全、XXE 防護、PHP 配置、Docker 安全 |
| **A06:2021** | **Vulnerable and Outdated Components（使用有漏洞或過期元件）** | 漏洞相依管理、第三方 JS 管理、npm 安全 |
| **A07:2021** | **Identification and Authentication Failures（身份認證失效）** | 認證機制、Session 管理、密碼儲存、MFA、SAML 安全 |
| **A08:2021** | **Software and Data Integrity Failures（軟體和資料完整性失效）** | 反序列化安全 |
| **A09:2021** | **Security Logging and Monitoring Failures（安全記錄與監控失效）** | 日誌記錄、應用程式日誌詞彙 |
| **A10:2021** | **Server-Side Request Forgery（SSRF，伺服器端請求偽造）** | SSRF 防護 |

#### 2. OWASP Cheatsheets
> 原文：[https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html)

（OWASP Cheatsheet Series 網站已可正常訪問，詳見上方 Top 10 各項目的對應 Cheat Sheet 連結）

### 影片


### 其他資源

- [OWASP Website](https://owasp.org/)
- [OWASP Application Security Verification Standard](https://github.com/OWASP/ASVS)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
