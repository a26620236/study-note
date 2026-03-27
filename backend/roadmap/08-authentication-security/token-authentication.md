# Token authentication

## 簡介

Token-based authentication verifies user identity and provides unique access tokens. Users access protected resources without re-entering credentials while token remains valid. Works like stamped tickets, invalidated on logout. Offers second security layer with detailed administrative control.

## 學習資源

### 文章

- [Token Based Authentication](https://roadmap.sh/guides/token-authentication)（視覺化指南，需瀏覽器查看）

#### 1. What Is Token-Based Authentication?
> 原文：[https://www.okta.com/identity-101/what-is-token-based-authentication/](https://www.okta.com/identity-101/what-is-token-based-authentication/)

**什麼是 Token-Based Authentication**

Token-Based Authentication 是「允許用戶驗證身份，並收到唯一 access token 的協議」。用戶在 token 有效期間無需重複輸入憑證即可訪問受保護資源，類似「加蓋印章的票券」，退出後失效。

**四步驟流程**

1. **Request（請求）**：用戶請求存取伺服器或資源
2. **Verification（驗證）**：伺服器確認存取資格
3. **Token Issuance（Token 發放）**：伺服器向用戶發放 token
4. **Storage（儲存）**：Token 在用戶 session 期間保存在瀏覽器中

**三種 Token 類型**

| 類型 | 說明 |
|------|------|
| **Connected（連接型）** | 插入系統的實體設備（USB、智慧卡） |
| **Contactless（非接觸型）** | 無需實體接觸即可通訊的設備（如感應戒指） |
| **Disconnected（斷連型）** | 跨距離通訊的設備（如手機雙因素驗證） |

**主要優勢**

- 提供額外驗證層，增強安全性
- 對操作和交易提供細粒度的管理控制
- 減少伺服器記憶體負擔（相比密碼式系統）
- 適合臨時訪問、特定權限級別和敏感環境

**注意事項**

Token 實作需要開發者專業知識：要求安全的 HTTPS 通訊、定期測試和謹慎實作以最大化安全效益。

### 影片

- [Why is JWT popular?](https://www.youtube.com/watch?v=P2CPd9ynFLg)
- [Explore top posts about Authentication](https://app.daily.dev/tags/authentication?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
