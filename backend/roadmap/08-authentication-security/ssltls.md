# SSL/TLS

## 簡介

SSL and TLS are cryptographic protocols providing internet communication security through data encryption. SSL is deprecated due to security flaws; modern browsers no longer support it. TLS remains secure and widely supported for encrypted data transmission.

## 學習資源

### 文章

#### 1. Wikipedia - SSL/TLS
> 原文：[https://en.wikipedia.org/wiki/Transport_Layer_Security](https://en.wikipedia.org/wiki/Transport_Layer_Security)

**什麼是 TLS（Transport Layer Security）**

TLS 是「設計用於在計算機網路上提供通訊安全的密碼協議」。它從 Netscape 在 1990 年代開發的 SSL（Secure Sockets Layer）協議演化而來。TLS 使用雙層方法：TLS Record Protocol（記錄協議）和 TLS Handshake Protocol（握手協議）。

**三大安全屬性**

| 屬性 | 說明 |
|------|------|
| **隱私/機密性** | 使用對稱金鑰算法加密資料 |
| **身份驗證** | 透過公鑰密碼學和數位憑證驗證伺服器身份 |
| **完整性** | 訊息驗證碼（MAC）偵測篡改或資料丟失 |

**TLS 握手流程**

1. 客戶端請求安全連接，提交支援的密碼套件列表
2. 伺服器選擇密碼套件，發送數位憑證
3. 客戶端驗證憑證真實性
4. 雙方使用 RSA 加密或 Diffie-Hellman 金鑰協商交換 session 金鑰
5. 建立加密的安全通道

**版本時間線**

| 版本 | 年份 | 狀態 |
|------|------|------|
| SSL 2.0 | 1995 | 已棄用（2011） |
| SSL 3.0 | 1996 | 已棄用（2015） |
| TLS 1.0 | 1999 | 已棄用（2021） |
| TLS 1.1 | 2006 | 已棄用（2021） |
| TLS 1.2 | 2008 | 目前支援 |
| TLS 1.3 | 2018 | 最新標準 |

**TLS 1.3 的改進**

- 強制要求前向保密（Forward Secrecy）
- 要求數位簽名
- 移除弱算法
- 加密更多握手資料
- 支援更快的 1-RTT 連接（相比舊版本）

#### 2. Cloudflare - What is SSL?
> 原文：[https://www.cloudflare.com/learning/ssl/what-is-ssl/](https://www.cloudflare.com/learning/ssl/what-is-ssl/)

（Cloudflare 網站目前仍被阻擋，無法讀取）

### 影片

- [SSL, TLS, HTTPS Explained](https://www.youtube.com/watch?v=j9QmMEWmcfo)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
