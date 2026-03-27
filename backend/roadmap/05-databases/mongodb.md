# MongoDB

## 簡介

MongoDB is a NoSQL document-oriented database storing data in BSON format without fixed schemas. Supports horizontal scaling via sharding and high availability through replica sets. Ideal for applications with evolving data structures, real-time analytics, and large-scale data handling.

## 學習資源

### 文章

#### 1. MongoDB Introduction - Core Concepts
> 原文：https://www.mongodb.com/docs/manual/introduction/

**MongoDB 簡介**

MongoDB 是一個開源的、基於文檔的 NoSQL 資料庫，以其靈活性和可擴展性著稱。

核心特性：
- **文檔導向 (Document-Oriented)**：以 JSON 類格式存儲資料
- **動態結構 (Dynamic Schema)**：無需預先定義資料結構
- **高性能**：快速查詢和寫入操作
- **可擴展性**：支援水平擴展（Sharding）
- **高可用性**：透過副本集實現
- **靈活的查詢語言 (MongoDB Query Language)**

**文檔模型 (Document Model)**

MongoDB 將資料儲存在文檔中，每個文檔是一個 JSON 物件的變體。

文檔結構範例：
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 28,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipcode": "10001"
  },
  "hobbies": ["reading", "hiking", "photography"],
  "createdAt": ISODate("2024-01-15T10:30:00Z")
}
```

文檔特性：
- 每個文檔都有唯一的 `_id` 欄位（主鍵）
- 支援嵌套物件和陣列
- 可存儲各種資料類型（字串、數字、日期、布林等）
- 最大文檔大小為 16MB

**集合 (Collections) 和資料庫 (Databases)**

階層結構：
```
MongoDB Server
├── Database (資料庫)
│   ├── Collection (集合)
│   │   ├── Document (文檔)
│   │   └── Document
│   └── Collection
└── Database
```

集合 (Collections)：
- 相似文檔的群組
- 無需預先定義結構（Schema-less）
- 可動態添加新欄位

**BSON 資料格式**

BSON (Binary JSON) 是 MongoDB 的內部二進制資料格式，基於 JSON 但擴展了更多資料類型，支援高效的序列化和反序列化。

支援的 BSON 資料類型：

| 類型 | 描述 | 範例 |
|------|------|------|
| String | 字串 | `"hello"` |
| Number | 整數或浮點數 | `42`, `3.14` |
| Boolean | 布林值 | `true`, `false` |
| Date | 日期時間 | `ISODate("2024-01-15")` |
| ObjectId | 唯一識別符 | `ObjectId("507f...")` |
| Array | 陣列 | `[1, 2, 3]` |
| Object | 嵌套物件 | `{x: 1, y: 2}` |

**CRUD 操作**

Create (建立)：
```javascript
// 插入單個文檔
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30
})

// 插入多個文檔
db.users.insertMany([
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" }
])
```

Read (讀取)：
```javascript
// 查詢所有文檔
db.users.find()

// 條件查詢
db.users.find({ age: { $gt: 25 } })  // age > 25

// 投影特定欄位
db.users.find({}, { name: 1, email: 1, _id: 0 })

// 排序和限制
db.users.find().sort({ age: -1 }).limit(10)
```

常用查詢操作符：
```javascript
// 比較操作符
{ age: { $gt: 25 } }      // 大於
{ age: { $gte: 25 } }     // 大於等於
{ age: { $lt: 35 } }      // 小於
{ age: { $ne: 30 } }      // 不等於

// 邏輯操作符
{ $and: [{ age: { $gt: 25 } }, { status: "active" }] }
{ $or: [{ age: { $lt: 20 } }, { age: { $gt: 60 } }] }

// 陣列操作符
{ hobbies: { $in: ["reading", "sports"] } }
{ hobbies: { $all: ["reading", "sports"] } }
```

Update (更新)：
```javascript
// 更新單個文檔
db.users.updateOne(
  { name: "John Doe" },
  { $set: { age: 31, email: "newemail@example.com" } }
)

// 更新操作符
{ $set: { field: value } }           // 設置欄位值
{ $inc: { age: 1 } }                 // 遞增
{ $push: { tags: "newTag" } }        // 添加到陣列
{ $pull: { tags: "oldTag" } }        // 從陣列移除
```

Delete (刪除)：
```javascript
// 刪除單個文檔
db.users.deleteOne({ name: "John Doe" })

// 刪除多個文檔
db.users.deleteMany({ status: "inactive" })
```

**索引 (Indexes)**

索引用途：
- 加速查詢操作
- 強制唯一性
- 改善排序效能

建立索引：
```javascript
// 建立單欄位索引
db.users.createIndex({ email: 1 })      // 升序
db.users.createIndex({ age: -1 })       // 降序

// 建立複合索引（多欄位）
db.users.createIndex({ email: 1, age: -1 })

// 建立唯一索引
db.users.createIndex({ email: 1 }, { unique: true })

// 建立文本索引（全文搜尋）
db.users.createIndex({ name: "text", bio: "text" })

// 建立 TTL 索引（自動過期）
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }  // 1小時後過期
)
```

**副本集 (Replica Sets)**

副本集提供高可用性 (High Availability)、資料冗餘和故障轉移能力。

副本集架構：
```
副本集 (Replica Set)
├── Primary (主節點) - 接收所有寫入操作
├── Secondary (從節點) - 複製 Primary 的資料，可處理讀取
├── Secondary (從節點) - 複製 Primary 的資料，可處理讀取
└── Arbiter (仲裁節點) - 可選，參與投票但不儲存資料
```

讀取偏好選項：
- `primary`：只讀主節點（預設）
- `primaryPreferred`：優先主節點，主節點不可用則讀從節點
- `secondary`：只讀從節點
- `secondaryPreferred`：優先從節點，無從節點則讀主節點
- `nearest`：讀延遲最低的節點

故障轉移流程：
1. Primary 節點失敗
2. 副本集成員檢測到 Primary 不可用
3. Secondary 節點舉行選舉 (Election)
4. 獲得多數票的 Secondary 成為新 Primary
5. 應用程式自動連接到新 Primary

**分片 (Sharding)**

分片提供水平擴展 (Horizontal Scaling) 能力，支援大規模資料集分佈存儲，提高寫入吞吐量。

分片架構：
```
分片叢集 (Sharded Cluster)
├── Mongos (查詢路由器)
├── Config Servers (配置服務器) - 副本集
└── Shards (分片) - 每個都是副本集
    ├── Shard 1
    ├── Shard 2
    └── Shard 3
```

分片鍵類型：
1. **Ranged Sharding** - 基於範圍（例：按時間戳分片）
2. **Hashed Sharding** - 基於雜湊值（均勻分佈）
3. **Geographic Sharding** - 基於地理位置

分片鍵範例：
```javascript
// 啟用分片
sh.enableSharding("myDatabase")

// 創建索引並設置分片鍵
db.users.createIndex({ userId: 1 })
sh.shardCollection("myDatabase.users", { userId: 1 })
```

分片優缺點：

優點：
- 支援超大資料集
- 提高寫入吞吐量
- 支援地理分佈式部署
- 自動資料平衡

缺點：
- 增加複雜性
- 某些查詢效能下降
- 需要選擇合適的分片鍵
- 無法更改分片鍵

**核心概念快速參考**

| 概念 | 說明 | 用例 |
|------|------|------|
| **Document** | 基本資料單位 | 儲存用戶、產品等資料 |
| **Collection** | 文檔的群組 | 類似 SQL 表格 |
| **Index** | 加速查詢的結構 | 提高查詢效能 |
| **Replica Set** | 資料冗餘和故障轉移 | 高可用性需求 |
| **Sharding** | 水平資料分佈 | 超大規模資料集 |

---

### 影片

- [daily.dev MongoDB Feed](https://app.daily.dev/tags/mongodb)

### 其他資源

- [Visit Dedicated MongoDB Roadmap](https://roadmap.sh/mongodb)
- [MongoDB Website](https://www.mongodb.com/)
- [Learning Path for MongoDB Developers](https://learn.mongodb.com/catalog)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
