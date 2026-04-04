# SSO（Single Sign-On，單一登入）

## 簡介

SSO 是一種身份驗證機制，讓使用者只需登入一次，即可存取多個相互信任的應用程式或服務，不需要重複輸入帳號密碼。企業內部系統（如 Email、HR、ERP）或消費級產品（如 Google 全家桶）都廣泛使用 SSO。

---

## 一、SSO 核心概念

### 1.1 為什麼需要 SSO？

| 問題 | SSO 如何解決 |
|------|-------------|
| 密碼疲勞：使用者為每個系統記不同密碼 | 只需記一組憑證 |
| 安全風險：密碼重複使用導致連鎖洩漏 | 集中管理降低攻擊面 |
| IT 成本：大量密碼重置請求 | 減少 helpdesk 負擔 |
| 用戶體驗：頻繁登入打斷工作流 | 無縫切換多個應用 |

### 1.2 SSO 的核心角色

```
┌──────────────────┐
│   使用者 (User)    │  ← 只登入一次
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  身份提供者 (IdP)  │  ← 負責驗證身份、發放憑證
│  Identity Provider│     例：Okta、Auth0、Azure AD、Google
└────────┬─────────┘
         │ 發送 Token / Assertion
         ▼
┌──────────────────┐
│ 服務提供者 (SP)    │  ← 信任 IdP 的驗證結果
│ Service Provider  │     例：你的 Web App、SaaS 服務
└──────────────────┘
```

**三個核心角色：**

- **使用者（User / Principal）**：想要存取服務的人
- **身份提供者（Identity Provider, IdP）**：負責驗證使用者身份的中央伺服器
- **服務提供者（Service Provider, SP）**：使用者想存取的應用程式

### 1.3 SSO 的信任關係

SSO 的基礎是 **SP 與 IdP 之間的預先建立信任**，通常透過：
- 交換憑證（certificates）
- 註冊 metadata（endpoints、entity IDs）
- 共享密鑰或公鑰

---

## 二、SSO 運作流程

### 2.1 SP-Initiated SSO（最常見）

使用者先訪問服務提供者，再被導向 IdP 認證：

```
使用者 ──→ SP（未登入）──→ 重導至 IdP
                                │
                          IdP 驗證身份
                          （登入頁面）
                                │
                          驗證成功 ←──┘
                                │
使用者 ←── SP（已登入）←── IdP 發送 Token/Assertion
```

**詳細步驟：**
1. 使用者訪問 SP 的受保護資源
2. SP 檢測到使用者未認證
3. SP 生成認證請求，重導使用者到 IdP
4. IdP 檢查是否已有有效 session
   - 如有 → 直接發放 Token（使用者無感）
   - 如無 → 顯示登入頁面
5. 使用者在 IdP 完成登入
6. IdP 生成 Token/Assertion，重導回 SP
7. SP 驗證 Token/Assertion
8. 使用者獲得存取權限

### 2.2 IdP-Initiated SSO

使用者先登入 IdP（如企業入口），再從中選擇要訪問的服務：

```
使用者 ──→ IdP 登入 ──→ 選擇「App A」──→ IdP 發送 Assertion 給 App A
                     ──→ 選擇「App B」──→ IdP 發送 Assertion 給 App B
```

常見場景：企業 SSO 入口（如 Okta Dashboard）。

---

## 三、SSO 實現協議

### 3.1 協議對比總覽

| 特性 | SAML 2.0 | OAuth 2.0 + OIDC | CAS |
|------|----------|-------------------|-----|
| **用途** | 企業 SSO | 消費級 + 企業 SSO | 學術/企業 SSO |
| **Token 格式** | XML Assertion | JWT（ID Token） | Service Ticket |
| **傳輸方式** | HTTP Redirect / POST | HTTP Redirect + API | HTTP Redirect |
| **適用場景** | 企業內部系統 | Web / Mobile / SPA | 傳統 Web 應用 |
| **複雜度** | 高 | 中 | 低 |
| **行動端支援** | 差 | 好 | 差 |

### 3.2 SAML 2.0

**Security Assertion Markup Language** — 企業 SSO 的老牌標準。

**核心概念：**
- 基於 XML 的 Assertion 傳遞身份資訊
- 使用數位簽章確保完整性
- 透過瀏覽器重導實現跨域 SSO

**SAML Assertion 包含三種聲明：**

| 聲明類型 | 內容 |
|---------|------|
| Authentication Statement | 使用者何時、如何通過認證 |
| Attribute Statement | 使用者屬性（姓名、email、角色等） |
| Authorization Decision Statement | 使用者被允許/拒絕的操作 |

**SAML SSO 流程（SP-Initiated）：**

```
User → SP: 請求受保護資源
SP → User: 302 Redirect to IdP (帶 SAMLRequest)
User → IdP: 提交 SAMLRequest
IdP → User: 顯示登入頁面
User → IdP: 輸入帳密
IdP → User: 回應 HTML Form (帶 SAMLResponse)
User → SP: POST SAMLResponse (自動提交)
SP: 驗證簽章 → 解析 Assertion → 建立 Session
SP → User: 存取許可
```

### 3.3 OpenID Connect (OIDC)

**建立在 OAuth 2.0 之上的身份驗證層** — 現代 SSO 的主流選擇。

**與 OAuth 2.0 的關係：**
- **OAuth 2.0**：授權框架（Authorization）→ 「你能做什麼」
- **OIDC**：身份驗證層（Authentication）→ 「你是誰」
- OIDC = OAuth 2.0 + ID Token + UserInfo Endpoint

**OIDC 的關鍵元素：**

| 元素 | 說明 |
|------|------|
| **ID Token** | JWT 格式，包含使用者身份資訊（sub, name, email 等） |
| **Access Token** | 用於存取受保護 API |
| **Refresh Token** | 用於更新過期的 Access Token |
| **UserInfo Endpoint** | 取得使用者詳細資料的 API |
| **Discovery Document** | `/.well-known/openid-configuration`，描述 IdP 支援的功能 |

**OIDC Authorization Code Flow（推薦）：**

```
User → SP: 訪問受保護頁面
SP → User: 302 Redirect to IdP /authorize
    ?response_type=code
    &client_id=xxx
    &redirect_uri=https://sp.com/callback
    &scope=openid profile email
    &state=random_csrf_token

User → IdP: 登入認證
IdP → User: 302 Redirect to SP /callback?code=xxx&state=xxx

SP → IdP: POST /token (帶 code + client_secret)
IdP → SP: { id_token, access_token, refresh_token }

SP: 驗證 id_token → 建立 Session
```

### 3.4 CAS（Central Authentication Service）

耶魯大學開發的 SSO 協議，常見於學術機構：

```
User → App: 訪問
App → CAS Server: Redirect to /login
User → CAS Server: 登入 → 拿到 Service Ticket (ST)
User → App: Redirect 帶 ST
App → CAS Server: 後端驗證 ST → 取得使用者資訊
```

---

## 四、SSO Session 管理

### 4.1 Session 機制

```
┌─────────────────────────────────────┐
│           IdP Session               │
│  (使用者在 IdP 的登入狀態)            │
│  儲存：Cookie / Server Session      │
│  存活：通常 8-24 小時               │
└─────────┬──────────┬────────────────┘
          │          │
    ┌─────▼──┐  ┌───▼────┐
    │ SP A   │  │ SP B   │
    │Session │  │Session │
    │(獨立)  │  │(獨立)  │
    └────────┘  └────────┘
```

**關鍵要點：**
- IdP Session 與 SP Session 是**獨立的**
- 使用者訪問新的 SP 時，如果 IdP Session 有效，可以無感登入
- 每個 SP 維護自己的 Session（通常用 Cookie）

### 4.2 Single Logout (SLO)

登出也需要協調，常見策略：

| 策略 | 說明 | 優缺點 |
|------|------|--------|
| **Front-Channel SLO** | IdP 透過瀏覽器向所有 SP 發送登出請求（iframe/redirect） | 可靠性差，受瀏覽器限制 |
| **Back-Channel SLO** | IdP 直接呼叫各 SP 的登出 API | 更可靠，但需要 SP 支援 |
| **僅登出 IdP** | 只清除 IdP Session，SP Session 自然過期 | 最簡單，但有安全間隙 |

---

## 五、企業 SSO 常見架構

### 5.1 常見 IdP 服務

| IdP | 類型 | 支援協議 | 適用場景 |
|-----|------|---------|---------|
| **Okta** | SaaS | SAML, OIDC, WS-Fed | 企業級 |
| **Auth0** | SaaS | OIDC, SAML | 開發者友善 |
| **Azure AD** | SaaS | SAML, OIDC, WS-Fed | Microsoft 生態 |
| **Google Workspace** | SaaS | SAML, OIDC | Google 生態 |
| **Keycloak** | 自建 | SAML, OIDC | 開源自建 |
| **AWS Cognito** | SaaS | OIDC, SAML | AWS 生態 |

### 5.2 社交登入 vs 企業 SSO

```
社交登入（Social Login）          企業 SSO（Enterprise SSO）
─────────────────────          ─────────────────────
IdP：Google, GitHub, Facebook   IdP：Okta, Azure AD, LDAP
協議：OAuth 2.0 + OIDC          協議：SAML 2.0 / OIDC
目的：方便消費者登入              目的：集中管理企業員工身份
控制：使用者自行管理              控制：IT 管理員集中管控
```

---

## 六、安全考量

### 6.1 常見攻擊與防禦

| 攻擊 | 說明 | 防禦方式 |
|------|------|---------|
| **CSRF** | 偽造跨站請求 | 使用 `state` 參數（OAuth）或 `RelayState`（SAML） |
| **Token 竊取** | 攔截 Token | HTTPS 強制、Token 短效期、HttpOnly Cookie |
| **重放攻擊** | 重複使用舊 Token | Token 綁定時間戳、nonce、一次性使用 |
| **開放重導向** | 惡意 redirect_uri | 嚴格白名單 redirect URI |
| **XML 簽章繞過** | 偽造 SAML Assertion | 嚴格驗證 XML 簽章、canonicalization |
| **Session 固定** | 攻擊者預設 Session ID | 認證後重新產生 Session ID |

### 6.2 最佳實踐

- **強制 HTTPS**：所有 SSO 通信必須加密
- **Token 短效期**：Access Token 建議 15 分鐘 ~ 1 小時
- **驗證 Issuer**：確認 Token 來源是受信任的 IdP
- **驗證 Audience**：確認 Token 是發給你的 SP
- **使用 PKCE**：SPA 和 Mobile App 必須使用 PKCE 防止授權碼攔截
- **安全儲存 Token**：避免 localStorage，優先使用 HttpOnly Cookie
- **實作 Token Revocation**：支援即時撤銷被洩漏的 Token

---

## 七、MFA / 2FA（多因素認證 / 二階段驗證）

### 7.1 什麼是 MFA？

**MFA（Multi-Factor Authentication，多因素認證）** 要求使用者提供兩種以上不同類別的驗證因素才能完成認證。**2FA（Two-Factor Authentication）** 是 MFA 的特例，剛好使用兩種因素。

```
傳統登入：帳號 + 密碼 → 進入系統

MFA 登入：帳號 + 密碼 → 第二因素驗證 → 進入系統
                         (OTP / 推播 / 生物辨識)
```

### 7.2 三大驗證因素類別

| 類別 | 英文 | 說明 | 範例 |
|------|------|------|------|
| **知識因素** | Something you know | 使用者知道的東西 | 密碼、PIN、安全問題 |
| **持有因素** | Something you have | 使用者擁有的東西 | 手機、硬體金鑰、智慧卡 |
| **固有因素** | Something you are | 使用者本身的特徵 | 指紋、臉部辨識、虹膜 |
| **行為因素** | Something you do | 使用者的行為模式（進階） | 打字節奏、滑鼠軌跡、地理位置 |

> MFA 要求至少來自**不同類別**的兩種因素。密碼 + 安全問題 **不算** MFA（都是知識因素）。

### 7.3 常見 MFA 方式

#### TOTP（Time-Based One-Time Password）

最常見的 2FA 方式，基於時間產生一次性密碼：

```
┌──────────────┐     共享密鑰（Secret Key）    ┌──────────────┐
│   伺服器      │◄──────────────────────────►│  驗證器 App   │
│              │                             │ (Google Auth) │
│  HMAC-SHA1   │     當前時間（30秒為單位）     │  HMAC-SHA1   │
│  (secret +   │◄──────────────────────────►│  (secret +   │
│   timestamp) │                             │   timestamp) │
│      ↓       │                             │      ↓       │
│   6位數 OTP  │        比對是否相同           │   6位數 OTP  │
└──────────────┘                             └──────────────┘
```

**運作原理：**
1. 註冊時：伺服器生成 Secret Key，透過 QR Code 傳給驗證器 App
2. 登入時：雙方用相同的 Secret + 當前時間戳 → HMAC-SHA1 → 產生 6 位數 OTP
3. 伺服器驗證使用者輸入的 OTP 是否匹配

**常見 TOTP App：**
- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password

#### SMS / Email OTP

透過簡訊或 Email 發送一次性驗證碼：

```
使用者登入 → 伺服器發送 OTP 到手機/信箱 → 使用者輸入 OTP → 驗證通過
```

| 優點 | 缺點 |
|------|------|
| 使用者熟悉、不需額外 App | SMS 可被 SIM Swap 攻擊劫持 |
| 實作簡單 | SMS 傳輸不加密，可被攔截 |
| | Email 帳號被盜 = 第二因素失效 |

> **NIST 已不建議**將 SMS 作為主要的 MFA 方式，但仍優於完全無 MFA。

#### 推播通知（Push Notification）

```
使用者登入 → 伺服器發送推播到已註冊裝置 → 使用者點擊「允許」→ 驗證通過
```

- 代表服務：Duo Security、Microsoft Authenticator 推播
- 優點：使用者體驗好，一鍵確認
- 缺點：**MFA Fatigue Attack**（攻擊者不斷發推播直到使用者誤按允許）
- 防禦：改用 Number Matching（要求使用者輸入螢幕上顯示的數字）

#### WebAuthn / FIDO2（硬體安全金鑰）

```
使用者登入 → 插入/觸碰硬體金鑰（如 YubiKey）→ 金鑰用私鑰簽署 Challenge → 驗證通過
```

**基於公私鑰密碼學：**

| 元素 | 儲存位置 |
|------|---------|
| 私鑰 | 硬體金鑰內（永遠不離開裝置） |
| 公鑰 | 伺服器 |
| Challenge | 伺服器每次隨機產生 |

**優點：**
- **防釣魚**：金鑰綁定 Origin，假網站無法觸發
- **防重放**：每次 Challenge 不同
- **最高安全等級**：私鑰無法被提取

**常見硬體金鑰：** YubiKey、Google Titan、Feitian

#### Passkeys（通行密鑰）

WebAuthn 的進化版，用裝置內建的生物辨識取代實體金鑰：

```
使用者登入 → 裝置提示指紋/Face ID → 裝置用私鑰簽署 → 驗證通過
```

- 可跨裝置同步（iCloud Keychain、Google Password Manager）
- 終極目標：**取代密碼**，不只是第二因素
- Apple、Google、Microsoft 都已支援

### 7.4 MFA 方式安全等級比較

```
安全性（低 → 高）

SMS OTP ──→ Email OTP ──→ TOTP App ──→ Push ──→ WebAuthn/FIDO2
  │              │             │          │            │
  ▼              ▼             ▼          ▼            ▼
SIM Swap     帳號被盜       Secret      MFA        防釣魚
可劫持       即失效        可能洩漏    Fatigue     最高安全
```

| 方式 | 防釣魚 | 防 SIM Swap | 離線可用 | 使用者體驗 |
|------|--------|------------|---------|-----------|
| SMS OTP | ✗ | ✗ | ✗ | ★★★★☆ |
| Email OTP | ✗ | ✓ | ✗ | ★★★☆☆ |
| TOTP App | ✗ | ✓ | ✓ | ★★★☆☆ |
| Push 通知 | ✗ | ✓ | ✗ | ★★★★★ |
| WebAuthn | ✓ | ✓ | ✓ | ★★★★☆ |
| Passkeys | ✓ | ✓ | ✓ | ★★★★★ |

### 7.5 SSO + MFA 的整合架構

在 SSO 架構中，MFA 通常在 **IdP 層** 實施：

```
使用者 → SP（未登入）→ 重導至 IdP
                         │
                    第一因素：帳號密碼
                         │
                    第二因素：TOTP / WebAuthn
                         │
                    兩者皆通過 ✓
                         │
使用者 ← SP（已登入）← IdP 發送 Token
```

**好處：**
- **集中管理**：MFA 政策在 IdP 統一設定，所有 SP 自動套用
- **彈性政策**：可依風險等級要求不同 MFA（如管理後台要求硬體金鑰）
- **一次驗證**：SSO Session 有效期間不需重複 MFA

**Adaptive MFA（風險自適應 MFA）：**

```
登入請求 → 風險評估引擎
              │
              ├── 低風險（已知裝置 + 公司網路）→ 僅密碼
              ├── 中風險（新裝置 / 異地）→ 密碼 + TOTP
              └── 高風險（異國 / 可疑行為）→ 密碼 + 硬體金鑰 + 管理員審核
```

常見風險訊號：IP 地理位置、裝置指紋、登入時間、存取的資源敏感度。

### 7.6 在 NextAuth.js 中整合 MFA

NextAuth 原生不內建 MFA 流程，但可透過以下方式實現：

**方式一：依賴 IdP 的 MFA（推薦）**

最簡單的做法 — 在 IdP（Okta、Azure AD 等）開啟 MFA 政策，NextAuth 不需額外處理：

```typescript
// auth.ts — IdP 已啟用 MFA，NextAuth 無需特殊設定
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "corporate-sso",
      name: "Corporate SSO",
      type: "oidc",
      issuer: "https://your-idp.okta.com", // IdP 端設定 MFA 政策
      clientId: process.env.SSO_CLIENT_ID,
      clientSecret: process.env.SSO_CLIENT_SECRET,
      authorization: {
        params: {
          // 要求 IdP 使用 MFA 等級的認證
          acr_values: "http://schemas.openid.net/pape/policies/2007/06/multi-factor",
        },
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // 檢查 IdP 回傳的認證等級（ACR）
        token.acr = account.acr
        token.amr = account.amr // Authentication Methods References
      }
      return token
    },
  },
})
```

**方式二：自建 TOTP 2FA 流程**

適合使用 Credentials Provider 或需要自訂 MFA 的場景：

```typescript
// lib/totp.ts — TOTP 工具
import { authenticator } from "otplib"
import qrcode from "qrcode"

// 生成 Secret（使用者啟用 2FA 時呼叫）
export function generateTOTPSecret(email: string) {
  const secret = authenticator.generateSecret()
  const otpauth = authenticator.keyuri(email, "YourApp", secret)
  return { secret, otpauth }
}

// 生成 QR Code（給使用者掃描）
export async function generateQRCode(otpauth: string) {
  return qrcode.toDataURL(otpauth)
}

// 驗證 OTP
export function verifyTOTP(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret })
}
```

```typescript
// auth.ts — 自建 2FA 流程
import { verifyTOTP } from "@/lib/totp"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        totpCode: {}, // 2FA 驗證碼
      },
      async authorize(credentials) {
        // 第一因素：驗證帳密
        const user = await verifyPassword(
          credentials.email as string,
          credentials.password as string
        )
        if (!user) return null

        // 檢查使用者是否啟用 2FA
        if (user.totpSecret) {
          const totpCode = credentials.totpCode as string
          if (!totpCode) {
            // 拋出特殊錯誤，前端據此顯示 OTP 輸入框
            throw new Error("TOTP_REQUIRED")
          }
          // 第二因素：驗證 TOTP
          const isValid = verifyTOTP(totpCode, user.totpSecret)
          if (!isValid) {
            throw new Error("INVALID_TOTP")
          }
        }

        return user
      },
    }),
  ],
})
```

```typescript
// app/login/page.tsx — 前端 2FA 流程
"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [step, setStep] = useState<"credentials" | "totp">("credentials")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [totpCode, setTotpCode] = useState("")

  async function handleLogin() {
    const result = await signIn("credentials", {
      email,
      password,
      totpCode: step === "totp" ? totpCode : undefined,
      redirect: false,
    })

    if (result?.error === "TOTP_REQUIRED") {
      setStep("totp") // 顯示 OTP 輸入框
    } else if (result?.error === "INVALID_TOTP") {
      alert("驗證碼錯誤，請重試")
    } else if (result?.ok) {
      window.location.href = "/dashboard"
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin() }}>
      {step === "credentials" ? (
        <>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密碼" />
        </>
      ) : (
        <>
          <p>請輸入驗證器 App 上的 6 位數驗證碼</p>
          <input type="text" value={totpCode} onChange={(e) => setTotpCode(e.target.value)}
                 placeholder="000000" maxLength={6} inputMode="numeric" />
        </>
      )}
      <button type="submit">{step === "credentials" ? "登入" : "驗證"}</button>
    </form>
  )
}
```

### 7.7 常見 MFA 面試題

1. **MFA 和 2FA 有什麼差別？**
   → 2FA 是 MFA 的子集。MFA 指兩種以上因素，2FA 剛好是兩種。

2. **為什麼 SMS OTP 不安全？**
   → SIM Swap 攻擊、SS7 協議漏洞可攔截簡訊、社交工程騙取驗證碼。NIST 已建議棄用。

3. **TOTP 如何做到離線驗證？**
   → 雙方共享 Secret Key + 使用相同時間戳，各自獨立計算 OTP，不需網路通信。

4. **WebAuthn 為什麼能防釣魚？**
   → 金鑰綁定 Origin（網域），假網站的 Origin 不同，金鑰不會回應 Challenge。

5. **SSO 環境下 MFA 應該設在哪一層？**
   → IdP 層。集中管理、一次驗證、所有 SP 受益。SP 層加 MFA 會破壞 SSO 的無縫體驗。

---

## 八、NextAuth.js 整合 SSO

### 8.1 NextAuth.js 簡介

NextAuth.js（v5 後更名為 **Auth.js**）是 Next.js 生態最主流的身份驗證解決方案，內建支援多種 SSO Provider。

**核心特色：**
- 內建 50+ OAuth / OIDC Provider（Google, GitHub, Azure AD 等）
- 支援 SAML（透過 Enterprise SSO 方案如 BoxyHQ）
- Session 管理（JWT 或 Database）
- 支援 App Router 和 Pages Router
- TypeScript 完整支援

### 8.2 安裝與基本設定

```bash
# 安裝
npm install next-auth
```

### 8.3 社交登入 SSO（OIDC Provider）

**設定 Google + GitHub SSO：**

```typescript
// auth.ts（Auth.js v5 / NextAuth v5）
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
})
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

```env
# .env.local
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
AUTH_SECRET=your-random-secret  # openssl rand -base64 32
```

### 8.4 企業 SSO — OIDC Provider（如 Okta、Azure AD）

```typescript
// auth.ts
import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // 通用 OIDC Provider
    {
      id: "corporate-sso",
      name: "Corporate SSO",
      type: "oidc",
      // IdP 的 Discovery Document URL
      issuer: "https://your-idp.okta.com",
      clientId: process.env.SSO_CLIENT_ID,
      clientSecret: process.env.SSO_CLIENT_SECRET,
    },
  ],
})
```

**Azure AD 範例：**

```typescript
import AzureAD from "next-auth/providers/microsoft-entra-id"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
})
```

### 8.5 企業 SSO — SAML Provider

NextAuth 原生不支援 SAML，需透過 **BoxyHQ SAML Jackson** 或將 SAML 包裝為 OIDC：

```bash
# 使用 BoxyHQ SAML Jackson
npm install @boxyhq/saml-jackson
```

```typescript
// auth.ts — 透過 BoxyHQ 橋接 SAML
import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "saml-sso",
      name: "SAML SSO",
      type: "oauth",
      // BoxyHQ Jackson 作為 SAML → OAuth 橋接
      authorization: {
        url: "http://localhost:5225/api/oauth/authorize",
        params: { scope: "" },
      },
      token: "http://localhost:5225/api/oauth/token",
      userinfo: "http://localhost:5225/api/oauth/userinfo",
      clientId: "tenant=your-tenant&product=your-product",
      clientSecret: "your-jackson-secret",
      profile(profile) {
        return {
          id: profile.id,
          name: [profile.firstName, profile.lastName].filter(Boolean).join(" "),
          email: profile.email,
          image: null,
        }
      },
    },
  ],
})
```

### 8.6 Session 管理策略

```typescript
// auth.ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [/* ... */],

  // 策略一：JWT Session（無狀態，適合無資料庫場景）
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 分鐘
  },

  // 策略二：Database Session（有狀態，適合需要即時撤銷場景）
  // session: {
  //   strategy: "database",
  //   maxAge: 30 * 60,
  // },

  callbacks: {
    // 自訂 JWT 內容（加入角色、權限等）
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.role = profile?.role ?? "user"
      }
      return token
    },

    // 自訂 Session 內容（暴露給前端）
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.role = token.role as string
      return session
    },
  },
})
```

### 8.7 在元件中使用 SSO

**Server Component（App Router）：**

```typescript
// app/page.tsx
import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()

  if (!session) {
    return <p>請先登入</p>
  }

  return <p>歡迎，{session.user?.name}</p>
}
```

**Client Component：**

```typescript
"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginButton() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>載入中...</p>

  if (session) {
    return (
      <div>
        <p>已登入：{session.user?.name}</p>
        <button onClick={() => signOut()}>登出</button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => signIn("google")}>用 Google 登入</button>
      <button onClick={() => signIn("github")}>用 GitHub 登入</button>
      <button onClick={() => signIn("corporate-sso")}>企業 SSO 登入</button>
    </div>
  )
}
```

**Middleware 保護路由：**

```typescript
// middleware.ts
export { auth as middleware } from "@/auth"

export const config = {
  // 保護 /dashboard 及其子路由
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
```

### 8.8 多租戶 SSO 架構

SaaS 應用常需支援不同客戶使用不同 IdP：

```typescript
// auth.ts — 動態 Provider 選擇
import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // 根據 tenant 動態選擇 IdP
    {
      id: "enterprise-sso",
      name: "Enterprise SSO",
      type: "oidc",
      // 動態 issuer — 從資料庫查詢 tenant 對應的 IdP
      issuer: process.env.DEFAULT_OIDC_ISSUER,
      clientId: process.env.SSO_CLIENT_ID,
      clientSecret: process.env.SSO_CLIENT_SECRET,
    },
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // 驗證使用者 email 是否屬於允許的 domain
      const allowedDomains = ["company-a.com", "company-b.com"]
      const emailDomain = profile?.email?.split("@")[1]
      return allowedDomains.includes(emailDomain ?? "")
    },
  },
})
```

**多租戶 SSO 常見模式：**

```
使用者輸入 Email
       │
       ▼
根據 Email Domain 查詢 Tenant 設定
       │
       ├── company-a.com → Okta (SAML)
       ├── company-b.com → Azure AD (OIDC)
       └── 其他 → 帳號密碼登入
```

---

## 九、SSO vs 相關技術比較

| 概念 | 說明 | 與 SSO 的關係 |
|------|------|--------------|
| **SSO** | 單一登入，一次驗證訪問多個服務 | — |
| **OAuth 2.0** | 授權框架 | SSO 的實現手段之一（搭配 OIDC） |
| **OIDC** | OAuth 2.0 上的身份驗證層 | 現代 SSO 的主流協議 |
| **SAML** | XML-based 聯邦身份協議 | 企業 SSO 的傳統標準 |
| **MFA** | 多因素認證（詳見第七章） | 在 IdP 層搭配 SSO 增強安全性 |
| **Federation** | 身份聯邦，跨組織信任 | SSO 可以是聯邦的一部分 |
| **Zero Trust** | 零信任架構 | SSO + 持續驗證 = 零信任的一環 |

---

## 十、常見面試題

1. **SSO 和 OAuth 有什麼區別？**
   → SSO 是一種使用者體驗（登入一次，訪問多個服務）；OAuth 是一種授權協議。SSO 可以用 OAuth + OIDC 來實現，但 OAuth 本身不是 SSO。

2. **SAML 和 OIDC 怎麼選？**
   → 企業內部/傳統系統 → SAML；新系統/Mobile/SPA → OIDC。如果可以選，優先 OIDC（更現代、更易整合）。

3. **SSO 的單點故障問題怎麼解決？**
   → IdP 高可用部署、SP 有離線降級策略（如緩存有效 Session）、使用多 IdP 備援。

4. **如何實現 Single Logout？**
   → Front-Channel（瀏覽器廣播）或 Back-Channel（Server-to-Server）。實務上完美 SLO 很難，常見做法是 Token 短效期 + IdP 登出。

5. **Token 放在哪裡最安全？**
   → HttpOnly + Secure + SameSite Cookie > 記憶體 > sessionStorage > localStorage（最不安全）。

---

## 學習資源

### 文章
- [Roadmap.sh - SSO](https://roadmap.sh/guides/sso)
- [Okta - What is SSO?](https://www.okta.com/topic/single-sign-on/)
- [Auth0 - Single Sign-On](https://auth0.com/docs/authenticate/single-sign-on)
- [Auth.js 官方文件](https://authjs.dev/)
- [BoxyHQ SAML Jackson](https://boxyhq.com/docs/jackson/overview)

### 影片
- [100% Local SSO with NextAuth.js](https://www.youtube.com/watch?v=w2h54xz6Ndw)
- [Session vs Token Authentication in 100 Seconds](https://www.youtube.com/watch?v=UBUNrFtufWo)

---

> 整理自多方技術文件與實務經驗，涵蓋 SSO 核心原理、協議比較、安全實踐及 NextAuth.js 整合方案
