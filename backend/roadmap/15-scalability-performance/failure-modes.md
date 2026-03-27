# Failure Modes

## 簡介

Database failure modes include hardware failures, software bugs, data corruption, performance degradation, and distributed system inconsistencies. Common issues: data loss, unavailability, replication lag, deadlocks. Mitigated through redundancy, backups, transaction logging, and failover mechanisms.

## 學習資源

### 文章

**常見故障模式概覽**

| 故障類型 | 說明 | 緩解方式 |
|---------|------|---------|
| **硬體故障** | 伺服器、磁碟、網路設備損壞 | RAID、冗餘硬體、熱備份 |
| **軟體錯誤** | 程式 Bug、記憶體洩漏、死鎖 | 代碼審查、自動測試、健康檢查 |
| **數據損毀** | 意外寫入、磁碟損壞 | 備份、事務日誌、ACID 事務 |
| **性能降級** | 慢查詢、資源耗盡 | 監控、索引優化、自動擴展 |
| **網路分區** | 節點間通訊失敗 | 冗餘網路路徑、Circuit Breaker |
| **級聯故障** | 一個服務故障引發連鎖反應 | 隔離艙（Bulkhead）、Circuit Breaker |
| **拜占庭故障** | 節點發送錯誤或矛盾的回應 | 共識算法（Paxos、Raft） |

**恢復策略**
- **自動故障轉移（Failover）**：主節點故障時自動切換到備用節點
- **熔斷（Circuit Breaker）**：防止對失敗服務的持續請求
- **重試機制**：帶指數退避的請求重試
- **死信佇列（Dead Letter Queue）**：隔離無法處理的訊息

### 其他資源

- [Database Failure Modes](https://roadmap.sh/ai/course/database-failure-modes-prevention-and-recovery)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
