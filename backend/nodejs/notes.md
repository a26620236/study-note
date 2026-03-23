# Node.js 官方教學筆記

> 整理自 [Node.js 官方文件](https://nodejs.org/en/learn)，共 9 大分類、57 篇文章。

## 目錄

- [Getting Started](#getting-started)
- [Command Line](#command-line)
- [HTTP](#http)
- [Manipulating Files](#manipulating-files)
- [Asynchronous Work](#asynchronous-work)
- [TypeScript](#typescript)
- [Modules](#modules)
- [Diagnostics](#diagnostics)
- [Test Runner](#test-runner)

---

## Getting Started（[視覺化總覽](supplements/getting-started-overview.md)）

### Introduction to Node.js
> 原文連結：https://nodejs.org/en/learn/getting-started/introduction-to-nodejs

Node.js 是一個開源且跨平台的 JavaScript 執行環境，使用 Google Chrome 的 V8 引擎在瀏覽器之外執行 JavaScript。

**核心特性：**
- **單執行緒、非阻塞 I/O**：Node.js 應用程式在單一行程中執行，不會為每個請求建立新的執行緒。當進行 I/O 操作（讀取網路、存取資料庫或檔案系統）時，Node.js 不會阻塞執行緒等待回應，而是在收到回應後恢復操作。
- **高並發處理**：這使得 Node.js 能夠以單一伺服器處理數千個並發連線，無需管理執行緒同步問題。
- **前後端統一語言**：前端開發者可以直接使用 JavaScript 撰寫伺服端程式碼。
- **ECMAScript 支援**：可自由選擇 Node.js 版本來決定使用哪個 ECMAScript 標準，不需等待使用者更新瀏覽器。

**Hello World 範例（[HTTP 伺服器](supplements/localhost.md)）：**

```javascript
const { createServer } = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

此程式碼引入 `http` 模組，使用 `createServer()` 建立伺服器，每次收到請求時觸發回呼函式，回傳狀態碼 200 和 "Hello World" 內容。儲存為 `server.js` 後執行 `node server.js` 即可啟動。

---

### How much JavaScript do you need to know to use Node.js
> 原文連結：https://nodejs.org/en/learn/getting-started/how-much-javascript-do-you-need-to-know-to-use-nodejs

在學習 Node.js 之前，建議先掌握以下 JavaScript 基礎概念：

**基礎概念：**
- 詞法結構（Lexical Structure）、表達式（Expressions）、資料型別（Data Types）
- 類別（Classes）、變數宣告（var / let / const）、函式（Functions）
- `this` 運算子、箭頭函式（Arrow Functions）、迴圈（Loops）
- 作用域（Scopes）、陣列（Arrays）、模板字面量（Template Literals）
- 嚴格模式（Strict Mode）、ES6+ 新特性

**非同步程式設計（對 Node.js 至關重要）：**
- 非同步程式設計與回呼函式（Callbacks）
- 計時器（setTimeout / setInterval）
- Promise 物件與鏈式呼叫
- async / await 語法
- 閉包（Closures）
- 事件迴圈（Event Loop）

非同步程式設計是 Node.js 的核心，務必熟練掌握 Callbacks、Promises 和 async/await。

---

### Differences between Node.js and the Browser
> 原文連結：https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser

雖然兩者都使用 JavaScript，但執行環境有本質差異：

| 面向 | 瀏覽器 | Node.js |
|------|--------|---------|
| DOM / Web API | 有 `document`、`window`、Cookies 等 | 無 DOM，提供檔案系統等伺服端 API |
| 環境控制 | 無法控制使用者的瀏覽器版本 | 可完全掌控執行環境與 Node.js 版本 |
| JS 版本 | 需用 Babel 轉譯以相容舊瀏覽器 | 可直接使用 Node.js 版本支援的 ES2015+ 語法 |
| 模組系統 | 僅支援 ES Modules（`import`） | 同時支援 CommonJS（`require`）與 ES Modules（`import`） |

Node.js 最大優勢在於前後端使用同一語言，但需注意兩個環境中可用的 API 不同。

---

### The V8 JavaScript Engine
> 原文連結：https://nodejs.org/en/learn/getting-started/the-v8-javascript-engine

V8 是 Google Chrome 的 JavaScript 引擎，負責解析和執行 JavaScript 程式碼。Node.js 在 2009 年選擇 V8 作為其核心引擎。

**重點：**
- V8 引擎獨立於瀏覽器，這一特性促成了 Node.js 的誕生，也支撐了 Electron 等桌面應用框架。
- 其他瀏覽器引擎：Firefox 使用 **SpiderMonkey**、Safari 使用 **JavaScriptCore**、Edge 已改用 **V8**（基於 Chromium）。
- 所有引擎皆實作 **ECMA ES-262 標準**（ECMAScript）。
- V8 以 C++ 撰寫，跨平台支援 Mac、Windows、Linux。
- **JIT 即時編譯**：現代 JavaScript 引擎不再僅是直譯，V8 使用 Just-In-Time 編譯技術，先編譯再執行，大幅提升效能。自 2009 年起各大引擎均採用此技術。

---

### An Introduction to the npm Package Manager
> 原文連結：https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager

npm 是 Node.js 的標準套件管理工具，npm registry 擁有超過 210 萬個套件。替代工具包括 **Yarn** 和 **pnpm**。

**安裝套件：**

```bash
# 安裝專案所有依賴
npm install

# 安裝特定套件（自動加入 package.json 的 dependencies）
npm install <package-name>

# 安裝為開發依賴
npm install <package-name> --save-dev

# 安裝特定版本
npm install <package-name>@<version>
```

**dependencies vs devDependencies**：前者為正式環境所需（如核心函式庫），後者僅用於開發（如測試工具），不會隨應用程式佈署至正式環境。

**更新套件：**

```bash
npm update              # 更新所有套件
npm update <package-name>  # 更新特定套件
```

npm 遵循 **語意化版本控制（semver）** 標準，可指定精確版本以確保團隊一致性。

**執行腳本：**

```json
{
  "scripts": {
    "start-dev": "node lib/server-development",
    "start": "node lib/server-production",
    "watch": "webpack --watch --progress --colors --config webpack.conf.js"
  }
}
```

```bash
npm run watch
npm run start
```

---

### ECMAScript 2015 (ES6) and beyond
> 原文連結：https://nodejs.org/en/learn/getting-started/ecmascript-2015-es6-and-beyond

Node.js 基於 V8 引擎構建，持續跟進最新 ECMAScript 規範。

**ES6 特性分為三類：**
1. **Shipping（已發佈）**：V8 認為穩定，Node.js 預設啟用，無需任何旗標。
2. **Staged（暫存）**：接近完成但尚未穩定，需使用 `--harmony` 旗標啟用，正式環境慎用。
3. **In Progress（開發中）**：需使用特定 harmony 旗標啟用，強烈不建議用於非測試環境。

**查詢各版本支援的 ES 特性**：造訪 [node.green](https://node.green/)。

**查看當前版本的 in progress 特性：**

```bash
node --v8-options | grep "in progress"
```

**查看 V8 版本：**

```bash
node -p process.versions.v8
```

正式環境建議移除 `--harmony` 旗標，等待特性成為 V8/Node.js 預設功能後再使用。

---

### Debugging Node.js
> 原文連結：https://nodejs.org/en/learn/getting-started/debugging

**啟用 Inspector：**

使用 `--inspect` 參數啟動 Node.js，預設監聽 `127.0.0.1:9229`，每個行程分配唯一 UUID。

**安全注意事項：**
- 切勿將除錯埠暴露於公開 IP 或 `0.0.0.0`，否則任何可存取該 IP 的客戶端都能執行任意程式碼。
- 預設綁定 `127.0.0.1`，但本機應用程式仍可無限制存取。
- 瀏覽器透過 WebSocket 連線，Node.js 會驗證 `Host` 標頭以防止 DNS 重新綁定攻擊。

**常用除錯工具：**
- **Chrome DevTools**：開啟 `chrome://inspect`，在 Remote Target 中找到應用程式。
- **VS Code**：在 Debug 面板設定 `.vscode/launch.json`，選擇 Node.js。
- **JetBrains WebStorm**：建立 Node.js debug configuration。

**常用命令列選項：**

| 旗標 | 說明 |
|------|------|
| `--inspect` | 啟用 Inspector，監聽預設位址和埠 |
| `--inspect-brk` | 啟用 Inspector，在使用者程式碼執行前中斷 |
| `--inspect-wait` | 啟用 Inspector，等待除錯器連接 |

**遠端除錯建議使用 SSH 通道：**

```bash
# 遠端機器
node --inspect server.js

# 本機建立 SSH 通道
ssh -L 9221:localhost:9229 user@remote.example.com
```

然後將除錯器連接至 `localhost:9221`。

---

### Fetch
> 原文連結：https://nodejs.org/en/learn/getting-started/fetch

Node.js 的 Fetch API 由 **Undici** HTTP 客戶端函式庫驅動，這是一個從零開始撰寫、不依賴內建 HTTP 客戶端的高效能函式庫。

**基本 GET 請求：**

```javascript
async function main() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  console.log(data);
}

main().catch(console.error);
```

**基本 POST 請求：**

```javascript
const body = { title: 'foo', body: 'bar', userId: 1 };

async function main() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
}

main().catch(console.error);
```

**進階用法 - 使用 Undici Pool 連線池：**

透過 `Pool` 可重複使用對相同伺服器的連線以提升效能：

```javascript
import { Pool } from 'undici';

const ollamaPool = new Pool('http://localhost:11434', {
  connections: 10,
});

async function streamOllamaCompletion(prompt) {
  const { statusCode, body } = await ollamaPool.request({
    path: '/api/generate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model: 'mistral' }),
  });

  if (statusCode !== 200) {
    await body.dump();
    throw new Error(`Request failed with status ${statusCode}`);
  }

  const decoder = new TextDecoder();
  for await (const chunk of body) {
    console.log(decoder.decode(chunk, { stream: true }));
  }
}
```

**串流回應（Streaming）：** 可搭配 `Writable` stream 和 Undici 的 `stream` 方法，以串流方式處理大量回應資料。

---

### WebSocket
> 原文連結：https://nodejs.org/en/learn/getting-started/websocket

自 **Node.js v22.4.0** 起，WebSocket API 已標記為穩定版，由 Undici 驅動。

**WebSocket 是什麼：**
- 標準化通訊協定，透過單一 TCP 連線實現**全雙工雙向通訊**。
- 使用 HTTP Upgrade 標頭轉換協定。
- 伺服器可主動推送內容至客戶端，比 HTTP 輪詢開銷更低。
- URI scheme：`ws://`（未加密）和 `wss://`（加密）。

**基本連線與訊息處理：**

```javascript
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', event => {
  console.log('WebSocket connection established!');
  socket.send('Hello Server!');
});

socket.addEventListener('message', event => {
  console.log('Message from server: ', event.data);
});

socket.addEventListener('close', event => {
  console.log('WebSocket connection closed:', event.code, event.reason);
});

socket.addEventListener('error', error => {
  console.error('WebSocket error:', error);
});
```

**傳送與接收 JSON 資料：**

```javascript
socket.addEventListener('open', () => {
  const data = { type: 'message', content: 'Hello from Node.js!' };
  socket.send(JSON.stringify(data));
});

socket.addEventListener('message', event => {
  try {
    const receivedData = JSON.parse(event.data);
    console.log('Received JSON:', receivedData);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
```

**重要限制：** Node.js v22 僅提供內建的 WebSocket **客戶端**功能。若要建立 WebSocket **伺服器**，仍需使用外部函式庫如 `ws` 或 `socket.io`。

---

### Node.js, the difference between development and production
> 原文連結：https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production

**核心觀點：** Node.js 本身在開發與正式環境之間沒有差異，不存在特定的正式環境設定。但 npm 上的許多函式庫會讀取 `NODE_ENV` 變數來調整行為。

**最佳實踐：** 永遠使用 `NODE_ENV=production` 執行 Node.js。建議參考 [twelve factor methodology](https://12factor.net/) 來設定應用程式。

**為什麼 NODE_ENV 被視為反模式：**

開發者常在程式碼中依據 `NODE_ENV` 分歧行為：

```javascript
if (process.env.NODE_ENV === 'development') {
  // ...
}
if (process.env.NODE_ENV === 'production') {
  // ...
}
```

這會導致 production 和 staging 環境行為不一致，使可靠的測試變得不可能——某功能可能在 development 通過但在 production 失敗。將 `NODE_ENV` 設定為 production 以外的值被認為是反模式。

---

### Profiling Node.js Applications
> 原文連結：https://nodejs.org/en/learn/getting-started/profiling

效能分析用於識別 CPU 瓶頸、記憶體洩漏和慢速函式呼叫。

**使用內建 Profiler：**

Node.js 內建基於 V8 的效能分析器，在程式執行期間定期取樣堆疊。

```bash
# 啟動帶有效能分析的應用程式
NODE_ENV=production node --prof app.js

# 使用 ApacheBench 進行壓力測試
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

執行後會產生 `isolate-0xnnnnnnnnnnnn-v8.log` 檔案。

**處理分析輸出：**

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

**分析結果範例：** 文章中的 Express 範例發現 **51.8% 的 CPU 時間** 花在同步的 `crypto.pbkdf2Sync` 上，阻塞了事件迴圈。

**解決方案 - 改用非同步版本：**

```javascript
// 將同步 pbkdf2Sync 改為非同步 pbkdf2
crypto.pbkdf2(password, users[username].salt, 10000, 512, 'sha512', (err, hash) => {
  if (users[username].hash.toString() === hash.toString()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

**改善結果：** 吞吐量提升約 4 倍（5.33 → 19.46 req/sec），延遲從 ~4 秒降至 ~1 秒。

**關鍵要點：** 使用 `--prof` 產生分析資料、用 `--prof-process` 解析輸出、關注 bottom-up profile 中的呼叫堆疊、非同步操作避免阻塞事件迴圈。

---

### Node.js with WebAssembly
> 原文連結：https://nodejs.org/en/learn/getting-started/nodejs-with-webassembly

WebAssembly（Wasm）是一種高效能的組合語言，可從 C/C++、Rust、AssemblyScript 等編譯而來，受 Node.js 支援。

**核心概念：**
- **Module**：已編譯的 `.wasm` 二進位檔案。
- **Memory**：可調整大小的 ArrayBuffer。
- **Table**：可調整大小的型別化參考陣列。
- **Instance**：Module 的實例化，包含其 Memory、Table 和變數。

**產生 Wasm 模組的方式：** 手寫 `.wat` 並轉換（wabt）、用 emscripten（C/C++）、用 wasm-pack（Rust）、用 AssemblyScript（TypeScript 風格）。

**在 Node.js 中使用 Wasm：**

```javascript
// CommonJS
const fs = require('node:fs');
const wasmBuffer = fs.readFileSync('/path/to/add.wasm');

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  const { add } = wasmModule.instance.exports;
  const sum = add(5, 6);
  console.log(sum); // 11
});
```

```javascript
// ESM
import fs from 'node:fs/promises';
const wasmBuffer = await fs.readFile('/path/to/add.wasm');
const wasmModule = await WebAssembly.instantiate(wasmBuffer);
const { add } = wasmModule.instance.exports;
console.log(add(5, 6)); // 11
```

**OS 存取限制：** Wasm 模組無法直接存取作業系統功能，需透過 [Wasmtime](https://docs.wasmtime.dev/) 搭配 WASI API 來實現。

---

### Security Best Practices
> 原文連結：https://nodejs.org/en/learn/getting-started/security-best-practices

此文涵蓋 Node.js 應用程式的安全威脅與緩解措施。

**1. HTTP 伺服器阻斷服務攻擊（DoS, CWE-400）：**
- 緩解：使用反向代理（快取、負載平衡、IP 黑名單）、設定伺服器逾時（`headersTimeout`、`requestTimeout`）、限制開啟的 socket 數量。

**2. DNS 重新綁定攻擊（CWE-346）：**
- 緩解：停用 SIGUSR1 信號上的 inspector、正式環境不啟用 inspector。

**3. 敏感資訊洩漏（CWE-552）：**
- 發佈 npm 套件時當前目錄所有檔案會被上傳。
- 緩解：使用 `npm publish --dry-run` 預覽、維護 `.npmignore`、在 `package.json` 使用 `files` 白名單。

**4. HTTP 請求走私攻擊（CWE-444）：**
- 緩解：不使用 `insecureHTTPParser`、使用 HTTP/2 端對端、停用 HTTP 降級。

**5. 時序攻擊（CWE-208）：**

```javascript
// 使用 crypto.timingSafeEqual 比較敏感值
crypto.timingSafeEqual(actual, expected);
```

**6. 惡意第三方模組（CWE-1357）：**

```bash
# 防止 npm 執行任意腳本
npm install --ignore-scripts

# 使用 npm ci 而非 npm install（鎖定依賴版本）
npm ci
```

- 固定依賴版本、使用 lockfile、用 `npm-audit` 自動檢查漏洞、注意 typosquatting 攻擊。

**7. 原型污染攻擊（CWE-1321）：**

```javascript
const data = JSON.parse('{"__proto__": { "polluted": true}}');
const c = Object.assign({}, a, data);
console.log(c.polluted); // true — 被污染了！
```

- 緩解：用 `Object.create(null)` 建立無原型物件、用 `Object.freeze()` 凍結原型、使用 `--disable-proto` 旗標。

**8. Monkey Patching（CWE-349）：**
- 使用 `--frozen-intrinsics` 旗標（實驗性）防止覆寫內建物件。

**9. Node.js 權限模型：**
- 使用 `--permission` 旗標限制執行階段的檔案系統、網路、子行程等存取權限。

**10. 不建議在正式環境使用實驗性功能。**

---

### Userland Migrations
> 原文連結：https://nodejs.org/en/learn/getting-started/userland-migrations

Node.js 提供「使用者層級遷移」工具，協助開發者因應新版本的棄用項目、新功能和破壞性變更。這些工具與 [Codemod](https://codemod.com) 平台合作開發，官方遷移腳本發佈在 `@nodejs` 命名空間下。

**使用 Codemod：**

```bash
# 執行特定的 codemod
npx codemod <codemod-name>

# 範例：將 import assertions 遷移至 import attributes
npx codemod @nodejs/import-assertions-to-attributes
```

**最佳實踐：**
- 在獨立分支中執行遷移，審查後再合併。
- 遷移後仔細檢視變更，確認無意外副作用。
- 執行測試套件驗證一切正常。
- 遷移後重新格式化和檢查程式碼風格。

可在 [GitHub 專案看板](https://github.com/orgs/nodejs/projects/13/views/1) 追蹤遷移進度，追蹤項目包含 codemod 類型、Node.js 版本和狀態。僅有 End-Of-Life（EOL）的棄用項目會被列出，其他遷移需自行查閱 Codemod registry。

---

## Command Line

### Run Node.js Scripts from the Command Line
> 原文連結：https://nodejs.org/en/learn/command-line/run-nodejs-scripts-from-the-command-line

**基本執行方式：** 安裝 Node.js 後，可使用全域的 `node` 指令執行腳本：

```bash
node app.js
```

**Shebang 行：** 在腳本檔案第一行加入 shebang，可讓作業系統知道要用哪個直譯器執行。推薦使用 `env` 方式，因為不同系統中 `node` 的路徑可能不同：

```bash
#!/usr/bin/env node
```

加上執行權限後即可直接執行腳本：

```bash
chmod u+x app.js
```

**直接執行程式碼：** 使用 `-e` 或 `--eval` 旗標可直接執行 JavaScript 字串，無需建立檔案：

```bash
node -e "console.log(123)"
```

注意：Windows cmd.exe 僅支援雙引號，PowerShell 及 Git Bash 則單雙引號皆可。

**自動重啟（Watch Mode）：** Node.js v16 起支援 `--watch` 旗標，檔案變更時自動重啟應用程式，適合開發階段使用：

```bash
node --watch app.js
```

**內建任務執行器（Task Runner）：** 使用 `--run` 旗標可執行 `package.json` 中 `scripts` 定義的指令：

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "node --run start -- --watch",
    "test": "node --test"
  }
}
```

```bash
node --run test
```

透過 `-- --argument` 語法可向指令傳遞額外參數。此任務執行器相較 `npm run` 較為精簡，不支援 pre/post 腳本，但著重於效能與簡潔性。執行時會自動設定 `NODE_RUN_SCRIPT_NAME` 和 `NODE_RUN_PACKAGE_JSON_PATH` 兩個環境變數。

---

### How to use the Node.js REPL
> 原文連結：https://nodejs.org/en/learn/command-line/how-to-use-the-nodejs-repl

**什麼是 REPL：** REPL 全稱 Read-Eval-Print Loop（讀取-求值-輸出 迴圈），是 Node.js 內建的互動式 JavaScript 執行環境。在終端輸入 `node`（不帶任何檔案參數）即可啟動：

```bash
node
```

**基本使用：** 輸入任何 JavaScript 程式碼會立即執行並顯示結果。表達式（expression）會直接顯示回傳值，而陳述式（statement）如 `console.log()` 會顯示 `undefined`（因為它沒有回傳值）：

```javascript
> 5 === '5'
false
> console.log('test')
test
undefined
```

**多行程式碼：** REPL 會自動偵測未完成的輸入（如函式定義），並以 `...` 提示繼續輸入。

**特殊變數 `_`：** 可存取上一個操作的結果：

```javascript
> 5 + 5
10
> _
10
```

**Dot 指令：** REPL 支援以 `.` 開頭的特殊指令：
- `.help` — 顯示可用的 dot 指令
- `.editor` — 進入多行編輯模式，按 `Ctrl-D` 執行
- `.break` — 中止多行輸入（等同 `Ctrl-C`）
- `.clear` — 重置 REPL 上下文並清除多行表達式
- `.load` — 載入 JavaScript 檔案
- `.save` — 將 REPL 中輸入過的程式碼儲存至檔案
- `.exit` — 離開 REPL（等同按兩次 `Ctrl-C`）

**在程式中使用 REPL：** 可透過 `node:repl` 模組在 JavaScript 檔案中啟動 REPL，並自訂提示符號：

```javascript
const repl = require('node:repl');
const local = repl.start('$ ');

local.on('exit', () => {
  console.log('exiting repl');
  process.exit();
});
```

---

### Output to the Command Line Using Node.js
> 原文連結：https://nodejs.org/en/learn/command-line/output-to-the-command-line-using-nodejs

**基本輸出 `console.log()`：** 最常用的方法，可傳入多個變數以空格分隔輸出：

```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

**格式化輸出：** 支援格式化佔位符：
- `%s` — 字串
- `%d` — 數字
- `%i` — 整數部分
- `%o` — 物件

```javascript
console.log('My %s has %d ears', 'cat', 2);
```

**清除控制台：** `console.clear()` 可清除終端畫面。

**計數 `console.count()`：** 追蹤同一字串被印出的次數，每次呼叫會自動累計並顯示計數：

```javascript
console.count('orange');  // orange: 1
console.count('orange');  // orange: 2
```

使用 `console.countReset('orange')` 可重置特定標籤的計數器。

**堆疊追蹤 `console.trace()`：** 印出函式的呼叫堆疊，有助於除錯時追蹤程式碼的執行路徑：

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

**計時 `console.time()` / `console.timeEnd()`：** 測量程式碼執行時間：

```javascript
console.time('doSomething()');
doSomething();
console.timeEnd('doSomething()');
```

**stdout 與 stderr 的區別：**
- `console.log()` 輸出到 **stdout**（標準輸出）
- `console.error()` 輸出到 **stderr**（標準錯誤）

兩者都會顯示在終端，但 stderr 可以被獨立重導向處理。

**彩色輸出（Node.js v22.11+）：** 使用 `node:util` 模組的 `styleText` 函式為終端文字加上樣式：

```javascript
import { styleText } from 'node:util';

console.log(
  styleText(['red'], 'This is red text ') +
    styleText(['green', 'bold'], 'and this is green bold text ') +
    'this is normal text'
);
```

第一個參數為樣式陣列，第二個參數為要套用樣式的文字。

---

### Accept Input from the Command Line in Node.js
> 原文連結：https://nodejs.org/en/learn/command-line/accept-input-from-the-command-line-in-nodejs

**readline 模組：** Node.js 自 v7 起提供 `readline` 模組，用於從可讀串流（如終端輸入 `process.stdin`）逐行讀取使用者輸入。

**基本用法：** 建立 readline 介面，使用 `question()` 方法向使用者提問並接收回應：

```javascript
// ESM
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`What's your name?`, name => {
  console.log(`Hi ${name}!`);
  rl.close();
});
```

**運作流程：**
1. `readline.createInterface()` 建立介面，設定 `input`（讀取來源，通常為 `process.stdin`）和 `output`（輸出目標，通常為 `process.stdout`）
2. `question()` 方法顯示提示文字，等待使用者按下 Enter 後，透過回呼函式取得輸入內容
3. 處理完畢後務必呼叫 `rl.close()` 關閉介面，釋放資源

**密碼輸入：** 若需要接受密碼，最佳實踐是不回顯輸入內容，改為每個字元顯示 `*` 符號，這需要額外的設定。

---

### How to Read Environment Variables from Node.js
> 原文連結：https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs

**基本概念：** Node.js 核心模組 `process` 提供 `env` 屬性，包含程序啟動時所有已設定的環境變數。`process` 是全域物件，不需要 import。

**設定與讀取環境變數：** 在命令列中可直接在 `node` 指令前設定：

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

在程式碼中透過 `process.env` 讀取：

```javascript
console.log(process.env.USER_ID);  // "239482"
console.log(process.env.USER_KEY); // "foobar"
```

**使用 .env 檔案（Node.js 20+）：** Node.js 20 起實驗性支援 `.env` 檔案。建立 `.env` 檔案後，使用 `--env-file` 旗標載入：

```shell
# .env file
PORT=3000
```

```bash
node --env-file=.env app.js
```

可同時指定多個 `.env` 檔案，後面的檔案會覆蓋前面的同名變數：

```bash
node --env-file=.env --env-file=.development.env app.js
```

重要：若環境中已存在同名變數，環境變數的值優先於 `.env` 檔案。若要避免 `.env` 檔案不存在時報錯，使用 `--env-file-if-exists` 旗標：

```bash
node --env-file-if-exists=.env app.js
```

**程式中載入 `process.loadEnvFile()`：** 可在程式碼中動態載入 `.env` 檔案：

```javascript
import { loadEnvFile } from 'node:process';
loadEnvFile('./config/.env');
```

注意：由於此方法在程序初始化之後才執行，與啟動相關的環境變數（如 `NODE_OPTIONS`）不會對程序產生效果，但仍可透過 `process.env` 存取其值。

---

## HTTP

### Anatomy of an HTTP Transaction
> 原文連結：https://nodejs.org/en/learn/http/anatomy-of-an-http-transaction

本文詳細說明 Node.js 如何處理 HTTP 請求與回應的完整流程，涵蓋從建立伺服器到錯誤處理的所有基礎知識。

#### 建立伺服器

使用 `http.createServer()` 建立 HTTP 伺服器，傳入的回呼函式會在每次收到請求時被呼叫：

```javascript
const http = require('node:http');

const server = http.createServer((request, response) => {
  // handle request here
});

server.listen(8080);
```

`Server` 物件本身是一個 `EventEmitter`，因此也可以用事件監聽的方式撰寫：

```javascript
const server = http.createServer();
server.on('request', (request, response) => {
  // handle request here
});
```

#### 取得請求資訊（Method、URL、Headers）

從 `request` 物件（`IncomingMessage` 實例）中取得 HTTP 方法與 URL：

```javascript
const { method, url } = request;
```

透過 `headers` 屬性取得標頭，**所有標頭名稱一律為小寫**，無論客戶端如何傳送。重複的標頭會被覆寫或以逗號串接。若需要原始格式，可使用 `rawHeaders`。

```javascript
const { headers } = request;
const userAgent = headers['user-agent'];
```

#### 讀取請求主體（Request Body）

`request` 物件實作了 `ReadableStream` 介面，需監聽 `'data'` 和 `'end'` 事件來收集資料：

```javascript
let body = [];
request
  .on('data', chunk => {
    body.push(chunk);
  })
  .on('end', () => {
    body = Buffer.concat(body).toString();
    // body 現在包含完整的請求主體字串
  });
```

也可以使用 npm 上的 `concat-stream` 或 `body` 等模組來簡化此流程。

#### 錯誤處理

`request` 和 `response` 都是串流（Stream），都可能觸發 `'error'` 事件。務必加上錯誤監聽器以避免程式崩潰：

```javascript
request.on('error', err => {
  console.error(err.stack);
});
response.on('error', err => {
  console.error(err);
});
```

#### 設定回應（Status Code、Headers、Body）

- **狀態碼**：透過 `response.statusCode` 設定，預設為 200。
- **標頭**：使用 `setHeader()` 逐一設定，或使用 `writeHead()` 一次寫入狀態碼與多個標頭。
- **回應主體**：`response` 是 `WritableStream`，使用 `write()` 寫入資料，`end()` 結束回應。

**重要**：必須在寫入主體之前設定好狀態碼與標頭。

```javascript
response.writeHead(200, {
  'Content-Type': 'application/json',
  'X-Powered-By': 'bacon',
});
response.end(JSON.stringify({ headers, method, url, body }));
```

#### Echo Server 範例（使用 pipe）

最簡潔的 echo server——僅對 `POST /echo` 回應，將請求主體直接導回回應：

```javascript
const http = require('node:http');

http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      request.pipe(response);
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

`request.pipe(response)` 是 Node.js 串流的強大特性，可將可讀串流直接導入可寫串流，程式碼極為簡潔。

#### 重點整理

1. 使用 `createServer()` 建立伺服器並呼叫 `listen()` 監聽埠號
2. 從 `request` 取得 method、url、headers、body
3. 根據 URL 與其他請求資料做路由判斷
4. 透過 `response` 設定狀態碼、標頭、並傳送回應主體
5. 善用 `pipe()` 將 request 串流導向 response 串流
6. 務必對 request 與 response 串流加上錯誤處理

---

### Enterprise Network Configuration
> 原文連結：https://nodejs.org/en/learn/http/enterprise-network-configuration

本文說明在企業環境中，如何設定 Node.js 的代理（Proxy）與憑證授權（CA）以正確通過公司網路限制。Node.js 已內建相關支援，多數情況不需要第三方套件。

#### 代理伺服器設定（Proxy Configuration）

企業環境通常要求透過 HTTP/HTTPS 代理存取外部服務。Node.js 支援標準的代理環境變數。

**支援版本**：`node:http` / `node:https` 需 v22.21.0、v24.5.0+；`fetch()` 需 v22.21.0、v24.0.0+。

**方法一：環境變數**

```bash
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1,.company.com

export NODE_USE_ENV_PROXY=1
node app.js
```

**方法二：命令列旗標**

```bash
node --use-env-proxy app.js
```

**方法三：.env 檔案**

```bash
HTTP_PROXY=http://proxy.company.com:8080
HTTPS_PROXY=http://proxy.company.com:8080
NO_PROXY=localhost,127.0.0.1,.company.com
NODE_USE_ENV_PROXY=1
```

啟用後，`http`、`https` 及 `fetch()` 請求會自動使用設定的代理，除非指定了自訂 agent 或目標符合 `NO_PROXY` 規則。

**程式化設定——單一請求覆寫**

```javascript
const https = require('node:https');

const agent = new https.Agent({
  proxyEnv: { HTTPS_PROXY: 'http://proxy.company.com:8080' },
});

https.request({ hostname: 'www.external.com', port: 443, path: '/', agent }, res => {
  // proxied request
});
```

**程式化設定——全域 Agent**（注意：不影響 `fetch()`）

```javascript
const http = require('node:http');
const https = require('node:https');

http.globalAgent = new http.Agent({
  proxyEnv: { HTTP_PROXY: 'http://proxy.company.com:8080' },
});
https.globalAgent = new https.Agent({
  proxyEnv: { HTTPS_PROXY: 'http://proxy.company.com:8080' },
});
```

**代理驗證**：在 URL 中加入帳密，但避免將憑證寫入設定檔，建議使用密鑰管理工具。

```bash
export HTTPS_PROXY=http://username:password@proxy.company.com:8080
```

**NO_PROXY 規則**支援多種模式：`*`（全部繞過）、精確主機名、`.company.com`（網域後綴）、`*.company.com`（萬用字元）、精確 IP、IP 範圍、主機名加埠號等。

#### 憑證授權設定（Certificate Authority Configuration）

Node.js 預設使用 Mozilla 內建的根 CA，不讀取作業系統的憑證存放區。在企業環境中，內部 CA 可能導致 TLS 驗證失敗：

```
Error: self signed certificate in certificate chain
```

**支援版本**：v22.15.0、v23.9.0、v24.0.0+。

**方法一：使用系統憑證存放區**

```bash
NODE_USE_SYSTEM_CA=1 node app.js
# 或
node --use-system-ca app.js
```

各平台讀取位置：Windows 使用 Windows Crypto API、macOS 使用 Keychain、Linux 使用 OpenSSL 預設路徑（如 `/etc/ssl/cert.pem`）。

**方法二：指定額外 CA 憑證**

```bash
export NODE_EXTRA_CA_CERTS=/path/to/company-ca-bundle.pem
node app.js
```

**方法三：組合使用**——同時啟用系統 CA 與額外憑證，Node.js 會信任內建 CA + 系統 CA + 額外憑證三者。

```bash
export NODE_USE_SYSTEM_CA=1
export NODE_EXTRA_CA_CERTS=/path/to/additional-cas.pem
node app.js
```

**程式化設定——全域 CA**

```javascript
const https = require('node:https');
const tls = require('node:tls');

const currentCerts = tls.getCACertificates('default');
const systemCerts = tls.getCACertificates('system');
tls.setDefaultCACertificates([...currentCerts, ...systemCerts]);
```

**程式化設定——單一請求 CA**（注意：`ca` 選項會取代預設值，若需要保留內建 CA 需手動串接）

```javascript
const https = require('node:https');
const specialCerts = ['-----BEGIN CERTIFICATE-----\n...'];

https.get({
  hostname: 'internal.company.com',
  port: 443,
  path: '/',
  ca: specialCerts,
}, res => { /* ... */ });
```

#### 重點整理

1. **代理**：透過 `NODE_USE_ENV_PROXY=1` 或 `--use-env-proxy` 啟用環境變數代理支援
2. **系統 CA**：透過 `NODE_USE_SYSTEM_CA=1` 或 `--use-system-ca` 讓 Node.js 讀取作業系統憑證
3. **彈性控制**：可透過程式碼針對單一請求或全域進行代理與憑證的細粒度設定
4. 這些內建功能在多數企業場景下可取代第三方套件

---

## Manipulating Files

### Node.js File Stats
> 原文連結：https://nodejs.org/en/learn/manipulating-files/nodejs-file-stats

每個檔案都帶有一組可透過 Node.js 檢查的詳細資訊，主要使用 `fs` 模組提供的 `stat()` 方法。

**三種取得檔案資訊的方式：**

**1. 非同步 Callback 方式：**
```javascript
const fs = require('node:fs');

fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  stats.isFile();          // true
  stats.isDirectory();     // false
  stats.isSymbolicLink();  // false
  console.log(stats.size); // 1024000 //= 1MB
});
```

**2. 同步方式：**
```javascript
const fs = require('node:fs');

try {
  const stats = fs.statSync('/Users/joe/test.txt');
} catch (err) {
  console.error(err);
}
```

**3. Promise 方式（推薦）：**
```javascript
const fs = require('node:fs/promises');

async function example() {
  try {
    const stats = await fs.stat('/Users/joe/test.txt');
    stats.isFile();          // true
    stats.isDirectory();     // false
    stats.isSymbolicLink();  // false
    console.log(stats.size); // 1024000 //= 1MB
  } catch (err) {
    console.log(err);
  }
}
example();
```

**`stats` 物件提供的常用資訊：**
- `stats.isFile()` — 判斷是否為檔案
- `stats.isDirectory()` — 判斷是否為目錄
- `stats.isSymbolicLink()` — 判斷是否為符號連結
- `stats.size` — 檔案大小（位元組）

---

### Node.js File Paths
> 原文連結：https://nodejs.org/en/learn/manipulating-files/nodejs-file-paths

不同作業系統的路徑格式不同（Linux/macOS 使用 `/`，Windows 使用 `\`），因此需要使用 `path` 模組來處理路徑，確保跨平台相容性。

```javascript
const path = require('node:path');
```

**從路徑中提取資訊：**
```javascript
const notes = '/users/joe/notes.txt';

path.dirname(notes);   // /users/joe       （父目錄）
path.basename(notes);  // notes.txt        （檔案名稱）
path.extname(notes);   // .txt             （副檔名）
```

取得不含副檔名的檔案名稱：
```javascript
path.basename(notes, path.extname(notes)); // notes
```

**路徑操作方法：**

- **`path.join()`** — 串接多個路徑片段：
```javascript
const name = 'joe';
path.join('/', 'users', name, 'notes.txt'); // '/users/joe/notes.txt'
```

- **`path.resolve()`** — 將相對路徑解析為絕對路徑：
```javascript
path.resolve('joe.txt');            // '/Users/joe/joe.txt'（以 cwd 為基底）
path.resolve('tmp', 'joe.txt');     // '/Users/joe/tmp/joe.txt'
path.resolve('/etc', 'joe.txt');    // '/etc/joe.txt'（第一個參數為絕對路徑）
```

- **`path.normalize()`** — 正規化路徑（處理 `.`、`..` 和雙斜線）：
```javascript
path.normalize('/users/joe/..//test.txt'); // '/users/test.txt'
```

**重要提醒：** `resolve` 和 `normalize` 都不會檢查路徑是否實際存在，它們只是根據輸入進行字串計算。

---

### Reading Files with Node.js
> 原文連結：https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs

Node.js 提供三種基本的檔案讀取方式，以及適合大型檔案的 Stream 方式。

**1. 非同步 Callback：**
```javascript
const fs = require('node:fs');

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

**2. 同步方式（會阻塞執行緒）：**
```javascript
const fs = require('node:fs');

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}
```

**3. Promise 方式（推薦）：**
```javascript
const fs = require('node:fs/promises');

async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' });
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
example();
```

**重要注意事項：** 以上三種方式都會將**整個檔案內容載入記憶體**，對於大型檔案會嚴重影響記憶體消耗與執行速度。

**4. Stream 方式（適用大型檔案）：** 使用 `fs.createReadStream()` 以分塊（chunk）方式讀取，不需一次載入整個檔案：
```javascript
const fs = require('node:fs');

const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

for await (const chunk of readStream) {
  console.log(chunk);
}
```

Stream 的優勢在於分塊處理、記憶體使用效率高，適合處理大量或大型檔案。

---

### Writing Files with Node.js
> 原文連結：https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs

**寫入檔案的三種方式：**

**1. 非同步 Callback：**
```javascript
const fs = require('node:fs');

const content = 'Some content!';
fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err);
  }
});
```

**2. 同步方式：**
```javascript
const fs = require('node:fs');

try {
  fs.writeFileSync('/Users/joe/test.txt', content);
} catch (err) {
  console.error(err);
}
```

**3. Promise 方式：**
```javascript
const fs = require('node:fs/promises');

async function example() {
  try {
    await fs.writeFile('/Users/joe/test.txt', content);
  } catch (err) {
    console.log(err);
  }
}
example();
```

**重要：** `writeFile` 預設會**覆蓋**檔案原有內容。可透過 flag 參數改變行為：
```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => {});
```

**常用 flag：**
| Flag | 說明 | 檔案不存在時自動建立 |
|------|------|---------------------|
| `r+` | 讀寫模式 | 否 |
| `w+` | 讀寫模式，游標置於檔案開頭 | 是 |
| `a`  | 寫入模式，游標置於檔案末尾 | 是 |
| `a+` | 讀寫模式，游標置於檔案末尾 | 是 |

**追加內容（不覆蓋原檔案）：** 使用 `fs.appendFile()` 或 `fsPromises.appendFile()`：
```javascript
const fs = require('node:fs');

fs.appendFile('file.log', content, err => {
  if (err) {
    console.error(err);
  }
});
```

---

### Working with File Descriptors in Node.js
> 原文連結：https://nodejs.org/en/learn/manipulating-files/working-with-file-descriptors-in-nodejs

**File descriptor（檔案描述符）**是作業系統中對已開啟檔案的參照，以數字 `fd` 表示。在進行進階檔案操作前，必須先透過 `fs.open()` 取得檔案描述符。

**1. Callback 方式：**
```javascript
const fs = require('node:fs');

fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
  // fd 就是檔案描述符
});
```

**2. 同步方式：**
```javascript
const fs = require('node:fs');

try {
  const fd = fs.openSync('/Users/joe/test.txt', 'r');
} catch (err) {
  console.error(err);
}
```

**3. Promise 方式（Node.js v14+）：**
```javascript
const fs = require('node:fs/promises');

async function example() {
  let filehandle;
  try {
    filehandle = await fs.open('/Users/joe/test.txt', 'r');
    console.log(filehandle.fd);
    console.log(await filehandle.readFile({ encoding: 'utf8' }));
  } finally {
    if (filehandle) {
      await filehandle.close();
    }
  }
}
example();
```

`fs.open()` 的第二個參數為開啟模式 flag（如 `r` 唯讀、`r+` 讀寫、`w+` 讀寫並建立、`a` 追加、`a+` 讀寫追加）。

**重要提醒：**
- 取得 file descriptor 後，可執行 `fs.close()` 等各種檔案系統操作
- Promise 方式回傳的是 `FileHandle` 物件，使用完畢務必在 `finally` 中呼叫 `filehandle.close()` 釋放資源
- 舊版 Node.js（v14 以前）可使用 `util.promisify(fs.open)` 將 callback 轉為 Promise

---

### Working with Folders in Node.js
> 原文連結：https://nodejs.org/en/learn/manipulating-files/working-with-folders-in-nodejs

Node.js `fs` 模組提供完整的目錄操作方法，每個操作都有 callback、sync、promise 三種版本。

**檢查資料夾是否存在：** 使用 `fs.access()` 或 `fsPromises.access()`。

**建立資料夾：**
```javascript
const fs = require('node:fs');

const folderName = '/Users/joe/test';

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}
```

**讀取資料夾內容：**
```javascript
const fs = require('node:fs');
const path = require('node:path');
const folderPath = '/Users/joe';

// 取得相對路徑
fs.readdirSync(folderPath);

// 取得完整路徑
fs.readdirSync(folderPath).map(fileName => {
  return path.join(folderPath, fileName);
});

// 只篩選檔案（排除子目錄）
const isFile = fileName => fs.lstatSync(fileName).isFile();

fs.readdirSync(folderPath)
  .map(fileName => path.join(folderPath, fileName))
  .filter(isFile);
```

**重新命名資料夾：**
```javascript
// Promise 方式
const fs = require('node:fs/promises');

async function example() {
  try {
    await fs.rename('/Users/joe', '/Users/roger');
  } catch (err) {
    console.log(err);
  }
}
```

**刪除資料夾：**
- 空資料夾：使用 `fs.rmdir()`
- 包含內容的資料夾：使用 `fs.rm()` 搭配 `{ recursive: true, force: true }` 遞迴刪除：
```javascript
const fs = require('node:fs');

fs.rm(dir, { recursive: true, force: true }, err => {
  if (err) {
    throw err;
  }
  console.log(`${dir} is deleted!`);
});
```
`force: true` 選項會在資料夾不存在時忽略錯誤，而非拋出例外。

---

### Working with Different Filesystems
> 原文連結：https://nodejs.org/en/learn/manipulating-files/working-with-different-filesystems

本文探討如何撰寫能在不同檔案系統上安全運行的 Node.js 程式碼。不同檔案系統在以下特性上有差異：大小寫敏感度、Unicode 格式保留、時間戳精度、擴展屬性、Unix 權限等。

**核心原則：採用「超集」策略，而非「最小公約數」策略。**

**不要做：**
- 不要將檔名統一轉為大寫/小寫儲存
- 不要將 Unicode 正規化（NFC/NFD）後儲存
- 不要將時間戳截斷為較低精度
- 這些做法會造成檔名衝突、資料損毀，且無法修復

**應該做：**
- 保留檔案系統回傳的原始大小寫
- 保留原始的 Unicode 位元組序列
- 保留檔案系統原生精度的時間戳
- 僅在「比較」時使用正規化，絕不用於「儲存」

**Unicode 比較範例：**
```javascript
// 正確：僅在比較時正規化
function compareFilenames(name1, name2) {
  return name1.normalize('NFC') === name2.normalize('NFC');
}

// 錯誤：絕不要正規化後儲存
const normalizedName = filename.normalize('NFC');
fs.renameSync(oldPath, normalizedName); // 這會損毀資料！
```

**檔案系統差異重點：**
- **HFS+（macOS）：** 會將 Unicode 正規化為 NFD 格式
- **NTFS（Windows）：** 保留原始 Unicode 格式，大小寫不敏感
- **EXT4（Linux）：** 保留原始 Unicode 格式，大小寫敏感
- 時間戳精度從奈秒到 24 小時不等，視檔案系統而定

**重要提醒：** 不要從 `process.platform` 推斷檔案系統行為。macOS 可能使用大小寫敏感的 HFSX，Linux 可能掛載不支援 Unix 權限的外部磁碟。應實際探測檔案系統的真實行為，而非假設標準行為。

| 原則 | 應該做 | 不應該做 |
|------|--------|---------|
| 大小寫 | 保留檔案系統提供的原始大小寫 | 為了儲存而正規化為大寫/小寫 |
| Unicode | 保留原始位元組序列 | 為了儲存而正規化 NFC/NFD |
| 時間戳 | 以檔案系統原生精度儲存 | 截斷為較低精度 |
| 比較 | 使用正規化函式進行相等比較 | 跨格式直接比較原始字串 |

---

## Asynchronous Work

### JavaScript Asynchronous Programming and Callbacks
> 原文連結：https://nodejs.org/en/learn/asynchronous-work/javascript-asynchronous-programming-and-callbacks

**非同步的本質：** 電腦本身是非同步設計的，程式在特定時間片段執行後會暫停，讓其他程式繼續運行。大多數語言（C、Java、Python 等）預設是同步的，透過執行緒或新行程來處理非同步。

**JavaScript 的特點：** JavaScript 預設是同步且單執行緒的，無法建立新執行緒。它誕生於瀏覽器環境，透過瀏覽器提供的 API 處理非同步功能（如 `onClick`、`onMouseOver` 等事件）。Node.js 進一步擴展了此能力，提供非阻塞 I/O 操作。

**Callback（回呼函式）：** 是一個作為值傳遞給另一個函式的函式，只在特定事件發生時才執行。JavaScript 的「一等函式」（first-class functions）特性使這成為可能。

```javascript
// 事件監聽器
document.getElementById('button').addEventListener('click', () => {
  // item clicked
});

// 計時器
setTimeout(() => {
  // runs after 2 seconds
}, 2000);
```

**Error-First Callback 模式：** Node.js 的慣例是 callback 的第一個參數為錯誤物件，無錯誤時為 `null`：

```javascript
const fs = require('node:fs');

fs.readFile('/file.json', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
});
```

**Callback Hell（回呼地獄）：** 多層巢狀的 callback 會導致程式碼難以維護，稱為「末日金字塔」。ES6 引入了 **Promises**，ES2017 引入了 **Async/Await** 來解決此問題。

```javascript
// Callback Hell 範例
window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {
    setTimeout(() => {
      items.forEach(item => {
        // your code here
      });
    }, 2000);
  });
});
```

---

### Asynchronous Flow Control
> 原文連結：https://nodejs.org/en/learn/asynchronous-work/asynchronous-flow-control

**核心問題：** JavaScript 主執行緒必須保持非阻塞。深層巢狀的非同步操作會產生 callback hell，使程式碼難以閱讀與維護。

**解決方案 - 函式組合：** 將複雜操作結構化為三種函式：
1. **Initiator（起始者）** - 序列中的第一個函式
2. **Middleware（中介層）** - 回傳其他函式的函式
3. **Terminator（終結者）** - 呼叫 callback 的函式

```javascript
function final(someInput, callback) {
  callback(`${someInput} and terminated by executing callback `);
}

function middleware(someInput, callback) {
  return final(`${someInput} touched by middleware `, callback);
}

function initiate() {
  const someInput = 'hello this is a function ';
  middleware(someInput, function (result) {
    console.log(result);
  });
}

initiate();
```

**狀態管理：** 避免使用全域變數（反模式），應直接傳遞變數或從快取/資料庫中取得。

**非同步資料的陷阱：** `setTimeout` 會將程式碼排入稍後執行，但函式會立即返回，導致資料尚未準備好就被使用。

**三種關鍵模式：**

**1. 串列執行（In Series）** - 順序很重要，每步依賴前一步結果：

```javascript
function serialProcedure(operation) {
  if (!operation) process.exit(0);
  executeFunctionWithArgs(operation, function (result) {
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

**2. 有限串列（Limited in Series）** - 大量資料集搭配執行上限：適用於批量處理但需限制數量的場景（如發送 100 萬封郵件）。

**3. 完全平行（Full Parallel）** - 順序無關、操作獨立：適用於同時發送多封郵件等場景，使用計數器判斷是否全部完成。

```javascript
recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) success += 1;
    else failed.push(recipient.name);
    count += 1;
    if (count === recipients.length) {
      final({ count, success, failed });
    }
  });
});
```

---

### Discover Promises in Node.js
> 原文連結：https://nodejs.org/en/learn/asynchronous-work/discover-promises-in-nodejs

**Promise 是什麼：** 代表非同步操作最終完成（或失敗）的特殊物件。類比：訂披薩 -- 你不會立即拿到，但送餐員「承諾」會送到。

**三種狀態：**
1. **Pending（待定）** - 操作仍在進行
2. **Fulfilled（已完成）** - 操作成功完成
3. **Rejected（已拒絕）** - 操作失敗

```javascript
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve('Operation was successful!');
  } else {
    reject('Something went wrong.');
  }
});
```

**處理 Promise：** `.then()` 處理成功、`.catch()` 處理失敗、`.finally()` 無論結果都執行。

**Promise 鏈式呼叫：** 每個 `.then()` 會等待前一個完成後才執行，可用來組織多個非同步操作的順序。

**Async/Await（現代寫法）：** 讓非同步程式碼看起來像同步：

```javascript
async function performTasks() {
  try {
    const result1 = await promise1;
    const result2 = await promise2;
    console.log(result1, result2);
  } catch (error) {
    console.error(error);
  }
}
```

**Node.js Promise 版 API：**

```javascript
const fs = require('node:fs/promises');

async function readFile() {
  try {
    const data = await fs.readFile('example.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}
```

**進階 Promise 方法：**

| 方法 | 行為 |
|------|------|
| `Promise.all()` | 所有 Promise 都 fulfilled 才 resolve；任一 reject 立即 reject |
| `Promise.allSettled()` | 等待所有 Promise 結算，回傳每個的狀態和結果 |
| `Promise.race()` | 第一個結算的 Promise 決定結果 |
| `Promise.any()` | 第一個 resolve 的 Promise 決定結果；全部 reject 才 reject |
| `Promise.try()` | 執行函式（同步或非同步），包裝結果為 Promise |
| `Promise.withResolvers()` | 建立 Promise，resolve/reject 函式可在外部存取 |

**排程方法比較：**

| 方法 | 時機 |
|------|------|
| `queueMicrotask()` | 當前腳本之後、I/O 之前 |
| `process.nextTick()` | 任何 I/O 事件之前 |
| `setImmediate()` | poll 階段之後（check 階段） |

---

### Discover JavaScript Timers
> 原文連結：https://nodejs.org/en/learn/asynchronous-work/discover-javascript-timers

**`setTimeout()`：** 延遲指定毫秒後執行函式一次。

```javascript
setTimeout(() => {
  // runs after 2 seconds
}, 2000);

// 帶參數的用法
const myFunction = (firstParam, secondParam) => {
  // do something
};
setTimeout(myFunction, 2000, firstParam, secondParam);

// 取消
const timeout = setTimeout(() => {}, 2000);
clearTimeout(timeout);
```

**零延遲 `setTimeout`：** 設定 `0` 毫秒不代表立即執行，而是在當前函式執行完成後盡快執行，可用來避免 CPU 密集任務阻塞。

```javascript
setTimeout(() => {
  console.log('after ');
}, 0);
console.log(' before ');
// 輸出：before -> after
```

**`setInterval()`：** 以指定間隔重複執行 callback：

```javascript
const interval = setInterval(() => {
  if (App.somethingIWait === 'arrived') {
    clearInterval(interval);
  }
  // otherwise do things
}, 100);
```

**遞迴 `setTimeout` vs `setInterval`：** `setInterval` 不考慮前次執行耗時，可能造成重疊。遞迴 `setTimeout` 在前次完成後才排程下一次，確保間隔一致：

```javascript
const myFunction = () => {
  // do something
  setTimeout(myFunction, 1000);
};
setTimeout(myFunction, 1000);
```

---

### Overview of Blocking vs Non-Blocking
> 原文連結：https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking

**Blocking（阻塞）：** Node.js 程序中額外的 JavaScript 必須等待非 JavaScript 操作完成。Event Loop 在阻塞操作期間無法繼續執行其他 JavaScript。Node.js 標準函式庫中使用 libuv 的同步方法是最常見的阻塞操作。

**Non-Blocking（非阻塞）：** 所有 I/O 方法都提供非同步版本，接受 callback 函式。以 `Sync` 結尾的方法名是其阻塞對應版本。

```javascript
// 阻塞（同步）
const fs = require('node:fs');
const data = fs.readFileSync('/file.md'); // 阻塞直到讀取完成
console.log(data);
moreWork(); // 在 console.log 之後執行

// 非阻塞（非同步）
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
  console.log(data);
});
moreWork(); // 在 console.log 之前執行
```

**並發與吞吐量：** Node.js 是單執行緒的，「並發」指 Event Loop 完成其他工作後執行 callback 的能力。例如一個 Web 請求花 50ms，其中 45ms 是資料庫 I/O，使用非阻塞操作可將這 45ms 釋放來處理其他請求。

**混用阻塞與非阻塞的危險：**

```javascript
// 錯誤！fs.unlinkSync 可能在 fs.readFile 完成前就執行
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
  console.log(data);
});
fs.unlinkSync('/file.md');

// 正確：將相依操作放在 callback 內
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr;
  console.log(data);
  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) throw unlinkErr;
  });
});
```

---

### The Node.js Event Loop, Timers, and process.nextTick()
> 原文連結：https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick

**Event Loop 是什麼：** 允許 Node.js 在單執行緒下執行非阻塞 I/O 操作，透過將操作卸載到系統核心，核心完成後通知 Node.js 將對應的 callback 加入 poll 佇列。

**Event Loop 六個階段（按執行順序）：**

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

1. **timers** - 執行 `setTimeout()` 和 `setInterval()` 的 callback。指定的是最低延遲閾值，非精確時間。
2. **pending callbacks** - 執行延遲到下一輪迴圈的 I/O callback（如 TCP `ECONNREFUSED`）。
3. **idle, prepare** - 僅供內部使用。
4. **poll** - 取得新的 I/O 事件、執行 I/O 相關 callback。佇列非空時依序執行；佇列為空且有 `setImmediate()` 時進入 check 階段；否則等待新 callback。
5. **check** - 執行 `setImmediate()` 的 callback。
6. **close callbacks** - 執行關閉事件的 callback（如 `socket.on('close', ...)`）。

**`setImmediate()` vs `setTimeout()` 的執行順序：**

```javascript
// 在 I/O 循環外 - 順序不確定
setTimeout(() => { console.log('timeout'); }, 0);
setImmediate(() => { console.log('immediate'); });

// 在 I/O 循環內 - setImmediate 總是先執行
const fs = require('node:fs');
fs.readFile(__filename, () => {
  setTimeout(() => { console.log('timeout'); }, 0);
  setImmediate(() => { console.log('immediate'); });
});
// 輸出：immediate -> timeout
```

**`process.nextTick()`：** 不屬於 Event Loop，在當前操作完成後、Event Loop 繼續到下一階段前執行。遞迴呼叫會「餓死」I/O。

**使用場景 -- 確保非同步一致性與允許 handler 綁定：**

```javascript
// 確保 callback 在其餘程式碼執行完後才呼叫
function apiCall(arg, callback) {
  if (typeof arg !== 'string') {
    return process.nextTick(callback, new TypeError('argument should be string'));
  }
}

// EventEmitter 在建構函式中 emit 事件前，讓使用者有機會綁定 handler
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    process.nextTick(() => { this.emit('event'); });
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => { console.log('an event occurred!'); });
```

---

### The Node.js Event Emitter
> 原文連結：https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter

**EventEmitter 是什麼：** `events` 模組提供的核心類別，用於建立事件驅動系統。可以觸發事件、監聽事件、管理監聽器。

```javascript
const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();
```

**核心方法：**

`emit()` - 觸發事件，執行所有已註冊的監聽器：

```javascript
eventEmitter.on('start', () => {
  console.log('started');
});
eventEmitter.emit('start');
```

`on()` - 註冊監聽器，每次事件觸發時執行。可傳遞多個參數：

```javascript
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});
eventEmitter.emit('start', 1, 100);
// 輸出：started from 1 to 100
```

**其他重要方法：**

| 方法 | 說明 |
|------|------|
| `once()` | 一次性監聽器，執行一次後自動移除 |
| `removeListener()` / `off()` | 移除特定事件的特定監聽器 |
| `removeAllListeners()` | 移除某事件的所有監聽器 |

```javascript
eventEmitter.once('event', () => {
  console.log('This runs only once');
});

const listener = () => console.log('event triggered');
eventEmitter.on('event', listener);
eventEmitter.off('event', listener);
```

**關鍵特性：** 多個監聽器按註冊順序執行；支援透過 `emit()` 傳遞任意數量參數。

---

### Understanding process.nextTick()
> 原文連結：https://nodejs.org/en/learn/asynchronous-work/understanding-processnexttick

**核心概念：** `process.nextTick()` 將函式排程在當前呼叫堆疊完成後、Event Loop 繼續前立即執行。優先級高於其他非同步操作。

```javascript
process.nextTick(() => {
  // do something
});
```

**運作機制：** 當 runtime 處理某個事件（稱為一個「tick」）時，Event Loop 正忙於處理當前函式。操作結束後，引擎會先執行所有 `nextTick()` 排入的函式，然後 Event Loop 才繼續處理其他佇列中的任務。

**與 `setTimeout()` 的關鍵差異：**

```javascript
setTimeout(() => {}, 0);    // 在下一個 tick 的尾端執行（較晚）
process.nextTick(() => {}); // 在下一個 tick 的開頭之前執行（較早）
```

`nextTick()` 優先處理呼叫，在當前堆疊後立即執行；`setTimeout(0)` 則被推遲到 Event Loop 的稍後階段。

**使用時機：** 需要確保程式碼在下一個 Event Loop 迭代中執行，但在任何 I/O 事件處理之前就已完成時。

---

### Understanding setImmediate()
> 原文連結：https://nodejs.org/en/learn/asynchronous-work/understanding-setimmediate

**核心功能：** `setImmediate()` 將程式碼排程在 Event Loop 下一次迭代的 check 階段非同步執行。

```javascript
setImmediate(() => {
  // run something
});
```

**與其他非同步方法的差異：**

- `process.nextTick()` 在當前迭代執行，總是先於 `setTimeout` 和 `setImmediate`
- 在 I/O callback 內：`setImmediate` 保證在當前迭代的 check 階段執行；`setTimeout` 需等到後續迭代的 timers 階段

**佇列優先順序：**
1. `process.nextTick queue`（最先）
2. `promises microtask queue`（其次）
3. `macrotask queue`（`setTimeout`、`setImmediate`）（最後）

**執行順序範例：**

```javascript
const baz = () => console.log('baz');
const foo = () => console.log('foo');
const zoo = () => console.log('zoo');

const start = () => {
  console.log('start');
  setImmediate(baz);
  new Promise((resolve, reject) => {
    resolve('bar');
  }).then(resolve => {
    console.log(resolve);
    process.nextTick(zoo);
  });
  process.nextTick(foo);
};

start();
// 輸出：start foo bar zoo baz
```

執行分解：
1. `start()` 印出 "start"
2. `foo()` 從 nextTick 佇列執行 -> "foo"
3. Promise 的 `.then()` 從 microtask 佇列執行 -> "bar"，並將 `zoo` 加入 nextTick 佇列
4. `zoo()` 執行 -> "zoo"
5. `baz()` 從 macrotask 佇列執行 -> "baz"

**ES Modules 的差異：** 在 `.mjs` 檔案中，整個腳本被包裝為非同步操作，輸出順序變為 `start bar foo zoo baz`，因為 Promise 的 microtask 佇列會先被清空。

---

### Don't Block the Event Loop (or the Worker Pool)
> 原文連結：https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop

**核心原則：** Node.js 在 Event Loop 中執行 JavaScript，並提供 Worker Pool 處理昂貴的任務。Node.js 之所以快速，是因為每個客戶端在任何時刻關聯的工作量很「小」。阻塞任一執行緒都會降低吞吐量甚至造成 DoS 攻擊。

**架構概述：**
- **Event Loop：** 執行 JS callback、處理非阻塞非同步請求（網路 I/O）
- **Worker Pool（libuv）：** 處理 I/O 密集型任務（`dns.lookup()`、檔案系統 API）和 CPU 密集型任務（`crypto.pbkdf2()`、`crypto.scrypt()`、`zlib` 等）

**如何評估複雜度：**

```javascript
// O(1) - 安全
app.get('/constant-time', (req, res) => {
  res.sendStatus(200);
});

// O(n) - 取決於輸入
app.get('/countToN', (req, res) => {
  const n = req.query.n;
  for (let i = 0; i < n; i++) {
    console.log(`Iter ${i}`);
  }
  res.sendStatus(200);
});

// O(n^2) - 更危險
app.get('/countToN2', (req, res) => {
  const n = req.query.n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(`Iter ${i}.${j}`);
    }
  }
  res.sendStatus(200);
});
```

**關鍵規則：限制輸入大小，拒絕過長的輸入。**

**REDOS（正規表達式阻斷服務攻擊）：** 避免巢狀量詞 `(a+)*`、重疊 OR 子句 `(a|a)*`、反向參照 `(a.*) \1`。對簡單字串匹配使用 `indexOf()`。

```javascript
// 易受攻擊的正規表達式
app.get('/redos-me', (req, res) => {
  const filePath = req.query.filePath;
  if (filePath.match(/(\/.+)+$/)) {  // 巢狀量詞 - 危險！
    console.log('valid path');
  } else {
    console.log('invalid path');
  }
  res.sendStatus(200);
});
```

防護工具：`safe-regex`、`node-re2`（使用 Google RE2 引擎）。

**伺服器中應避免的同步 API：**
- 加密：`crypto.randomFillSync()`、`crypto.pbkdf2Sync()` 等
- 壓縮：`zlib.inflateSync()`、`zlib.deflateSync()` 等
- 檔案系統：所有同步 API（特別是分散式檔案系統如 NFS，延遲不可預測）
- 子行程：`child_process.spawnSync()`、`child_process.execSync()` 等

**JSON DoS：** `JSON.parse()` 和 `JSON.stringify()` 雖是 O(n) 但對大物件可能很慢（50MB 字串：stringify 0.7s、parse 1.3s）。解決方案：使用串流式 JSON 函式庫如 `JSONStream`。

**不阻塞的複雜計算方案：**

**方案一：分割（Partitioning）** - 使用 `setImmediate()` 將控制權交回 Event Loop：

```javascript
function asyncAvg(n, avgCB) {
  let sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }
    setImmediate(help.bind(null, i + 1, cb));
  }
  help(1, function (sum) {
    const avg = sum / n;
    avgCB(avg);
  });
}
```

**方案二：卸載（Offloading）** - 將工作移至 Worker Pool，使用 C++ addon（N-API）、Child Process 或 Cluster。注意：不要為每個客戶端建立子行程（fork bomb）。

**Worker Pool 注意事項：** Worker 數量 `k` 遠小於並發客戶端數，應最小化任務時間的變異。一個長任務會使 Worker Pool 有效大小減 1。解決方案：將可變長度任務拆分為相似成本的子任務。

**npm 模組風險：** 不僅關注 API 是否正確，更要確認其是否阻塞 Event Loop 或 Worker Pool。對複雜 API，應檢視原始碼或要求開發者提供效能成本文件。

---

## TypeScript

### Introduction to TypeScript
> 原文連結：https://nodejs.org/en/learn/typescript/introduction

**TypeScript 是什麼？**
TypeScript 是由 Microsoft 維護的開源語言，基於 JavaScript 之上增加了型別語法，能在編輯器或 CI/CD 流程中提早發現錯誤，並提升程式碼的可維護性。

**基本範例：**

```typescript
type User = {
  name: string;
  age: number;
};

function isAdult(user: User): boolean {
  return user.age >= 18;
}

const justine = {
  name: 'Justine',
  age: 23,
} satisfies User;

const isJustineAnAdult = isAdult(justine);
```

此範例展示了幾個核心概念：
- **型別宣告（Type Declaration）**：使用 `type` 關鍵字建立自訂物件型別。
- **函式型別標註**：`isAdult` 接受 `User` 型別參數並回傳 `boolean`。
- **型別推論（Type Inference）**：TypeScript 能自動推論變數型別，例如 `isJustineAnAdult` 會被推論為 `boolean`，無需手動標註。
- **型別安全**：TypeScript 會強制檢查型別使用是否正確，防止誤用。

**TypeScript 的組成：**

1. **TypeScript 程式碼**：在 JavaScript 基礎上加入型別標註語法，編譯後型別相關語法會被移除，產出純 JavaScript。
2. **型別定義檔（Type Definitions）**：存放在 `.d.ts` 檔案中，僅包含型別資訊，不含實作邏輯。用於讓 TypeScript 理解現有 JavaScript 函式庫的型別。許多套件的型別定義在 `@types` 命名空間下（由 DefinitelyTyped 社群維護），例如：
   ```bash
   npm add --save-dev @types/node
   ```
   安裝後即可對 Node.js API 進行型別檢查與自動完成。
3. **轉換能力**：TypeScript 也具備程式碼轉換功能，例如將 JSX 語法轉為一般 JavaScript（類似 Babel 的功能）。

---

### Running TypeScript Natively
> 原文連結：https://nodejs.org/en/learn/typescript/run-natively

**核心概念：Node.js 現在可以原生執行 TypeScript，不需要事先轉譯。**

**快速開始：**

- **Node.js v22.18.0 及之後版本**：若原始碼只包含「可擦除的 TypeScript 語法（erasable syntax）」，可直接執行：
  ```bash
  node example.ts
  ```
- **v22.18.0 之前版本**：需加上旗標：
  ```bash
  node --experimental-strip-types example.ts
  ```

**進階：僅限 TypeScript 的語法（如 `enum`、`namespace`）**

從 v22.7.0 起，可使用 `--experimental-transform-types` 旗標來支援需要轉換的 TypeScript 專屬語法：
```bash
node --experimental-transform-types another-example.ts
```
注意：啟用此旗標會自動隱含啟用 `--experimental-strip-types`，不需兩者都寫。此旗標為選擇性啟用（opt-in），僅在程式碼需要時才使用。

**停用 TypeScript 支援：**
```bash
node --no-experimental-strip-types example.ts
```

**關於設定檔：**
- Node.js 的 TypeScript 載入器（[Amaro](https://github.com/nodejs/amaro)）**不需要** `tsconfig.json` 即可執行 TypeScript。
- 但仍建議建立 `tsconfig.json` 以確保編輯器與 `tsc` 的行為與 Node.js 執行時一致。
- 建議使用 **TypeScript 5.7 或更高版本**。

**限制：** 原生支援有一些限制，詳情請參考官方 API 文件。

---

### Running TypeScript code using transpilation
> 原文連結：https://nodejs.org/en/learn/typescript/transpile

**轉譯（Transpilation）** 是將 TypeScript 原始碼轉換為 JavaScript 的過程，因為瀏覽器和 Node.js 無法直接執行 TypeScript。

**操作步驟：**

**第一步：撰寫 TypeScript 檔案**（`example.ts`）

**第二步：安裝 TypeScript 作為開發依賴**
```bash
npm i -D typescript
```

**第三步：使用 `tsc` 編譯**
```bash
npx tsc example.ts
```
這會產生對應的 `example.js` 檔案。

**第四步：用 Node.js 執行編譯後的 JavaScript**
```bash
node example.js
```

**型別錯誤檢查：**

TypeScript 編譯器會在編譯階段捕捉型別錯誤，阻止有問題的程式碼被執行。例如：
```typescript
const justine: User = {
  name: 'Justine',
  age: 'Secret!',  // Error: Type 'string' is not assignable to type 'number'.
};

const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
// Error: Expected 1 arguments, but got 2.
// Error: Type 'boolean' is not assignable to type 'string'.
```

**重點整理：**
- 轉譯將 `.ts` 轉為 `.js`。
- `tsc` 是 TypeScript 官方編譯器。
- 型別錯誤在編譯階段被捕捉，而非執行階段。
- 編譯後的 `.js` 檔案可直接用 Node.js 執行。

---

### Running TypeScript with a Runner
> 原文連結：https://nodejs.org/en/learn/typescript/run

**概述：** 本文介紹如何使用第三方執行工具（runner）來執行 TypeScript，適用於進階 TypeScript 處理需求或 Node.js v22.7.0 之前的版本。較新版本可直接使用 Node.js 內建的 TypeScript 支援。

**工具一：`ts-node`**

- 一個 TypeScript 執行環境，允許直接執行 `.ts` 檔案，無需預先編譯。
- **預設會執行型別檢查**（除非啟用 `transpileOnly`）。
- 安裝與使用：
  ```bash
  npm i -D ts-node
  npx ts-node example.ts
  ```
- 注意：雖然 `ts-node` 能在執行時捕捉型別錯誤，但建議上線前仍應先用 `tsc` 做型別檢查。

**工具二：`tsx`**

- 另一個 TypeScript 執行環境，同樣可直接執行 `.ts` 檔案。
- **不會執行型別檢查**，採用純轉譯方式，因此速度更快。
- 安裝與使用：
  ```bash
  npm i -D tsx
  npx tsx example.ts
  ```
- 也可透過 Node.js 的 `--import` 旗標註冊：
  ```bash
  node --import=tsx example.ts
  ```

**兩者比較：**

| 特性 | ts-node | tsx |
|------|---------|-----|
| 型別檢查 | 預設啟用 | 無 |
| 編譯方式 | JIT 編譯 | 轉譯 |
| 速度 | 較慢（型別檢查開銷） | 較快 |
| 建議工作流程 | 直接執行 | 先用 `tsc --noEmit` 檢查型別，再執行 |

**建議的 `tsx` 工作流程：**
```bash
tsc --noEmit        # 先做型別檢查
npx tsx your-file.ts # 再執行
```

---

### Publishing a TypeScript Package
> 原文連結：https://nodejs.org/en/learn/typescript/publishing-a-ts-package

**核心原則：發佈編譯後的 JavaScript 與型別宣告檔，而非原始 TypeScript 原始碼。**

**重要觀念：**

- `package.json` 中的 `main` 欄位指向**發佈後的內容**（JavaScript），所以應設為 `"main": "main.js"` 而非 `main.ts`。
- `scripts` 欄位則針對**原始碼**操作，可使用 `.ts` 副檔名，例如 `"test": "node --test './src/**/*.test.ts'"`。

**關於 Node.js 的 Type Stripping：**
- Node.js 22.18.0 起預設啟用 type stripping。
- 但 Node.js **不會**對 `node_modules` 中的檔案進行 type stripping（避免效能問題）。
- TypeScript 維護者目前不建議直接發佈原始 TypeScript。
- 若使用 `enum` 等特殊語法，可在 TypeScript 5.8+ 中啟用 `erasableSyntaxOnly` 選項確保不使用不相容的功能。

**目錄結構：**

原始碼結構包含 `src/` 目錄下的 `.ts` 及 `.test.ts` 檔案；發佈後的套件僅包含 `.js`、`.d.ts`、`.d.ts.map` 檔案。

**型別宣告檔（`.d.ts`）的產生：**

- 型別宣告是 sidecar 檔案，提供型別資訊但不含執行邏輯。
- 不需要提交到版本控制，可在發佈時即時產生。
- 應在 `npm publish` 之前立即產生。

**`package.json` 範例：**
```json
{
  "name": "example-ts-pkg",
  "version": "1.0.0",
  "main": "main.js",
  "types": "main.d.ts",
  "scripts": {
    "test": "node --test './src/**/*.test.ts'",
    "types:check": "tsc --noEmit",
    "build": "tsc"
  }
}
```

**`.npmignore` 範例：**
```
*.test.ts
*.fixture.*
src/
.github/
*.json
!package.json
!*.d.ts
```
特別注意 `!*.d.ts` 這行例外規則，否則型別宣告檔會被排除在發佈之外。

**CI 中的型別檢查：**

將型別檢查視為與單元測試同等重要的步驟。建議在 GitHub Actions 的 CI 工作流程中獨立設置 `types:check` 步驟（執行 `tsc --noEmit`），與測試步驟分開，因為型別檢查不受平台或 Node.js 版本影響。

**最佳實踐：**
- 使用 Dependabot 保持依賴更新。
- 使用 `.nvmrc` 指定專案使用的 Node.js 版本。
- 在多個作業系統（macOS、Ubuntu、Windows）及多個 Node.js LTS 版本上執行測試矩陣。

---

## Modules

### How to Use Streams
> 原文連結：https://nodejs.org/en/learn/modules/how-to-use-streams

Node.js 的 Streams 是一種用於處理資料流的強大抽象機制。所有 Stream 都繼承自 `EventEmitter`，能在資料處理的各階段發出事件。

**為什麼要用 Streams？**
- **記憶體效率**：以 chunk 為單位逐步處理資料，而非一次載入整個資料集到記憶體中。
- **回應速度**：資料到達即可立即處理，無需等待整個 payload。
- **可擴展性**：以有限資源處理大量資料，適合即時應用。

> 注意：若應用程式中資料已全部在記憶體中，使用 Streams 反而會增加不必要的開銷。

**四種 Stream 類型：**

**1. Readable Stream（可讀流）** — 從來源依序讀取資料，如 `fs.ReadStream`、`process.stdin`。

```javascript
class MyStream extends Readable {
  #count = 0;
  _read(size) {
    this.push(':-)');
    if (++this.#count === 5) {
      this.push(null); // 結束信號
    }
  }
}

const stream = new MyStream();
stream.on('data', chunk => {
  console.log(chunk.toString());
});
```

使用 `readable` 事件可實現更精細的控制，搭配 `highWaterMark` 設定緩衝區大小。

**2. Writable Stream（可寫流）** — 依序輸出資料，如 `fs.WriteStream`、`process.stdout`。

```javascript
const stream = new MyStream(); // extends Writable, highWaterMark: 10
for (let i = 0; i < 10; i++) {
  const waitDrain = !stream.write('hello');
  if (waitDrain) {
    console.log('>> wait drain');
    await once(stream, 'drain');
  }
}
stream.end('world');
```

當 `.write()` 回傳 `false` 時，代表背壓啟動，需等待 `drain` 事件才能繼續寫入。

**3. Duplex Stream（雙工流）** — 同時實現可讀與可寫，例如 `net.Socket`。可用於建立 TCP 伺服器與客戶端。

**4. Transform Stream（轉換流）** — 特殊的 Duplex，輸出根據輸入計算而來，用於資料轉換。

```javascript
const upper = new Transform({
  transform(data, enc, cb) {
    this.push(data.toString().toUpperCase());
    cb();
  },
});
```

**Stream 操作方式：**

**`.pipe()` 方法** — 將可讀流串接到可寫/轉換流。缺點是錯誤處理困難，其他流不會收到錯誤通知，可能導致記憶體洩漏。

**`pipeline()` 函式（推薦）** — 更安全的管道方式，自動處理錯誤與清理。

```javascript
const { pipeline } = require('node:stream');
pipeline(readStream, upper, writeStream, err => {
  if (err) return console.error('Pipeline error:', err.message);
  console.log('Pipeline succeeded');
});
```

也支援 async/await 版本：`require('node:stream/promises').pipeline()`。

**Async Iterators（推薦）** — 使用 `for await...of` 語法，程式碼更簡潔、可讀性更高、自動處理背壓。

```javascript
async function main() {
  await pipeline(
    fs.createReadStream(__filename),
    async function* (source) {
      for await (let chunk of source) {
        yield chunk.toString().toUpperCase();
      }
    },
    process.stdout
  );
}
```

**Object Mode** — 設定 `objectMode: true` 可讓 Stream 處理任意 JavaScript 物件，此時 `highWaterMark` 代表物件數量而非位元組數。

**Node.js Streams vs Web Streams** — Node.js 提供兩種實作。可透過 `Duplex.toWeb()` / `Duplex.fromWeb()` 互相轉換。使用 `fetch` API 時，回傳的 body 是 Web `ReadableStream<Uint8Array>`，需搭配 `TextDecoderStream` 處理字串。

---

### Backpressuring in Streams
> 原文連結：https://nodejs.org/en/learn/modules/backpressuring-in-streams

背壓（Backpressure）是指資料傳輸過程中，當接收端處理速度慢於傳送端，資料在緩衝區中堆積的現象。Streams 透過流量控制（flow control）機制來解決此問題。

**不處理背壓的後果：**
1. 拖慢所有其他程序
2. 垃圾回收器過度負荷
3. 記憶體耗盡

**實際記憶體對比：**
- 有背壓：最大記憶體約 ~87.81 MB
- 無背壓：最大記憶體約 ~1.52 GB（差距達一個數量級）

**背壓運作機制：**

核心在於 `.write()` 的回傳值。當回傳 `false` 時（緩衝區超過 `highWaterMark` 或寫入佇列忙碌）：
1. 傳入的 Readable stream 暫停
2. 消費端處理已緩衝的資料
3. 緩衝區清空後發出 `drain` 事件
4. 資料流恢復

使用 `pipeline()` 處理錯誤（推薦）：

```javascript
const { pipeline } = require('node:stream');
pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  err => {
    if (err) console.error('Pipeline failed', err);
    else console.log('Pipeline succeeded');
  }
);
```

**Streams 黃金規則：**
1. **未被請求時，絕不 `.push()`**
2. **`.write()` 回傳 false 後，絕不繼續呼叫** — 等 `drain` 事件
3. **仔細測試** — Streams 行為在不同 Node.js 版本間可能改變

**Readable Stream 正確做法：**

```javascript
// 錯誤：忽略 .push() 回傳值
while (null !== (chunk = getNextChunk())) {
  this.push(chunk); // 未檢查回傳值
}

// 正確：尊重回傳值
let canPushMore = true;
while (canPushMore && null !== (chunk = getNextChunk())) {
  canPushMore = this.push(chunk); // 檢查是否可繼續推送
}
```

**Writable Stream 注意事項：**

回呼函式（callback）只能呼叫一次，使用 `return callback()` 避免重複呼叫。

**`.cork()` 和 `.uncork()` 最佳實踐：**

```javascript
// 正確：使用 process.nextTick 批次處理
ws.cork();
ws.write('hello ');
ws.write('world ');
process.nextTick(doUncork, ws);

function doUncork(stream) {
  stream.uncork();
}
```

**`highWaterMark` 預設值：**
- 一般模式：16 KB（16384 bytes）
- Object mode：16 個物件

---

### Publishing a Package
> 原文連結：https://nodejs.org/en/learn/modules/publishing-a-package

本文詳細說明發佈 Node.js 套件時，如何處理 CommonJS (CJS) 與 ECMAScript Modules (ESM) 格式。**核心建議：通常只發佈一種格式（CJS 或 ESM），避免雙套件風險（Dual-Package Hazard）。**

**兩種主要選擇：**
1. 以 CJS 撰寫並發佈 — CJS 與 ESM 消費者皆可使用
2. 以 ESM 撰寫並發佈 — Node.js 22.x 及 23.x+ 中，CJS 可 `require()` 靜態 ESM

**CJS 發佈配置：**

```json
{
  "name": "my-cjs-package",
  "exports": {
    ".": "./index.js"
  }
}
```

**ESM 發佈配置：**

```json
{
  "name": "my-esm-package",
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./package.json": "./package.json"
  }
}
```

關鍵：`"type": "module"` 讓 `.js` 檔被視為 ESM。自 Node.js 23.0.0 起，CJS 可 `require()` 不含 top-level `await` 的靜態 ESM。

**雙格式發佈（若確實需要）：**

方案 A — 將命名匯出直接掛載於 `module.exports`：

```javascript
module.exports.foo = function foo() {};
module.exports.bar = function bar() {};
```

方案 B — ESM wrapper：

```javascript
// wrapper.mjs
import cjs from '../cjs/index.js';
const { a, b, c } = cjs;
export { a, b, c };
```

搭配 `package.json`：
```json
{
  "exports": {
    ".": {
      "import": "./dist/esm/wrapper.mjs",
      "require": "./dist/cjs/index.js",
      "default": "./dist/cjs/index.js"
    }
  }
}
```

> 注意：wrapper 方式會破壞 live bindings。

方案 C — 完整雙發佈（套件較大，且有雙套件風險）。

**Dual-Package Hazard（雙套件風險）：**

同一套件同時提供 CJS 與 ESM 時，可能載入兩個不同實例：
- `require('pkg')` 與 `import pkg from 'pkg'` 可能是不同的實例
- 導致 `instanceof` 失敗、屬性遺失、有狀態套件出現平行狀態

解決方案：只發佈一種格式，或使用 `"node"` 和 `"default"` 匯出條件取代 `"require"` 和 `"import"`。

**`"type"` 欄位陷阱：**

```json
// 錯誤：type: module 導致 require 路徑的 .js 也被當成 ESM
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"  // 會被當成 ESM！
    }
  }
}

// 正確：CJS 檔案使用 .cjs 副檔名
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

**其他最佳實踐：**
- 優先使用 `"exports"` 而非 `"main"`，可防止外部存取內部程式碼
- 加入 `"engines"` 欄位標示 Node.js 版本相容性
- 在 exports 中包含 `"./package.json": "./package.json"`

---

### Publishing Node-API Modules
> 原文連結：https://nodejs.org/en/learn/modules/publishing-node-api-modules

本文說明如何將 Node-API 版本的套件與非 Node-API 版本並行發佈，以 `iotivity-node` 為範例。

**發佈流程：**

**步驟一：發佈非 Node-API 版本**

1. 更新 `package.json` 中的版本號（例如 `1.2.0-2`）
2. 完成發佈檢查清單（測試通過、demo 正常、文件更新）
3. 執行：

```bash
npm publish
```

**步驟二：發佈 Node-API 版本**

1. 更新版本號（例如 `1.2.0-3` 或 `1.2.0-napi`），建議遵循 [semver.org](https://semver.org) 的 pre-release 版本規範
2. 完成發佈檢查清單
3. 使用 `n-api` tag 發佈：

```bash
npm publish --tag n-api
```

**npm Tags 的作用：**

使用 `--tag n-api` 發佈後，即使 `1.2.0-3` 在數值上較新，執行 `npm install iotivity-node` 仍會安裝非 Node-API 版本（即 `latest` tag）。使用者必須明確指定 tag：

```bash
npm install iotivity-node@n-api
```

**在依賴中引用 Node-API 版本：**

使用 tag（取得最新 tag 版本）：
```json
{
  "dependencies": {
    "iotivity-node": "n-api"
  }
}
```

> 注意：tag 版本無法使用版本範圍（如 `^2.0.0`），它只指向一個版本。若維護者將新版本標上同一 tag，`npm update` 會取得較新的版本。

使用精確版本號（確保穩定性）：
```json
{
  "dependencies": {
    "iotivity-node": "1.2.0-3"
  }
}
```

---

### ABI Stability
> 原文連結：https://nodejs.org/en/learn/modules/abi-stability

**ABI（Application Binary Interface）** 是程式呼叫其他已編譯程式的函式和使用資料結構的方式，可視為 API 的編譯版本。

**ABI 相容性要求：**
- 標頭檔（header files）定義了類別、函式、資料結構、列舉和常數
- 編譯後轉為可用的位址、預期參數值、記憶體結構大小與佈局
- 使用 ABI 的應用程式必須確保位址、參數值、記憶體佈局與 ABI 提供者一致
- 編譯器和標頭檔維護者共同承擔確保 ABI 相容性的責任

**Node.js 中的 ABI 穩定性：**

Node.js 的標頭檔由多個獨立團隊維護：
- **Node.js 團隊**：`node.h`、`node_buffer.h`
- **V8 團隊**：`v8.h`（獨立排程與優先順序）

由於 Node.js 僅能部分控制標頭檔變更，採用**語意化版本控制**（semantic versioning）：
- 承諾：針對某主要版本編譯的 native addon，在該主要版本的任何次要/修補版本中皆可成功載入

**N-API 的誕生動機：**

1. **JavaScript 相容性差異**：純 JS 套件升級 Node.js 主要版本無需重新編譯，但 native addon 每次都需重新編譯/安裝/部署，增加維運負擔。
2. **替代實作**：其他 JavaScript 執行環境（非 V8 引擎）希望利用 Node.js 套件生態系。
3. **未來引擎變更**：Node.js 可能更換 JavaScript 引擎，需要與引擎無關的 API。

**N-API 實作：**
- 於 **Node.js 8.6.0** 引入，**Node.js 8.12.0** 標記為穩定
- 標頭檔：`node_api.h`、`node_api_types.h`

**前向相容性保證：**

> N-API 版本 *n* 將在其首次發佈的 Node.js 主要版本中可用，並在所有後續版本（包括後續主要版本）中持續可用。

**N-API 版本機制：**
- 採用**累加式版本**（非語意化版本），每個 N-API 版本等同於 semver 的 minor 版本
- 所有變更向後相容
- 新 API 先以 **experimental** 狀態加入，讓社群在生產環境中驗證
- Experimental API **不受前向相容性保證**，可能進行 ABI 不相容的變更

**N-API 的效益：**
- 原生模組作者只需使用 `node_api.h` 和 `node_api_types.h` 中定義的 API
- 維運負擔不會比純 JavaScript 套件更高
- 跨 Node.js 主要版本保持二進位相容

---

---

## Diagnostics

### User Journey
> 原文連結：https://nodejs.org/en/learn/diagnostics/user-journey

此頁面是 Node.js 診斷（Diagnostics）系列文件的導覽入口，由 **Diagnostics Working Group** 與 **Node.js Website Team** 共同維護。

**核心概念：**

- 整個診斷文件以「使用者旅程（User Journey）」為原則進行組織，提供**連貫的、按步驟操作的除錯流程**，協助開發者對應用程式進行根因分析（Root-cause Analysis）。
- 診斷系列共包含五個主題：
  1. **User Journey** — 導覽頁（本頁）
  2. **Memory** — 記憶體使用與洩漏偵測
  3. **Live Debugging** — 即時除錯技術
  4. **Poor Performance** — 效能瓶頸識別與修復
  5. **Flame Graphs** — 效能資料視覺化

**重點提示：** 此頁本身不包含技術細節，而是作為索引頁指引開發者前往對應的診斷主題。每個子主題都提供具體的工具與步驟來解決不同類型的問題。

---

### Memory
> 原文連結：https://nodejs.org/en/learn/diagnostics/memory

本文說明如何診斷 Node.js 應用程式中的記憶體相關問題，涵蓋兩大問題情境。

**情境一：程序記憶體耗盡（Process Runs Out of Memory）**

Node.js 是垃圾回收（Garbage Collected）語言，但仍可能因為「物件保留者（Object Retainers）」導致記憶體洩漏。對於**多租戶、業務關鍵、長時間運行**的應用程式尤其需要注意。

- **症狀：**
  - 記憶體使用量持續上升（可能快速，也可能經過數天、數週緩慢增長）
  - Process Manager 不斷重啟程序
  - 效能變慢、請求因重啟而失敗（Load Balancer 回應 502 錯誤）

- **副作用：**
  - GC 活動增加 → CPU 使用率升高、回應時間變慢
  - GC 阻塞 Event Loop，導致整體延遲上升
  - 記憶體置換（Memory Swapping）拖慢程序
  - 記憶體不足時甚至無法擷取 Heap Snapshot

**情境二：記憶體使用效率低落**

- **症狀：** 記憶體消耗量異常偏高、GC 活動頻繁
- **副作用：** Page Fault 數量增加、CPU 使用率偏高

**除錯方法三步驟：**

1. **判斷物件大小** — 了解特定型別物件佔用多少空間
2. **識別保留者（Retainers）** — 找出哪些變數阻止物件被 GC 回收
3. **分析分配模式（Allocation Patterns）** — 了解程式的記憶體分配隨時間的變化

**推薦工具：**

| 工具 | 用途 |
|------|------|
| **Heap Profiler** | 分析堆積記憶體使用情況 |
| **Heap Snapshot** | 擷取記憶體快照進行分析 |
| **GC Traces** | 追蹤垃圾回收活動 |

另可參考 **Understanding and Tuning Memory** 了解記憶體微調方法。

---

### Live Debugging
> 原文連結：https://nodejs.org/en/learn/diagnostics/live-debugging

本文介紹當 Node.js 應用程式的行為與預期不符時，如何進行即時除錯。

**問題情境：應用程式行為不如預期**

- 典型範例：HTTP Server 回傳的 JSON 回應中，某些欄位為空值
- 問題可能出在應用程式邏輯（Application Logic）本身

**除錯需求：**

當開發者需要了解應用程式對特定觸發事件（如一個 HTTP Request）所執行的程式碼路徑時，需要：

1. **逐步執行程式碼（Step Through）** — 控制程式執行流程
2. **檢查變數值（Inspect Variables）** — 查看記憶體中變數的實際數值
3. **追蹤程式碼路徑（Track Code Path）** — 理解程式走了哪條執行路徑

**主要工具：Using Inspector**

Node.js 內建的 Inspector 協定是進行即時除錯的核心工具。透過 Inspector，開發者可以連接 Chrome DevTools 或 VS Code 等 IDE，對執行中的 Node.js 程序設置中斷點、逐行執行、即時檢視變數狀態。

啟動方式：

```bash
node --inspect app.js
```

或在啟動時立即暫停（等待 Debugger 連接）：

```bash
node --inspect-brk app.js
```

---

### Poor Performance
> 原文連結：https://nodejs.org/en/learn/diagnostics/poor-performance

本文說明如何診斷 Node.js 應用程式的效能問題。

**何時使用本指南：**

1. 應用程式延遲（Latency）偏高，且已排除資料庫、下游服務、外部資源等因素
2. 懷疑應用程式在自身程式碼中花費過多時間進行運算
3. 效能尚可但希望進一步優化，以提升使用者體驗或節省運算成本

**核心目標：** 識別**佔用較多 CPU 週期**的程式碼片段，通常透過本地端 Profiling 與程式碼優化來完成。

**兩種 Profiling 方法：**

| 方法 | 說明 |
|------|------|
| **V8 Sampling Profiler** | Node.js 內建的取樣分析工具，專注於找出 CPU 密集型程式碼區段。可透過 `node --prof app.js` 產生 profiling 日誌，再用 `node --prof-process` 分析。 |
| **Linux Perf** | 系統級效能分析工具，提供更底層的效能指標，適合進階分析。 |

**除錯迭代流程：**

1. **Profile（分析）** — 使用上述工具蒐集效能數據
2. **Identify Hot Spots（識別熱點）** — 找出耗時最多的函式
3. **Optimize（優化）** — 改善熱點程式碼
4. **Re-profile（重新分析）** — 驗證優化效果

---

### Flame Graphs
> 原文連結：https://nodejs.org/en/learn/diagnostics/flame-graphs

本文是整個診斷系列中內容最豐富的一篇，詳細介紹如何使用火焰圖（Flame Graph）視覺化 CPU 時間分佈。

**什麼是火焰圖？**

火焰圖是一種視覺化 CPU 時間在各函式中分佈的方式，能幫助你精確定位**同步操作中耗時過長**的位置。最飽和的橘色長條代表 CPU 密集型函式，應優先檢查。

**方法一：使用預封裝工具 0x（最簡單）**

[0x](https://www.npmjs.com/package/0x) 是一個 npm 套件，可一步到位地在本地產生火焰圖，適合開發環境與生產環境。

**方法二：使用系統 perf 工具（完整控制）**

步驟如下：

1. 安裝 `perf`（通常透過 `linux-tools-common` 套件）

2. 以 perf 記錄 Node.js 執行資料：

```bash
perf record -e cycles:u -g -- node --perf-basic-prof --interpreted-frames-native-stack app.js
```

3. 產生資料檔：

```bash
perf script > perfs.out
```

4. 產生火焰圖（兩種方式）：

   - **線上預覽：** 將 `perfs.out` 上傳至 https://flamegraph.com
   - **本地生成：** 使用 Brendan Gregg 的 FlameGraph 工具：

```bash
cat perfs.out | ./FlameGraph/stackcollapse-perf.pl | ./FlameGraph/flamegraph.pl --colors=js > profile.svg
```

**對已執行中的 Process 取樣：**

```bash
perf record -F99 -p `pgrep -n node` -g -- sleep 3
```

- `-F99`：每秒取樣 99 次（值越高越精確但輸出越多）
- `sleep 3`：讓 perf 持續記錄 3 秒

**過濾 Node.js 內部函式（讓火焰圖更易讀）：**

```bash
sed -i -r \
  -e "/( __libc_start| LazyCompile | v8::internal::| Builtin:| Stub:| LoadIC:|\[unknown\]| LoadPolymorphicIC:)/d" \
  -e 's/ LazyCompile:[*~]?/ /' \
  perfs.out
```

**重要的 Node.js Profiling 旗標：**

| 旗標 | 說明 |
|------|------|
| `--perf-basic-prof` | 產生詳細輸出 |
| `--perf-basic-prof-only-functions` | 輸出較少、開銷較低（**推薦使用**） |
| `--interpreted-frames-native-stack` | Node.js 10+ 用於解決 Turbofan 編譯器導致函式名稱遺失的問題 |

不使用這些旗標時，火焰圖中大部分長條會顯示為 `v8::Function::Call`，難以分析。

**Node.js 版本注意事項：**

- **Node.js 8.x：** V8 引入 Turbofan 編譯管線，可能導致 perf 無法取得正確的函式名稱，顯示為 `ByteCodeHandler:`。`0x` 工具內建了緩解方案。
- **Node.js 10+：** 可搭配 `--interpreted-frames-native-stack` 旗標解決此問題：

```bash
node --interpreted-frames-native-stack --perf-basic-prof-only-functions app.js
```

- **標籤損壞問題：** 若看到類似 `node'_ZN2v88internal11interpreter...` 的亂碼標籤，代表 Linux perf 未編譯 demangle 支援。

**練習資源：** 可透過 [node-example-flamegraph](https://github.com/naugtur/node-example-flamegraph) 進行火焰圖實作練習。

---

## Test Runner

### Discovering Node.js's Test Runner
> 原文連結：https://nodejs.org/en/learn/test-runner/introduction

Node.js 內建了自己的測試執行器（Test Runner），**不需要額外安裝** Jest、Mocha 或 Vitest 等第三方套件即可使用。

**什麼是 Test Runner？**

Test Runner 是一個用來執行測試的工具，它會：
- 執行測試並回報通過或失敗的結果
- 提供額外資訊，例如程式碼覆蓋率（code coverage）

**為什麼要測試程式碼？**

- 驗證程式碼是否如預期般運作
- 在開發早期就捕捉到 bug
- 確保程式碼的可靠性與可維護性
- 在重構或修改時提供信心

本篇為系列入門文章，後續會依序介紹：使用 Test Runner、Mocking（模擬）、以及收集程式碼覆蓋率。詳細 API 可參考 [官方文件](https://nodejs.org/docs/latest/api/test.html#test-runner)。

---

### Using Node.js's Test Runner
> 原文連結：https://nodejs.org/en/learn/test-runner/using-test-runner

本文詳細說明如何架構與使用 Node.js 內建的 Test Runner，涵蓋專案結構、各類測試的 setup、動態測試案例產生、快照測試、以及 UI 測試等。

**建議專案結構**

```
example/
  ├ src/
    ├ app/…
    └ sw/…
  └ test/
    ├ globals/
    ├ setup.mjs
    ├ setup.units.mjs
    └ setup.ui.mjs
```

重點：依測試類型建立獨立的 setup 檔案，避免昂貴的 mock/stub 拖慢不相關的測試。

**通用 Setup**

建立一個基底 setup 檔，其他 setup 檔都引入它：

```javascript
import { register } from 'node:module';

register('some-typescript-loader');
// 此後支援 TypeScript
// 但其他 test/setup.*.mjs 仍須為純 JavaScript
```

**動態產生測試案例**

使用 `test` 搭配 `testContext.test`（即 `t.test`）動態產生子測試：

```javascript
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { detectOsInUserAgent } from '…';

const userAgents = [
  { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...', os: 'WIN' },
  // …
];

test('Detect OS via user-agent', { concurrency: true }, t => {
  for (const { os, ua } of userAgents) {
    t.test(ua, () => assert.equal(detectOsInUserAgent(ua), os));
  }
});
```

注意：要用 **`t.test`** 而非頂層的 `test`，這樣子測試才會正確歸屬在父測試之下。v23.8.0 之前 `testContext.test` 不會自動 await。

**快照測試（Snapshot Tests）**

自 v22.3.0 起可用，需加 `--experimental-test-snapshots` 旗標。可自訂快照檔案路徑：

```javascript
import { basename, dirname, extname, join } from 'node:path';
import { snapshot } from 'node:test';

snapshot.setResolveSnapshotPath(generateSnapshotPath);
function generateSnapshotPath(testFilePath) {
  const ext = extname(testFilePath);
  const filename = basename(testFilePath, ext);
  const base = dirname(testFilePath);
  return join(base, `${filename}.snap.cjs`);
}
```

在測試中使用 `t.assert.snapshot()`（來自 test context，**不是** `node:assert`）：

```javascript
it('should render defaults when no props are provided', t => {
  const component = render(<SomeComponent />).container.firstChild;
  t.assert.snapshot(prettyDOM(component));
});
```

**單元測試（Unit Tests）**

最簡單的測試類型，setup 最少：

```javascript
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Cat } from './Cat.js';
import { Fish } from './Fish.js';
import { Plastic } from './Plastic.js';

describe('Cat', () => {
  it('should eat fish', () => {
    const cat = new Cat();
    const fish = new Fish();
    assert.doesNotThrow(() => cat.eat(fish));
  });

  it('should NOT eat plastic', () => {
    const cat = new Cat();
    const plastic = new Plastic();
    assert.throws(() => cat.eat(plastic));
  });
});
```

**UI 測試**

UI 測試需要 DOM 環境（如 jsdom）。在 setup 中初始化：

```javascript
import jsdom from 'global-jsdom';
import './setup.units.mjs';

jsdom(undefined, {
  url: 'https://test.example.com', // 須指定 URL 以避免問題
});
```

UI 測試中也可搭配 `mock.module()` 做模組 mock（需加 `--experimental-test-module-mocks` 旗標），但 **mock 必須在 import 被測模組之前設置**。

**核心原則**

1. **隔離性**：各類型測試的 setup 應最小化且互相隔離
2. **YAGNI**：只設置該類測試需要的東西
3. **效能**：昂貴的 mock/stub 會拖慢所有測試
4. **併發**：獨立測試可使用 `{ concurrency: true }` 加速

---

### Mocking in Tests
> 原文連結：https://nodejs.org/en/learn/test-runner/mocking

本文深入探討 Node.js Test Runner 中的 Mocking 機制，說明何時該 mock、何時不該 mock，以及如何 mock 模組、API 和時間。

**什麼是 Mocking？**

Mocking 是建立程式碼「替身」的技術，用來以 `當 'a' 時，做 'b'` 的方式控制行為。目的是限制變動因素，讓測試具有**確定性（deterministic）**——無論執行順序或次數，結果永遠相同。

**不同測試層級的 Mock 策略**

| 測試類型 | 說明 | 該 Mock 什麼 |
|---------|------|-------------|
| Unit（單元測試） | 最小可隔離的程式碼 | 自有程式碼、外部套件、外部系統 |
| Component（元件測試） | 單元 + 相依性 | 外部套件、外部系統 |
| Integration（整合測試） | 元件的組合 | 外部套件、外部系統 |
| E2E（端對端測試） | 完整應用 | **不要 mock** |

**Mock 自有程式碼（Own Code）**

- **該 Mock 的情況**：真正的單元測試中，應 mock 掉相依的自有模組，專注測試目標函式本身
- **不該 Mock 的情況**：如果相依函式簡單且經過充分測試，不 mock 更真實且能增加覆蓋率。但缺點是一個函式壞掉會導致多個測試同時失敗

**Mock 外部套件（External Code）**

單元測試中**一律應 mock** 外部套件（它們有自己的測試）。例外：像 React/Angular 這類大型框架通常不 mock。

**Mock 外部系統（External System）**

資料庫、檔案系統、記憶體儲存等外部系統若不 mock，並行測試會互相干擾（race condition）。

**如何 Mock 模組**

使用 `mock.module()` 搭配動態 `import()`（mock 必須在 import 之前設置）：

```javascript
import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

describe('foo', { concurrency: true }, async () => {
  const barMock = mock.fn();

  const barNamedExports = await import('./bar.mjs')
    .then(({ default: _, ...rest }) => rest);

  mock.module('./bar.mjs', {
    defaultExport: barMock,
    namedExports: barNamedExports,
  });

  // 動態 import 確保 mock 已生效
  const { foo } = await import('./foo.mjs');

  it('should do the thing', () => {
    barMock.mock.mockImplementationOnce(function bar_mock() { /* … */ });
    assert.equal(foo(), 42);
  });
});
```

**如何 Mock API（fetch）**

使用 `undici`（Node.js 的 fetch 實作底層）的 `MockAgent`：

```javascript
import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { MockAgent, setGlobalDispatcher } from 'undici';

describe('endpoints', { concurrency: true }, () => {
  let agent;
  beforeEach(() => {
    agent = new MockAgent();
    setGlobalDispatcher(agent);
  });

  it('should retrieve data', async () => {
    agent
      .get('https://example.com')
      .intercept({ path: 'foo', method: 'GET' })
      .reply(200, { key: 'good', val: 'item' });

    assert.deepEqual(await endpoints.get('foo'), {
      code: 200,
      data: { key: 'good', val: 'item' },
    });
  });
});
```

**如何 Mock 時間**

使用 `mock.timers` 控制時間，避免測試等待真實時間流逝：

```javascript
import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

describe('whatever', { concurrency: true }, async () => {
  mock.timers.enable({ now: new Date('2000-01-01T00:02:02Z') });

  const { default: ago } = await import('./ago.mjs');

  it('should choose "minutes" when that\'s the closest unit', () => {
    const t = ago('1999-12-01T23:59:59Z');
    assert.equal(t, '2 minutes ago');
  });
});
```

注意事項：時區建議使用 `Z`（UTC）以避免非預期結果；模組必須在 `mock.timers.enable()` **之後**才動態 import。

---

### Collecting Code Coverage in Node.js
> 原文連結：https://nodejs.org/en/learn/test-runner/collecting-code-coverage

本文說明如何使用 Node.js Test Runner 內建的程式碼覆蓋率功能。

**什麼是程式碼覆蓋率？**

程式碼覆蓋率衡量測試執行了多少比例的原始碼，以百分比表示。它能揭示哪些程式碼已被測試、哪些尚未被測試，幫助找出測試套件的缺口。

**啟用覆蓋率報告**

CLI 方式：

```bash
node --experimental-test-coverage --test main.test.js
```

程式碼方式（`run()` API）：

```javascript
run({
  files: ['main.test.js'],
  coverage: true
});
```

**覆蓋率指標說明**

以下列程式碼為例，定義了三個函式但只測試了 `add()` 和 `isEven()`：

```javascript
// main.js
function add(a, b) { return a + b; }
function isEven(num) { return num % 2 === 0; }
function multiply(a, b) { return a * b; }

module.exports = { add, isEven, multiply };
```

報告結果：

```
file         | line % | branch % | funcs % | uncovered lines
main.js      |  76.92 |   100.00 |   66.67 | 9-11
```

三種指標：
- **Line Coverage（行覆蓋率）**：被執行到的程式碼行數百分比
- **Branch Coverage（分支覆蓋率）**：if-else 等分支被測試到的百分比
- **Function Coverage（函式覆蓋率）**：被呼叫到的函式百分比

未被測試的 `multiply()` 函式（第 9-11 行）導致行覆蓋率為 76.92%、函式覆蓋率為 66.67%。

**排除特定程式碼（使用註解）**

使用 `/* node:coverage ignore next N */` 註解忽略接下來 N 行：

```javascript
/* node:coverage ignore next 3 */
function multiply(a, b) {
  return a * b;
}
```

加上此註解後，覆蓋率報告會顯示 100%。

**包含與排除檔案（使用 CLI）**

- `--test-coverage-exclude`：排除符合 glob 的檔案
- `--test-coverage-include`：只包含符合 glob 的檔案

```bash
# 排除特定檔案
node --experimental-test-coverage --test-coverage-exclude=src/age.js --test main.test.js

# 只包含 src 目錄下的檔案
node --experimental-test-coverage --test-coverage-include=src/*.js --test main.test.js
```

兩個旗標可多次使用，同時使用時，檔案必須符合 include 規則且不符合 exclude 規則。

**設定覆蓋率門檻（Thresholds）**

可設定最低覆蓋率門檻，未達標時 process 會以 exit code `1` 結束（表示失敗）：

```bash
node --experimental-test-coverage --test-coverage-lines=90 --test main.test.js
```

程式碼方式：

```javascript
run({
  files: ['main.test.js'],
  coverage: true,
  lineCoverage: 90
});
```

支援三種門檻：
- `--test-coverage-lines`：行覆蓋率門檻
- `--test-coverage-branches`：分支覆蓋率門檻
- `--test-coverage-functions`：函式覆蓋率門檻

這在 CI/CD 中特別有用，可確保程式碼品質不會因覆蓋率下降而倒退。

---
