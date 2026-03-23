# Domain Name

## 簡介

Domain names are human-readable internet addresses that translate to IP addresses for computer identification. Consist of second-level domain ("example") and top-level domain (".com"). Managed by registrars, providing user-friendly website navigation instead of numeric IP addresses.

## 學習資源

### 文章

#### 1. What is a Domain Name?
> 原文：https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_domain_name

**定義**

Domain Name 是網際網路基礎設施的關鍵組成部分，為任何網頁伺服器提供人類可讀的地址，替代難以記憶的 IP 位址（如 `192.0.2.172`）。

**Domain Name 的結構**

從右到左讀取，由多個部分以點號分隔：

```
developer.mozilla.org
         │      │     │
         │      │     └─ TLD (頂級網域)
         │      └────────── SLD (次級網域)
         └─────────────────── Subdomain (子網域)
```

**1. TLD (Top-Level Domain) - 頂級網域**

| TLD 類型 | 範例 | 用途 |
|----------|------|------|
| **通用** | `.com`, `.org`, `.net` | 無特殊限制 |
| **地域性** | `.us`, `.fr`, `.se` | 表示特定國家或語言 |
| **特殊** | `.gov`, `.edu` | 僅限政府部門或教育機構 |

特性：
- 最大長度：63 個字符
- 由 **ICANN** 維護管理

**2. Label（標籤）**

TLD 前面的部分，規則：
- 不分大小寫
- 長度：1–63 個字符
- 允許字符：A–Z、0–9、連字號 `-`
- 連字號不能是首或末字符

**3. Subdomain（子網域）**

可創建多個 label 來建立子網域：
```
developer.mozilla.org      ← developer 是子網域
support.mozilla.org        ← support 是子網域
bugzilla.mozilla.org       ← bugzilla 是子網域
```

**Domain Name 的註冊**

**重要概念：你無法「購買」域名，只能租賃使用權。**

- 支付費用獲得一年或多年的使用權
- 續約時優先權歸現有使用者
- **Registrar（註冊商）** 透過 Registry 追蹤技術和管理資訊

**查詢域名可用性**

方法 1：Registrar 網站的 WHOIS 服務
```
前往域名註冊商網站 → 使用 WHOIS 查詢工具
```

方法 2：命令行工具
```bash
whois mozilla.org
# 已註冊：顯示註冊資訊
# 未註冊：顯示 NOT FOUND
```

**註冊流程**
1. 前往 Registrar 網站
2. 點擊「Get a domain name」
3. 填寫申請表（確保域名拼寫正確）
4. 等待確認（全球 DNS 伺服器在數小時內更新）

**DNS 與 Domain Name 的關係**

**DNS 請求流程**

當你在瀏覽器輸入 `mozilla.org` 時：
```
瀏覽器 → 檢查本機 DNS 快取
        ↓
    找到 → 直接使用 IP
    未找到 → 查詢 DNS 伺服器
        ↓
DNS 伺服器回傳 IP 位址
        ↓
瀏覽器與網頁伺服器通訊 ✓
```

**關鍵重點**

| 概念 | 說明 |
|------|------|
| **Domain Name** | 人類可讀的網址，替代 IP 位址 |
| **TLD** | 最右邊的部分，定義域名用途 |
| **Label** | 以點號分隔的部分 |
| **Registrar** | 管理域名註冊的公司 |
| **WHOIS** | 查詢域名可用性和所有者資訊的工具 |
| **DNS** | 將域名轉換為 IP 位址的系統 |
| **Subdomain** | 在現有域名前添加 label 創建的子網域 |

---

#### 2. What is a Domain Name? | Domain name vs. URL
> 原文：https://www.cloudflare.com/en-gb/learning/dns/glossary/what-is-a-domain-name/
> ⚠️ 此網站無法訪問

### 影片

- [A Beginners Guide to How Domain Names Work](https://www.youtube.com/watch?v=Y4cRx19nhJk)
- [Everything You Need to Know About Domain Names](https://www.youtube.com/watch?v=qO5qcQgiNX4)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
