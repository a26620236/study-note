# GraphQL

## 簡介

GraphQL is Facebook's query language for APIs allowing clients to request exactly the data they need. Uses single endpoint with schema-defined data structure, reducing over-fetching and under-fetching. More flexible than REST for complex applications with diverse platform needs.

## 學習資源

### 文章

#### 1. GraphQL 官方網站
> 原文：https://graphql.org/

## 1. 主要概念和定義

**GraphQL 是什麼？**
- 開源的 API 查詢語言和伺服器端運行時
- 由 Facebook 於 2012 年開發，2015 年開源
- 提供強型別的 schema，定義資料之間的關係
- 不依賴特定的資料庫或儲存引擎

**核心特點：**
- 與現有代碼和資料相容
- 隨著時間推移更容易演化 API
- 由 Linux Foundation 旗下的 GraphQL Foundation 支持

---

## 2. 核心功能和特性

### 五大設計支柱（Five Pillars）

| 支柱 | 說明 |
|------|------|
| **Product-centric** | 為前端工程師設計，對應 UI 的思維方式 |
| **Hierarchical** | Query 結構映射 UI 階層，自然對應資料需求 |
| **Strong-typing** | 強型別系統，支援查詢驗證和可預測的回應 |
| **Client-specified response** | 客戶端控制接收的資料，只取需要的欄位 |
| **Self-documenting** | API 可自我描述，工具和客戶端可查詢 schema |

### 五大優勢

#### 1. **Precision（精準性）**
```graphql
query {
  hero {
    name
    height
    mass
  }
}
```
- 只請求需要的資料，無過度取得（over-fetching）或不足取得（under-fetching）
- 提高應用效能和響應速度

#### 2. **Optimization（最佳化）**
- 在一個請求中檢索多個資源
- 追蹤資料之間的關係，消除多次 API 呼叫
- 相比 REST API，大幅減少網絡請求

#### 3. **Productivity（生產力）**
- 強大的社群工具支援（如 GraphiQL）
- IDE 中可自動完成和錯誤檢測
- 開源工具減少開發時間

#### 4. **Consistency（一致性）**
- 基於 Type 和 Field 的結構，而非 Endpoint
- 確保資料一致性和自文件化
- 清晰、可操作的錯誤信息

#### 5. **Versionless（無版本化）**
```graphql
# 舊欄位標記為已棄用
type Film {
  title: String
  director: String @deprecated
  directedBy: Person  # 新欄位
}
```
- 新增欄位和 Type 無需破壞現有查詢
- API 持續演化，應用無縫升級
- 支援欄位廢棄（deprecation）機制

#### 6. **Integration（整合）**
- Storage-agnostic，與資料庫無關
- 整合 REST API、第三方服務
- 多語言支援（C#, Node.js, Python, Rust 等）

---

## 3. 使用方式和最佳實踐

### 基本查詢結構

**Query 定義：**
```graphql
query getCity($city: String) {
  cities(name: $city) {
    population
    weather {
      temperature
      precipitation
    }
  }
}
```

**Schema 定義：**
```graphql
type Project {
  name: String!
  tagline: String
  contributors(first: Int, after: ID): [User!]!
}
```

### Data Colocation（資料共置）

使用 Fragment 將元件的資料需求定義在其旁邊：

```graphql
query GetFriendList {
  ...FriendList
}

fragment FriendList on Query {
  friends {
    ...FriendListItem
  }
}

fragment FriendListItem on Friend {
  name
  profilePic
  mutualFriendsCount
  isSubscribed
  ...FriendInfo
}

fragment FriendInfo on Friend {
  username
  email
  location
}
```

---

## 4. 重要的技術細節

### 業務優勢

| 方面 | 優勢 |
|------|------|
| **用戶體驗** | 快速資料檢索、改善頻寬效率 |
| **安全性** | 強大的存取控制、完整的資料消費可見性 |
| **開發效率** | 快速迭代、跨團隊協作改善 |

### 適用場景

1. **大型後端服務**：統一資料層，簡化 API 管理
2. **行動應用**：精確請求節省電池，離線快取支援
3. **前端複雜應用**：元件級資料聲明，單次請求聚合多個服務
4. **實時更新應用**：Subscription 取代輪詢和 WebSocket
5. **全棧 TypeScript 應用**：Schema-first 開發，完整型別安全
6. **AI 應用**：自描述 schema、強型別和組合性完美適配 LLM

### 支援的語言和平台

- **程式語言**：JavaScript, C#, Node.js, Python, Rust
- **資料庫**：PostgreSQL 及其他關聯式資料庫
- **整合方案**：REST API、第三方服務

### 相關文檔

- GraphQL 學習中心
- Best Practices
- 效能最佳化
- Schema 設計

---

## 5. 社群與支援

- **官方規範**：spec.graphql.org
- **GitHub**：完整開源實現
- **社群平台**：Discord、事件、線上資源
- **年度會議**：GraphQLConf 2026（5月6-7日，加州 Menlo Park）

---

### 影片

- [Tutorial - GraphQL Explained in 100 Seconds](https://www.youtube.com/watch?v=eIQh02xuVw4)
- [Explore top posts about GraphQL](https://app.daily.dev/tags/graphql?ref=roadmapsh)

### 其他資源

- [Visit Dedicated GraphQL Roadmap](https://roadmap.sh/graphql)
- [GraphQL](https://graphql.org/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
