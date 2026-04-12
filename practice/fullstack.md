# 前端工程師的後端轉職指南 — LumiTure-BE

> 前提：你已經會 Python，這份文件聚焦在「從前端視角理解這個 Django 後端 repo」所需的一切。

---

## 目錄

- [需要掌握的技術棧](#需要掌握的技術棧)
- [一周學習計劃](#一周學習計劃)
- [前端 ↔ 後端 對照表](#前端--後端-對照表)
- [學習資源](#學習資源)

---

## 需要掌握的技術棧

### 核心框架

| 技術 | 用途 | 優先級 |
|------|------|--------|
| **Django 4.2** | Web 框架、ORM、Admin、Migrations | 🔴 必學 |
| **Django REST Framework (DRF)** | REST API：ViewSet、Serializer、Permission、Router | 🔴 必學 |
| **Celery + RabbitMQ** | 非同步任務佇列（寄信、資料同步等） | 🟡 重要 |
| **PostgreSQL** | 關聯式資料庫 | 🟡 重要 |
| **Redis** | 快取、WebSocket Channel Layer、Celery Result Backend | 🟡 重要 |

### API 設計與文件

| 技術 | 用途 |
|------|------|
| **drf-spectacular** | OpenAPI Schema 自動生成（類似 Swagger） |
| **drf-nested-routers** | 巢狀 URL 路由（`/groups/{id}/tier-two/`） |
| **djangorestframework-camel-case** | JSON 自動 snake_case ↔ camelCase |

### 認證與授權（這個 repo 特別複雜）

| 技術 | 用途 |
|------|------|
| **SimpleJWT** | JWT Token 認證 |
| **django-oauth-toolkit** | OAuth 2.0 Provider（給 MCP 用） |
| **django-guardian** | Object-level permission（每個物件各自的權限） |

### 資料與雲端

| 技術 | 用途 |
|------|------|
| **Google BigQuery** | 成本數據倉儲（pandas-gbq） |
| **GCP / AWS / Azure SDK** | 多雲整合 |
| **SendGrid** | 寄送 Email |
| **Slack SDK** | 錯誤通知 |

### 開發工具鏈

| 技術 | 用途 | 前端類比 |
|------|------|----------|
| **Poetry** | 套件管理 | npm / pnpm |
| **pytest + factory-boy** | 測試框架 + 測試資料工廠 | Jest + MSW |
| **Ruff** | Linter + Formatter | ESLint + Prettier |
| **pre-commit** | Git hook（commitizen conventional commits） | husky + lint-staged |
| **Docker + docker-compose** | 本機開發環境 | — |

### 部署與監控

| 技術 | 用途 |
|------|------|
| **Docker** | 容器化 |
| **Kubernetes + Helm** | 部署（多環境：dev / staging / prod） |
| **OpenTelemetry** | 分散式追蹤 |
| **Google Cloud Build** | CI/CD |

---

## 一周學習計劃

### Day 1：Django 基礎 + 本地環境

**目標：能跑起來、能看懂 Model**

- [ ] 讀 Django 官方 Tutorial Part 1-4（約 2-3 小時）
  - 重點：Model、Migration、ORM QuerySet、Admin
- [ ] 用 `docker-compose up` 把本地環境跑起來
- [ ] 讀 `src/configs/settings.py` — 了解 `INSTALLED_APPS`、DB 設定、Middleware
- [ ] 讀 2-3 個 Model 檔案，理解 `TimeStampedModel`、`SoftDeletableModel`、ForeignKey 關係
  - 推薦從 `src/apps/user/models.py` 開始

### Day 2：Django REST Framework

**目標：看懂 API 怎麼寫的**

- [ ] 讀 DRF 官方 Tutorial（約 2 小時）
  - 重點：**Serializer**（= 前端的 Zod/Yup）、**ViewSet**（= Controller）、**Router**（= Route 定義）
- [ ] 讀 `src/configs/urls.py` — 理解路由結構
- [ ] 選一個簡單的 ViewSet 完整追蹤（view → serializer → service → model）
  - 推薦 `src/apps/budget/views.py`
- [ ] 理解 `@extend_schema` 裝飾器（就是給 Swagger 文件用的）

### Day 3：認證、權限、測試

**目標：看懂 Permission 怎麼運作 + 能跑測試**

- [ ] 讀 `src/configs/authentications.py` — JWT 認證流程
- [ ] 讀 Permission 相關程式碼 — `IsAuthenticated`、`HasDefaultUserRoleGroup`
- [ ] 理解 django-guardian 的 object-level permission 概念
- [ ] 跑一次 `pytest`，看懂一個測試檔案的結構
  - 讀 `tests/` 下任一測試 + `tests/factories/` 的 Factory 定義

### Day 4：Celery 非同步任務 + Redis 快取

**目標：理解背景任務怎麼運作**

- [ ] 讀 Celery 基礎概念（10 分鐘就夠）：Task、Worker、Broker、Result Backend
- [ ] 讀 `src/configs/celery.py` — 了解佇列設定
- [ ] 讀 `src/apps/user/tasks.py` — 看實際的 Celery Task 範例
- [ ] 理解 `@shared_task`、retry、`handle_task_failure_notification` 裝飾器
- [ ] 讀 `src/apps/common/decorators.py` — 了解 `@cache` 裝飾器

### Day 5：專案架構深入 + Service 層

**目標：掌握程式碼分層邏輯**

- [ ] 完整追蹤一個 API 從進來到回傳的完整路徑：
  ```
  URL → Router → ViewSet → Permission Check → Serializer (驗證)
  → Service (商業邏輯) → Model/BigQuery → Response
  ```
- [ ] 讀 `src/apps/dashboard/services/` — 理解 Service 層的寫法
- [ ] 讀 `src/configs/responses.py` — 統一回傳格式
- [ ] 讀 `src/configs/enums.py` — 全域錯誤碼

### Day 6：Docker、部署、CI/CD

**目標：理解程式怎麼被部署的**

- [ ] 讀 `docker-compose.yaml` — 理解各服務（API、DB、Redis、RabbitMQ）
- [ ] 讀 `src/build/Dockerfile` — 理解建置流程
- [ ] 讀 `scripts/start.sh` — 啟動順序（migrate → seed → uvicorn）
- [ ] 粗略看 `k8s/` Helm chart 結構（不用深入）
- [ ] 讀 `.github/workflows/unit-test.yml` — CI 怎麼跑

### Day 7：實戰練習

**目標：動手改東西**

- [ ] 嘗試為一個現有 Model 新增一個欄位 + Migration
- [ ] 嘗試新增一個簡單的 API endpoint（新的 `@action`）
- [ ] 為你新增的功能寫一個測試
- [ ] 跑 `ruff check` 和 `ruff format` 確保 code style 通過
- [ ] 用 `git commit` 觸發 pre-commit hook，熟悉 commitizen conventional commit 格式

---

## 前端 ↔ 後端 對照表

| 前端概念 | 後端對應 | 說明 |
|----------|----------|------|
| React Component | Django ViewSet | 處理「一個資源」的所有操作 |
| Zod / Yup Schema | DRF Serializer | 輸入驗證 + 輸出格式化 |
| Next.js Route | DRF Router + `urls.py` | URL → handler 的對應 |
| Next.js Middleware | Django Middleware | 請求/回應的攔截層 |
| Redux / Zustand Store | Django ORM + Database | 狀態持久化 |
| React Query / SWR | Django Cache + Redis | 資料快取 |
| npm / pnpm | Poetry | 套件管理 |
| `package.json` | `pyproject.toml` | 專案設定 + 依賴宣告 |
| ESLint + Prettier | Ruff | Lint + Format |
| husky + lint-staged | pre-commit | Git hook |
| Jest / Vitest | pytest | 測試框架 |
| MSW (mock service worker) | factory-boy | 測試資料生成 |
| `.env.local` | `.env` | 環境變數 |
| `fetch` / `axios` | — | **你現在是被 call 的那端** |

> 最後一行是最關鍵的心態轉換 — 身為前端你習慣「發 request」，現在你要學會「收 request 並回 response」。

---

## 學習資源

### Django 基礎

| 資源 | 類型 | 說明 |
|------|------|------|
| [Django 官方 Tutorial](https://docs.djangoproject.com/en/4.2/intro/tutorial01/) | 文件 | Part 1-4 必讀，約 3 小時搞定 |
| [Django for Beginners](https://djangoforbeginners.com/) | 書 | William Vincent 的書，適合快速入門 |
| [Django ORM Cookbook](https://books.agiliq.com/projects/django-orm-cookbook/en/latest/) | 文件 | QuerySet 的常見用法速查，遇到 ORM 問題來翻 |
| [Classy Class-Based Views](https://ccbv.co.uk/) | 工具 | Django CBV 的繼承結構速查，看不懂 View 來這查 |

### Django REST Framework

| 資源 | 類型 | 說明 |
|------|------|------|
| [DRF 官方 Tutorial](https://www.django-rest-framework.org/tutorial/quickstart/) | 文件 | 必讀，1-2 小時可以走完 |
| [DRF 官方 API Guide](https://www.django-rest-framework.org/api-guide/serializers/) | 文件 | Serializer / ViewSet / Permission 三個章節重點讀 |
| [Classy DRF](https://www.cdrf.co/) | 工具 | DRF ViewSet / Mixin 的繼承結構速查 |
| [Coding for Entrepreneurs - DRF](https://www.youtube.com/playlist?list=PLEsfXFp6DpzTOcOVdZF-th7BS_GYGguAS) | 影片 | YouTube 免費系列，適合看程式碼跑起來的樣子 |

### Celery & 非同步任務

| 資源 | 類型 | 說明 |
|------|------|------|
| [Celery 官方 First Steps](https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html) | 文件 | 只要讀 First Steps 就夠上手 |
| [Real Python - Celery + Django](https://realpython.com/asynchronous-tasks-with-django-and-celery/) | 教學 | 完整範例，帶你從零建一個 async task |

### PostgreSQL & 資料庫

| 資源 | 類型 | 說明 |
|------|------|------|
| [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) | 文件 | SQL 基礎速查，如果 SQL 不熟從這裡開始 |
| [Django ORM vs Raw SQL](https://docs.djangoproject.com/en/4.2/topics/db/sql/) | 文件 | 了解 ORM 產生的 SQL 長什麼樣 |
| [pgcli](https://www.pgcli.com/) | 工具 | 帶自動補全的 PostgreSQL CLI，比 psql 好用 |

### 測試

| 資源 | 類型 | 說明 |
|------|------|------|
| [pytest 官方文件](https://docs.pytest.org/en/stable/getting-started.html) | 文件 | Getting Started 看完就夠 |
| [factory-boy 文件](https://factoryboy.readthedocs.io/en/stable/) | 文件 | 重點看 Factory、SubFactory、LazyAttribute |
| [Real Python - Testing in Django](https://realpython.com/testing-in-django-part-1-best-practices-and-examples/) | 教學 | Django 測試最佳實踐 |

### Docker & 部署

| 資源 | 類型 | 說明 |
|------|------|------|
| [Docker 官方 Get Started](https://docs.docker.com/get-started/) | 文件 | 30 分鐘速覽，理解 Image / Container / Volume |
| [docker-compose 官方文件](https://docs.docker.com/compose/gettingstarted/) | 文件 | 理解 services、ports、volumes、depends_on |
| [Kubernetes 官方概念](https://kubernetes.io/docs/concepts/overview/) | 文件 | 先看 Pod / Service / Deployment 三個概念就好 |
| [Helm 官方 Getting Started](https://helm.sh/docs/intro/quickstart/) | 文件 | 了解 Chart / Values / Template 即可 |

### Poetry (套件管理)

| 資源 | 類型 | 說明 |
|------|------|------|
| [Poetry 官方文件](https://python-poetry.org/docs/basic-usage/) | 文件 | 會 `poetry add`、`poetry install`、`poetry shell` 就夠 |

### 認證與安全

| 資源 | 類型 | 說明 |
|------|------|------|
| [SimpleJWT 文件](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/) | 文件 | 了解 Access / Refresh Token 流程 |
| [django-guardian 文件](https://django-guardian.readthedocs.io/en/stable/) | 文件 | Object-level permission 概念，重點看 `assign_perm` / `check_perm` |
| [OAuth 2.0 Simplified](https://aaronparecki.com/oauth-2-simplified/) | 文章 | 最好的 OAuth 2.0 入門解釋 |

### 推薦的速查 Cheatsheet

| 資源 | 說明 |
|------|------|
| [Django Cheatsheet (GitHub)](https://github.com/lucrae/django-cheat-sheet) | Django 常用語法速查 |
| [DRF Cheatsheet](https://djangocentral.com/django-rest-framework-cheat-sheet/) | DRF ViewSet / Serializer 速查 |
| [HTTP Status Codes](https://httpstatuses.io/) | HTTP 狀態碼速查（寫 API 必備） |

### 進階（有餘力再看）

| 資源 | 類型 | 說明 |
|------|------|------|
| [Two Scoops of Django](https://www.feldroy.com/books/two-scoops-of-django-3-x) | 書 | Django 最佳實踐聖經 |
| [Django Channels 文件](https://channels.readthedocs.io/en/stable/) | 文件 | WebSocket 相關，這個 repo 有用到 |
| [OpenTelemetry Python 文件](https://opentelemetry.io/docs/languages/python/) | 文件 | 分散式追蹤，了解概念即可 |
| [TestDriven.io - Django + Celery](https://testdriven.io/courses/django-celery/) | 課程 | 付費但品質很好的 Celery 深入教學 |
