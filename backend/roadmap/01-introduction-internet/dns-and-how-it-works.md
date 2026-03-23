# DNS

## 簡介

DNS (Domain Name System) translates human-readable domain names into IP addresses. Uses hierarchical structure with root servers, TLD servers (.com, .org), authoritative servers, and local DNS servers. Essential for internet functionality, enabling memorable names instead of IP addresses.

## 學習資源

### 文章

#### 1. Everything You Need to Know About DNS
> 原文：https://cs.fyi/guide/everything-you-need-to-know-about-dns

##### 什麼是 DNS？

DNS (Domain Name System) 就像是網際網路的電話簿。它將域名（如 `www.example.com`）映射到 IP 位址（如 `192.0.2.1`），讓我們不需要記憶一長串數字就能訪問網站。

##### DNS 的工作原理

當你在瀏覽器輸入域名時，DNS 會透過一系列的查詢步驟來找到對應的 IP 位址：

**查詢流程的五個步驟：**

1. **本地快取檢查（Local Caches）**
   - **瀏覽器快取**：你可能之前訪問過該網站，瀏覽器已經快取了 IP 位址
   - **DNS 快取**：基於 TTL (Time To Live)，電腦可能已經快取了 IP 位址
   - **Hosts 檔案**：你可能手動在 hosts 檔案中添加了域名對應關係

2. **遞迴 DNS 伺服器（Recursive DNS Servers）**
   - 電腦或路由器的 DNS 設定會指向一個 DNS 伺服器（預設是 ISP 的 DNS 伺服器）
   - 這個伺服器稱為遞迴 DNS 伺服器
   - 它會檢查自己的快取，若沒有則繼續向上查詢

3. **根 DNS 伺服器（Root DNS Servers）**
   - DNS 層級結構中的最頂層伺服器
   - 負責委派頂級域名（如 `.com`、`.org`、`.net`）的查詢責任
   - 它們不儲存網站的 IP 位址，而是儲存 TLD DNS 伺服器的位址

4. **頂級域名 DNS 伺服器（Top Level Domain DNS Servers）**
   - 負責管理二級域名（如 `example.com`、`example.org`）
   - 不儲存網站本身的 IP 位址，而是儲存權威 DNS 伺服器的位址
   - 可使用命令查詢：`dig +short NS example.com`

5. **權威 DNS 伺服器（Authoritative DNS Servers）**
   - 這是實際儲存 DNS 記錄的地方
   - 權威 DNS 伺服器會返回域名的 A 記錄（將域名映射到 IP 位址）
   - 最終將 IP 位址返回給遞迴 DNS 伺服器，再返回給你的電腦

##### 使用 dig 命令進行 DNS 查詢

**基本查詢：**
```bash
# 查詢域名的 IP 位址
dig +short www.example.com

# 追蹤完整的 DNS 解析過程
dig +trace www.example.com

# 查詢特定類型的 DNS 記錄
dig example.com A      # A 記錄（IPv4 位址）
dig example.com MX     # MX 記錄（郵件伺服器）
dig example.com NS     # NS 記錄（名稱伺服器）

# 查詢特定 DNS 伺服器
dig example.com A @8.8.8.8

# 檢查 DNSSEC 驗證
dig example.com +dnssec
```

##### DNS 調試技巧

**檢查 DNS 解析：**
```bash
dig example.com +short
```

**檢查 DNS 傳播：**
```bash
dig example.com MX +trace
```

**查詢頂級域名的名稱伺服器：**
```bash
dig +short NS com
dig +short NS org
dig +short NS ai
```

##### 常見 DNS 錯誤

| 錯誤代碼 | 說明 |
|---------|------|
| `DNS_PROBE_FINISHED_NXDOMAIN` | 域名不存在（可能輸入錯誤或已過期） |
| `DNS_PROBE_FINISHED_NO_INTERNET` | 域名存在但 DNS 伺服器無法連接 |
| `DNS_PROBE_FINISHED_BAD_CONFIG` | DNS 伺服器配置錯誤或無法連接 |

##### 清除 DNS 快取

**Windows：**
```bash
ipconfig /flushdns
```

**macOS：**
```bash
dscacheutil -flushcache
```

##### 重要概念

- **DNSSEC (DNS Security Extensions)**：DNS 的安全擴充功能，用於驗證 DNS 資料的來源和完整性，防止 DNS 資料在傳輸過程中被竄改

- **TTL (Time To Live)**：DNS 記錄的生存時間，決定了記錄可以被快取多久

- **A 記錄**：將域名映射到 IPv4 位址的 DNS 記錄

- **MX 記錄**：指定處理域名電子郵件的郵件伺服器

---

#### 2. What is DNS? (Cloudflare)
> 原文：https://www.cloudflare.com/en-gb/learning/dns/what-is-dns/

⚠️ **此網站有防護機制，無法直接訪問**

根據 Cloudflare Learning Center，該文章涵蓋以下主題：
- DNS 的基本定義和運作方式
- DNS 的層級結構（Root、TLD、Authoritative Name Servers）
- DNS 查詢的類型（Recursive、Iterative）
- DNS 快取機制
- DNS 記錄類型（A、AAAA、CNAME、MX、TXT、NS 等）
- DNS 安全相關議題

建議直接訪問網站閱讀完整內容：https://www.cloudflare.com/en-gb/learning/dns/what-is-dns/

---

#### 3. How DNS works (comic)
> 原文：https://howdns.works/

這是一個由 DNSimple 製作的互動式漫畫教學網站，以圖像化的方式解釋 DNS 的運作原理。

##### 特色

- 使用漫畫形式講解 DNS 概念，適合初學者理解
- 互動式學習體驗，逐步引導了解 DNS 查詢流程
- 涵蓋以下關鍵主題：
  - DNS Resolver（DNS 解析器）
  - Name Servers（名稱伺服器）
  - Root Servers（根伺服器）
  - TLD Servers（頂級域名伺服器）
  - Authoritative Name Servers（權威名稱伺服器）
  - 完整的 DNS 查詢流程演示

##### 學習路徑

網站透過視覺化的方式，將 DNS 查詢過程比喻為尋找地址的過程，幫助理解：
1. 瀏覽器如何發起 DNS 請求
2. DNS Resolver 如何處理查詢
3. 查詢如何在不同層級的伺服器之間傳遞
4. 最終如何取得網站的 IP 位址

**推薦理由：** 非常適合視覺化學習者，能夠直觀理解 DNS 的階層結構和查詢流程。

網站提供多語言版本（英文、西班牙文、德文、法文），互動性強，是學習 DNS 基礎的絕佳資源。

---

### 影片

- [DNS and How does it Work?](https://www.youtube.com/watch?v=Wj0od2ag5sk)
- [Explore top posts about DNS](https://app.daily.dev/tags/dns?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
