# Hateoas

## 簡介

HATEOAS (Hypermedia As The Engine Of Application State) is a REST constraint enabling clients to navigate APIs dynamically through hypermedia links in responses. Clients discover actions through links instead of hard-coded URLs, providing flexibility and decoupling from server changes.

## 學習資源

### 文章

#### 1. Richardson Maturity Model - Martin Fowler
> 原文：[https://martinfowler.com/articles/richardsonMaturityModel.html](https://martinfowler.com/articles/richardsonMaturityModel.html)

**Richardson Maturity Model (RMM) 概述**

Richardson Maturity Model 是評估 RESTful Web 服務成熟度的模型，將 REST 方法的核心要素分為四個逐進式階段。

**四個成熟度等級**

| 等級 | 名稱 | 核心概念 | 特徵 |
|------|------|---------|------|
| **Level 0** | 遠端程序呼叫 | 單一服務端點 | 使用 POST，相當於 RPC |
| **Level 1** | 資源導向 | 引入資源概念 | 各資源擁有獨立 URI |
| **Level 2** | HTTP 動詞標準化 | 使用標準 HTTP 方法 | GET/POST/PUT/DELETE + 狀態碼 |
| **Level 3** | 超媒體控制（HATEOAS） | 回應包含超連結 | 伺服器動態提供可用操作 |

**HATEOAS 的角色**

HATEOAS (Level 3) 代表 RESTful 成熟度的最高層級，核心目的：
- **自主性發現**：用戶端透過連結自行探索可用操作
- **伺服器自主性**：允許伺服器團隊調整內部 URI 結構
- **協定文件化**：連結的 `rel` 屬性明確標示關係類型
- **向前相容性**：新功能可通過新連結宣告

**範例回應**：
```xml
<appointment>
  <link rel="/linkrels/appointment/cancel" uri="/slots/1234/appointment"/>
  <link rel="/linkrels/appointment/addTest" uri="/slots/1234/appointment/tests"/>
  <link rel="self" uri="/slots/1234/appointment"/>
</appointment>
```

**重要聲明**：根據 REST 創造者 Roy Fielding 的定義，只有達到 Level 3 的服務才算真正的 REST API。

---

#### 2. What is HATEOAS and why is it important for my REST API?
> 原文：[https://restcookbook.com/Basics/hateoas/](https://restcookbook.com/Basics/hateoas/)

**HATEOAS 定義**

HATEOAS 代表 "Hypertext As The Engine Of Application State"（超文本作為應用狀態引擎）。核心原則是 API 回應應包含指向可執行動作的連結，讓用戶端動態發現可用功能。

**為什麼重要**

| 優勢 | 說明 |
|------|------|
| **動態發現** | 用戶端無需硬編碼 URL |
| **狀態感知** | API 根據當前狀態限制可用操作 |
| **自文檔化** | 回應本身表明可執行的動作 |
| **靈活性** | 服務器可更改 URL 而不破壞用戶端 |

**實際範例**

正常帳戶（餘額充足）：
```xml
GET /account/12345
餘額: 100.00 USD
可用操作：deposit（存款）、withdraw（提款）、transfer（轉帳）、close（結帳）
```

透支帳戶（餘額為負）：
```xml
GET /account/12345
餘額: -25.00 USD
可用操作：deposit（僅限存款）
```

系統會根據業務邏輯動態調整返回的連結，確保用戶端只能執行當前許可的操作。

---

#### 3. HATEOAS - A Practical Guide with Spring
> 原文：[https://www.baeldung.com/spring-hateoas-tutorial](https://www.baeldung.com/spring-hateoas-tutorial)

**Spring HATEOAS 核心概念**

Spring HATEOAS 是一套用於建構符合 HATEOAS 原則的 REST API 函式庫，核心目的是解耦客戶端與伺服器，讓 API 可自由變更 URI 結構而不破壞客戶端。

**三大核心抽象**

| 抽象類別 | 用途 |
|---------|------|
| **RepresentationModel** | 資源基底類別，提供 `add()` 方法附加連結 |
| **Link** | 儲存資源的 metadata（URI），遵循 Atom link 語法（`rel` + `href`） |
| **WebMvcLinkBuilder** | 簡化 URI 建構，避免硬編碼連結 |

**實作步驟**

1. **資源繼承 RepresentationModel**
```java
public class Customer extends RepresentationModel<Customer> {
    private String customerId;
    private String customerName;
}
```

2. **使用 WebMvcLinkBuilder 建立連結**
```java
// Self link
linkTo(CustomerController.class).slash(customer.getCustomerId()).withSelfRel();

// Method link（關聯其他資源）
linkTo(methodOn(CustomerController.class)
    .getOrdersForCustomer(customerId)).withRel("allOrders");
```

3. **回應結構（HAL 格式）**
```json
{
  "customerId": "10A",
  "customerName": "Jane",
  "_links": {
    "self": { "href": ".../customers/10A" },
    "allOrders": { "href": ".../customers/10A/orders" }
  }
}
```

**重要特性**
- 客戶端只需一個進入點，後續操作透過回應中的連結導航
- 伺服器可自由變更 URI 結構而不影響客戶端
- 若客戶無訂單，`allOrders` 連結不會出現（動態揭露可用操作）
- 使用 `CollectionModel` 包裝集合資源

### 影片

- [@video@What happened to HATEOAS](https://www.youtube.com/watch?v=HNTSrytKCoQ)
- [@video@HATEOAS Explained](https://www.youtube.com/watch?v=gCNAudrbWCo)


---

> 整理自 [roadmap.sh - Backend Roadmap](https://roadmap.sh/backend)
