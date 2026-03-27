# Open API Spec

## 簡介

OpenAPI Specification (OAS), formerly Swagger, is a standard for defining and documenting RESTful APIs in YAML/JSON format. Describes endpoints, formats, authentication, and metadata. Enables client generation, automated documentation, testing, and promotes API design consistency.

## 學習資源

### 文章

#### 1. OpenAPI Specification 3.1.1 - Introduction & Core Concepts
> 原文：https://swagger.io/specification/

**OpenAPI Specification (OAS) 核心目的**

OpenAPI Specification 定義了一套標準、語言無關的 HTTP API 介面規範，使人類和電腦都能無需查看源碼或文檔，就能發現和理解服務能力。經過適當定義後，消費者可用最少實現邏輯與遠端服務互動，支援文檔生成、代碼生成、測試等多種用途。

**核心術語定義**

| 術語 | 定義 |
|------|------|
| **OpenAPI Description (OAD)** | 正式描述 API 表面與語義的完整文件集合，包含入口文件及所有被引用文件 |
| **OpenAPI Document** | 單個 JSON 或 YAML 文件，遵循 OAS 規範，包含必需的 `openapi` 版本欄位 |
| **Schema** | 描述語法與結構的正式規範；本規範本身即為 OAS 格式的 schema |
| **Path Templating** | 使用花括號 `{}` 標記 URL 路徑中可替換的部分（如 `/items/{itemId}`） |
| **Media Types** | 遵循 RFC6838 的媒體類型定義（例：`application/json`, `text/plain; charset=utf-8`） |

**Path Templating 重要約束**：
- 路徑中每個模板表達式必須對應 Path Item 中的路徑參數
- 參數值不能包含未轉義的 RFC3986 通用語法字符（`/`, `?`, `#`）

**大小寫敏感性**：
- 大多數欄位名稱和值區分大小寫
- 直接對應 HTTP 概念的欄位遵循 HTTP 大小寫規則

**版本管理方案**

版本格式：`major.minor.patch`（如 3.1.0）

| 版本部分 | 說明 |
|---------|------|
| **major.minor** | 指定 OAS 功能集 |
| **patch** | 修正文檔錯誤或澄清，不涉及功能集變更 |

兼容性規則：
- 工具支援 OAS 3.1 應相容於所有 OAS 3.1.* 版本
- 工具不應區別 patch 版本
- minor 版本偶發含非向後兼容變更（影響評估為低）

**檔案格式**

OpenAPI Document 為 JSON 物件，可用 JSON 或 YAML 格式表示。

關鍵規則：
- 所有欄位名稱**區分大小寫**
- 兩類欄位：**Fixed fields**（具有聲明名稱）、**Patterned fields**（符合聲明模式）
- YAML 建議使用 1.2 版本，Tags 限制於 YAML JSON schema ruleset

範例（JSON）：
```json
{
  "field": [1, 2, 3]
}
```

**文件結構**

OpenAPI Description 支援單文件或多文件架構：

- **單文件**：所有定義包含在一個 JSON/YAML 文檔中，適合簡單 API
- **多文件**：推薦入口文檔命名為 `openapi.json` 或 `openapi.yaml`，透過 Reference Object、Path Item Object 的 `$ref` 欄位引用外部文檔

文檔解析要求（遵循 JSON Schema Specification Draft 2020-12）：
- 解析前不應判定引用無法解析
- 必須檢測可能提供引用目標的關鍵字
- 支援通過媒體類型、根級 `openapi` 欄位等方式檢測文檔類型

**重要警告**：孤立解析 OAS 內容片段的結果為未定義，可能違反規範要求。

**資料型別系統**

基礎型別（JSON Schema Draft 2020-12）：
```
"null", "boolean", "object", "array", "number", "string", "integer"
```

**OAS 定義的 Format 修飾符**：

| Format | JSON 資料型別 | 說明 |
|--------|-------------|------|
| `int32` | number | 有符號 32 位 |
| `int64` | number | 有符號 64 位（long） |
| `float` | number | 浮點數 |
| `double` | number | 雙精度浮點數 |
| `password` | string | 隱藏提示 |

**二進位資料處理**：

| 形式 | 使用情境 | Schema 關鍵字 |
|------|---------|--------------|
| **Raw binary** | 原始未編碼二進位（整個 HTTP body 或 `multipart/*` 二進位部分） | 省略 `type`，使用 `contentMediaType: image/png` |
| **Encoded binary** | 二進位嵌入文本格式（JSON、URL 查詢字符串） | `type: string, contentMediaType: image/png, contentEncoding: base64` |

**OAS 3.0 遷移範例**：
```
OAS < 3.1:  type: string, format: binary
OAS 3.1:    contentMediaType: image/png

OAS < 3.1:  type: string, format: byte
OAS 3.1:    type: string, contentMediaType: image/png, contentEncoding: base64
```

**Rich Text Formatting**

`description` 欄位支援 **CommonMark 0.27** markdown 格式。工具渲染富文本必須至少支援 CommonMark 0.27，可忽略某些特性以應對安全考量。

**關鍵設計原則**：
- **語言無關性**：使任何語言工具都能處理
- **完整文檔解析**：避免片段孤立解析
- **多文件支援**：透過 Reference 機制實現模塊化
- **互操作性優先**：建議避免歧義和實現定義行為
- **向後兼容**：patch 版本保持完全兼容

---


### 影片

- [OpenAPI 3.0: How to Design and Document APIs with the Latest OpenAPI Specification 3.0](https://www.youtube.com/watch?v=6kwmW_p_Tig)
- [ REST API and OpenAPI: It’s Not an Either/Or Question](https://www.youtube.com/watch?v=pRS9LRBgjYg)

### 其他資源

- [OpenAPI Specification Website](https://swagger.io/specification/)
- [Open API Live Editor](https://swagger.io/tools/swagger-editor/)

---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
