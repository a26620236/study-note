# Celery：非同步任務佇列與 Broker 概念

> 從「Celery Worker 是幹嘛的」出發，釐清 Celery / RabbitMQ / Redis 三者的分工、
> Broker（訊息代理）的意義，以及生產者—消費者模式的由來。

## 目錄

- [Celery Worker 是什麼](#celery-worker-是什麼)
- [為什麼需要背景任務](#為什麼需要背景任務)
- [整體架構](#整體架構)
- [Celery、RabbitMQ、Redis 各自的角色](#celeryrabbitmqredis-各自的角色)
- [Celery 同時存在於 Broker 的前面和後面](#celery-同時存在於-broker-的前面和後面)
- [Broker 是什麼意思](#broker-是什麼意思)
- [為什麼叫生產者端和消費者端](#為什麼叫生產者端和消費者端)

---

## Celery Worker 是什麼

**Celery Worker 是實際「執行背景任務」的程序（process）**。

Celery 是 Python 生態常用的分散式任務佇列（task queue）系統，Worker 就是它的消費者端——不斷從佇列裡撈任務出來跑。

幾個重點：

- **Worker 是獨立於 Web server 的程序**，通常用 `celery -A myapp worker` 啟動。
  它和你的 app 共用同一份程式碼（才知道任務函式長什麼樣），但生命週期完全分開
- **水平擴展很容易**：任務量大就多開幾個 Worker，它們會自動從 broker 分工搶任務。
  在 K8s 上通常是一個獨立的 Deployment（web pod 和 worker pod 分開部署），可依佇列長度做 autoscaling
- **具備重試與容錯**：任務失敗可設定自動 retry；Worker 掛掉時未 ack 的任務會回到佇列，由其他 Worker 接手

> 一句話總結：Web app 負責「接單」，Broker 是「單據夾」，Celery Worker 就是廚房裡實際做菜的人。

## 為什麼需要背景任務

Web 應用的 request/response 週期要求快速回應，但有些工作很慢、或不需要即時完成：

- 寄 Email、發推播通知
- 圖片／影片轉檔、產生報表
- 呼叫慢速的第三方 API
- 定時排程任務（搭配 Celery Beat）

如果這些事在 request 裡同步做，使用者就得傻等，server 的連線也會被佔住。
所以做法是：**API 收到請求後，只把「任務」丟進佇列就立刻回應，真正的苦工交給背景的 Worker 慢慢處理。**

## 整體架構

```
┌─ 你的 App（如 Django）─┐         ┌──── Broker ────┐         ┌── Worker 程序 ──┐
│                        │         │                │         │                  │
│  Celery 客戶端程式碼    │ ──推送──▶│ Redis/RabbitMQ │──領取──▶ │  Celery Worker   │
│  send_email.delay(...)  │         │  （排隊的訊息） │         │  真正執行函式     │
└────────────────────────┘         └────────────────┘         └──────────────────┘
        Celery（生產者端）                中間人                  Celery（消費者端）
                                                                        │
                                                                        ▼
                                                          Result Backend（選用，常用 Redis）
                                                          存任務執行結果／狀態
```

完整流程：

1. **發佈任務**：在 Django/FastAPI 裡呼叫 `send_email.delay(user_id)`——這是 Celery 的「客戶端」程式碼。
   它把任務打包成一則訊息（任務名稱 + 參數，序列化成 JSON），**塞進 broker 就結束了**，API 馬上可以回應使用者
2. **暫存任務**：訊息在 Redis/RabbitMQ 裡排隊等著
3. **執行任務**：另一邊獨立跑著的 Celery Worker 不斷向 broker 領訊息，領到後查出對應的 Python 函式、真正執行

**為什麼要隔著一個 broker？** 因為 app 和 worker 是不同的程序、可能在不同機器上，
它們不直接講話，需要一個雙方都連得到的地方交換訊息——
這樣 app 發完單就能走人，worker 掛了訊息也還在隊伍裡。

## Celery、RabbitMQ、Redis 各自的角色

**Celery 是「任務系統的框架」，Redis 和 RabbitMQ 是它底下可以選用的「訊息傳遞基礎設施（Broker）」。**

### Celery — 任務佇列框架（應用層）

一個 Python 函式庫／框架，負責整個「非同步任務」的邏輯：

- 定義任務（`@app.task` 裝飾的函式）
- 發布任務（`send_email.delay(...)`）
- Worker 執行、重試、超時、排程（Beat）、結果追蹤

但 Celery **自己不會傳遞訊息**——它需要一個中間人來存放和轉發任務訊息，這個中間人就是 Broker。

### RabbitMQ — 專職的訊息佇列（Message Broker）

一套獨立的訊息佇列伺服器，實作 AMQP 協定，生來就是為了「可靠地傳遞訊息」：

- 訊息可持久化到磁碟，伺服器重啟不丟單
- 完整的 ack 機制：Worker 沒確認完成，訊息會重新派發
- 支援複雜路由（exchange、routing key、fanout 廣播等）

適合任務「一筆都不能丟」的場景，例如金流、訂單處理。是 Celery 官方最推薦的 broker。

### Redis — 記憶體資料庫（兼職當 Broker）

Redis 本體是 in-memory key-value 資料庫，最常見的用途其實是**快取（cache）**、session 儲存、排行榜、分散式鎖等。
因為它有 list 和 pub/sub 功能，所以也「可以」拿來當 Celery 的 broker：

- **優點**：部署簡單、速度快；專案通常本來就有 Redis（拿來做快取），一機兩用
- **缺點**：訊息可靠性不如 RabbitMQ——預設資料在記憶體，極端情況（斷電、故障轉移）可能丟任務

另外 Redis 也常被拿來當 Celery 的 **Result Backend**（存任務執行結果），這和 broker 是兩個不同的角色。

### 三者比較

| | 本質 | 在這套架構的角色 |
|---|---|---|
| Celery | Python 任務框架 | 定義、派發、執行任務的整套邏輯 |
| RabbitMQ | 訊息佇列伺服器 | Broker：可靠地暫存與轉發任務訊息 |
| Redis | 記憶體資料庫 | 可兼任 Broker（輕量場景）和 Result Backend；本業是快取 |

**選擇上的經驗法則**：
任務丟了會出事、流量大且路由複雜 → RabbitMQ；
一般網站的寄信、報表這類「丟了大不了重跑」的任務，且系統已有 Redis → 直接用 Redis 最省事。

## Celery 同時存在於 Broker 的前面和後面

常見疑問：「發佈任務不是 Celery 負責嗎？怎麼流程圖裡 Celery Worker 在 broker 後面？」

關鍵：**Celery 是一個函式庫，不是單一一個服務**，它同時出現在兩個地方——

- 裝在 app 裡（呼叫 `.delay()`）→ 扮演**生產者**，在 broker 前面
- 用 `celery worker` 指令啟動 → 扮演**消費者**，在 broker 後面

同一套 Celery 函式庫，放在不同位置就扮演不同角色。
「Celery Worker 在 broker 後面」指的只是消費端；發佈那一段（也是 Celery）在 broker 前面。

## Broker 是什麼意思

Broker 原意是「**中間人、仲介、掮客**」——像房屋仲介（real estate broker）、股票經紀人（stockbroker）那種撮合兩方的角色。

在這個情境叫 **message broker，中文通常翻「訊息代理」或「訊息中介」**：
生產者不直接把訊息交給消費者，而是交給這個中間人，由它負責保管、排隊、轉發。

好處是兩邊**解耦**——發訊息的人不需要知道誰來處理、對方現在忙不忙、甚至活著沒有。

## 為什麼叫生產者端和消費者端

這是計算機科學的經典術語——「**生產者—消費者模式（Producer-Consumer Pattern）**」，
借用了經濟學裡工廠生產、顧客消費的比喻。

### 這個比喻在說什麼

```
生產者（Producer）──把東西放上──▶ 輸送帶/倉庫（Queue）──▶ 消費者（Consumer）拿走使用
```

- **生產者**：「製造」出待處理項目的一方。app 每呼叫一次 `.delay()`，就是「生產」了一則任務訊息，放進佇列
- **消費者**：把項目「拿走並用掉」的一方。Worker 從佇列取出訊息、執行完，這則訊息就從佇列消失了——被「消費」掉了

「消費」這個詞很精準：訊息跟商品一樣是**一次性的**——
一則訊息被某個 worker 拿走處理完就沒了，不會有兩個 worker 重複吃到同一筆（這正是佇列要保證的事）。

### 為什麼不直接叫「發送方／接收方」

因為這個模式的重點不只是傳遞，而是中間**有個緩衝區（buffer/queue）把兩邊隔開**，帶來兩個關鍵性質：

1. **兩邊速度可以不一樣**：生產者可能瞬間湧入 1000 筆任務（例如活動開跑大家都在下單），
   消費者慢慢消化就好，佇列就像倉庫暫存庫存；反過來消費者閒著時就等待新貨
2. **兩邊互相不認識**：工廠不需要知道最後是誰買了商品；app 發完任務也不管是哪台機器上的哪個 worker 來做。
   要加產能就多開幾個消費者，生產者程式碼一行都不用改

這個術語最早來自 1960 年代 Dijkstra 提出的「生產者—消費者問題」（bounded-buffer problem），
原本是討論多執行緒之間如何安全地共享一個緩衝區。
後來整套訊息佇列系統（RabbitMQ、Kafka 等）都沿用這組詞，官方文件裡就直接寫 `producer` / `consumer`。

### 對應回 Celery

| 角色 | 在 Celery 架構中 | 做的事 |
|---|---|---|
| Producer | 你的 app（呼叫 `.delay()` 的 Celery 客戶端） | 產生任務訊息，放進 broker |
| Queue/Buffer | Broker（Redis/RabbitMQ） | 暫存、排隊 |
| Consumer | Celery Worker | 取出訊息、執行、消化掉 |
