# 開發流程改革

## 提案流程

spec → figma draft → prototype → designer review → kick off → rd develop

## 關鍵決定

- **Spec**：PM 寫技術 spec，再用 AI 轉譯成設計師友善版本
- **Figma draft**：產出方式待定
- **Prototype**：code-based 原型（v0/Bolt 等工具）

---

## 一、逐步分析

### Step 1: Spec → AI 轉譯

**可行性：高**

PM 寫的技術 spec 用 AI（如 ChatGPT/Claude）轉譯成設計師友善版本，這是目前最成熟、最低風險的 AI 應用場景。

**實務做法：**
- PM 照常寫 spec（含功能需求、邊界條件、技術限制）
- 用 AI 產出「設計摘要」版本：聚焦在使用者故事、畫面流程、互動行為
- 兩份文件並存，不是取代而是補充

**業界參考：** 很多團隊已經在用 AI 做文件轉譯/摘要，這步基本上沒爭議。

**範例：登入頁（支援 SSO + MFA）**

以下用同一個功能展示兩份文件的差異：

#### PM 技術 Spec（工程師導向）

```markdown
# 登入頁 Login Page

## 功能需求
- 支援 SSO 登入：Google OAuth 2.0、Azure AD (OIDC)、GitHub OAuth
- 支援 MFA：TOTP (Google Authenticator / Microsoft Authenticator)
- 登入失敗鎖定：連續 5 次失敗鎖定 15 分鐘
- Session 有效期 24 小時，refresh token 7 天

## API 規格
- POST /api/auth/login — email/password 登入
- GET /api/auth/sso/:provider — SSO redirect
- POST /api/auth/sso/callback — SSO callback
- POST /api/auth/mfa/verify — MFA 驗證碼驗證
- POST /api/auth/mfa/setup — 首次啟用 MFA，回傳 QR code

## 邊界條件
- SSO callback 失敗時 redirect 回登入頁，帶 error query param
- MFA 驗證碼 30 秒過期，允許前後各一組 code（容錯 ±30s）
- 已綁定 MFA 的帳號，SSO 登入後仍需驗證 MFA
- Azure AD 需支援 multi-tenant 配置

## 技術限制
- OAuth state parameter 須存入 Redis，TTL 10 分鐘
- MFA secret 加密存儲，使用 AES-256-GCM
```

#### AI 轉譯的設計摘要（設計師導向）

```markdown
# 登入頁 — 設計摘要

## 使用者故事
身為使用者，我可以透過以下方式登入系統：
- 輸入 Email + 密碼
- 點擊 Google / Azure / GitHub 圖示進行快速登入
- 登入後，如果帳號有開啟二次驗證(MFA)，需要再輸入驗證碼

## 畫面與流程

### 畫面 1：登入主頁
- Email / Password 輸入欄位
- 「登入」按鈕
- 分隔線「或使用以下方式登入」
- 三個 SSO 按鈕：Google / Azure / GitHub（各有品牌 icon）

### 畫面 2：MFA 驗證（條件觸發）
- 出現時機：帳號有開啟 MFA 時，登入成功後跳轉至此畫面
- 6 位數驗證碼輸入欄位
- 「驗證」按鈕
- 提示文字：「請開啟您的驗證器 App 輸入驗證碼」

### 畫面 3：MFA 首次設定
- 出現時機：管理員要求使用者啟用 MFA 時
- 顯示 QR Code（使用者用手機掃描）
- 掃描後輸入驗證碼確認綁定

## 互動行為
- SSO 按鈕點擊後 → 跳轉至第三方登入頁（離開本站）→ 成功後自動返回
- SSO 登入失敗 → 返回登入主頁，顯示錯誤提示（如「Google 登入失敗，請重試」）
- 密碼連續輸入錯誤 5 次 → 鎖定畫面，提示「帳號已鎖定，請 15 分鐘後再試」
- MFA 驗證碼錯誤 → 欄位標紅，提示「驗證碼錯誤，請重新輸入」

## 需要設計的狀態
- [ ] 預設狀態
- [ ] 載入中（登入按鈕 loading）
- [ ] 錯誤狀態（欄位驗證、登入失敗、帳號鎖定）
- [ ] MFA 驗證畫面
- [ ] MFA 首次設定畫面
- [ ] SSO 跳轉中的過渡畫面（optional）
```

#### 兩份文件的核心差異

| | 技術 Spec | 設計摘要 |
|---|---|---|
| 語言 | API endpoint、加密演算法、TTL | 畫面、按鈕、提示文字 |
| 結構 | 按技術模組分 | 按使用者看到的畫面分 |
| 關注點 | 怎麼實作 | 使用者會經歷什麼 |
| 邊界條件 | 技術層面（token 過期、加密） | 翻譯成使用者看到的結果（鎖定提示、錯誤訊息） |

> AI 轉譯的重點不是「簡化」，而是**換一個視角重述同樣的需求** — 把技術邊界條件翻譯成使用者會看到的畫面狀態。

---

### Step 2: Figma Draft

**團隊現況：**
- 前端有 component library，但 Figma 沒有對應元件庫
- 設計師主要產出：hi-fi 設計稿 + 標註

**核心問題：** 設計師目前花大量時間做的事（hi-fi 稿 + 標註間距色碼），前端 component library 已經定義好了。她在 Figma 裡重新畫一次前端已有的元件，再標註一次前端已知的規格 — 這是最大的浪費。

**方向選項：**

| 方向 | 優點 | 缺點 |
|------|------|------|
| **A. 跳過 Figma，直接出 code prototype** | 最快、最省工、設計師只需 review 成品 | 設計師完全失去主場，可能反彈大 |
| **B. 用 AI 工具生成 Figma 初稿** | 保留設計師的 Figma 工作流 | 目前工具（Galileo、Musho）品質不穩，生成的組件結構常常很亂 |
| **C. 從 code prototype 反向匯入 Figma** | prototype 先行，但設計師仍有 Figma 可編輯 | 工具鏈還不夠成熟（Figma Dev Mode 是反向的） |
| **D. 簡化 Figma 稿為 wireframe 等級** | 設計師快速出 wireframe，不追求 hi-fi | 降低設計品質標準，需要團隊共識 |

**決定：走方向 A，分兩步過渡**

#### 短期過渡：A + D 混合
1. 設計師出 **wireframe 等級**的稿（灰框 + 文字說明佈局和流程）
2. 工程師用 AI 工具 + 既有 component library 產出 **code prototype**
3. 設計師 review prototype，針對視覺細節給回饋（色彩、間距微調、動畫等）

#### Wireframe 產出規範

**工具選擇：直接用 Figma，建一套 wireframe 元件庫**
- 設計師已經會用，零學習成本
- 建一套灰色低保真元件（灰框按鈕、灰框輸入欄、佔位圖片等），拖拉組合即可
- 刻意限制元件庫只有灰階 — 物理上阻止掉進 hi-fi 的坑
- 同一個 Figma workspace 裡維護 wireframe library 和 hi-fi library 兩套，根據階段切換

> 其他業界常見工具：Balsamiq（手繪風）、Excalidraw / tldraw（免費手繪白板）、FigJam（Figma 白板）。但多一個工具就多一個摩擦點，設計師已經在 Figma 裡，沒必要搬出去。

**Wireframe 該有什麼 vs 不該有什麼：**

| 該有 | 不該有 |
|------|--------|
| 元素的相對位置和層級 | 精確的間距數值 |
| 文字內容（按鈕文案、提示語） | 色碼、字型字級 |
| 互動流程和條件分支 | 陰影、圓角等視覺細節 |
| 各狀態的畫面（error、loading） | 精美的 icon 和插圖 |

**Wireframe 搭配文字說明，範例（以登入頁為例）：**

```
佈局說明：
- 登入表單置中，最大寬度 400px
- 整體垂直置中於畫面

流程說明：
- 預設顯示登入主頁
- 登入成功 + 帳號有 MFA → 跳轉 MFA 驗證畫面
- SSO 按鈕點擊 → 跳轉第三方 → 返回後同上判斷 MFA

互動備註：
- 密碼欄位有顯示/隱藏切換（眼睛 icon）
- MFA 輸入框自動 focus 下一格（OTP input 行為）
- 錯誤時整個驗證碼欄位搖晃 + 清空
```

> 本質：告訴工程師「要放什麼、放哪裡、怎麼動」，視覺細節交給 component library 和 code prototype 階段處理。產出工作量約為原本 hi-fi 稿的 1/3，修改成本極低。

#### 長期目標：Wireframe 作為 AI 輸入（非跳過）
原本設想純方向 A（跳過 Figma 直接 code prototype），但純靠 spec 文字描述，AI 對佈局的理解容易跟設計師腦中的畫面有落差（元素排列方向、資訊優先層級、分頁方式等），光靠文字很難精確傳達，一張 wireframe 一秒就看懂。

**確定的流程：**
```
Spec + 設計摘要 + Wireframe 定案
        │
        ├──→ RD：AI code prototype → 繼續開發功能
        │         （prototype 功能上 ≈ 正式代碼，差別只在 UI 細節）
        │
        └──→ 設計師：同時開始畫完整 Figma（基於 wireframe，不用等 prototype）
                │
                ▼
         Design QA（設計師拿 Figma 對照成品，修 UI 細節）
```

兩邊的起點都是 wireframe，不存在誰等誰的問題。設計師畫 Figma 的同時 RD 已經在做了，等 Figma 出來時功能也差不多了，直接進 Design QA 對齊 UI 細節。

Wireframe 的價值不是「好看」，而是**消除佈局歧義**。設計師花 30 分鐘畫的灰框圖，可以省掉後面來回修改好幾輪。

**設計師的角色調整：**
1. 產出 wireframe 作為 AI 生成 prototype 的輸入
2. Wireframe 定案後立即平行畫完整 Figma
3. 轉為 **Design QA** — 拿 Figma 對照成品，修正 UI 細節
4. 把時間花在更高價值的事：UX 流程優化、視覺風格定義、design system 維護

#### 設計師的新價值定位

| 以前 | 以後 |
|------|------|
| 逐頁畫 hi-fi 稿 | 定義整體視覺規範和元件風格 |
| 手動標註間距色碼 | Review prototype 的視覺品質 |
| 改稿改稿再改稿 | 參與 UX 流程設計和使用者研究 |

> 這不是弱化設計師，是把她從重複勞動中解放出來。但這個敘事要先跟設計師溝通好，否則容易被解讀為「你的工作被 AI 取代了」。

---

### Step 3: Code-based Prototype

**團隊技術棧：** MUI + 自行二度封裝的客製化元件

**工具決定：Cursor / Claude Code 直接在 repo 內生成（漸進式）**

AI 直接在既有 repo 中生成頁面，可以：
- 讀取封裝元件的原始碼和 props 定義
- 參考既有頁面的使用方式
- 直接 import 正確的路徑

Prototype 就是正式代碼的起點，不存在「拋棄式 vs 漸進式」的問題。

**實務流程：**
1. 工程師開一個 branch
2. 把 Spec + 設計摘要 + Wireframe 截圖 一併餵給 Cursor/Claude Code
3. AI 參考既有元件 + 既有頁面風格，生成新頁面
4. 部署 preview（Vercel preview / Storybook）給設計師 review

> 外部工具（v0、Bolt、Lovable）不認識團隊封裝的元件，生成結果還需搬回來調整，不推薦作為主要方案。

---

### Step 3.5: 設計師平行畫完整 Figma

**AI 能直接畫出完整 Figma 嗎？目前不可行。**

| 工具 | 能做什麼 | 問題 |
|------|---------|------|
| Figma AI（官方） | 在 Figma 內生成簡單 UI 區塊 | 不能餵入自訂元件規格，生成的東西很泛用 |
| Galileo AI | 從文字描述生成設計稿 | 不認識團隊的 MUI 封裝元件，風格對不上 |
| Musho | 快速生成整頁設計 | 同上，產出是它自己的風格 |
| Codia AI | Code → Figma 轉換 | 轉換品質不穩，圖層結構亂 |

這些工具都是「生成通用好看的 UI」，但做不到對齊團隊的 MUI theme（色彩、間距、圓角）和封裝元件的視覺樣式。就算提供規格，生成的 Figma 稿與實際產品一致性大概只有 50-60%，設計師修到對的時間可能比自己畫還久。

**解法：用 MUI 官方 Figma Kit 快速建立元件庫**

團隊的情況是 code 端比 Figma 端更完整（前端有封裝元件，Figma 沒有對應元件庫）。不需要從零建，MUI 官方有提供 **Figma Kit（Figma 元件套件）**：一個預先建好所有 MUI 元件 Figma 版本的檔案，設計師可以直接拖拉使用。

> 對照理解：MUI npm package → 給工程師用的元件庫；MUI Figma Kit → 給設計師用的同一套元件庫，只是在 Figma 裡。

**Figma Kit 版本：**

| | 免費版（Community） | 付費版（MUI Store） |
|---|---|---|
| 更新頻率 | 不固定，社群維護為主 | 跟隨 MUI 版本更新 |
| 元件覆蓋率 | 基礎元件為主 | 完整，含 MUI X |
| 價格 | 免費 | 一次性購買（依方案不同） |

> 具體定價和最新更新頻率請以 MUI 官網 Design Kit 頁面為準。

**即使 Kit 更新有時間差，對團隊影響不大：**
- 團隊用的是封裝過的元件，不會每次 MUI 小版本更新就跟著改
- Figma Kit 是起點不是終點，匯入後套上自己的 theme，之後維護的是自己那層
- Button、TextField、Dialog 等核心元件結構很少大改
- 真正需注意的是 MUI 大版本升級（如 v5 → v6）時 Figma Kit 要跟著換

**建立步驟：**

```
MUI 官方 Figma Kit（基底）
        │
        ▼
覆蓋團隊 theme（色彩、字型、圓角、間距）
  → 利用 Figma Variable，改完所有元件自動套用
        │
        ▼
針對二度封裝元件，用 MUI 元件組合出對應的 Figma component
  → 例如 CustomButton = Button + 特定 variant + icon
  → 例如 SearchInput = TextField + IconButton
```

**預估工作量：**

| 項目 | 時間 |
|------|------|
| 匯入 MUI Figma Kit + 套 theme | 半天 |
| 建二度封裝元件（看數量） | 1-3 天 |
| 總計 | 約一週內可完成 |

比起從零建整套 Figma 元件庫（通常要 2-4 週），這個路徑快非常多。建好之後設計師畫完整稿就是拖拉組合拼積木，速度夠快，能跟 RD 平行作業。

---

### Step 4: Designer Review

**角色轉變是最大挑戰**

設計師從「創作者」變成「審核者」，這需要：
1. 明確定義 review 的範圍和標準（色彩、間距、互動、一致性）
2. 給設計師有效的 markup/feedback 工具（如 Figma 註解、或直接在 prototype 上標註）
3. 漸進式導入，不要一步到位

---

## 二、業界現況

- **正在發生但尚未標準化**：很多團隊在實驗，但沒有「公認的最佳實踐」
- **設計工程師 (Design Engineer)** 角色崛起：同時懂設計和前端的人，用 code 取代部分 Figma 工作
- **Vercel、Linear、Supabase** 等公司已有類似流程，但他們的設計師本身就有 code 能力
- 多數傳統團隊的做法是**局部導入**：在某幾個環節加入 AI，而非翻轉整條流程

---

## 三、建議的實施策略

**不要一次全改，分階段：**

### Phase 1（低風險，立即可做）
- Spec AI 轉譯：PM spec → AI 產出設計摘要
- 建立 spec 模板，包含設計師需要的欄位（user flow、畫面描述、互動行為）

### Phase 2（中風險，需小規模試驗）
- 選一個小功能，嘗試用 AI 工具（v0/Bolt）產出 code prototype
- 讓設計師參與 review，收集回饋
- 決定 prototype 是拋棄式還是漸進式

### Phase 3（高風險，需團隊共識）
- 根據 Phase 2 結果，決定 Figma 在流程中的定位
- 正式調整設計師的工作方式和產出標準

---

## 四、待討論項目

1. Spec 的具體格式 — 怎麼寫才能同時服務工程師和設計師？
2. 設計師的 AI 工具培訓計畫
3. Prototype 工具選型（取決於團隊技術棧）
4. Design system 現況（有無現成的 component library？）
5. 設計師的接受度和溝通策略
