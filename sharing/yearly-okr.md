# 2026 年度 OKR

> 將年度規劃中的事項拆解為可向上彙報的 OKR。每項 Objective 說明帶來的商業價值，Key Results 採可量化指標，便於 quarterly review 對齊進度。

---

## O1：提升交付品質與穩定性，降低線上問題對業務的衝擊

**為什麼做（Why）**
線上問題每次發生都會佔用工程資源做 hotfix、影響客戶信任，並打亂既定開發節奏。透過提前在開發階段攔截 bug，可降低事後修復成本，讓團隊把時間放在新功能交付而非救火。

**好處（Business Value）**
- 降低線上 regression 與 hotfix 頻率，減少非預期的工時消耗
- QA 驗證流程自動化，釋出每次 release 前的人力成本
- Sprint 交付可預期，降低跨部門對工程排程的不確定感

**Key Results**
- KR1.1：前端 codebase 單元測試覆蓋率達 **100%**
- KR1.2：前端 codebase 核心使用者流程 E2E 自動化測試覆蓋率 達 **100%**
- KR1.3：Sprint 承諾項目準時交付率維持 **≥ 90%**，scope creep 比例 ≤ 10%

---

## O2：建立自動化 CI/CD 基礎建設，消除人工操作失誤空間

**為什麼做（Why）**
目前部分流程仰賴人工執行（type check、release tag、跨環境 backport），任何一個步驟漏掉都可能造成線上事故或 release 延誤。把這些流程標準化、自動化後，可讓團隊規模擴張時不會被流程綁架。

**好處（Business Value）**
- 程式碼品質問題在 PR 階段被攔截，降低 code review 與 QA 負擔
- Release 流程可重現、可追溯，降低「忘了打 tag / backport 漏環境」的風險
- PR 與 Notion / Slack 雙向打通，跨部門可即時掌握開發進度

**Key Results**
- KR2.1：**100% PR** 自動跑 TypeScript type check + ESLint，並 block 不合格的合併
- KR2.2：上線 release flow 自動化（PR merge → 自動打 tag → GitHub Action 跨環境 backport），人工介入次數降至 **0**
- KR2.3：建立 PR 自動通知機制（Slack 推播 + 解析 branch name 注入 Notion ticket 連結），覆蓋率 **100% PR**
- KR2.4：每次 CI 執行後自動產出 coverage report 並回報至 PR comment

---

## O3：以 AI 工具深度嵌入開發流程，提升團隊單位時間產能

**為什麼做（Why）**
AI 輔助開發已是業界趨勢，但若僅停留在「個人輔助工具」就無法放大團隊產能。將高重複性流程（需求拆解、code review、PR 建立）標準化為團隊共用指令，可把個人經驗變成組織資產。

**好處（Business Value）**
- 把工程師從重複性高、低附加價值的操作中解放出來，專注設計與決策
- 新進成員透過指令集快速上手，降低 onboarding 成本
- 形成可對外分享的 AI workflow 案例，提升公司在前端社群的技術品牌

**Key Results**
- KR3.1：上線 **5 個** Claude Code 自定義指令（`/pr-plan`、`/pr-task-breakdown`、`/pr-implement`、`/pr-code-review`、`/pr-flow`）並提供使用文件
- KR3.2：前端團隊內所有成員實際採用並提供使用回饋
- KR3.3：統計導入前後功能開發從建立 plan 到 PR review 完成的平均時間，**縮短 ≥ 30%**

---

## O4：完成關鍵技術升級，降低長期維護成本

**為什麼做（Why）**
框架版本落後會逐漸累積技術債：新套件相容性問題、安全性 patch 無法套用、新進工程師的學習曲線拉長。一次性的升級投入，可換來後續數年的維護成本下降與效能提升。

**好處（Business Value）**
- 取得新版本的效能優化與新特性（如 React 19 的 compiler、actions）
- 解決 ESM 相容性與測試環境分歧，降低後續 debug 成本
- 測試執行速度提升直接縮短 CI 時間，加速整體 release cadence

**Key Results**
- KR4.1：完成前端框架主版本升級（含 breaking changes 評估、遷移策略文件、漸進式推進），既有功能 regression 數 **≤ 3 件**
- KR4.2：完成測試框架 Jest → Vitest 遷移，本地測試執行速度提升 **≥ 50%**
- KR4.3：升級過程產出 1 份內部技術文件，紀錄遷移決策與避雷點

---

## O5：強化團隊協作流程與跨部門溝通效率

**為什麼做（Why）**
功能延遲與返工，多數源於需求模糊、開發前未對齊、或交付前缺乏 demo 把關。透過在工程流程的關鍵節點導入結構化做法，可把問題消化在源頭，而非讓它在 release 前才爆。

**好處（Business Value）**
- 跨部門資訊對齊提早，減少實作階段才發現規格衝突的返工
- 團隊內知識留存（技術文件、demo），降低人員異動造成的斷層
- 流程透明化，PM、設計、後端可即時掌握前端狀態

**Key Results**
- KR5.1：推動並落地 **至少 3 項** 團隊流程改善（例：standup 形式調整、開發前技術架構討論、release channel 與版本格式統一）
- KR5.2：每個 Major 需求在進入開發前完成跨部門技術對齊（PM / 設計 / 後端 / 前端），對齊紀錄留存於 Notion
- KR5.3：每個 Major 需求交付前舉辦 1 次內部 Demo，並產出技術文件

---

## O6：累積並輸出技術影響力，將個人經驗轉為團隊與公司資產

**為什麼做（Why）**
工程能力若僅停留在個人，價值難以放大；透過內外分享，可讓團隊整體水位提升，並建立公司在前端領域的對外品牌，協助招募與商務拓展。

**好處（Business Value）**
- 把外部前端生態的最新進展，轉化為團隊可直接應用的 know-how
- 對外分享 AI-assisted workflow 實戰經驗，提升公司技術形象、協助招募
- 形成可複製的 playbook，讓後續新成員或其他團隊能快速複製成果

**Key Results**
- KR6.1：內部 RD Sharing 至少 **2 場**（前端生態趨勢 / AI workflow 應用）
- KR6.2：對外分享 Claude Code 整合 AI workflow 實戰經驗 **至少 1 場**（社群、Meetup 或公司技術部落格）
- KR6.3：產出 1 份可對外分享的「AI-assisted Frontend Workflow Playbook」文件

---
