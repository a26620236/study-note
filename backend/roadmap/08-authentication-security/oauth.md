# OAuth

## 簡介

OAuth is an open authorization standard allowing third-party applications to access user resources without exposing credentials. Uses access tokens issued after user permission, involving resource owner, resource server, and authorization server. Enables secure token-based access management for services.

## 學習資源

### 文章

#### 1. Okta - What the Heck is OAuth
> 原文：[https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth)

**什麼是 OAuth？**

OAuth 是一套開放標準的授權框架，允許應用在不暴露使用者密碼的情況下，獲得對資源的限制性訪問。

**核心差異**
- OAuth 是授權框架，不是身份驗證協議
- OAuth 1.0a vs 2.0 完全不同，無法相容

**中央組件**

1. **Scopes（範圍）**：權限捆綁
2. **Actors（參與方）**：Resource Owner、Resource Server、Client、Authorization Server
3. **Tokens（令牌）**：
   - Access Token：短期（數小時）
   - Refresh Token：長期（數天至數年）

**主要流程**

| 流程類型 | 應用場景 |
|---------|--------|
| **Implicit Flow** | 單頁應用 (SPA) |
| **Authorization Code Flow** | 標準應用（最安全）|
| **Client Credential Flow** | 伺服器對伺服器 |
| **Device Flow** | TV、IoT、CLI |

**安全考量**
- 使用 CSRF token（state 參數）
- 白名單 redirect URI
- 保護 Client Secret

**OpenID Connect（OIDC）**

解決 OAuth 無法直接認證的問題，在 OAuth 上增加身份驗證層。

---

#### 2. DigitalOcean - An Introduction to OAuth 2
> 原文：[https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2)

**核心概念**

涵蓋 OAuth 2 的基礎知識，包括授權工作原理與安全的 API 存取方式。

**主要內容**
- **參與角色**：Resource Owner、Client、Authorization Server、Resource Server
- **Grant Types**：Authorization Code Flow、Implicit Flow
- **安全最佳實踐**：不應在 URL 中傳遞 Bearer tokens，而應透過 HTTP headers 傳送

### 影片

- [OAuth 2 Explained In Simple Terms](https://www.youtube.com/watch?v=ZV5yTm4pT8g)
- [Explore top posts about OAuth](https://app.daily.dev/tags/oauth?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
