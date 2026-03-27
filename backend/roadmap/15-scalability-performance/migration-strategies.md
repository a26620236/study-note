# Migration Strategies

## 簡介

Migration strategies plan transitions between environments. Key approaches: Rehost (lift and shift with minimal changes), Replatform (optimize for new environment), Refactor (redesign for new features), Repurchase (replace with new solutions), Retain (keep in current environment), Retire (decommission redundant systems).

## 學習資源

### 文章

#### 1. Databases as a Challenge for Continuous Delivery - phauer.com
> 原文：[https://phauer.com/2015/databases-challenge-continuous-delivery/](https://phauer.com/2015/databases-challenge-continuous-delivery/)

**資料庫對持續交付的三大挑戰**

1. **數據適應困難**：大規模修改現有數據的複雜性
2. **回滾複雜**：資料庫變更難以或無法回滾
3. **測試限制**：難以複製類生產的資料庫測試環境

**遷移策略**

**向後兼容的結構變更**

設計對舊版本應用仍然兼容的 Schema 修改。例如：添加帶默認值的可選列，讓舊代碼無需立即更新也能正常運行。

**獨立的數據源**

「每個部署單元使用獨立的資料庫或至少獨立的 Schema」，最小化協調需求，各服務自管理其數據存儲。

**部署場景**

| 場景 | 策略 |
|------|------|
| **有維護窗口** | 停止應用 → 更新資料庫 → 部署新版本 → 重啟 |
| **零停機（藍/綠部署）** | 多階段漸進式變更（例如重命名列：添加新列 → 雙寫 → 遷移數據 → 切換讀取 → 刪除舊列） |

**NoSQL 的優勢**：無強制 Schema，舊新數據結構可共存，無需強制 Schema 更新（但應用程式必須處理可變數據格式）

**AWS 6Rs 遷移策略概覽**

| 策略 | 說明 |
|------|------|
| **Rehost（重新託管）** | Lift and Shift，最小變更 |
| **Replatform（重新平台化）** | 針對新環境優化 |
| **Refactor（重構）** | 為新功能重新設計 |
| **Repurchase（重新購買）** | 替換為新解決方案 |
| **Retain（保留）** | 保留在當前環境 |
| **Retire（退役）** | 停用冗餘系統 |

### 影片

- [AWS Cloud Migration Strategies](https://www.youtube.com/watch?v=9ziB82V7qVM)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
