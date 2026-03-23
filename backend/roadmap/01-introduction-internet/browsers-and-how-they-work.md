# Browsers

## 簡介

Web browsers interpret HTML, CSS, and JavaScript to render web pages. Modern browsers use rendering engines (Blink, Gecko, WebKit) and JavaScript engines, offering features like tabs, bookmarks, extensions, and security through sandboxing and HTTPS enforcement.

## 學習資源

### 文章

#### 1. How Browsers Work
> 原文：https://www.ramotion.com/blog/what-is-web-browser/

**瀏覽器定義**

網頁瀏覽器是一種軟體應用程式，使用戶能夠"存取網際網路上的資訊"。它充當翻譯工具，從網路伺服器取得資訊並將其顯示為網頁。

**主要組件**

| 組件 | 功能 |
|------|------|
| **使用者介面 (UI)** | 網址列、導航按鈕、標籤頁功能 |
| **渲染引擎** | 將網站代碼轉換為視覺元素（Blink、WebKit、Gecko） |
| **JavaScript 引擎** | 解釋並執行 JavaScript 代碼，實現動態互動 |
| **網路組件** | 從網路伺服器獲取檔案（代碼、圖像、影片） |
| **安全組件** | 處理資料加密傳輸 (HTTPS)，防護惡意攻擊 |

**主要渲染引擎**

| 引擎 | 瀏覽器 | 特點 |
|------|--------|------|
| **Blink** | Google Chrome | 速度和效率 |
| **WebKit** | Apple Safari | 複雜網頁呈現 |
| **Gecko** | Mozilla Firefox | 開源和標準合規 |

**瀏覽器工作原理**
```
使用者輸入 URL
        ↓
網路組件獲取檔案
        ↓
渲染引擎解析代碼
        ↓
JavaScript 引擎執行互動
        ↓
UI 顯示完整網頁
```

**現代瀏覽器主要功能**
- 標籤瀏覽：同時開啟多個網站
- 書籤：儲存常用網站
- HTTPS 支援：加密使用者活動和資訊
- 隱私瀏覽模式：不儲存瀏覽記錄
- 擴充程式/附加元件：擴展功能（廣告攔截、密碼管理）
- 同步功能：跨裝置同步瀏覽資料

**安全與隱私**
- **HTTPS**：資料加密傳輸
- **追蹤程式攔截**：保護隱私
- **沙盒隔離**：將網站與作業系統分離，防止惡意代碼執行

---

#### 2. Populating the Page: How Browsers Work
> 原文：https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work

**Navigation（導航階段）**

1. **DNS Lookup**：將域名轉換為 IP 地址
2. **TCP Handshake**：瀏覽器與服務器協商連接（三次握手）
3. **TLS Negotiation**：HTTPS 連接需要 5 次額外往返
   - **總計**：8 次往返後才能發送實際請求

**Parsing（解析階段）**

**建構 DOM Tree**
- HTML 解析 → Tokenization → 樹構造
- 將 HTML 標記轉換為 DOM（Document Object Model）

**Preload Scanner（預加載掃描器）**
- 在主線程解析 HTML 時，背景預先請求高優先級資源
- 請求 CSS、JavaScript、Web 字體
- 避免資源阻塞 HTML 解析

**建構 CSSOM Tree**
- CSS 解析 → 級聯計算 → CSSOM
- 類似 DOM 的樹結構，但用於樣式
- 構建速度極快（比 DNS 查詢還快）

**Critical Rendering Path（關鍵渲染路徑）**

| 步驟 | 說明 |
|------|------|
| **1. Processing HTML** | 解析 HTML → DOM Tree |
| **2. Processing CSS** | 解析 CSS → CSSOM Tree |
| **3. Style** | 結合 DOM 和 CSSOM → **Render Tree**（只包含可見節點） |
| **4. Layout** | 確定每個節點的尺寸和位置（基於視口大小） |
| **5. Paint** | 將節點轉換為屏幕像素（必須在 16.67ms 內完成以達 60fps） |
| **6. Compositing** | 合併多個層，確保正確渲染順序 |

**層優化（Layering）**

某些屬性會建立新層，在 GPU 上繪製：
```css
will-change: transform;
opacity: 0.8;
transform: translate3d(0, 0, 0);
```

**Interactivity（互動性）**

**Time to Interactive (TTI)**：從首次請求到頁面可響應用戶交互的時間
- 必須在 **50ms 內** 回應交互
- 在 First Contentful Paint 之後開始計算

**性能優化要點**

| 階段 | 優化策略 |
|------|--------|
| Navigation | DNS 預連接、連接複用 |
| Response | 首 14KB 包含關鍵內容 |
| Parsing | 使用 `async`/`defer` 延遲 JS |
| Style | 最小化 CSS 複雜度 |
| Layout | 避免強制 reflow |
| Paint | 減少繪製區域、使用層 |
| Interaction | 保持主線程可用 |

**關鍵概念**
- **DOM**：HTML 的內部表示
- **CSSOM**：CSS 的對象模型
- **Render Tree**：可見節點 + 計算樣式
- **Reflow**：重新計算布局（影響性能）
- **Repaint**：重新繪製（較 reflow 輕量）
- **Compositing**：合併層到最終輸出

### 影片

- [How Do Web Browsers Work?](https://www.youtube.com/watch?v=5rLFYtXHo9s)
- [Explore top posts about Browsers](https://app.daily.dev/tags/browsers?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
