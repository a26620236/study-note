# Web Security Knowledge

## 簡介

Web security protects applications from threats through strong authentication, encryption (SSL/TLS), input validation preventing SQL injection and XSS attacks, secure coding practices, session management, regular updates, and ongoing security testing including penetration testing.

## 學習資源

### 文章

#### 1. Why HTTPS Matters
> 原文：[https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https)

**為什麼 HTTPS 很重要**

所有網站都應該採用 HTTPS 保護，而不僅限於處理敏感資訊的網站。

**三大主要優勢**

**1. 保護網站完整性**
- HTTPS 防止入侵者篡改網站與使用者瀏覽器之間的通訊
- 攻擊者可能在任何網路節點發起入侵（使用者設備、Wi-Fi 熱點、ISP）
- 保護所有資源（圖片、Cookie、腳本、HTML）

**2. 保護使用者隱私與安全**
- 防止被動監聽
- 即使單次訪問看似無害，攻擊者也可能通過聚合分析使用者行為來推斷身份
- 員工可能無意中透過閱讀未受保護的醫療文章而洩露健康資訊

**3. 推動網路未來發展**
- 新的 Web 平台功能（`getUserMedia()`、Service Workers、Progressive Web Apps）都強制要求 HTTPS
- 許多舊版 API（如 Geolocation API）也正在更新以要求使用者許可
- HTTPS 是實現這些權限工作流的關鍵元件

### 影片

- [7 Security Risks and Hacking Stories for Web Developers](https://www.youtube.com/watch?v=4YOpILi9Oxs)
- [Explore top posts about Security](https://app.daily.dev/tags/security?ref=roadmapsh)

### 其他資源

- [Visit the Dedicated Cybersecurity Roadmap](https://roadmap.sh/cyber-security)
- [OWASP Web Application Security Testing Checklist](https://github.com/0xRadi/OWASP-Web-Checklist)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
