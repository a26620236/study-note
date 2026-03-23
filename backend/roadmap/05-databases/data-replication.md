# Data Replication

## 簡介

Data replication creates multiple copies of data across distributed system nodes for availability, reliability, and performance. Can be synchronous or asynchronous. Uses master-slave, multi-master, or peer-to-peer models. Improves fault tolerance but challenges data consistency.

## 學習資源

### 文章

#### 1. Data Replication - IBM
> 原文：https://www.ibm.com/topics/data-replication

**核心定義**

資料複製是在不同位置建立和維護相同資料多個副本的過程，以確保資料的可用性、可靠性和復原力。透過從來源位置複製資料到一個或多個目標位置，組織能為全球使用者提供快速資料存取，同時降低延遲問題。

**複製方式分類**

| 複製方式 | 特性 | 適用場景 |
|--------|------|--------|
| **Synchronous（同步）** | 資料同時複製到主伺服器和所有副本伺服器 | 需要零資料遺失 |
| **Asynchronous（非同步）** | 資料先複製到主伺服器，再分批複製到副本伺服器 | 頻寬有限、成本考量 |

**三大複製類型**

1. **Transaction Replication（事務複製）**
   - 整個資料庫從主伺服器複製到次要伺服器
   - 實時連續更新資料變更
   - 常用於伺服器對伺服器環境

2. **Snapshot Replication（快照複製）**
   - 分發特定時間點的資料庫快照
   - 適合資料變更不頻繁的情況
   - 可協助意外刪除後的復原

3. **Merge Replication（合併複製）**
   - 兩個資料庫合併為一個
   - 雙方都能修改資料
   - 僅建議用於伺服器到客戶端環境

**複製配置方案**

| 方案 | 優點 | 缺點 |
|------|------|------|
| **Full Replication** | 高冗餘度、低延遲、快速查詢 | 難以實現並行性、更新緩慢 |
| **Partial Replication** | 優先複製重要資料、資源分配靈活 | 複雜度較高 |
| **No Replication** | 容易復原、易實現並行性 | 可用性差、查詢執行慢 |

**複製技術**

1. **Full-Table Replication** - 複製所有新舊資料
2. **Key-Based Incremental Replication** - 僅複製新增資料
3. **Log-Based Replication** - 監控資料庫日誌記錄變更

**核心好處**

- 增強可擴展性：透過分散資料到多節點，支援更高流量和工作負載
- 加速災難復原：遠端副本能快速還原系統
- 降低延遲：全球分散資料庫減少資料傳輸距離
- 提高容錯能力：提供冗餘性，防止單點故障
- 優化效能：負載均衡分散存取請求

**風險因素**

- 資料不一致：複製延遲、網路問題或並行更新衝突
- 資料遺失風險：非即時保護策略在故障時可能導致資料損失
- 延遲問題：網路延遲和頻寬限制影響更新時效性
- 安全風險：多位置複製增加資料洩露風險
- 合規複雜性：受規管行業需符合特定法規

**管理最佳實踐**

採用 SaaS 資料可觀測性平台進行：
- **監控** - 確保複製管道執行正常
- **追蹤** - 系統性故障排除
- **告警** - 設置異常提醒，及時修復問題

---

### 影片

- [What is Data Replication?](https://www.youtube.com/watch?v=iO8a1nMbL1o)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
