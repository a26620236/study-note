# Security Assertion Markup Language (SAML)

## 簡介

SAML (Security Assertion Markup Language) is an XML-based framework for single sign-on (SSO) and identity federation. Enables authentication exchange between identity providers (IdP) and service providers (SP) through XML assertions containing user identity and permissions. Streamlines user management and centralized authentication.

## 學習資源

### 文章

#### 1. SAML Explained in Plain English
> 原文：[https://www.onelogin.com/learn/saml](https://www.onelogin.com/learn/saml)

**什麼是 SAML**

SAML 是「Security Assertion Markup Language」，基於 XML 格式的開放標準，讓多個 Web 應用之間安全地交換身份驗證憑證。主要用途是實現 **單一登入（SSO）**。

**SAML 的運作流程**

1. 用戶訪問服務提供者（Service Provider，SP）的應用程式
2. SP 發出 SAML 請求
3. 瀏覽器將請求轉發給身份提供者（Identity Provider，IdP）
4. IdP 驗證用戶身份（或確認已有有效認證）
5. IdP 生成 SAML 回應（包含 XML assertion）
6. 瀏覽器將回應提交給 SP
7. SP 驗證 assertion
8. 驗證成功，用戶獲得訪問權限

**關鍵組件**

| 組件 | 說明 |
|------|------|
| **Identity Provider（IdP）** | 安全儲存和管理用戶憑證 |
| **Service Provider（SP）** | 信任 IdP 認證的 Web 應用程式 |
| **SAML Assertion** | 在 IdP 和 SP 之間傳遞的認證憑證（XML 格式） |

**SAML 的主要優勢**

- 用戶只需一組憑證，消除「密碼疲勞」
- 減少 IT 幫助台的密碼重置請求
- 集中化憑證管理，增強安全性
- 用戶體驗更快速流暢
- 降低組織基礎設施成本

**SAML vs OAuth**

- **SAML**：處理**身份驗證**（Authentication，驗證「你是誰」）
- **OAuth**：處理**授權**（Authorization，授予「你能做什麼」）

### 影片

- [How SAML Authentication Works](https://www.youtube.com/watch?v=VzRnb9u8T1A)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
