# 實戰練習計畫：從零打造一個 Mini FinOps API Server

> 目標：建一個「個人記帳 API」，每個步驟都對應 LumiTure-BE 實際使用的技術與 pattern。
> 做完這個練習，你回頭看 repo 的每一行程式碼都會有感覺。

---

## 目錄

- [練習專案概述](#練習專案概述)
- [你需要準備的東西](#你需要準備的東西)
- [Step 0：專案初始化](#step-0專案初始化)
- [Step 1：Django Model + Migration](#step-1django-model--migration)
- [Step 2：Django Admin](#step-2django-admin)
- [Step 3：DRF Serializer + ViewSet](#step-3drf-serializer--viewset)
- [Step 4：統一回傳格式 + 錯誤碼](#step-4統一回傳格式--錯誤碼)
- [Step 5：認證 — JWT](#step-5認證--jwt)
- [Step 6：權限 — Object-level Permission](#step-6權限--object-level-permission)
- [Step 7：Service 層重構](#step-7service-層重構)
- [Step 8：Celery 非同步任務](#step-8celery-非同步任務)
- [Step 9：Redis 快取](#step-9redis-快取)
- [Step 10：測試](#step-10測試)
- [Step 11：Docker 化](#step-11docker-化)
- [Step 12：OpenAPI 文件](#step-12openapi-文件)
- [Step 13：GCP BigQuery 整合（選修）](#step-13gcp-bigquery-整合選修)
- [Step 14：WebSocket 即時通知（選修）](#step-14websocket-即時通知選修)
- [做完之後：回到 LumiTure-BE 的銜接指南](#做完之後回到-lumiture-be-的銜接指南)

---

## 練習專案概述

**專案名稱：** `mini-finops`

**情境：** 一個多租戶的個人/團隊記帳 API，支援：
- 使用者註冊、登入（JWT）
- 建立組織（Organization），邀請成員
- 記錄支出（Expense），分類、標籤
- 月度預算（Budget），超支提醒
- 支出報表匯出（非同步任務）

**為什麼選這個？** 因為它和 LumiTure-BE 的核心 domain 幾乎一模一樣 — 多租戶、預算、支出追蹤、非同步任務 — 但規模小到你一個人能做完。

---

## 你需要準備的東西

### 免費 / 本機

| 項目 | 說明 |
|------|------|
| **Python 3.12** | `brew install python@3.12` |
| **Poetry** | `pip install poetry` |
| **Docker Desktop** | [下載](https://www.docker.com/products/docker-desktop/) |
| **PostgreSQL client** | `brew install libpq` 或 `brew install pgcli`（推薦） |
| **Postman 或 Insomnia** | 測 API 用，你可能已經有了 |

### 需要公司資源（選修步驟才需要）

| 項目 | 用途 | 預估費用 |
|------|------|----------|
| **GCP 專案** | Step 13 BigQuery 練習 | BigQuery 每月前 1TB 查詢免費，幾乎不花錢 |
| **GCP Service Account JSON** | 認證用 | 免費 |
| **SendGrid 帳號** | Step 8 寄信練習 | Free tier 100 封/天 |

> 除了 Step 13 和寄信功能，其他所有步驟都是 100% 免費、本機完成。

---

## Step 0：專案初始化

**對應學習：** Day 1 + Day 6（Poetry、Docker）

```bash
# 建立專案
mkdir mini-finops && cd mini-finops
poetry init --python "^3.12"

# 安裝核心依賴
poetry add django djangorestframework psycopg2-binary

# 建立 Django 專案
poetry run django-admin startproject configs .

# 建立第一個 app
poetry run python manage.py startapp user
poetry run python manage.py startapp expense
poetry run python manage.py startapp budget
```

**專案結構目標（模仿 LumiTure-BE）：**

```
mini-finops/
├── configs/          # 對應 src/configs/
│   ├── settings.py
│   ├── urls.py
│   ├── responses.py  # Step 4 加
│   ├── enums.py      # Step 4 加
│   └── celery.py     # Step 8 加
├── apps/
│   ├── user/
│   ├── expense/
│   ├── budget/
│   └── common/       # Step 9 加
├── tests/
│   └── factories/
├── scripts/
│   └── entrypoint.sh # Step 11 加
├── docker-compose.yaml
├── Dockerfile
└── pyproject.toml
```

### 練習重點
- 理解 `pyproject.toml` 和 `poetry.lock` 的關係（= `package.json` + `pnpm-lock.yaml`）
- 理解 `manage.py` 是什麼（= 後端的 CLI 進入點）
- 在 `settings.py` 中設定 PostgreSQL 連線（先用 SQLite 也行，之後 Step 11 換）

---

## Step 1：Django Model + Migration

**對應學習：** Day 1

**要建的 Model：**

```python
# apps/user/models.py
class Organization(TimeStampedModel):
    name = models.CharField(max_length=100)
    fiscal_year_start = models.IntegerField(default=1)  # 1-12

class User(AbstractUser):
    email = models.EmailField(unique=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)
    role = models.CharField(choices=[('OWNER', 'Owner'), ('MEMBER', 'Member')])

# apps/expense/models.py
class Category(TimeStampedModel):
    name = models.CharField(max_length=50)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

class Expense(TimeStampedModel, SoftDeletableModel):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='TWD')
    description = models.TextField(blank=True)
    date = models.DateField()

# apps/budget/models.py
class Budget(TimeStampedModel):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.IntegerField()  # 1-12
    year = models.IntegerField()
```

### 練習重點
- 安裝 `django-model-utils`，使用 `TimeStampedModel` 和 `SoftDeletableModel`（和 repo 一樣）
- 跑 `python manage.py makemigrations` + `migrate`
- 用 `python manage.py shell` 進 Django Shell，手動 CRUD 幾筆資料
- 試試 `QuerySet`：`filter()`、`exclude()`、`annotate()`、`aggregate()`
- 理解 `ForeignKey` 的 `on_delete` 選項
- 試試 `select_related()` 和 `prefetch_related()`（面對 N+1 問題的解法）

### 和 LumiTure-BE 的對應
| 你建的 | Repo 中的 |
|--------|-----------|
| `Organization` | `apps/user/models.py` → `Organization` |
| `User` | `apps/user/models.py` → `User`（自訂 AUTH_USER_MODEL） |
| `Expense` | 類似 `DashboardSummaryHistory` |
| `Budget` | `apps/budget/models.py` → `Budget` |

---

## Step 2：Django Admin

**對應學習：** Day 1

```python
# apps/expense/admin.py
@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['date', 'amount', 'currency', 'category', 'created_by']
    list_filter = ['category', 'currency', 'date']
    search_fields = ['description']
    date_hierarchy = 'date'
```

### 練習重點
- 建一個 superuser：`python manage.py createsuperuser`
- 進 `/admin/` 用 UI 新增幾筆資料
- 感受 Django Admin 的強大（前端要花好幾天做的 CRUD 後台，這裡幾行搞定）
- LumiTure-BE 用了 `django-jazzmin` 美化 Admin，你也可以裝來玩

---

## Step 3：DRF Serializer + ViewSet

**對應學習：** Day 2

```bash
poetry add djangorestframework drf-nested-routers djangorestframework-camel-case
```

**建立 Serializer（模仿 repo 的 Read/Create 分離）：**

```python
# apps/expense/serializers.py
class ExpenseReadSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = ['id', 'amount', 'currency', 'description', 'date', 'category', 'category_name']

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

class ExpenseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['amount', 'currency', 'description', 'date', 'category']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be positive.')
        return value
```

**建立 ViewSet（模仿 repo 的 @action pattern）：**

```python
# apps/expense/views.py
class ExpenseViewSet(ViewSet):

    @extend_schema(responses=ExpenseReadSerializer(many=True))
    def list(self, request):
        expenses = Expense.objects.filter(organization=request.user.organization)
        serializer = ExpenseReadSerializer(expenses, many=True)
        return Response(data=create_success_response_data(data=serializer.data))

    @extend_schema(request=ExpenseCreateSerializer)
    def create(self, request):
        serializer = ExpenseCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user, organization=request.user.organization)
        return Response(
            data=create_success_response_data(data=serializer.data, status_code=HTTP_201_CREATED),
            status=status.HTTP_201_CREATED,
        )

    @action(methods=['GET'], detail=False, url_path='monthly-summary')
    def monthly_summary(self, request):
        """自訂 endpoint — 月度支出摘要"""
        # ... aggregation logic ...
        pass
```

**設定路由（模仿 repo 的 nested router）：**

```python
# configs/urls.py
router = DefaultRouter(trailing_slash=False)
router.register('expenses', ExpenseViewSet, basename='expense')
router.register('budgets', BudgetViewSet, basename='budget')

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
]
```

### 練習重點
- 理解 `Serializer` = 驗證 + 序列化（像前端的 Zod schema + API response transformer 合體）
- 理解 `ViewSet` + `@action` = Controller method
- 用 Postman 打你的 API，確認 CRUD 都通
- 安裝 `djangorestframework-camel-case`，設定 `DEFAULT_RENDERER_CLASSES` 和 `DEFAULT_PARSER_CLASSES`
- 對照 repo 的 `apps/budget/views.py` 和 `apps/budget/serializers.py`，比較你寫的

---

## Step 4：統一回傳格式 + 錯誤碼

**對應學習：** Day 5

模仿 repo 的 `configs/responses.py` 和 `configs/enums.py`：

```python
# configs/enums.py
class HTTPSuccessCodeAndMessages(models.TextChoices):
    OK = 'OK', 'The request has succeeded.'
    CREATED = 'CREATED', 'The request resulted in a new resource.'

class HTTPErrorCodeAndMessages(models.TextChoices):
    BAD_REQUEST = 'BAD_REQUEST', 'The request was invalid.'
    NOT_FOUND = 'NOT_FOUND', 'The requested resource was not found.'

class ValidationErrorCodeAndMessages(models.TextChoices):
    INVALID_AMOUNT = 'INVALID_AMOUNT', 'Amount must be a positive number.'
    BUDGET_EXCEEDED = 'BUDGET_EXCEEDED', 'This expense exceeds the budget.'

# configs/responses.py
def create_success_response_data(status_code=200, data=None):
    return {'success': True, 'message': '...', 'data': data}

def create_error_response_data(status_code=500, error_code=None, error_detail=None):
    return {'success': False, 'message': '...', 'data': {'code': error_code, 'detail': error_detail}}
```

### 練習重點
- 理解 `TextChoices` 是 Django 的 Enum
- 所有 API 回傳格式統一 — 前端工程師一定懂這有多重要
- 對照 repo 的 `configs/responses.py` 和 `configs/enums.py`

---

## Step 5：認證 — JWT

**對應學習：** Day 3

```bash
poetry add djangorestframework-simplejwt
```

```python
# configs/settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=5),
}

# configs/urls.py — 加上 token endpoints
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns += [
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]
```

### 練習重點
- 用 Postman 先 `POST /api/token/` 拿 access + refresh token
- 在後續的 request header 帶 `Authorization: Bearer <token>`
- 嘗試不帶 token 打 API，確認會收到 401
- 理解 access token vs refresh token 的流程
- 對照 repo 的 `configs/authentications.py`，看它怎麼擴展 JWT（加上 PricingPlan 檢查）

---

## Step 6：權限 — Object-level Permission

**對應學習：** Day 3

```bash
poetry add django-guardian
```

```python
# apps/user/permissions.py
class IsOrganizationMember(permissions.BasePermission):
    """確認使用者屬於該組織"""
    def has_permission(self, request, view):
        return request.user.organization is not None

class IsExpenseOwnerOrOrgOwner(permissions.BasePermission):
    """只有支出建立者或組織 Owner 能修改"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user or request.user.role == 'OWNER'

# apps/expense/views.py
class ExpenseViewSet(ViewSet):
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    # ...
```

### 練習重點
- 理解 `has_permission()`（= 全域檢查）vs `has_object_permission()`（= 物件層級檢查）
- 建兩個使用者，一個 Owner 一個 Member，測試權限差異
- 安裝 `django-guardian`，試試 `assign_perm()` 和 `ObjectPermissionChecker`
- 對照 repo 的 `apps/user/permissions.py`，看 `ObjectPermissionAssigner` 和 `CRUD_PERMISSIONS`

---

## Step 7：Service 層重構

**對應學習：** Day 5

把商業邏輯從 ViewSet 搬到 Service：

```python
# apps/budget/services.py
from dataclasses import dataclass
from collections import defaultdict

@dataclass
class BudgetStatus:
    budget_amount: Decimal
    spent_amount: Decimal
    remaining: Decimal
    usage_percent: float
    is_over_budget: bool

class BudgetServices:

    def get_monthly_budget_status(self, organization_id: int, year: int, month: int) -> list[BudgetStatus]:
        budgets = Budget.objects.filter(
            organization_id=organization_id, year=year, month=month
        ).select_related('category')

        expenses = Expense.objects.filter(
            organization_id=organization_id,
            date__year=year,
            date__month=month,
        ).values('category_id').annotate(total=Sum('amount'))

        spent_by_category = {e['category_id']: e['total'] for e in expenses}

        results = []
        for budget in budgets:
            spent = spent_by_category.get(budget.category_id, Decimal('0'))
            results.append(BudgetStatus(
                budget_amount=budget.amount,
                spent_amount=spent,
                remaining=budget.amount - spent,
                usage_percent=float(spent / budget.amount * 100) if budget.amount else 0,
                is_over_budget=spent > budget.amount,
            ))
        return results

# apps/budget/views.py — 改用 Service
class BudgetViewSet(ViewSet):
    services = BudgetServices()

    @action(methods=['GET'], detail=False, url_path='status')
    def budget_status(self, request):
        results = self.services.get_monthly_budget_status(
            organization_id=request.user.organization_id,
            year=request.query_params.get('year'),
            month=request.query_params.get('month'),
        )
        # ...
```

### 練習重點
- **這是整個練習最重要的一步** — LumiTure-BE 的核心 pattern 就是 Service 層
- 理解 `@dataclass` 作為 structured return type（repo 大量使用）
- 理解 `defaultdict` 的用法（repo 的 service 裡很常見）
- View 只負責：驗證 → 呼叫 service → 回傳。商業邏輯全部在 Service
- 對照 repo 的 `apps/budget/services.py` 和 `apps/dashboard/services/`

---

## Step 8：Celery 非同步任務

**對應學習：** Day 4

```bash
poetry add celery[redis] redis
```

```python
# configs/celery.py（直接模仿 repo）
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configs.settings')
celery_app = Celery('mini-finops')
celery_app.config_from_object('django.conf:settings', namespace='CELERY')
celery_app.autodiscover_tasks()

# configs/settings.py
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'

# apps/budget/tasks.py（模仿 repo 的 task pattern）
import logging
from configs.celery import celery_app

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def check_budget_and_notify(self, organization_id: int, year: int, month: int):
    """檢查預算使用狀況，超支時發通知"""
    logger.info(f'Checking budget for org={organization_id}, {year}/{month}')

    services = BudgetServices()
    statuses = services.get_monthly_budget_status(organization_id, year, month)

    over_budget = [s for s in statuses if s.is_over_budget]
    if over_budget:
        # 發通知（先用 logger，之後可以接 SendGrid / Slack）
        logger.warning(f'Organization {organization_id} has {len(over_budget)} over-budget categories')

    return f'Checked {len(statuses)} budgets, {len(over_budget)} over budget'

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def generate_monthly_report(self, organization_id: int, year: int, month: int):
    """產生月報（模擬耗時任務）"""
    import time
    time.sleep(5)  # 模擬報表產生需要時間

    logger.info(f'Report generated for org={organization_id}, {year}/{month}')
    return f'Report ready'
```

**在 View 中觸發非同步任務：**

```python
# apps/expense/views.py
class ExpenseViewSet(ViewSet):

    def create(self, request):
        # ... 儲存 expense 之後 ...

        # 非同步檢查預算（不阻塞 response）
        check_budget_and_notify.delay(
            organization_id=request.user.organization_id,
            year=expense.date.year,
            month=expense.date.month,
        )

        return Response(...)
```

### 練習重點
- 啟動 Redis：`docker run -d -p 6379:6379 redis:6`
- 啟動 Worker：`celery -A configs worker -l info`
- 在 View 中用 `.delay()` 呼叫 task，觀察 Worker terminal 的輸出
- 理解 `bind=True` 讓你可以在 task 裡用 `self`（拿 task name、retry count）
- 理解 `max_retries` + `default_retry_delay` 的重試機制
- 對照 repo 的 `apps/user/tasks.py` 和 `configs/celery.py`

---

## Step 9：Redis 快取

**對應學習：** Day 4

```bash
poetry add django-redis orjson
```

```python
# configs/settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://localhost:6379/2',
    }
}

# apps/common/decorators.py（直接模仿 repo）
import orjson
from functools import wraps
from django.core.cache import cache as django_cache

A_DAY_SECONDS = 60 * 60 * 24

def cache(key: str, ex: int = A_DAY_SECONDS, force: bool = False):
    def inner(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            kargs = {k: v for k, v in zip(func.__code__.co_varnames, args)}
            cache_key = key.format(**kargs, **kwargs)
            cached_value = django_cache.get(cache_key)
            if not cached_value:
                value = func(*args, **kwargs)
                if value or force:
                    django_cache.set(cache_key, orjson.dumps(value), ex)
            else:
                value = orjson.loads(cached_value)
            return value
        return wrapper
    return inner

# 使用
class BudgetServices:

    @cache(key='budget_status:{organization_id}:{year}:{month}', ex=60 * 30)
    def get_monthly_budget_status(self, organization_id, year, month):
        # ... expensive query ...
        pass
```

### 練習重點
- 理解 cache decorator 的 key template：`budget_status:{org_id}:{year}:{month}`
- 用 `redis-cli` 或 `pgcli` 看快取裡的資料：`redis-cli KEYS *`
- 理解 cache invalidation（什麼時候要清快取？新增 expense 之後？）
- 用 `orjson` 做序列化（比標準 `json` 快很多，repo 也用這個）
- 對照 repo 的 `apps/common/decorators.py`

---

## Step 10：測試

**對應學習：** Day 3

```bash
poetry add --group dev pytest pytest-django factory-boy pytest-mock
```

```ini
# pyproject.toml
[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "configs.settings"
pythonpath = ["."]
```

**建立 Factory（模仿 repo）：**

```python
# tests/factories/user.py
import factory
from apps.user.models import User, Organization

class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Organization

    name = factory.Sequence(lambda n: f'Org {n}')

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.LazyAttribute(lambda o: f'{o.username}@test.com')
    username = factory.Sequence(lambda n: f'user{n}')
    organization = factory.SubFactory(OrganizationFactory)
    role = 'MEMBER'
```

**寫測試（模仿 repo 的 class-based pattern）：**

```python
# tests/budget/test_services.py
import pytest
from unittest.mock import Mock
from apps.budget.services import BudgetServices
from tests.factories.user import OrganizationFactory

@pytest.mark.django_db
class TestBudgetServices:

    @pytest.fixture(autouse=True)
    def setup(self):
        self.org = OrganizationFactory()
        self.services = BudgetServices()

    def test_get_monthly_budget_status_no_budgets(self):
        result = self.services.get_monthly_budget_status(
            organization_id=self.org.id, year=2026, month=4,
        )
        assert result == []

    def test_get_monthly_budget_status_under_budget(self):
        # 建立 budget + expense，驗證 is_over_budget == False
        pass

    def test_get_monthly_budget_status_over_budget(self):
        # 建立 budget + 超支的 expense，驗證 is_over_budget == True
        pass
```

### 練習重點
- 跑測試：`pytest -v`
- 理解 `@pytest.mark.django_db` 讓測試可以存取資料庫
- 理解 `@pytest.fixture(autouse=True)` 類似 `beforeEach`
- 理解 `factory.SubFactory` 自動建立關聯資料（像 MSW 但更強）
- 用 `mocker.patch()` mock 外部依賴（如 SendGrid、Redis）
- 對照 repo 的 `tests/` 目錄結構和 `tests/factories/`

---

## Step 11：Docker 化

**對應學習：** Day 6

**docker-compose.yaml（模仿 repo 結構）：**

```yaml
x-dev: &dev
  tty: true
  stdin_open: true

services:
  api: &api
    <<: *dev
    build: .
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    env_file: .env
    command: python manage.py runserver 0:8000

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: mini_finops
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6
    ports:
      - "6379:6379"

  worker:
    <<: *api
    ports: []
    command: celery -A configs worker -l info -Q default-queue

volumes:
  postgres_data:
```

**Dockerfile（模仿 repo 的 multi-stage）：**

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN pip install poetry
COPY pyproject.toml poetry.lock ./
RUN poetry config virtualenvs.create false && poetry install --no-root

COPY . .
```

### 練習重點
- `docker-compose up` 一鍵啟動所有服務
- 理解 YAML anchors `&dev` / `*dev`（repo 用這招讓 worker 繼承 api 設定）
- 理解 `volumes` 讓你改本機程式碼不用重建 image
- 理解 `depends_on` 確保啟動順序
- 寫一個 `scripts/entrypoint.sh`：migrate → seed → 啟動 server
- 對照 repo 的 `docker-compose.yaml` 和 `src/build/Dockerfile`

---

## Step 12：OpenAPI 文件

**對應學習：** Day 2

```bash
poetry add drf-spectacular
```

```python
# configs/settings.py
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Mini FinOps API',
    'VERSION': '1.0.0',
}

# configs/urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns += [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
```

### 練習重點
- 打開 `/api/docs/` 看到你自己的 Swagger UI
- 用 `@extend_schema` 裝飾你的 ViewSet method，補充 parameters、responses
- 這就是前端串 API 時看的那個文件，現在你是寫文件的人了
- 對照 repo 的 Swagger 設定和 `@extend_schema` 用法

---

## Step 13：GCP BigQuery 整合（選修）

**對應學習：** 進階

> ⚠️ 需要公司的 GCP 專案權限和 Service Account。

```bash
poetry add google-cloud-bigquery pandas pandas-gbq
```

```python
# apps/expense/services.py
from google.cloud import bigquery

class ExpenseAnalyticsService:
    def __init__(self, bq_client: bigquery.Client = None):
        self.bq_client = bq_client or bigquery.Client()

    def get_expense_trends(self, organization_id: int, months: int = 6):
        query = """
        SELECT
            FORMAT_DATE('%Y-%m', date) AS month,
            SUM(amount) AS total,
            category
        FROM `{project}.{dataset}.expenses`
        WHERE organization_id = @org_id
        GROUP BY month, category
        ORDER BY month
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter('org_id', 'INT64', organization_id),
            ]
        )
        return self.bq_client.query(query, job_config=job_config).to_dataframe()
```

### 練習重點
- 理解 BigQuery 的 `project.dataset.table` 命名
- 理解 Parameterized Query（防 SQL injection）
- 理解 `bq_client` 作為 dependency injection（和 repo 的 `BudgetServices(bq_client)` 一樣）
- 用 `pandas` 處理查詢結果
- 對照 repo 的 `apps/dashboard/services/` 和 `apps/platforms/gcp/`

### GCP 設定步驟
1. 請後端同事幫你開一個 dev 用的 GCP Service Account
2. 下載 JSON key，設定 `GOOGLE_APPLICATION_CREDENTIALS` 環境變數
3. 在 BigQuery Console 建一個 test dataset
4. BigQuery 前 1TB/月查詢免費，練習幾乎不花錢

---

## Step 14：WebSocket 即時通知（選修）

**對應學習：** 進階

```bash
poetry add channels channels-redis
```

```python
# apps/common/consumers.py
import json
from channels.generic.websocket import AsyncJsonWebSocketConsumer

class BudgetAlertConsumer(AsyncJsonWebSocketConsumer):
    async def connect(self):
        self.org_id = self.scope['url_route']['kwargs']['org_id']
        self.group_name = f'budget_alerts_{self.org_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def budget_alert(self, event):
        await self.send_json(event['data'])
```

### 練習重點
- 理解 ASGI vs WSGI（同步 vs 非同步）
- 理解 Channel Layer（Redis-backed pub/sub）
- 在 Celery task 中透過 WebSocket 推播超支通知
- 對照 repo 的 `configs/asgi.py` 和 `apps/common/` 下的 consumer

---

## 做完之後：回到 LumiTure-BE 的銜接指南

恭喜你走到這裡。現在你已經親手建過一遍和 LumiTure-BE 幾乎一樣的技術棧。

### 回到 repo 的第一步

```bash
# 1. 把環境跑起來
cp .env.example .env   # 填入必要的環境變數（問後端同事拿）
docker-compose up

# 2. 打開 Swagger UI
open http://localhost:8000/api/docs/

# 3. 跑測試確認環境正常
docker-compose exec api pytest -v
```

### 你現在可以自信做的事

| 任務 | 你練過的對應 Step |
|------|-------------------|
| 新增一個 API field | Step 1 (Model) + Step 3 (Serializer) |
| 新增一個 API endpoint | Step 3 (ViewSet @action) |
| 修改商業邏輯 | Step 7 (Service 層) |
| 修 bug 後寫測試 | Step 10 (pytest + factory-boy) |
| 加一個背景任務 | Step 8 (Celery task) |
| 加快取 | Step 9 (Redis + cache decorator) |
| 看懂部署設定 | Step 11 (Docker) |
| 理解權限報錯 | Step 5 (JWT) + Step 6 (Permission) |

### 建議的第一個 PR

找一個小 bug 或小功能，例如：
- 修一個 Serializer 的驗證邏輯
- 幫某個 endpoint 補上 `@extend_schema`
- 幫某個 Service 方法寫一個缺失的測試

不要一開始就碰認證、權限、雲端整合這些核心模組。從邊緣開始，逐步往核心靠近。

### LumiTure-BE 特有的東西（練習沒涵蓋的）

| 主題 | 說明 | 建議 |
|------|------|------|
| **Multi-cloud（AWS/Azure/GCP）** | 三朵雲的 billing API 整合 | 遇到再讀，不用提前學 |
| **MCP Server** | Model Context Protocol，給 AI 用的 API | 比較新的概念，看 `apps/mcp_server/` |
| **django-simple-history** | 資料異動歷史追蹤 | 用到再查文件 |
| **django-money** | 貨幣欄位 | 很直覺，用到再學 |
| **OpenTelemetry** | 分散式追蹤 | 部署相關，初期不用管 |
| **Helm / K8s** | Kubernetes 部署 | DevOps 負責，了解概念即可 |
| **django-oauth-toolkit** | OAuth 2.0 Provider | 比 JWT 複雜很多，進階再學 |
