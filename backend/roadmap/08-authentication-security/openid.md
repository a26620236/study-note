# OpenID

## 簡介

OpenID is an open standard for decentralized authentication enabling single sign-on across multiple websites using one set of credentials managed by an identity provider. Often works with OAuth 2.0 for authorization, enhancing user convenience and streamlining identity management.

## 學習資源

### 文章

#### 1. OpenID Connect Protocol
> 原文：[https://auth0.com/docs/authenticate/protocols/openid-connect-protocol](https://auth0.com/docs/authenticate/protocols/openid-connect-protocol)

**什麼是 OpenID Connect (OIDC)?**

OpenID Connect 是建立在 OAuth 2.0 框架之上的身份認證層。OIDC 允許第三方應用程式驗證終端使用者的身份並取得基本使用者個人資料。此協議採用 JSON Web Tokens (JWTs) 來傳遞身份資訊。

**OpenID 與 OAuth 2.0 的差異**

兩者的核心差異在於應用目的：
- **OAuth 2.0**：著重於資源存取與共享
- **OpenID Connect**：專注於使用者認證

每當需要使用 OIDC 登入網站時，會被重導到 OpenID 網站登入，然後返回原網站。這使用戶能實現跨網站的單一登入體驗。

**JWT 與宣告 (Claims)**

JWT 包含有關使用者的宣告，例如姓名或電子郵件地址。OpenID Connect 規範定義了標準宣告集合（姓名、電子郵件、性別、出生日期等）。若標準宣告不符合需求，開發者可建立自訂宣告並將其新增至 Token 中。

### 影片

- [An Illustrated Guide to OAuth and OpenID Connect](https://www.youtube.com/watch?v=t18YB3xDfXI)
- [OAuth 2.0 and OpenID Connect (in plain English)](https://www.youtube.com/watch?v=996OiexHze0)
- [Explore top posts about Authentication](https://app.daily.dev/tags/authentication?ref=roadmapsh)

### 其他資源

- [OpenID Website](https://openid.net/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
