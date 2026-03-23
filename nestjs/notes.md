# NestJS 官方教學筆記

> 整理自 [NestJS 官方文件](https://docs.nestjs.com/)，共 3 大分類、23 篇文章。

## 目錄

- [Introduction](#introduction)
- [Overview](#overview)
- [Fundamentals](#fundamentals)

---

## Introduction

### Introduction
> 原文連結：https://docs.nestjs.com/

**Nest (NestJS)** 是一個用於建構高效、可擴展的 **Node.js** 伺服器端應用程式的框架。它使用漸進式 JavaScript，完整支援 **TypeScript**（同時也允許使用純 JavaScript），並結合了 **OOP**（物件導向程式設計）、**FP**（函數式程式設計）與 **FRP**（函數式響應式程式設計）的設計元素。

#### 底層架構

Nest 底層預設使用 **Express** 作為 HTTP Server 框架，也可選擇配置為 **Fastify**。Nest 在這些框架之上提供了一層**抽象層**，但同時也將底層框架的 API 直接暴露給開發者，讓開發者可以自由使用底層平台的大量第三方模組。

#### 設計哲學

在 Node.js 生態系中，雖然有許多優秀的程式庫與工具，但沒有一個能有效解決**架構（Architecture）**的核心問題。Nest 提供了一套**開箱即用的應用程式架構**，讓開發者與團隊能夠建立具有以下特性的應用程式：

- **高度可測試性（Testable）**
- **可擴展性（Scalable）**
- **低耦合（Loosely Coupled）**
- **易於維護（Easily Maintainable）**

此架構的設計深受 **Angular** 啟發。

#### 安裝方式

**方式一：使用 Nest CLI（建議初學者使用）**

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

> 若需要更嚴格的 TypeScript 設定，可加上 `--strict` 參數：`nest new --strict project-name`

**方式二：使用 Git Clone Starter Project**

```bash
$ git clone https://github.com/nestjs/typescript-starter.git project
$ cd project
$ npm install
$ npm run start
```

啟動後開啟瀏覽器前往 `http://localhost:3000/` 即可。若需要 JavaScript 版本，將上述指令中的 `typescript-starter.git` 替換為 `javascript-starter.git`。

**方式三：從零開始手動建立**

自行建立專案樣板檔案，最少需要安裝以下依賴套件：

- `@nestjs/core`
- `@nestjs/common`
- `rxjs`
- `reflect-metadata`

---

## Overview

### First Steps
> 原文連結：https://docs.nestjs.com/first-steps

NestJS 是一個用於構建高效、可擴展的 Node.js 伺服端應用程式的框架。以下是啟動一個 Nest 專案的核心步驟與概念。

**語言與前置條件：**
- 支援 **TypeScript** 及純 **JavaScript**（需搭配 Babel）
- 需安裝 **Node.js >= 20**

**建立專案：**

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

> 加上 `--strict` 旗標可啟用 TypeScript 嚴格模式。

**專案核心檔案結構：**

| 檔案 | 說明 |
| --- | --- |
| `app.controller.ts` | 包含單一路由的基本 Controller |
| `app.controller.spec.ts` | Controller 的單元測試 |
| `app.module.ts` | 應用程式的根 Module |
| `app.service.ts` | 包含單一方法的基本 Service |
| `main.ts` | 應用程式入口，使用 `NestFactory` 建立應用實例 |

**應用程式入口 (`main.ts`)：**

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

`NestFactory.create()` 回傳一個實作 `INestApplication` 介面的物件。若建立過程發生錯誤，預設會以 code `1` 結束程式；設定 `abortOnError: false` 可改為拋出例外。

**平台選擇：**

NestJS 是**平台無關**的框架，內建支援兩個 HTTP 平台：

| 平台 | 說明 |
| --- | --- |
| `platform-express` | 預設使用，社群資源豐富、成熟穩定 |
| `platform-fastify` | 高效能、低開銷，注重最大吞吐量 |

可透過泛型指定平台類型以存取平台專屬 API：

```typescript
const app = await NestFactory.create<NestExpressApplication>(AppModule);
```

**啟動應用程式：**

```bash
$ npm run start        # 正式啟動
$ npm run start:dev    # 開發模式（自動監聽檔案變更）
```

> 使用 SWC builder（`npm run start -- -b swc`）可加速編譯約 20 倍。

---

### Controllers
> 原文連結：https://docs.nestjs.com/controllers

Controller 負責處理傳入的 **Request** 並回傳 **Response**。**Routing** 機制決定哪個 Controller 處理哪個請求。

**基本 Controller 與路由：**

使用 `@Controller()` Decorator 定義 Controller，可指定路由前綴來群組相關路由：

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

- 路由路徑 = Controller 前綴 + 方法 Decorator 路徑。例如 `@Controller('cats')` + `@Get('breed')` = `GET /cats/breed`
- 可用 CLI 快速建立：`nest g controller [name]`

**兩種回應處理方式：**

| 方式 | 說明 |
| --- | --- |
| **Standard（推薦）** | 回傳物件/陣列自動序列化為 JSON；回傳原始型別直接發送。預設狀態碼 GET=200, POST=201 |
| **Library-specific** | 注入 `@Res()` 使用平台原生 response 物件（如 `res.status(200).json([])`）。使用此方式會停用 Standard 模式 |

> 若同時需要存取 response 物件又想保留 Standard 模式，可使用 `@Res({ passthrough: true })`。

**Request 物件與常用 Decorator：**

| Decorator | 對應值 |
| --- | --- |
| `@Req()` | `req` |
| `@Body(key?)` | `req.body` / `req.body[key]` |
| `@Query(key?)` | `req.query` / `req.query[key]` |
| `@Param(key?)` | `req.params` / `req.params[key]` |
| `@Headers(name?)` | `req.headers` / `req.headers[name]` |
| `@Ip()` | `req.ip` |
| `@Session()` | `req.session` |

**HTTP 方法 Decorator：**
`@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`, `@Options()`, `@Head()`, `@All()`

**路由萬用字元：**

```typescript
@Get('abcd/*')
findAll() {
  return 'This route uses a wildcard';
}
```

匹配 `abcd/` 開頭的所有路徑。Express v5 需使用命名萬用字元如 `abcd/*splat`。

**狀態碼與標頭：**

```typescript
@Post()
@HttpCode(204)
@Header('Cache-Control', 'no-store')
create() {
  return 'This action adds a new cat';
}
```

**路由參數：**

```typescript
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}
```

> 帶參數的路由應宣告在靜態路由之後，避免攔截靜態路由的流量。

**DTO（Data Transfer Object）：**

建議使用 **class** 而非 interface 定義 DTO，因為 class 在編譯後仍保留為實體，Pipe 等功能需要在執行時期存取 metatype：

```typescript
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```

**非同步處理：**

Route handler 可回傳 `Promise` 或 RxJS `Observable`，Nest 會自動處理訂閱與解析。

**註冊 Controller：**

Controller 必須在 Module 的 `controllers` 陣列中註冊：

```typescript
@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

---

### Providers
> 原文連結：https://docs.nestjs.com/providers

Provider 是 Nest 的核心概念。Service、Repository、Factory、Helper 等都可以作為 Provider。Provider 的核心思想是可以被**注入（inject）**為依賴，由 Nest 的 IoC 容器管理物件之間的關係。

**Service 範例：**

```typescript
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

- `@Injectable()` Decorator 標記此 class 可被 Nest IoC 容器管理
- CLI 指令：`nest g service cats`

**依賴注入（Dependency Injection）：**

透過 **Constructor injection** 注入 Provider，搭配 TypeScript 的 `private` 簡寫同時宣告並初始化：

```typescript
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

Nest 根據型別自動解析依賴，建立（或回傳已存在的 singleton）實例並注入。

**Scope（作用域）：**

- 預設為 **singleton**，與應用程式生命週期一致
- 可設定為 **request-scoped**，每個請求建立新實例（適用於 per-request caching、多租戶等場景）

**Optional Provider：**

使用 `@Optional()` 標記非必要的依賴，當該 Provider 不存在時不會拋出錯誤：

```typescript
@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

**Property-based Injection：**

在特定情境下（如深層繼承鏈），可在屬性層級使用 `@Inject()`：

```typescript
@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```

> 若 class 不繼承其他 class，優先使用 **constructor-based injection**，可讀性較佳。

**註冊 Provider：**

在 Module 的 `providers` 陣列中註冊，Nest 即可解析依賴關係：

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

---

### Modules
> 原文連結：https://docs.nestjs.com/modules

Module 是以 `@Module()` Decorator 標註的 class，提供 Nest 組織應用程式結構的 metadata。每個應用程式至少有一個**根 Module（root module）**。

**`@Module()` 屬性：**

| 屬性 | 說明 |
| --- | --- |
| `providers` | 由 Nest Injector 實例化的 Provider，至少在此 Module 內可共享 |
| `controllers` | 此 Module 中需被實例化的 Controller |
| `imports` | 引入其他 Module 所匯出的 Provider |
| `exports` | 此 Module 提供的 Provider 子集，供其他 Module 引入使用 |

Module 預設會**封裝** Provider，只有明確匯出的 Provider 才能被外部使用。

**Feature Module：**

將相關的 Controller 和 Service 組織進同一個 Feature Module：

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

然後在根 Module 中引入：

```typescript
@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

**Shared Module：**

Module 預設為 **singleton**，可在多個 Module 間共享同一個 Provider 實例。需將 Provider 加入 `exports` 陣列：

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

任何引入 `CatsModule` 的 Module 都能存取同一個 `CatsService` 實例。

**Module Re-exporting：**

Module 可以重新匯出所引入的 Module：

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

**Global Module：**

使用 `@Global()` Decorator 使 Module 全域可用，無需在每個 Module 中重複引入：

```typescript
@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

> 不建議將所有 Module 都設為 Global，應優先使用 `imports` 明確管理依賴。

**Dynamic Module：**

可在執行時期根據參數動態配置 Module 的 Provider：

```typescript
@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```

使用方式：

```typescript
@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

Dynamic Module 回傳的屬性會**擴展**（而非覆蓋）`@Module()` 中定義的靜態 metadata。設定 `global: true` 可將 Dynamic Module 註冊為全域。

---

### Middleware
> 原文連結：https://docs.nestjs.com/middleware

Middleware 是在 **Route handler 之前**被呼叫的函式，可存取 `request`、`response` 物件及 `next()` 函式。等同於 Express middleware。

**Middleware 的功能：**
- 執行任意程式碼
- 修改 request 和 response 物件
- 結束 request-response 生命週期
- 呼叫下一個 Middleware
- 若未結束生命週期，**必須**呼叫 `next()`，否則請求會懸掛

**Class Middleware：**

使用 `@Injectable()` 並實作 `NestMiddleware` 介面：

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

支援**依賴注入**，可透過 constructor 注入同 Module 內的 Provider。

**套用 Middleware：**

在 Module 中實作 `NestModule` 介面，透過 `configure()` 方法設定：

```typescript
@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
  }
}
```

可限制特定 HTTP 方法：

```typescript
consumer
  .apply(LoggerMiddleware)
  .forRoutes({ path: 'cats', method: RequestMethod.GET });
```

**MiddlewareConsumer：**

- `forRoutes()` 可接受字串、`RouteInfo` 物件、Controller class
- `exclude()` 可排除特定路由

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/{*splat}',
  )
  .forRoutes(CatsController);
```

**Functional Middleware：**

當 Middleware 不需要依賴注入時，可簡化為函式：

```typescript
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

**多個 Middleware：**

在 `apply()` 中以逗號分隔：

```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

**Global Middleware：**

使用 `app.use()` 綁定到所有路由：

```typescript
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(process.env.PORT ?? 3000);
```

> Global middleware 無法存取 DI 容器，只能使用 Functional middleware。若需要 DI，可改用 class middleware 搭配 `.forRoutes('*')`。

---

### Exception Filters
> 原文連結：https://docs.nestjs.com/exception-filters

Nest 內建**例外處理層（exceptions layer）**，負責處理應用程式中所有未捕獲的例外。內建的 Global Exception Filter 處理 `HttpException` 及其子類；無法辨識的例外會回傳：

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

**拋出標準例外：**

```typescript
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

`HttpException` 建構子參數：
1. **response**：`string` 覆寫 message；`object` 覆寫整個 JSON body
2. **status**：HTTP 狀態碼，建議用 `HttpStatus` enum
3. **options**（optional）：可附加 `cause` 用於日誌記錄

**自訂例外：**

繼承 `HttpException` 建立自己的例外階層：

```typescript
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

**內建 HTTP 例外：**

`BadRequestException`, `UnauthorizedException`, `NotFoundException`, `ForbiddenException`, `ConflictException`, `GoneException`, `PayloadTooLargeException`, `UnprocessableEntityException`, `InternalServerErrorException`, `NotImplementedException`, `BadGatewayException`, `ServiceUnavailableException`, `GatewayTimeoutException` 等。

所有內建例外都支援 `cause` 和 `description` 選項：

```typescript
throw new BadRequestException('Something bad happened', {
  cause: new Error(),
  description: 'Some error description',
});
```

**自訂 Exception Filter：**

實作 `ExceptionFilter` 介面，使用 `@Catch()` 指定要攔截的例外類型：

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

**綁定 Filter 的三種範圍：**

```typescript
// Method-scoped
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) { ... }

// Controller-scoped
@Controller()
@UseFilters(new HttpExceptionFilter())
export class CatsController {}

// Global-scoped
app.useGlobalFilters(new HttpExceptionFilter());
```

> 傳入 class 而非 instance 可讓 Nest 管理實例化並啟用 DI，減少記憶體使用。

**Global Filter 搭配 DI：**

透過 `APP_FILTER` token 在 Module 中註冊：

```typescript
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

**捕獲所有例外：**

`@Catch()` 不帶參數即可捕獲所有例外類型。使用 `HttpAdapterHost` 可實現平台無關的回應：

```typescript
@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
```

---

### Pipes
> 原文連結：https://docs.nestjs.com/pipes

Pipe 是以 `@Injectable()` 標註、實作 `PipeTransform` 介面的 class，有兩大用途：

- **Transformation（轉換）**：將輸入資料轉為目標格式（如字串轉整數）
- **Validation（驗證）**：驗證輸入資料，有效則通過，無效則拋出例外

Pipe 在 **Route handler 被呼叫前**執行，接收即將傳入 handler 的參數。Pipe 拋出的例外會被 Exception Filter 捕獲，**不會**執行後續的 Controller 方法。

**內建 Pipe：**

`ValidationPipe`, `ParseIntPipe`, `ParseFloatPipe`, `ParseBoolPipe`, `ParseArrayPipe`, `ParseUUIDPipe`, `ParseEnumPipe`, `DefaultValuePipe`, `ParseFilePipe`, `ParseDatePipe`

**綁定 Pipe：**

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

若傳入無法解析的值（如 `GET /abc`），會回傳 400 錯誤。可傳入 instance 自訂行為：

```typescript
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

**自訂 Pipe：**

每個 Pipe 必須實作 `transform(value, metadata)` 方法：

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

`ArgumentMetadata` 包含：
- `type`：`'body' | 'query' | 'param' | 'custom'`
- `metatype`：參數的型別（如 `String`）；若使用 interface 則為 `Object`
- `data`：傳給 Decorator 的字串（如 `@Body('name')` 中的 `'name'`）

**Schema-based Validation（使用 Zod）：**

```typescript
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
```

**Class Validator 方式：**

安裝 `class-validator` 和 `class-transformer`，在 DTO 上加驗證 Decorator：

```typescript
import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

**Pipe 綁定範圍：**

```typescript
// Parameter-scoped
@Post()
async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) { ... }

// Global-scoped
app.useGlobalPipes(new ValidationPipe());

// Module 層級的 Global（支援 DI）
@Module({
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
```

**提供預設值：**

使用 `DefaultValuePipe` 處理缺失的 query 參數：

```typescript
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```

---

### Guards
> 原文連結：https://docs.nestjs.com/guards

Guard 是以 `@Injectable()` 標註、實作 `CanActivate` 介面的 class。Guard 的**唯一職責**是根據執行時期的條件（如權限、角色、ACL）決定請求是否被處理。

**Guard vs Middleware：**
- Middleware 不知道 `next()` 之後會執行哪個 handler
- Guard 可存取 `ExecutionContext`，知道接下來**確切**要執行什麼
- **執行順序：** Middleware -> Guard -> Interceptor -> Pipe -> Route Handler

**Authorization Guard 範例：**

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

`canActivate()` 回傳 `true` 則允許請求，回傳 `false` 則拒絕（拋出 `ForbiddenException`）。

**綁定 Guard：**

```typescript
// Controller-scoped
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}

// Global-scoped
app.useGlobalGuards(new RolesGuard());

// Module 層級的 Global（支援 DI）
@Module({
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
```

**基於角色的存取控制（RBAC）：**

1. 建立自訂 Decorator 設定 metadata：

```typescript
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();
```

2. 在 handler 上標註角色：

```typescript
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

3. 在 Guard 中讀取 metadata 並比對：

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}
```

---

### Interceptors
> 原文連結：https://docs.nestjs.com/interceptors

Interceptor 是以 `@Injectable()` 標註、實作 `NestInterceptor` 介面的 class，靈感來自 **AOP（Aspect Oriented Programming）**。

**Interceptor 的能力：**
- 在方法執行**前後**綁定額外邏輯
- **轉換**函式回傳的結果
- **轉換**函式拋出的例外
- 擴展基本函式行為
- 依據特定條件**完全覆寫**函式（如快取）

**核心概念：**

`intercept(context, next)` 方法接收兩個參數：
- `ExecutionContext`：與 Guard 相同
- `CallHandler`：提供 `handle()` 方法，回傳 RxJS `Observable`。若不呼叫 `handle()`，Route handler **不會**執行

**Logging Interceptor 範例：**

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```

**綁定 Interceptor：**

```typescript
// Controller-scoped
@UseInterceptors(LoggingInterceptor)
export class CatsController {}

// Global-scoped
app.useGlobalInterceptors(new LoggingInterceptor());

// Module 層級的 Global（支援 DI）
@Module({
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
})
export class AppModule {}
```

**Response Mapping（回應轉換）：**

使用 RxJS `map()` 統一包裝回應格式：

```typescript
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => ({ data })));
  }
}
```

**Exception Mapping（例外轉換）：**

使用 RxJS `catchError()` 覆寫例外：

```typescript
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => throwError(() => new BadGatewayException())),
      );
  }
}
```

**Stream Overriding（串流覆寫，用於快取）：**

```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);  // 直接回傳，不呼叫 handler
    }
    return next.handle();
  }
}
```

**Timeout 處理：**

```typescript
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
```

---

### Custom Decorators
> 原文連結：https://docs.nestjs.com/custom-decorators

NestJS 圍繞 **Decorator** 設計，開發者可建立自訂 Decorator 來增強程式碼可讀性與重複使用性。

**建立 Param Decorator：**

使用 `createParamDecorator()` 建立自訂參數 Decorator，從 request 中提取資料：

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

使用方式：

```typescript
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}
```

**傳遞資料給 Decorator：**

利用 `data` 參數按 key 提取 request 物件的屬性：

```typescript
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

// 使用
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```

**搭配 Pipe 使用：**

自訂 Param Decorator 可與 Pipe 一起使用：

```typescript
@Get()
async findOne(
  @User(new ValidationPipe({ validateCustomDecorators: true }))
  user: UserEntity,
) {
  console.log(user);
}
```

> `validateCustomDecorators` 必須設為 `true`，`ValidationPipe` 預設不驗證自訂 Decorator 的參數。

**Decorator 組合（Composition）：**

使用 `applyDecorators()` 將多個 Decorator 合併為一個：

```typescript
import { applyDecorators } from '@nestjs/common';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
```

使用方式：

```typescript
@Get('users')
@Auth('admin')
findAllUsers() {}
```

單一 `@Auth()` Decorator 即可套用所有四個 Decorator 的效果。

---

## Fundamentals

### Custom Providers
> 原文連結：https://docs.nestjs.com/fundamentals/custom-providers

NestJS 的 Dependency Injection (DI) 系統採用 **Inversion of Control (IoC)** 技術，由框架自動管理實例的建立與注入。標準做法是透過 `@Injectable()` 標記 Service、在 Controller 的 constructor 注入、並於 Module 的 `providers` 陣列中註冊。

**標準 Provider 語法的展開形式：**

```typescript
// 簡寫
providers: [CatsService]

// 等同於完整寫法
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
]
```

當需要以下情境時，就必須使用 **Custom Provider**：
- 建立自訂實例而非標準的 class 實例化
- 在多個依賴中重用同一個 class
- 以 mock 版本取代實作進行測試

#### 四種 Custom Provider 類型

**1. Value Provider (`useValue`)**：注入常數值或 mock 物件，適合測試時替換真實實作。

```typescript
{
  provide: CatsService,
  useValue: mockCatsService,
}
```

**2. Class Provider (`useClass`)**：根據條件（如環境變數）動態決定要解析的 class。

```typescript
{
  provide: ConfigService,
  useClass:
    process.env.NODE_ENV === 'development'
      ? DevelopmentConfigService
      : ProductionConfigService,
}
```

**3. Factory Provider (`useFactory`)**：以函式動態產生 Provider，可透過 `inject` 屬性注入其他依賴。

```typescript
{
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
}
```

**4. Alias Provider (`useExisting`)**：為同一個 Provider 建立多個存取點（別名），共享同一實例。

```typescript
{
  provide: 'AliasedLoggerService',
  useExisting: LoggerService,
}
```

#### Non-class Token

可使用 **字串** 或 **Symbol** 作為 Provider 的識別 Token，搭配 `@Inject()` Decorator 注入：

```typescript
@Injectable()
export class CatsRepository {
  constructor(@Inject('CONNECTION') connection: Connection) {}
}
```

---

### Asynchronous Providers
> 原文連結：https://docs.nestjs.com/fundamentals/async-providers

Asynchronous Provider 允許應用程式在非同步操作完成之前延遲啟動。典型使用情境是：**在資料庫連線建立之前，不希望開始接受請求**。

**實作方式**：透過 `useFactory` 搭配 `async/await`，Factory 函式回傳一個 Promise：

```typescript
{
  provide: 'ASYNC_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection(options);
    return connection;
  },
}
```

**注入方式**：與其他 Provider 相同，使用 Token 注入：

```typescript
@Inject('ASYNC_CONNECTION')
private readonly connection: Connection,
```

Nest 會在解析完所有非同步 Provider 之後，才開始實例化依賴於它們的 class。

---

### Dynamic Modules
> 原文連結：https://docs.nestjs.com/fundamentals/dynamic-modules

**Static Module**（靜態模組）在定義時就固定了所有 Provider、Controller 與匯入匯出的設定。**Dynamic Module**（動態模組）則提供一組 API，讓消費端在 import 時可以**自訂**模組的行為與設定。

#### 靜態 vs. 動態匯入

```typescript
// 靜態匯入 — 無法影響 ConfigModule 的行為
@Module({
  imports: [ConfigModule],
})
export class AppModule {}

// 動態匯入 — 傳入設定物件自訂行為
@Module({
  imports: [ConfigModule.register({ folder: './config' })],
})
export class AppModule {}
```

#### 動態模組的實作

`register()` 是一個 **靜態方法**，回傳一個 `DynamicModule` 物件：

```typescript
@Module({})
export class ConfigModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
```

`ConfigService` 透過 `@Inject('CONFIG_OPTIONS')` 取得設定物件：

```typescript
@Injectable()
export class ConfigService {
  constructor(@Inject('CONFIG_OPTIONS') private options: Record<string, any>) {
    // 使用 options 自訂行為
  }
}
```

#### 命名慣例

| 方法名稱 | 用途 |
|---|---|
| `register` | 每個消費模組可各自傳入不同設定 |
| `forRoot` | 全域設定一次，多處重用 |
| `forFeature` | 在 `forRoot` 基礎上，針對特定模組微調設定 |

以上皆有對應的非同步版本：`registerAsync`、`forRootAsync`、`forFeatureAsync`。

#### ConfigurableModuleBuilder

NestJS 提供 `ConfigurableModuleBuilder` 簡化動態模組的建立，自動產生 `register` 與 `registerAsync` 方法：

```typescript
// config.module-definition.ts
import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ConfigModuleOptions } from './interfaces/config-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();
```

```typescript
// config.module.ts
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {}
```

可透過以下方法進一步自訂：
- **`setClassMethodName('forRoot')`**：改變方法名稱（自動產生 `forRoot` / `forRootAsync`）
- **`setFactoryMethodName('createConfigOptions')`**：改變 Options Factory Class 的方法名稱
- **`setExtras()`**：定義額外屬性（如 `isGlobal`），這些屬性不會包含在 `MODULE_OPTIONS_TOKEN` 中

---

### Injection Scopes
> 原文連結：https://docs.nestjs.com/fundamentals/injection-scopes

NestJS 提供三種 Provider Scope：

| Scope | 說明 |
|---|---|
| **DEFAULT（Singleton）** | 單一實例在整個應用程式中共享，生命週期與應用程式相同。**大多數情況建議使用此 Scope。** |
| **REQUEST** | 為每個進入的請求建立專屬實例，請求處理完畢後進行垃圾回收。 |
| **TRANSIENT** | 每個注入的消費者都會收到獨立的全新實例，不在消費者之間共享。 |

**設定方式：**

```typescript
@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```

#### Scope 的傳播（Scope Bubbling）

**REQUEST Scope 會沿著注入鏈向上傳播**：若 Controller 依賴一個 REQUEST-scoped 的 Provider，該 Controller 本身也會變成 REQUEST-scoped。

傳播鏈範例：`CatsController <- CatsService <- CatsRepository`，若 `CatsRepository` 是 REQUEST-scoped，則整條鏈上的元件都會成為 REQUEST-scoped。

TRANSIENT-scoped 的依賴則**不會**使其消費者變成 TRANSIENT。

> **效能注意**：使用 REQUEST Scope 會對效能產生影響（約降低 5%），應盡量使用 Singleton Scope。

#### Durable Providers

針對**多租戶（Multi-tenancy）** 應用程式，NestJS 提供 **Durable Provider** 作為效能最佳化方案。透過實作 `ContextIdStrategy`，可依照共同屬性（如 Tenant ID）**跨請求重用** DI 子樹，而非每個請求都重建：

```typescript
@Injectable({ scope: Scope.REQUEST, durable: true })
export class CatsService {}
```

---

### Circular Dependency
> 原文連結：https://docs.nestjs.com/fundamentals/circular-dependency

Circular Dependency（循環依賴）發生在兩個 class 或 Module 互相依賴的情況。雖然應盡量避免，但 NestJS 提供了解決機制。

#### Forward Reference

使用 `forwardRef()` 工具函式，允許參考尚未定義的 class。**雙方都必須使用**：

```typescript
// cats.service.ts
@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService,
  ) {}
}

// common.service.ts
@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private catsService: CatsService,
  ) {}
}
```

#### Module 層級的 Forward Reference

模組之間的循環依賴也使用 `forwardRef()`，且**雙方模組都要設定**：

```typescript
@Module({
  imports: [forwardRef(() => CatsModule)],
})
export class CommonModule {}
```

#### 注意事項

- **實例化順序不確定**，不要依賴 constructor 的呼叫順序
- 避免使用 **barrel files**（index.ts）在同一目錄中互相 import，可能無意間產生循環依賴
- 可重構程式碼，使用 `ModuleRef` 從 DI 容器中動態取得 Provider，以避免 Forward Reference

---

### Module Reference
> 原文連結：https://docs.nestjs.com/fundamentals/module-ref

`ModuleRef` class 提供動態存取內部 Provider 與實例化 class 的機制。

#### 主要方法

**`get()`**：取得當前模組中已註冊的 Provider（Singleton 實例）。

```typescript
@Injectable()
export class CatsService {
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    const service = this.moduleRef.get(HttpService);
  }
}
```

> **限制**：`get()` 無法取得 Scoped Provider（Transient 或 Request-scoped），需使用 `resolve()`。若要從全域上下文取得 Provider，傳入 `{ strict: false }` 選項。

**`resolve()`**：針對 Scoped Provider，每次呼叫會從獨立的 **DI 子樹** 建立唯一實例。

```typescript
const instance1 = await this.moduleRef.resolve(TransientService);
const instance2 = await this.moduleRef.resolve(TransientService);
// instance1 !== instance2
```

若需要在多次 `resolve()` 呼叫之間取得同一實例，需傳入相同的 **Context ID**：

```typescript
const contextId = ContextIdFactory.create();
const service1 = await this.moduleRef.resolve(TransientService, contextId);
const service2 = await this.moduleRef.resolve(TransientService, contextId);
// service1 === service2
```

**`create()`**：動態實例化未註冊為 Provider 的 class：

```typescript
const instance = await this.moduleRef.create(SomeClass);
```

---

### Lazy-loading Modules
> 原文連結：https://docs.nestjs.com/fundamentals/lazy-loading-modules

預設情況下，所有 Module 在應用啟動時就會 **eagerly load**（即時載入）。在 **Serverless 環境** 中，啟動延遲（Cold Start）是關鍵考量，此時 Lazy Loading 可以顯著減少啟動時間。

#### 使用方式

注入 `LazyModuleLoader`（來自 `@nestjs/core`），然後按需載入 Module：

```typescript
@Injectable()
export class CatsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  async someMethod() {
    const { LazyModule } = await import('./lazy.module');
    const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);

    const { LazyService } = await import('./lazy.service');
    const lazyService = moduleRef.get(LazyService);
  }
}
```

**重要特性：**
- **快取機制**：首次載入後，後續呼叫會回傳快取的實例
- Lazy-loaded Module 與 Eagerly-loaded Module **共享同一個 Module Graph**
- Lazy-loaded Module 中的 **Lifecycle Hook 不會被觸發**

#### 限制

**Controller、Gateway、Resolver 無法被 Lazy Load**，原因：
- REST API（Express/Fastify）：應用就緒後無法再註冊新路由
- Microservices：連線建立後無法再訂閱新的 Topic/Channel
- GraphQL（Code First）：Schema 在啟動時就必須根據 metadata 產生

#### 適用場景

最適合用於 **Worker / Cron Job / Lambda / Serverless Function / Webhook** 等需根據輸入參數觸發不同邏輯的場景。

---

### Execution Context
> 原文連結：https://docs.nestjs.com/fundamentals/execution-context

NestJS 提供工具類別，協助開發者撰寫能**跨應用程式類型**（HTTP、Microservices、WebSockets）運作的通用 Guard、Filter 與 Interceptor。核心為兩個 class：`ArgumentsHost` 與 `ExecutionContext`。

#### ArgumentsHost

`ArgumentsHost` 封裝了 Handler 接收到的參數，並允許選擇適當的 Context 來取得參數。

**切換 Context 的方法：**

```typescript
// HTTP Context
const ctx = host.switchToHttp();
const request = ctx.getRequest<Request>();
const response = ctx.getResponse<Response>();

// WebSocket Context
const client = host.switchToWs().getClient();
const data = host.switchToWs().getData();

// RPC (Microservice) Context
const data = host.switchToRpc().getData();
const context = host.switchToRpc().getContext();
```

**判斷當前應用類型：**

```typescript
if (host.getType() === 'http') { /* REST */ }
else if (host.getType() === 'rpc') { /* Microservice */ }
else if (host.getType<GqlContextType>() === 'graphql') { /* GraphQL */ }
```

#### ExecutionContext

`ExecutionContext` 繼承自 `ArgumentsHost`，額外提供：

- **`getHandler()`**：回傳即將被呼叫的路由 Handler 方法的參考
- **`getClass()`**：回傳該 Handler 所屬的 Controller class

```typescript
const methodKey = ctx.getHandler().name; // "create"
const className = ctx.getClass().name;   // "CatsController"
```

#### Reflection 與 Metadata

**使用 `Reflector#createDecorator` 建立強型別 Decorator：**

```typescript
// roles.decorator.ts
import { Reflector } from '@nestjs/core';
export const Roles = Reflector.createDecorator<string[]>();

// cats.controller.ts
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {}
```

**在 Guard 中讀取 metadata：**

```typescript
@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    // ...
  }
}
```

**合併 Controller 與 Handler 層級的 metadata：**

| 方法 | 行為 |
|---|---|
| `getAllAndOverride(key, [handler, class])` | Handler 層級優先覆蓋 Controller 層級 |
| `getAllAndMerge(key, [handler, class])` | 合併兩個層級的值（陣列或物件） |

---

### Lifecycle Events
> 原文連結：https://docs.nestjs.com/fundamentals/lifecycle-events

NestJS 應用程式的生命週期分為三個階段：**Initializing**、**Running**、**Terminating**。框架提供 Lifecycle Hook 讓開發者在關鍵時刻執行程式碼。

#### Lifecycle Hook 一覽

| Hook 方法 | 觸發時機 |
|---|---|
| `onModuleInit()` | 所屬 Module 的依賴解析完成後呼叫 |
| `onApplicationBootstrap()` | 所有 Module 初始化完成後、開始監聽連線之前呼叫 |
| `onModuleDestroy()`* | 收到終止訊號（如 `SIGTERM`）後呼叫 |
| `beforeApplicationShutdown()`* | 所有 `onModuleDestroy()` 完成後呼叫，完成後關閉所有連線 |
| `onApplicationShutdown()`* | 連線關閉後呼叫（`app.close()` resolve 後） |

\* 需要顯式呼叫 `app.close()` 或啟用 Shutdown Hook 才會觸發。

#### 使用方式

實作對應的 Interface（`OnModuleInit`、`OnApplicationBootstrap` 等）：

```typescript
@Injectable()
export class UsersService implements OnModuleInit {
  onModuleInit() {
    console.log('The module has been initialized.');
  }
}
```

**支援非同步初始化**：`onModuleInit` 和 `onApplicationBootstrap` 可以回傳 Promise 或使用 `async/await`。

#### Application Shutdown

Shutdown Hook 預設**未啟用**，需手動啟用：

```typescript
const app = await NestFactory.create(AppModule);
app.enableShutdownHooks();
await app.listen(3000);
```

> **注意**：`enableShutdownHooks` 會佔用記憶體啟動 Listener。在同一個 Node Process 中執行多個 Nest App（如 Jest 平行測試）時，Node 可能警告過多 Listener。

**執行順序**：收到終止訊號後依序呼叫 `onModuleDestroy()` -> `beforeApplicationShutdown()` -> `onApplicationShutdown()`，每個步驟等待 Promise 完成才進入下一步。

**REQUEST-scoped 的 Provider 不會觸發 Lifecycle Hook**，因為它們的生命週期與請求綁定，而非與應用程式綁定。

---

### Discovery Service
> 原文連結：https://docs.nestjs.com/fundamentals/discovery-service

`DiscoveryService`（來自 `@nestjs/core`）允許開發者在**執行時期動態檢查和取得** Provider、Controller 及其 metadata。適用於建立 Plugin、Decorator 或需要 Runtime Introspection 的進階功能。

#### 設定

需先在 Module 中匯入 `DiscoveryModule`：

```typescript
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule],
  providers: [ExampleService],
})
export class ExampleModule {}
```

#### 取得所有 Provider 與 Controller

```typescript
@Injectable()
export class ExampleService {
  constructor(private readonly discoveryService: DiscoveryService) {}

  findAll() {
    const providers = this.discoveryService.getProviders();
    const controllers = this.discoveryService.getControllers();
  }
}
```

#### 搭配自訂 Decorator 擷取 Metadata

```typescript
// 建立 Decorator
export const FeatureFlag = DiscoveryService.createDecorator();

// 套用至 Service
@Injectable()
@FeatureFlag('experimental')
export class CustomService {}

// 篩選特定 metadata 的 Provider
const providers = this.discoveryService.getProviders();
const experimentalProviders = providers.filter(
  (item) =>
    this.discoveryService.getMetadataByDecorator(FeatureFlag, item) ===
    'experimental',
);
```

---

### Platform Agnosticism
> 原文連結：https://docs.nestjs.com/fundamentals/platform-agnosticism

NestJS 是一個**平台無關（Platform-agnostic）** 的框架，核心理念是 **Build Once, Use Everywhere**。

**跨平台能力：**
- **HTTP 伺服器框架**：相同的元件可在 Express 和 Fastify 之間無縫切換
- **應用類型**：同一套邏輯可跨 HTTP Server、Microservices（不同 Transport Layer）、WebSockets 使用
- **GraphQL**：可與 REST API 交互使用，透過專屬的 `@nestjs/graphql` 模組
- **Application Context**：支援建立 CRON Job、CLI App 等各種 Node.js 應用

框架的核心設計目標是提供高度模組化與可重用性，讓開發者撰寫的邏輯元件能在不同類型的應用中重複使用。

---

### Testing
> 原文連結：https://docs.nestjs.com/fundamentals/testing

NestJS 將自動化測試視為軟體開發的必要環節，內建多項測試支援功能：
- 自動產生 Component 的 Unit Test 與 Application 的 E2E Test 樣板
- 提供建構隔離 Module/Application Loader 的工具
- 內建整合 **Jest** 與 **Supertest**，同時不綁定特定測試工具
- 在測試環境中提供完整的 DI 系統，方便 Mock

#### 安裝

```bash
$ npm i --save-dev @nestjs/testing
```

#### Unit Testing

**使用 Testing Utilities（`@nestjs/testing`）**：

```typescript
import { Test } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

describe('CatsController', () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService],
    }).compile();

    catsService = moduleRef.get(CatsService);
    catsController = moduleRef.get(CatsController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(catsService, 'findAll').mockImplementation(() => result);
      expect(await catsController.findAll()).toBe(result);
    });
  });
});
```

`Test.createTestingModule()` 接收與 `@Module()` 相同的 metadata 物件，`compile()` 後回傳可用於測試的 Module。

**關鍵方法：**

| 方法 | 說明 |
|---|---|
| `get()` | 取得 Static（Singleton）實例 |
| `resolve()` | 取得 Scoped（Request / Transient）實例，每次回傳不同實例 |
| `createNestApplication()` | 建立完整 Nest 應用實例（用於 E2E 測試） |
| `select()` | 導覽 Module Dependency Graph，從特定 Module 取得實例 |

#### Auto Mocking

使用 `useMocker()` 為所有未提供的依賴自動建立 Mock：

```typescript
const moduleRef = await Test.createTestingModule({
  controllers: [CatsController],
})
  .useMocker((token) => {
    if (token === CatsService) {
      return { findAll: jest.fn().mockResolvedValue(['test1', 'test2']) };
    }
    if (typeof token === 'function') {
      const mockMetadata = moduleMocker.getMetadata(token);
      const Mock = moduleMocker.generateFromMetadata(mockMetadata);
      return new Mock();
    }
  })
  .compile();
```

#### End-to-End (E2E) Testing

使用 `createNestApplication()` 建立完整的 Nest 執行環境，搭配 Supertest 模擬 HTTP 請求：

```typescript
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { CatsModule } from '../../src/cats/cats.module';
import { CatsService } from '../../src/cats/cats.service';
import { INestApplication } from '@nestjs/common';

describe('Cats', () => {
  let app: INestApplication;
  let catsService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET cats', () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({ data: catsService.findAll() });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

#### Override 方法

| 方法 | 說明 |
|---|---|
| `overrideProvider()` | 替換 Provider，支援 `useClass`、`useValue`、`useFactory` |
| `overrideModule()` | 替換整個 Module，使用 `useModule()` |
| `overrideGuard()` | 替換 Guard |
| `overrideInterceptor()` | 替換 Interceptor |
| `overrideFilter()` | 替換 Filter |
| `overridePipe()` | 替換 Pipe |

#### 覆寫全域 Enhancer

全域註冊的 Guard/Pipe/Interceptor/Filter 需將 `useClass` 改為 `useExisting` 才能被 Override：

```typescript
// 原始註冊 — 改用 useExisting
providers: [
  {
    provide: APP_GUARD,
    useExisting: JwtAuthGuard,
  },
  JwtAuthGuard,
],

// 測試中 Override
const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideProvider(JwtAuthGuard)
  .useClass(MockAuthGuard)
  .compile();
```

#### 測試 Request-scoped 實例

產生固定的 Context ID 並攔截 `ContextIdFactory.getByRequest()`，使所有請求共用同一個 DI 子樹：

```typescript
const contextId = ContextIdFactory.create();
jest
  .spyOn(ContextIdFactory, 'getByRequest')
  .mockImplementation(() => contextId);

catsService = await moduleRef.resolve(CatsService, contextId);
```
