# React 畫面管理機制的核心觀念

## DOM 與 Virtual DOM

React 是一個用於「打造 UI」的工具，而在瀏覽器中呈現 UI 的載體就是 **DOM**。DOM 與瀏覽器的畫面渲染引擎綁定，因此**操作 DOM 就會連動更新畫面繪製的結果**。在 React 這類現代前端解決方案中，我們一般**不會直接自己去操作 DOM**，而是透過 React 建立的抽象層代為管理 DOM，大多數時候只需要與 React 提供的 API 互動即可。因此，想從基礎真正理解 React 的運作方式，就必須從 **DOM 與 React 代理抽象層之間的關係**開始剖析。

### DOM

**DOM（Document Object Model）是存在於瀏覽器 JavaScript 環境中的樹狀資料結構**，用來描述瀏覽器畫面中的節點。每個節點實際上是一個 JS 物件，除了包含該元素的一些屬性，還提供一些介面（方法），以便調用來插入和操作 DOM。

**DOM 節點與瀏覽器中的渲染引擎綁定**：當我們操作 DOM 時，就會連帶觸發瀏覽器渲染引擎進行一連串更新畫面的流程。因此 **DOM 操作在效能上是相對昂貴的動作**，當畫面上有大量 DOM 在短時間內異動時，更容易出現畫面卡頓等問題。

由此得出前端效能優化的重要關鍵：盡可能減少 DOM 操作——更精確地說，是**「以最少的 DOM 操作來達到所需要的畫面結果」**。

### Virtual DOM



#### 概念與設計緣由

在進入 React 本身之前，得先引入一個 **React 核心機制背後所採用的重要概念：Virtual DOM**。

由於操作「真實」DOM 會直接連動瀏覽器渲染引擎的一系列行為、非常花費效能，為了改善這個效能問題，衍生出了 **Virtual DOM** 的概念。意義上來說，**Virtual DOM 是真實 DOM 的虛構描述體**，它實際上也是一種樹狀結構的資料。

**每一個 Virtual DOM element 的資料都是普通的 JavaScript 物件變數，內容則嘗試在描述一個真實的 DOM element 預計要長的樣子**（像是元素類型、屬性、子元素有哪些…等等資訊）。接著透過負責渲染畫面的程式處理後，就能將 Virtual DOM element 轉換並產生成實際的 DOM element，以更新瀏覽器的實際畫面。

#### 常見誤解釐清：同步方向是單向的

學習 React 時有一種常見的誤解：認為「Virtual DOM 是從真實 DOM 複製一份出來的 copy」。**事實上正好相反**——

實際上是**先自行以 Virtual DOM 來定義預計想要的畫面結構，然後再將這個結構的描述轉換成真實的 DOM Tree**（也就是去操作真實 DOM Tree，來同步為長得跟 Virtual DOM 對應一致）。因此，兩者之間的同步關係是**由 Virtual DOM => DOM 單向的**。開發者對 Virtual DOM 進行管理與互動，而由 Virtual DOM 到真實 DOM 的同步則由程式自動處理。

#### 多一層抽象的好處：畫面更新流程

Virtual DOM 就像是**畫面產生的模擬彩排場**。每次有新 UI 畫面產生的需求時，透過以下流程來完成畫面更新：

1. **透過事先定義好的模板程式來產生新的 Virtual DOM Tree，作為新的彩排結果**
2. **與此前最後一次舊畫面用的 Virtual DOM Tree 進行兩棵樹的結構細節比較，其中差異之處才是本次畫面更新中真正有需要變更的部分**
3. 將新舊 Virtual DOM Tree 中有差異的部分更新到真實的 DOM Tree 中，以完成瀏覽器畫面的更新

透過這個流程，就可以**將真實的 DOM 操作範圍最小化**，限縮在真正需要變更的地方，盡可能減少因 DOM 操作而造成的效能花費。

#### 為什麼整體效能仍然划算？

雖然每次重新產生畫面的 Virtual DOM 資料、並與舊有的 Virtual DOM 進行詳細的樹狀結構比較，都會有效能上的花費，但因為操作的是**普通的 JavaScript 物件資料**，並且與真實 DOM 不同——**Virtual DOM 並沒有與瀏覽器的渲染引擎做直接的綁定**——因此整體來說，仍然比頻繁且大量地操作真實 DOM 的效能花費低了許多。

#### Virtual DOM 與前端框架

一些主流前端框架或解決方案（包含 React）都採用了這種概念來實作並管理畫面的抽象層。不同框架對 Virtual DOM 概念的實踐與比較方式可能不盡相同，**但觀念上都是以這種虛擬的抽象層來代理 DOM 的處理**。（本文的描述是基於 React 所採納的概念來介紹。）

此處的簡介是為了先對 Virtual DOM 的概念與設計緣由建立基本認識；後續會更進一步介紹 Virtual DOM 在 React 畫面更新流程中扮演的角色，並對應到實際的程式碼流程做細節解析。

## 建構一切 UI 的最基本單位 — React element



### React element：Virtual DOM 的最小組成單位

React 採用 **Virtual DOM** 的概念來實作抽象層，以產生並管理瀏覽器畫面中的真實 DOM。在 React 中，每一個 Virtual DOM element 稱之為「**React element**」，是這個抽象層中的**最小組成單位**。

**React element 是一種普通的 JavaScript 物件資料**，用來描述對應於「真實 DOM」的節點資料與結構。可以透過 React 提供的 `createElement()` 方法來建立一個 React element：

```jsx
import React from "react";

const buttonReactElement = React.createElement(
  'button',           // 元素類型
  { id: 'button1' },  // 屬性
  'I am a button'     // 子元素
);
```

`createElement()` 的參數依序為：

1. 第一個參數：**元素類型**
2. 第二個參數：**屬性**
3. 第三個參數：**子元素**

產生出來的 React element 就只是一個普通的 JavaScript 物件，將它 `console.log` 印出來後大概長這樣：

```jsx
// buttonReactElement
{
  type: 'button',
  props: { id: 'button1', children: 'I am a button' },
  key: null,
  ref: null,
  $$typeof: Symbol('react.element'),
};
```

雖然看起來是再普通不過的 JavaScript 物件資料，但將這個 React element 交由 React 進行轉換處理之後，就可以**自動產生對應的實際瀏覽器 DOM 畫面結果**：

Untitled
（圖片來源：原文）

此時在真實 DOM Tree 中，就可以找到這個由 React 代為自動產生的實際 DOM element：

```jsx
const buttonDomElement = document.getElementById('button1');
```

釐清這兩者的角色差異：


| 變數                   | 角色                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `buttonReactElement` | 是一個 **React element**，在交給 React 進行渲染轉換之前就只是個 JavaScript 物件。意義上就是一個 Virtual DOM element，用來讓開發者**描述並定義**希望到時候產生的真實 DOM 會長成什麼樣子 |
| `buttonDomElement`   | 是一個**真實的 DOM 節點**，由 React 基於接收到的 React element 內容自動產生的對應結果                                                                   |




### 巢狀結構：React element 也可以是樹狀的

與真實的 DOM 一樣，React element 也可以是巢狀的樹狀結構——可以將一個 React element 的子元素指定成另一個或多個 React element。

而**如果子元素不只一個的話，可以繼續在** `createElement()` **的第四、第五、第六......第 N 個參數以此類推往下填**，React 會依序將它們視作接續的子元素：

```jsx
const reactElement = React.createElement(
  'div',
  { id: 'wrapper', className: 'foo' },
  React.createElement(
    'ul',
    { id: 'list-01' },
    // 從第三個參數開始每個參數都是子元素
    React.createElement('li', { className: 'list-item' }, 'item 1'), 
    // 第四個參數就會是第二個子元素
    React.createElement('li', { className: 'list-item' }, 'item 2'), 
    // 第五個參數就會是第三個子元素
    React.createElement('li', { className: 'list-item' }, 'item 3'), 
  ),
  React.createElement(
    'button',
    { id: 'button1' },
    'I am a button'
  )
);
```

會產生對應的瀏覽器 DOM 畫面結果：

Imgur
（圖片來源：原文）

由此可見，我們可以透過定義 React element 的內容，來**間接控制**畫面最後實際產生的 DOM 結構，兩者之間有著顯而易見的完整對應。

### 補充說明：React element 中與 DOM 的屬性對應和差異

有些 React element 的屬性名稱和格式，與對應的真實 DOM 有些許不同。以下是最常見且常用的差異之處：

#### 1. 屬性一律改為 camelCase 命名

- 所有的 DOM property 和 attribute（**包括 event handler**）都會改以 **camelCase** 命名
  - 例如：`onclick` ⇒ `onClick`、`tabindex` ⇒ `tabIndex` ...等等
- **例外**：`aria-`* 和 `data-`* attribute 需要**保持全部小寫**。例如 `aria-label` 保持原樣即可



#### 2. 避開 JavaScript 保留字的改名

有一些涉及到 JavaScript 內建保留字的屬性會稍微改名，以避免意外情況：

- `class` ⇒ `className`
- `<label>` 會有的 `for` 屬性 ⇒ `htmlFor`



#### 3. inline styles 的 `style` 屬性格式不同

- 在 React element 中，`style` 是以**物件**的格式指定的，而非像撰寫 HTML Tag 時那樣以字串指定，且其中的 CSS properties 名稱都會改以 **camelCase** 表示
- 舉例來說：原本在 HTML 中的 `style="font-size: 14px; color: red;"`，在 React element 中則是以 `{ style: { fontSize: '14px', color: 'red' } }` 的形式表示

完整詳細的差異表可以參考官方文件：
[https://reactjs.org/docs/dom-elements.html#differences-in-attributes](https://reactjs.org/docs/dom-elements.html#differences-in-attributes)

---



## Render React elements

在瞭解 React element 是虛擬抽象層中的最小建構單位之後，接下來要深入理解：**如何讓 React elements 產生出對應的真實 DOM elements**。這段程式碼寫起來很簡單，但確實理解流程中每一步如何連貫運作，是內化「Virtual DOM 概念如何被實際應用在 React 中」的基本功。

### Reconciler & Renderer

React 將「定義並產生 UI」的工作大致分成兩大部分：**Reconciler** 與 **Renderer**。

#### Reconciler

- 負責處理**抽象層的構成、管理與調度**，也就是「Virtual DOM」概念以及管理 React elements 的部分。
- 當畫面需要更新時，Reconciler 會負責**產生新的 Virtual DOM Tree（也就是 React elements），並與前一次的 Virtual DOM Tree 進行比較來找出差異的部分**，再將差異告知 Renderer。這個流程稱之為「**Reconciliation**」。
- 開發者只需要透過 React 提供的 API 來與 Reconciler 互動（例如定義並產生 React elements 以決定畫面結構、使用 React 內建 API 控制資料更新等），就能涵蓋絕大多數前端畫面的控制與操作需求，**幾乎不需要親手操作真實的 DOM**。



#### Renderer

- 負責將 Reconciler 所產生及管理的 React elements（Virtual DOM elements），**在目標環境（瀏覽器）中轉換並產生對應的實際畫面（真實 DOM elements）**。
- 當畫面需要更新時，Reconciler 會找出畫面上實際需要更新之處並命令 Renderer；Renderer 則負責向瀏覽器實際操作那些**真正有更新需求**的 DOM，完成畫面更新。
- 用於瀏覽器環境的 React Renderer 稱之為「**React DOM**」。



#### 補充：更多種類的 React Renderer

得益於 React 將「抽象層的管理（Reconciler）」與「將抽象層渲染成實際畫面（Renderer）」**拆分成兩個部分**，只要有支援其他目標環境的 Renderer 配合，React 也可以用於產生瀏覽器 DOM 以外的 UI 或畫面，例如：

- [React Native](https://reactnative.dev/)：產生原生 Android / iOS App UI
- [React-pdf](https://react-pdf.org/)：產生 PDF 文件

除了 React 官方維護的 `react-dom` 與 `react-native` 之外，還有各式各樣由社群開源貢獻者維護的 React Renderer。這些非瀏覽器環境的 Renderer 支援的 elements 類型自然不是 DOM element，而是對應環境中的原生元素（例如 React Native 中的 `Text`、`View` 等 Android / iOS 原生元件類型），透過專用的 Renderer 最終在對應平台中產生原生的畫面 UI。

### React DOM

在瀏覽器環境的前端開發中，我們使用 React 官方提供的 `react-dom` 作為 Renderer，來產生並管理真實的 DOM。

概念上來說，我們其實是**指定瀏覽器畫面中的特定區塊，讓 React 對其擁有完全的管轄權，來持續進行 Virtual DOM ⇒ DOM 的單向轉換與同步**。

因此需要事先指定一個目標區塊作為容器：每次 Reconciler 產生新的 Virtual DOM 並分析出哪些地方需要 DOM 操作後，就會將這份需求任務傳遞給 Renderer，Renderer 再於事先指定的目標容器中進行 DOM 的產生或操作，完成瀏覽器畫面的實際更新。

#### 建立 root 與 render 的流程

第一步：在 Web App 的 HTML 原始碼 `<body>` 裡放置一個**空的容器元素**，通常是一個空的 `<div>`，並加上一個值隨意的 `id`，以便在 JavaScript 中取得這個 DOM element：

```
<body>
  <div id="root-container">
    <!-- 之後 React 轉換輸出的真實 DOM elements 就會注入到這裡 -->
  </div>
</body>

```

第二步：在 JavaScript 中取得這個容器元素，並以 `ReactDOM.createRoot()` 方法產生一個「**root**」——也就是 React 產生並管理 DOM elements 輸出結果的「**畫面渲染管轄入口**」：

```
import React from 'react';
import ReactDOM from 'react-dom/client';  // 用於瀏覽器 DOM 環境的 Renderer

// 取得在 HTML 中事先定義好的容器元素，以作為之後 React 產生 DOM elements 結果的輸出容器
const rootContainerElement = document.getElementById('root-container');

// 用這個容器元素來建立一個 React App 的畫面渲染管轄入口 (root)
const root = ReactDOM.createRoot(rootContainerElement);

// ....

```

第三步：以 `root.render()` 方法將 React element 轉換渲染成真實的 DOM element：

```
import React from 'react';
import ReactDOM from 'react-dom/client';  // 用於瀏覽器 DOM 環境的 Renderer

// 取得在 HTML 中事先定義好的容器元素，以作為之後 React 產生 DOM elements 結果的輸出容器
const rootContainerElement = document.getElementById('root-container');

// 用這個容器元素來建立一個 React App 的畫面渲染管轄入口 (root)
const root = ReactDOM.createRoot(rootContainerElement);

// 先準備好一個 React element
const buttonReactElement = React.createElement(
  'button',           // 元素類型
  { id: 'button1' },  // 屬性
  'I am a button'     // 子元素
);

// 在這個 root 上將 React element 進行轉換渲染成真實的 DOM element
root.render(buttonReactElement);

```

執行後就能在瀏覽器畫面中看到結果：React element 所對應產生的 DOM element（那個 `button`）被放置在 root 當初指定的容器元素（id 為 `root-container` 的 `div`）裡面：

#### 注意事項：不要手動操作 React 管轄範圍內的 DOM

在將 React element 渲染到 root 對應的目標容器裡之後，**這個容器元素以內的所有內容就通通交由 React 進行代理管轄與操作**。因此在大多數情況下，**不建議手動操作或修改 React 管轄範圍內的 DOM elements**——這可能導致 React 內部所認知的 Virtual DOM Tree 與對應的真實 DOM Tree 不一致、不再維持完全同步的狀態，進而引發意外的問題或隱患。

### React 只會去操作真正需要更新的那些 DOM elements

React element 從概念上來說是在表達「**某一個歷史時刻當時的畫面結構**」，因此 **React element 一旦被建立之後就永遠不能再修改**。所以當我們想要更新畫面時，**必須產生一組全新的 React element 來餵給 Renderer**

## JSX 語法糖

雖然 `React.createElement()` 已經可以讓我們產生 React element，方便且清楚地指定想要的 DOM tree 結構，但相較於以往習慣用 HTML 標籤語法來表達 DOM 樹狀結構的體驗，仍有一段差距。

因此 React 提供了一種稱為「JSX」的**語法糖（syntactic sugar）**：讓我們在定義 React element 的結構時，有著相當類似撰寫 HTML 的體驗。開發時撰寫 JSX 語法，再由專門的工具**自動轉換成** `React.createElement()` **的語法**。

先看一個對照範例：

```
// 以普通的呼叫 React.createElement() 來定義 React element
const reactElement = React.createElement(
  'div',
  { id: 'wrapper', className: 'foo' },
  React.createElement(
    'ul',
    { id: 'list-01' },
    // 從第三個參數開始每個參數都是子元素
    React.createElement('li', { className: 'list-item' }, 'item 1'), 
    // 第四個參數就會是第二個子元素
    React.createElement('li', { className: 'list-item' }, 'item 2'), 
    // 第五個參數就會是第三個子元素
    React.createElement('li', { className: 'list-item' }, 'item 3'), 
  ),
  React.createElement(
    'button',
    { id: 'button1' },
    'I am a button'
  )
);

// 以 JSX 語法來定義 React element
const reactElementWithJSX = (
  <div id="wrapper" className="foo">
    <ul id="list-01">
      <li className="list-item">item 1</li>
      <li className="list-item">item 2</li>
      <li className="list-item">item 3</li>
    </ul>
    <button id="button1">I am a button</button>
  </div>
);
```

在[以上的範例](https://codesandbox.io/s/ac-react-course-jsx-example-zkipk4?file=/src/index.js)（可在 CodeSandbox 線上試玩）中，`reactElementWithJSX` 這段 JSX 語法同樣會回傳一個 React element，且兩者的內容完全相同——**使用 JSX 語法的後者在經過開發工具的自動轉換之後，會分毫不差地變成前者。因此寫 JSX 語法其實就是在寫** `React.createElement()`。

也就是說，只要你願意，完全可以不使用 JSX，全部親自寫 `React.createElement()` 來開發 React App。不過，用 JSX 定義畫面的樹狀結構顯然更方便簡潔，也更接近我們熟悉的 HTML 撰寫體驗。因此**為了程式碼可讀性與開發體驗，絕大多數時候都推薦使用 JSX 語法來定義 React element**。

注意事項：React element 的 props 與 HTML 屬性寫法有些差異，例如 `class` ⇒ `className`。

#### 為什麼 JSX 需要先經過轉譯（transpile）？

問題來了：我們撰寫的 JSX 語法要如何在瀏覽器的 JavaScript 引擎中正常運作？答案是：**不能直接執行**。在沒有先進行轉換的情況下，JSX 語法在正常的 JavaScript 執行環境中是完全不合法的，直接執行只會造成 runtime 錯誤：

JSX 直接執行時的語法錯誤
（圖片來源：原文，示範 JSX 未轉譯直接執行時瀏覽器噴出的錯誤）

因此，我們必須在程式碼實際進入 runtime 環境執行之前，**先做靜態的轉譯（transpile）**，將其中的 JSX 語法都替換成真正可運行的 `React.createElement()` 語法，才能正常在 JavaScript runtime 中執行。

當你已經參透 **JSX 的本質是** `React.createElement()` **的呼叫**之後，看到上面這段程式碼，腦袋就會自動理解轉換成：

```
const items = ['a', 'b', 'c'];
let childElement;

if (items.length >= 1) {
  childElement = React.createElement('img', {
    src: './image.jpg'
  });
} else {
  childElement = React.createElement('input', {
    type: 'text',
    name: 'email'
  });
}

const appElement = React.createElement(
  'div',
  null,
  items.map(item => React.createElement('span', null, item)),
  childElement
);

```

其實就只是用普通的 JavaScript 邏輯來操作普通的 JavaScript 物件資料，並沒有什麼黑魔法。

### JSX 與 Component

React element 可以用來描述**對應真實 DOM element 類型**的節點資料：

```
const element = <div id="foo" />;

// 上面的這段 JSX 會被轉譯成：
const element = React.createElement('div', { id: 'foo' })

```

不過，React element 的類型其實也可以是**使用者自定義的 component**：

```
// 在標籤類型的地方填上 function component 名稱
const element = <Welcome name="Zet" />; 

// 上面的這段 JSX 會變轉譯成：
const element = React.createElement(Welcome, { name: 'Zet' }); 

```

當 `React.createElement` 的第一個參數（element type）傳入一個 component 的 function 時，**React 就會將第二個參數的屬性當作 props 傳入 component function 中**。

舉例來說，下面這段程式碼會在頁面上畫出「Hello, Zet」：

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Zet" />;

const root = ReactDOM.createRoot(document.getElementById('root-container'));
root.render(element);

```

梳理一下這個例子中發生了什麼事：

1. 我們以 `<Welcome name="Zet" />` 這個 React element 呼叫了 `root.render()`
2. React 以 `{ name: 'Zet' }` 作為 props 參數來呼叫 `Welcome` 這個 component function
3. `Welcome` component 回傳一個 `<h1>Hello, Zet</h1>` 這種結構的 React element 作為結果
4. React DOM 成功地將 root 管轄範圍內的真實 DOM tree 更新成與 React element 一致，顯示在瀏覽器畫面上



#### 為什麼 Component 命名的首字母必須為大寫

首先整理 React element 建立時的幾種類型：


| React element 類型                | `React.createElement` 第一個參數                                                    | 範例                 |
| ------------------------------- | ------------------------------------------------------------------------------ | ------------------ |
| 對應真實 DOM 的 React element        | 以**字串**定義，傳入支援的 DOM element 類型名稱                                               | `'button'`、`'div'` |
| 對應自定義 component 的 React element | 以**函式**定義，傳入自定義的 component function                                            | `Welcome`          |
| 特殊類型 `Fragment`                 | 從 React import 的 `Fragment` 其實是一個 **symbol 變數**，是專門用來建立特殊 React element 的 type | `Fragment`         |


問題在於：**transpiler 無法直接從 JSX 標籤語法本身，區分標籤類型名稱想表達的是「字串內容」還是「一個函式名稱（也就是一個變數名稱）」**：

```
// 應將標籤類型名稱「div」視為字串內容，轉譯成 React.creatElment('div')
const element1 = <div />;

// 應將標籤類型名稱「Welcome」視為變數名稱，轉譯成 React.creatElment(Welcome)
const element2 = <Welcome />;  

```

因此 transpiler 在做 JSX 轉譯時，是以**標籤類型名稱的首字母大小寫**來判斷：

- 首字母為**小寫**時（例如 `<div>`）：判斷它是一個對應真實 DOM 的 element type 名稱，將標籤類型名稱視為**字串內容**，當作 `React.createElement` 的第一個參數傳入。
- 首字母為**大寫**時（例如 `<Welcome>`）：判斷它是一個 component function 的名稱，將標籤類型名稱視為**變數名稱**，當作 `React.createElement` 的第一個參數傳入。

**這就是為什麼自定義 component 的命名，第一個字母必須是大寫。**

除了滿足 JSX 轉換判斷的需求之外，首字母是否大寫在 React 開發慣例中也方便開發者分辨其是否為自定義的 component：例如 `<Button>` 通常是指自定義的按鈕 component，而 `<button>` 則是指對應 DOM 原生的 `button` 元素。

---





## React 畫面更新的核心機制：一律重繪渲染策略

### 單向資料流 & DOM 渲染策略
在繼續深談 React 管理並更新畫面的策略與機制之前，我們先來探究一下關於單向資料流的概念，以及在尚未使用前端框架時實現單向資料流的 DOM 渲染策略，來幫助我們了解「沒有使用前端框架來管理畫面時，會遇到的問題與需求」，進而更好地理解為什麼 React 可以幫助我們解決這些問題。

單向資料流
我們先聚焦在一個相當重要的 design pattern 上 —— 單向資料流。單向資料流是目前在前端領域中相當主流且被普遍應用的 pattern，當今最熱門的前端框架或解決方案基本上都是遵循這個 pattern 所設計的。

任何 UI 畫面只要不是完全靜態寫死的，則背後一定有其作為來源的原始資料，例如購物網站的商品列表、社群網站的動態內容、論壇中的文章列表…等等。而使用者最後看到的光鮮亮麗且內容豐富的 UI 畫面是怎麼產生的呢？其實就是如上圖所示意的：當我們獲得這些新的原始資料時，將這些資料套入預先定義好的模板以及渲染邏輯，進而產生使用者所看到的畫面。

而單向資料流的核心概念就是：畫面結果是原始資料透過模板與渲染邏輯所產生的延伸結果，而這個過程是單向且不可逆的。當資料發生變化時，畫面才會產生對應的變化，以資料去驅動畫面。

所謂「單向」的意思，就是只有資料變化時才能導致畫面更新，畫面無法在原始資料發生變化以外的情況隨意改變。且畫面本身也不允許以任何原因，主動逆向去直接修改原始資料。

由於這是一個單向的流程，因此畫面不會因為資料變化以外的任何原因而隨意改變，這樣就可以保證將 UI 產生的主要變因限縮在「資料」上，並且當資料更新時對應綁定的畫面就會自動發生變化，進而提升前端應用程式的可靠性與可維護性。



### 從「一律重繪」的策略講起

在前面章節中，我們已經知道 Virtual DOM 的概念可以幫助解決大量 DOM 操作的效能問題。結合前一章解析的 DOM 渲染策略，可以推導出一個關鍵思路：

> 「**既然一律重繪真實的 DOM Tree 很浪費效能的話，那我們改成一律重繪虛擬的 DOM Tree 不就好了嗎？**」

為什麼這樣可行？因為 **Virtual DOM 在 JavaScript 中的實現只是一些自定義的普通變數資料而已**，它不像真實 DOM 那樣直接與瀏覽器的渲染引擎綁定。所以當畫面同時有大量變動需求時，即使重繪整個 Virtual DOM，效能成本也肯定比直接重繪大量真實 DOM 小得多。

### React 如何利用 Virtual DOM 更新真實 DOM

在 React 的管轄之下，**真實 DOM Tree 會一直與 Virtual DOM Tree 保持結構一致**。因此 React 只要將重繪前的舊 Virtual DOM Tree 與重繪後的新 Virtual DOM Tree 進行詳細的比較，然後**只去更新這些差異處的真實 DOM elements** 就好了。

React 正是採用這樣的思路：選擇**一律重繪的渲染策略**，並以 Virtual DOM 的設計來解決其伴隨的 DOM 操作效能問題。

這個策略的重點在於：React 只需要知道**資料有發生變化**就行，**而不關心資料具體變化的差異在哪**，然後進行一律重繪的流程。而既然一律重繪真實 DOM 會有嚴重的效能問題，React 就改以 Virtual DOM 來進行一律重繪。更具體一點的說，**React 中一律重繪的是 React elements**。

### 觀念釐清：React 中「render」的真正意義

因此當我們在 React 中講「渲染」或「**render**」時，通常都是在說 **Virtual DOM elements（也就是 React elements）的產生**，而不是在指真實 DOM elements 的操作。

而「重繪 Virtual DOM」在 React 中通常也被稱為「**re-render**」，具體在 React 中的行為就是：

> 「**以新的資料（props 或 state）重新再執行一次 component function，並產生新版的 React elements**」



### 新手補充：component function 與 state 是什麼？

上面這句定義裡有兩個關鍵字：**component function** 與 **state**。其中 component function 我們在前面〈JSX 語法糖〉一節已經打過照面，但還沒有從「畫面更新」的角度好好理解它；而 state 則是到目前為止都還沒正式介紹過的新概念。在繼續往下之前，先把這兩個概念補起來——讀完這一節之後，再回頭看那句定義，你會發現它其實在描述一件非常具體的事。

#### component function：畫面的藍圖，一個回傳 React elements 的普通 function

實際開發時，我們不會把整個 App 的畫面寫成一大包 React elements，而是會把 UI 拆分成一塊一塊可以重複使用的**積木**，例如導覽列、商品卡片、按鈕……等等。每一塊積木就是一個 **component**。

而 component 的本體是什麼？在現代的 React 中，**一個 component 就是一個普通的 JavaScript function**：它**接收 props 作為參數**，並**回傳一份 React elements**（通常以 JSX 撰寫）。這正是前面〈JSX 語法糖〉一節看過的 function component 寫法：

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

這裡沒有任何黑魔法——`Welcome` 就只是一個 function，你甚至可以自己手動呼叫 `Welcome({ name: 'Ben' })`，它就會回傳一個 `<h1>Hello, Ben</h1>` 結構的 React element。

不過在實際的 React App 中，**這個 function 不是由我們自己呼叫，而是由 React 在「需要產生畫面」的時候去呼叫它**。前面梳理過：當我們寫下 `<Welcome name="Ben" />` 時，其實是在告訴 React：「畫面上這個位置，請你呼叫 `Welcome` 這個 function、並把 `{ name: 'Ben' }` 當作 props 傳進去，用它的回傳值作為這塊畫面的內容。」

這裡要補上一個前文還沒點出的關鍵理解角度：

> **component function 就是「畫面的藍圖」：每被 React 執行一次，就產生一份「此時此刻畫面應該長什麼樣子」的描述（React elements）。**

還記得前面提過「React element 一旦被建立之後就永遠不能再修改」嗎？所以當畫面需要更新時，React 不會去修改舊的 React elements，而是**再執行一次 component function，拿到一份全新的 React elements**——這就是那句 re-render 定義中「重新再執行一次 component function」的意思。

#### state 與 useState：component 自己記住、並驅動畫面更新的資料

props 是**由外部傳進來**的資料；但很多時候，component 需要一份**自己記住、且會隨著使用者互動而改變**的資料——例如計數器目前的數字、輸入框目前的文字、開關目前是開還是關。這種資料就是 **state**。

直覺上你可能會想：「這不就用一個普通的 JavaScript 變數存起來就好了嗎？」在 React 中這樣做是行不通的，原因有兩個：

1. **修改普通變數，不會通知 React 要重繪畫面**。React 採用的是一律重繪的渲染策略，但它必須先「知道資料變了」才會啟動重繪流程；直接對普通變數賦值，React 完全無從得知，畫面自然不會有任何反應。
2. **re-render 時，component function 會被整個重新執行一次**。function 裡宣告的區域變數會在每次執行時重新初始化，也就是**被重置回初始值**——上一次的修改根本留不住。

所以 state 需要一個特殊的存放與更新機制，讓資料「存活在 component function 之外、由 React 代為保管」，並且在更新時能通知 React。這個機制就是 **`useState`**：

```
const [count, setCount] = useState(0);
```

說明這行語法：

- `useState(0)` 的參數是這個 state 的**初始值**，只在第一次 render 時生效。
- 它的回傳值是一個陣列，慣例上用**陣列解構**取出兩個東西：第一個（`count`）是**目前的 state 值**，第二個（`setCount`）是**專門用來更新這個 state 的函式**（通稱 setState 函式，後文提到的 setState 都是指這類函式）。
- 附帶一提：`useState` 必須寫在 component function 的最上層，這裡先記住這個規則即可。

呼叫 `setCount(新值)` 時，它會做**兩件事**：

> **1. 把 React 內部保管的 state 資料更新成新的值；2. 觸發這個 component 的 re-render。**

這也是為什麼**絕對不可以直接對 state 變數賦值修改**（例如 `count = count + 1`）。先不說 `count` 是以 `const` 宣告、這樣賦值會直接拋出錯誤；就算刻意改用 `let` 讓它能被賦值，那也只是在改一個普通的區域變數，上面兩個問題都會發生：React 不會知道要重繪，且下次 re-render 時值也會被 `useState` 保管的舊資料蓋回去。想更新 state，**唯一的正確方式是呼叫對應的 setState 函式**。

把以上概念組合起來，就是一個最簡單的計數器 component：

```
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      count: {count}
    </button>
  );
}
```

我們用這個例子把完整流程走一遍：

1. **initial render（首次渲染）**：React 呼叫 `Counter` 這個 component function，`useState(0)` 回傳的 `count` 是初始值 `0`，function 回傳一份「按鈕上顯示 count: 0」的 React elements，React 據此產生真實 DOM，畫面出現按鈕。
2. 使用者**點擊按鈕**，觸發 `onClick`，呼叫了 `setCount(count + 1)`——此時 `count` 的值是 `0`，所以等同於呼叫 `setCount(1)`。
3. `setCount` 將 React 內部保管的 `count` 資料更新為 `1`，並**通知 React：資料變了，該重繪了**。
4. React **以新的資料重新執行一次 `Counter` 這個 component function**——這一步就是 **re-render**。注意：這次執行時 `useState` 回傳的 `count` 是 `1` 而不是初始值 `0`，因為這份資料是由 React 保管在 component function 之外的，不會因為 function 重新執行而被重置。
5. function 回傳**新版的 React elements**：一份「按鈕上顯示 count: 1」的畫面描述。
6. React 將新舊兩份 React elements（也就是新舊 Virtual DOM Tree）進行比較——也就是前面介紹過的 **Reconciliation** 流程——發現差異只有按鈕裡的文字從 `0` 變成 `1`，於是**只更新那一小塊真實 DOM**，完成畫面更新。

#### 回頭再讀一次那句定義

現在我們把那句話再拿出來看：

> 「**以新的資料（props 或 state）重新再執行一次 component function，並產生新版的 React elements**」

拆開來讀：「新的資料」指的是外部傳入的 **props** 或 component 自己保管的 **state** 有了新的值；「重新再執行一次 component function」指的是 React 再呼叫一次你寫的那個畫面藍圖 function；「產生新版的 React elements」則是這次執行的回傳結果——一份描述最新畫面的 Virtual DOM，接著交給前面學過的新舊比較流程，把差異最小化地更新到真實 DOM。你會發現，這句話正是「一律重繪」策略落實在程式碼層面的具體樣貌：**資料變了，就重新執行藍圖、重新產生整份畫面描述，剩下的效能問題交給 Virtual DOM 的比較機制解決**。




