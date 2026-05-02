---
description: 抓取當日軟體開發相關熱門科技新聞，分類為前端 / 後端 / AI / DevOps 雲端 / 其他，擷取重點並補充專業術語說明，輸出為英中雙語對照 .md 筆記。
---

# tech-news — 每日科技新聞摘要（英中雙語）

目的：每天產出 10–15 則精選科技新聞摘要，可在 10–15 分鐘內讀完，協助使用者掌握軟體開發相關趨勢。

## 工作流程

### 1. 確認輸出路徑

- 取得今天日期 `YYYY-MM-DD` 與星期幾
- 輸出檔案：`techNews/YYYY-MM-DD.md`（位於專案根目錄）
- 若該檔已存在，**直接覆寫**（同日重跑視為更新）

### 2. 抓取來源

#### 每日來源（每次都抓）

| 來源 | URL | 主要分類 |
|------|-----|---------|
| Hacker News | https://news.ycombinator.com | 綜合 / 後端 / AI 工具討論 |
| GitHub Trending | https://github.com/trending?since=daily | 開源專案 / 工具 |
| Frontend Masters Blog | https://frontendmasters.com/blog | React / Next / TS / JS / CSS 深度文 |
| dev.to | https://dev.to/top/week | 前端 / AI 工具使用心得 |
| Anthropic Engineering | https://www.anthropic.com/engineering | Claude 實作與工程實踐（非研究） |
| Anthropic News | https://www.anthropic.com/news | 僅取產品 / 工具 / Claude Code 公告（過濾掉純研究與模型發布） |
| Google DeepMind Blog | https://deepmind.google/discover/blog | 僅取產品 / 開發者工具（過濾掉純研究與模型發布） |

#### 每週來源（**僅週六或週日執行時**才納入；平日跳過）

| 來源 | URL | 主要分類 |
|------|-----|---------|
| InfoQ | https://www.infoq.com | 架構 / 後端 |
| Frontend Focus | https://frontendfoc.us | 前端週報 |
| Smashing Magazine | https://www.smashingmagazine.com | 前端深度文 |
| web.dev | https://web.dev | Web 標準 / 瀏覽器 API |
| 掘金前端 | https://juejin.cn/frontend | 中文前端社群 |

備援：若主要來源失敗，使用 WebSearch 搜尋 `"frontend news" OR "AI engineering" OR "Claude Code" today` 取得替代文章。

#### 抓取規則

- 每來源取首頁前 10–20 條候選
- 取標題、URL、發布時間、簡短描述
- **過濾**掉：消費電子產品評測、企業財報、政治、單純行銷文、新手 tutorial 重複文
- 同主題多源重複報導 → 合併為一則，連結保留訊息最完整的那條

### 3. 篩選與加權（重點）

從候選清單中**最終選出 10–15 則**。排序加權規則：

#### 優先納入（高加權）

1. **AI 工具更新與新功能**（最高權重）：Claude Code、Cursor、Copilot、Codex、Devin、Aider、Continue、Windsurf、OpenClaw 等的新版本、新指令、新整合
2. **AI 工具使用心得 / workflow 分享**：「How I use Claude Code」、「Cursor tips」、團隊導入經驗、提示詞 / skill / hook 設定範例
3. **指定前端技術**：**React、Next.js、TypeScript、JavaScript、HTML、CSS** — 新版本、新 API、效能改善、最佳實踐
4. **MCP / Agent 應用生態**：新的 MCP server、整合教學、實際應用案例（不要 LLM 研究本身）
5. **影響開發體驗的工具**：npm、Node.js、Vite、瀏覽器更新

#### 中加權

- 後端語言 / 框架更新（Go、Rust、Node、Python、Java）
- 資料庫、可觀測性、雲服務重大公告
- 重大資安事件

#### 低加權（除非當日新聞太少才補）

- 純技術心得文、職涯討論

#### 直接排除（不納入）

- **LLM 研究 / 模型理論**：論文、benchmark 比較、模型架構討論、訓練細節
- **新模型發布本身**（GPT-5、Claude Opus 5、Gemini 3 等）— 除非附帶開發者可立即用的工具更新
- **AI 產業新聞**：估值、融資、商業合作（與工程師日常無關）
- **消費電子**、企業財報、政治
- **非指定前端技術**：Vue、Svelte、Solid、Angular、Astro 等（除非影響整個前端生態）

### 4. 分類

依下列類別整理（沒有就省略，不要硬湊類別）：

- **前端技術**：**React、Next.js、TypeScript、JavaScript、HTML、CSS** 相關更新、API、最佳實踐（其他框架不收）
- **後端技術**：語言、資料庫、API 設計、訊息佇列、效能、安全
- **AI 應用**：AI 工具更新（Claude Code、Cursor、Copilot 等）、使用心得分享、MCP 整合案例（不收 LLM 研究 / 新模型本身）
- **DevOps / 雲端**：K8s、CI/CD、IaC、雲服務、監控、成本優化
- **其他**：開源治理、社群事件、資安事件、職涯趨勢

### 5. 撰寫每則摘要（雙語區塊對照格式）

採用 **區塊對照格式**：在同一個內容區塊內，**所有英文 bullet 先列完**，用 `-------` 分隔線（前後不空行）隔開，**再列所有中文 bullet**。**不是**一行英文接一行中文的交替格式。

#### 適用範圍

- **Today's Highlights**：所有英文 bullet 先列完 → `-------` → 所有中文 bullet
- **新聞內文**（Core / Impact / Details 等小節）：先列全部英文 bullet → `-------` → 再列全部中文 bullet
- **小標題**（`###` 那行）：維持一行英文標題、一行中文標題（讓讀者一眼看到雙語標題）
- **大標題區塊**（`#` 標題、Sources、Mode 那幾行）：**純英文**，不加中文翻譯
- **Glossary**：**例外**，不用 `-------` 分隔線；每個詞條直接 EN 定義接 ZH 定義（連續兩行）

#### 翻譯原則

- 翻譯不逐字直譯，要符合中文／英文母語者的表達習慣
- 中文原文新聞（如 iThome、掘金）→ 中文 bullet 在前、`-------`、英文 bullet 在後

#### 格式範本

```markdown
### React 19 RC Released with Server Components Stable
### React 19 RC 發布，Server Components 進入穩定版

[原文連結](url)

- **Core**
  - React 19 RC marks Server Components as stable, no longer experimental.
  - The new `use()` hook lets you read promises during render.
- **Impact**
  - Framework authors like Next.js and Remix can ship without "experimental" warnings.
-------
- **核心**
  - React 19 RC 將 Server Components 標記為穩定版，不再是實驗性功能。
  - 新增 `use()` hook 可在 render 中讀取 promise。
- **影響**
  - Next.js、Remix 等框架作者可以不再帶著「實驗性」警告出貨。
```

#### 撰寫原則

- 每則保持 3–5 個 bullet 點；不要為了補滿欄位寫無意義內容
- 沒有具體數據／細節時，直接省略對應小節
- 只寫對「軟體工程師日常工作」有用的訊息，行銷話術一律刪
- 不要加 emoji
- 小節標題（**Core**、**Impact**、**Details** 等）在英文區塊用英文、中文區塊用中文；不要寫成 `Core / 核心` 的斜線併排

### 6. 專業術語補充

文章結尾加「專業術語補充 / Glossary」區塊，列出當天摘要中可能讓人卡住的名詞，雙語格式同樣 Immersive Translate 風格。

#### 判斷哪些要補

- AI 工具相關的實用概念（MCP、tool calling、context window、agent skill、hook） → 補
- 首次出現或近 3 個月才流行的新概念 → 補
- 跨領域名詞（後端工程師看的前端 build tool 名詞、反之亦然） → 補
- 業界常識（HTTP、REST、Git、Docker） → 不用補
- **純 LLM 研究名詞**（attention、MoE、scaling law、distillation 等理論概念） → **不用補**，使用者表明不關心

#### 格式

```markdown
## Glossary

- **Server Components**
  - React components that render on the server and stream HTML + minimal JS to the client.
  - *在伺服器端 render 的 React 元件，串流 HTML 加最少 JS 給瀏覽器，減少前端 bundle。*
- **MCP (Model Context Protocol)**
  - An open protocol that standardizes how LLM agents call external tools and data sources.
  - 標準化 LLM agent 如何呼叫外部工具與資料來源的開放協議。
```

### 7. 最終檔案結構

```markdown
# Tech News YYYY-MM-DD (Day)

> Sources: Hacker News、GitHub Trending、Frontend Masters、Claude Code Releases（N stories）
> Mode: Daily or Daily + Weekly

## Today's Highlights

- One-line takeaway 1
- One-line takeaway 2
- ...（5–7 points）
-------
- 一句話重點 1
- 一句話重點 2
- ...（共 5–7 點）

## AI

### [標題雙語]
...

## Frontend

...

## Backend

...

## DevOps & Cloud

...

## Others

...

## Glossary

...
```

### 8. 收尾

完成後告訴使用者：

- 檔案路徑
- 今天總共 N 則、分布在哪些類別
- 一句話的「最值得花 1 分鐘讀的那則」推薦
- 若是週末模式，註記哪些則來自週報來源

## 注意事項

- 每天目標 **10–15 則**，寧可少而精，**不要硬湊**
- 平日只用「每日來源」；週六、週日才加「每週來源」
- 若所有來源都失敗，**不要產出空檔**，回報失敗原因即可
- 連結用原文連結，不用 archive / paywall bypass
- 不抓需付費訂閱才能讀完整內容的來源
- 雙語對照若原文已是中文（如 iThome、掘金），把英文翻譯放在中文之後
