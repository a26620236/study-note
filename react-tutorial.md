# React 入門:用 React 描述畫面(30 分鐘)

> 對象:完全沒碰過前端框架的新手
> 主軸:參考 react.dev〈[Describing the UI](https://react.dev/learn/describing-the-ui)〉章節
> 現場 Demo 環境:<https://playcode.io/react-playground--019ea652-e7ab-746b-921b-50239f139f46>

---

## 0. 開場:React 到底是什麼?(3 分鐘)

- 一句話定位:**用 JavaScript 把「畫面」拆成一塊塊可重複使用的元件(Component)**
- 對比新手熟悉的東西:傳統是「寫一份 HTML,再用 JS 去改它」;React 是「我描述畫面長怎樣,資料變了畫面自動跟著變」
- 關鍵心法:**宣告式(declarative)** — 你描述「結果」,而不是「一步步怎麼改 DOM」
- ⚠️ 本場只談「描述畫面」,不碰互動/狀態(那是下一階段)

## 1. 你的第一個元件 Component(5 分鐘)

- 元件 = 一個回傳畫面的 JavaScript 函式
- 現場看最小範例:

  ```jsx
  function Welcome() {
    return <h1>Hello, React</h1>;
  }
  ```

- 三個鐵則:**大寫開頭、回傳一段畫面、像 HTML 標籤一樣使用 `<Welcome />`**
- 比喻:元件就像「樂高積木」,可以重複拼、層層組合

## 2. JSX:在 JavaScript 裡寫畫面(6 分鐘)

- JSX 是什麼:看起來像 HTML,實際是 JavaScript 的語法糖
- 新手最容易踩的差異(挑重點講):
  - 只能回傳**一個**根元素(用 `<>...</>` 包起來)
  - `class` 要寫成 `className`
  - 標籤一定要閉合 `<img />`
- **用大括號 `{}` 塞入 JavaScript**:變數、運算、函式呼叫

  ```jsx
  const name = 'Han';
  return <h1>Hello, {name}</h1>;
  ```

## 3. Props:把資料傳進元件(6 分鐘)

- 為什麼需要:同一個元件,餵不同資料 → 顯示不同內容(可重用的關鍵)
- 比喻:props 就像「函式的參數」,或「給元件的設定」

  ```jsx
  function Welcome({ name }) {
    return <h1>Hello, {name}</h1>;
  }
  // 使用
  <Welcome name="Han" />
  <Welcome name="Mile" />
  ```

- 重點觀念:**資料由上往下流(父 → 子),props 是唯讀的**

## 4. 條件渲染 & 清單渲染(6 分鐘)

這兩個是實務上「每天都會用」的,合併快講:

- **條件渲染**:用三元運算子 / `&&` 決定要不要顯示

  ```jsx
  {
    isLoggedIn ? <Dashboard /> : <LoginButton />;
  }
  ```

- **清單渲染**:用 `.map()` 把陣列變成一排元件

  ```jsx
  {
    users.map((user) => <Welcome name={user.name} />);
  }
  ```

- 點一下 `key` 的概念(每個項目要有唯一 key),但不深入

## 5. 收尾:元件要「純粹」+ 全景圖(3 分鐘)

- 一句話帶過「保持元件純粹」:**相同的 props 進去,就該畫出相同的結果**(不要在渲染時偷改外部資料)
- 把今天學的串起來:**Component → JSX → Props → 條件/清單**,這就是「描述 UI」的全貌
- 預告下一步:互動與狀態(State)、事件處理 → 才是讓畫面「動起來」
- 給資源:react.dev 官方教學(本場大綱就是它的 Describing the UI 章節)

---

## 時間分配總覽

| 段落              | 時間 |
| ----------------- | ---- |
| 開場 React 是什麼 | 3 分 |
| 第一個元件        | 5 分 |
| JSX               | 6 分 |
| Props             | 6 分 |
| 條件 + 清單渲染   | 6 分 |
| 收尾 + 預告       | 3 分 |
| **緩衝 / Q&A**    | 1 分 |

---

## 參考頁面(對齊各段落)

| 大綱段落           | 網址                                                          |
| ------------------ | ------------------------------------------------------------- |
| 主章節總覽         | <https://react.dev/learn/describing-the-ui>                   |
| 1. 第一個元件      | <https://react.dev/learn/your-first-component>                |
| 2-1. JSX 寫法      | <https://react.dev/learn/writing-markup-with-jsx>             |
| 2-2. JSX 裡用 `{}` | <https://react.dev/learn/javascript-in-jsx-with-curly-braces> |
| 3. Props           | <https://react.dev/learn/passing-props-to-a-component>        |
| 4-1. 條件渲染      | <https://react.dev/learn/conditional-rendering>               |
| 4-2. 清單渲染      | <https://react.dev/learn/rendering-list>                      |
| 5. 元件純粹性      | <https://react.dev/learn/keeping-components-pure>             |
