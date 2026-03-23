# Localhost

## 什麼是 localhost？

`localhost` 是一個指向**本機電腦**的主機名稱（hostname），對應的 IP 位址是 `127.0.0.1`（IPv4）或 `::1`（IPv6）。

當你在瀏覽器輸入 `http://localhost:3000` 時，請求不會離開你的電腦，而是直接送到本機上監聽該 port 的程式。

## 127.0.0.1 vs localhost

| 項目 | 說明 |
|------|------|
| `127.0.0.1` | IPv4 的 loopback 位址，直接指向本機 |
| `localhost` | 主機名稱，通常被解析為 `127.0.0.1` 或 `::1` |
| `0.0.0.0` | 監聽所有網路介面（包含外部連線），不只本機 |

## Loopback 介面

localhost 背後的機制是作業系統的 **loopback 介面**：

- 封包不會經過實體網路卡，直接在 OS 內部繞回
- 速度極快，因為不經過實際網路傳輸
- 即使沒有網路連線也能運作

## 在 Node.js 中的使用

```javascript
const { createServer } = require('node:http');

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

// 監聽 127.0.0.1（僅本機可存取）
server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://localhost:3000/');
});
```

### hostname 選擇的差異

- `'127.0.0.1'` / `'localhost'`：只有本機可以連到這個 server
- `'0.0.0.0'`：同一網路內的其他裝置也能透過你的 IP 連入

## Port（連接埠）

localhost 後面的數字（如 `:3000`）是 **port number**：

- 一台電腦可以同時跑很多 server，靠不同 port 區分
- 常見 port：`80`（HTTP）、`443`（HTTPS）、`3000`/`8080`（開發用）
- 1024 以下的 port 通常需要管理員權限

## 常見用途

- **本地開發**：啟動 dev server 在本機測試網頁或 API
- **資料庫連線**：連線本機的 MySQL、PostgreSQL、Redis 等
- **容器開發**：Docker container 透過 port mapping 對應到 localhost
