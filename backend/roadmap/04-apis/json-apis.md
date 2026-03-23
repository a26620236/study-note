# JSON APIs

## 簡介

JSON (JavaScript Object Notation) is an encoding scheme eliminating ad-hoc code for server communication. JSON API provides standardized implementation for data stores and structures, including entity types, bundles, and fields with defined communication protocols.

## 學習資源

### 文章

#### 1. What is JSON API?
> 原文：[https://medium.com/@niranjan.cs/what-is-json-api-3b824fba2788](https://medium.com/@niranjan.cs/what-is-json-api-3b824fba2788)

**JSON API 與 REST 的關係**

JSON API **不是** REST 的替代品，而是在 REST 基礎上增加額外約束：使用特定的 MIME Type `application/vnd.api+json`，讓資料交換遵循一套統一標準。

**解決的問題：Chatty API**

以部落格網站為例，顯示一篇文章需要：文章內容、作者資訊、評論等。
- 傳統 REST：需呼叫多個端點（`/articles/{id}`、`/author`、`/comment`），造成大量來回請求（chatty）
- JSON API：透過單一端點返回所有相關資料，並用結構化格式組織

**JSON API 回應結構**

| 欄位 | 說明 |
|------|------|
| **links.self** | 資源自連結 |
| **data** | 主要資源陣列，每個元素包含 type、id、attributes |
| **data[].relationships** | 描述與其他資源的關係 |
| **included** | 被引用的關聯資源詳細資料 |

**核心優勢：參數化查詢**

透過 HTTP 請求參數對資料進行切割、排序、分頁：

```
GET /articles?include=author&fields[articles]=title,body&fields[people]=name
Accept: application/vnd.api+json
```

- **Sparse Fieldsets**：只取所需欄位（減少傳輸量）
- **Include**：指定要包含的關聯資源
- **Filter / Sort / Paginate**：在單一端點上完成所有操作
- **單一資源查詢**：`GET /articles/{id}` 無需另建端點

---

#### 2. JSON API Recommendations and Best Practices
> 原文：[https://jsonapi.org/recommendations/](https://jsonapi.org/recommendations/)

**主要建議概覽**

JSON:API 推薦文件涵蓋 8 個核心領域，建立跨不同實作的一致性標準。

**命名規範**
- 應使用駝峰式命名（`wordWordWord` 格式）
- 名稱應以 a-z 開頭和結尾
- 僅包含 ASCII 英數字 (a-z, A-Z, 0-9)

**URL 設計**

| 類型 | URL 範例 |
|------|---------|
| 資源集合 | `/photos` |
| 單一資源 | `/photos/1` |
| Relationship URL | `/photos/1/relationships/comments` |
| Related Resource URL | `/photos/1/comments` |

**篩選機制**
```
GET /comments?filter[post]=1 HTTP/1.1
GET /comments?filter[post]=1,2 HTTP/1.1
GET /comments?filter[post]=1,2&filter[author]=12 HTTP/1.1
```

**連結包含建議**

| 連結類型 | 位置 | 用途 |
|---------|------|------|
| Top-level | 文件根層 | 自連結及分頁連結 |
| Resource-level | 各資源物件 | 該資源的自連結 |
| Relationship | 關係物件中 | 所有可用關係的連結 |

**特殊用例**
- **不支援 PATCH 的用戶端**：使用 `X-HTTP-Method-Override: PATCH` 標頭
- **日期時間格式**：建議採用 ISO 8601 標準
- **非同步處理**：202 Accepted → 200 OK (Retry-After) → 303 See Other

---

#### 3. JSON API Specification
> 原文：[https://jsonapi.org/](https://jsonapi.org/)

**JSON:API 定義**

JSON:API 是建構 JSON API 的規範，致力於解決團隊在 JSON 回應格式上的討論分歧。

**核心功能和特性**

| 功能特性 | 說明 |
|---------|------|
| **標準化格式** | 遵循共同慣例提高生產力 |
| **通用工具支持** | 可利用已有的通用工具和最佳實踐 |
| **高效快取** | 客戶端能有效快取回應 |
| **完整資料管理** | 涵蓋資源建立、更新和讀取操作 |

**回應結構**
- links - 導航和相關資源連結
- data - 主要資源內容
- attributes - 資源屬性
- relationships - 資源間的關係連結
- included - 相關資源詳細資訊

**官方狀態**
- 媒體類型：`application/vnd.api+json`
- 已向 IANA 正式註冊
- 目前穩定版本：v1.1（2022年9月30日發佈）

---

#### 4. JSON.org - Introducing JSON
> 原文：[https://www.json.org/json-en.html](https://www.json.org/json-en.html)

**JSON 定義**

JSON（JavaScript Object Notation）為一種輕量級的資料交換格式，易於人類閱讀和撰寫，同時也易於機器解析與生成。

**資料結構和類型**

基本結構：

| 結構類型 | 定義 | 表示符號 |
|---------|------|---------|
| **Object** | 名稱/值配對的無序集合 | `{ }` |
| **Array** | 值的有序集合 | `[ ]` |

支援的值類型：
- **String**：零個或多個 Unicode 字元，以雙引號包圍
- **Number**：類似 C 或 Java 的數字格式
- **Boolean**：`true` 或 `false`
- **Null**：`null`
- **Object**、**Array**：可巢狀結構

**語法規則**

物件結構：
```json
{ "名稱": 值, "名稱2": 值2 }
```

陣列結構：
```json
[ 值1, 值2, 值3 ]
```

**核心優勢**
- 完全與語言無關
- 採用 C 語族程式設計師熟悉的慣例
- 支援 C、C++、C#、Java、JavaScript、Perl、Python 等眾多語言
- 理想的資料交換語言

### 影片

- [JSON API: Explained in 4 minutes](https://www.youtube.com/watch?v=N-4prIh7t38)
- [REST API vs JSON API - Which Should You Use?](https://www.youtube.com/watch?v=0oXYLzuucwE)

### 其他資源

- [Full Stack Open - Node.js and Express (Part 3)](https://fullstackopen.com/en/part3)
- [JSON API Specification](https://jsonapi.org/)
- [JSON.org - Introducing JSON](https://www.json.org/json-en.html)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
