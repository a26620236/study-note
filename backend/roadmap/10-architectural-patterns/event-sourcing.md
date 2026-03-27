# Event Sourcing

## 簡介

Event sourcing represents system state as a sequence of events over time. Changes are recorded as events in an event store, with current state derived by replaying events. Provides auditable history, supports undo/redo, often used with CQRS and DDD.

## 學習資源

### 文章

#### 1. Event Sourcing - Martin Fowler
> 原文：[https://martinfowler.com/eaaDev/EventSourcing.html](https://martinfowler.com/eaaDev/EventSourcing.html)

**什麼是 Event Sourcing**

「將所有應用程式狀態的變更作為事件序列捕獲」。系統不僅儲存當前狀態，還保存所有修改的完整歷史，作為不可變的事件日誌。

**工作原理**

發生變更時，系統創建事件物件並按順序儲存。通過重放事件日誌可以重建任意時間點的應用程式狀態。

**核心優勢**

| 優勢 | 說明 |
|------|------|
| **完整重建** | 從頭重放事件日誌可完全重建應用程式狀態 |
| **時間查詢** | 可確定系統在過去任意時間點的狀態 |
| **事件回滾** | 可撤銷先前事件，糾正錯誤或處理亂序數據 |
| **審計追蹤** | 完整記錄供合規、調試和支援使用 |

**主要用例**
- 會計系統（自然對齊審計要求）
- 可擴展的事件驅動架構
- 生產問題調試（在測試環境中重放事件）
- 實現追溯事件或並行模型的基礎

**注意事項**

Event Sourcing 增加了與外部系統交互和代碼演進的複雜性。當審計追蹤、時間查詢或事件重放是核心業務需求時最有價值。

### 影片

- [Event Sourcing 101](https://www.youtube.com/watch?v=lg6aF5PP4Tc)
- [Explore top posts about Architecture](https://app.daily.dev/tags/architecture?ref=roadmapsh)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
