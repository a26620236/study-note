# Tailwind CSS 官方教學筆記

> 整理自 [Tailwind CSS Documentation](https://tailwindcss.com/docs/styling-with-utility-classes)，共 1 大分類、9 篇文章。

## 目錄

- [Styling with Utility Classes](#styling-with-utility-classes)
- [Hover, Focus, and Other States](#hover-focus-and-other-states)
- [Responsive Design](#responsive-design)
- [Dark Mode](#dark-mode)
- [Theme](#theme)
- [Colors](#colors)
- [Adding Custom Styles](#adding-custom-styles)
- [Detecting Classes in Source Files](#detecting-classes-in-source-files)
- [Functions and Directives](#functions-and-directives)

---

## Core Concepts

### Styling with Utility Classes

> 原文連結：https://tailwindcss.com/docs/styling-with-utility-classes

**核心概念：** Tailwind CSS 採用 **utility-first** 方法，透過在 HTML 中直接套用單一用途的 utility class 來建構設計，取代撰寫自訂 CSS。

**Utility class 的優勢（相較於傳統 CSS）：**
- **速度快** — 不需花時間命名 class 或在檔案間切換
- **安全** — 修改只影響特定元素，不會意外破壞其他地方
- **可維護** — 邏輯局部化，修改舊專案更容易
- **可攜** — 可直接複製貼上整段 UI 到其他專案
- **CSS 更小** — utility class 可重複使用，CSS 體積不會線性成長

**基本範例：**

```html
<div class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg">
  <img class="size-12 shrink-0" src="/img/logo.svg" alt="ChitChat Logo" />
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-gray-500">You have a new message!</p>
  </div>
</div>
```

**為什麼不直接用 inline style？**

Utility class 相較 inline style 有三大優勢：

1. **設計系統約束** — utility 來自預定義的 design token，不像 inline style 可填入任意數值
2. **支援 state variant** — inline style 無法處理 `:hover`、`:focus` 等 pseudo-class
3. **支援 media query** — inline style 無法做 responsive design

```html
<!-- inline style 無法做到 hover 效果 -->
<button class="bg-sky-500 hover:bg-sky-700">Save changes</button>

<!-- inline style 無法做到 responsive -->
<div class="grid grid-cols-2 sm:grid-cols-3">...</div>
```

**State variant 的運作方式：**

在 utility 前加上 variant prefix（如 `hover:`、`focus:`、`active:`），**該 class 只在對應狀態時生效**：

```html
<button class="bg-sky-500 hover:bg-sky-700">Save changes</button>
```

產生的 CSS：
```css
.hover\:bg-sky-700 {
  &:hover {
    background-color: var(--color-sky-700);
  }
}
```

**Dark mode** 使用 `dark:` prefix：

```html
<div class="bg-white dark:bg-gray-800">
  <h3 class="text-gray-900 dark:text-white">標題</h3>
  <p class="text-gray-500 dark:text-gray-400">內容</p>
</div>
```

**Arbitrary value（任意值）：** 當預設 theme 沒有需要的值時，使用方括號語法：

```html
<button class="bg-[#316ff6]">Sign in with Facebook</button>
<div class="grid grid-cols-[24rem_2.5rem_minmax(0,1fr)]">...</div>
<div class="max-h-[calc(100dvh-(--spacing(6)))]">...</div>
```

**複合 variant：** 可以串聯多個 variant 處理複雜條件：

```html
<button class="dark:lg:data-current:hover:bg-indigo-600">...</button>
```

**Group 與 Peer：**

- **`group-*`** — 根據父元素狀態來樣式化子元素：
```html
<a href="#" class="group rounded-lg p-8">
  <span class="group-hover:underline">Read more...</span>
</a>
```

- **`peer-*`** — 根據兄弟元素狀態來樣式化（只能用在前面的兄弟）

**管理重複的方式：**

1. **迴圈渲染** — 大多數重複元素透過迴圈產出，markup 只寫一次
2. **多游標編輯** — 同檔案中的重複可用編輯器多游標一次修改
3. **元件化** — 跨檔案重用的樣式抽成 framework component（React、Vue、Svelte）
4. **自訂 CSS** — 簡單的模式可用 `@layer components` 定義：

```css
@layer components {
  .btn-primary {
    border-radius: calc(infinity * 1px);
    background-color: var(--color-violet-500);
    padding-inline: --spacing(5);
    padding-block: --spacing(2);
    font-weight: var(--font-weight-semibold);
    color: var(--color-white);
  }
}
```

**管理樣式衝突：**

- 兩個衝突的 class（如 `grid flex`），**後出現在 stylesheet 中的會勝出**，與 HTML 中的順序無關
- **`!` modifier** — 強制 utility 生效：`bg-red-500!` 會加上 `!important`
- **`important` flag** — 全域標記所有 utility 為 `!important`：`@import "tailwindcss" important;`
- **`prefix` option** — 加前綴避免命名衝突：`@import "tailwindcss" prefix(tw);`

---

### Hover, Focus, and Other States

> 原文連結：https://tailwindcss.com/docs/hover-focus-and-other-states

**核心概念：** Tailwind 中每個 utility class 都可以透過加上 **variant prefix** 來**條件式套用**，variant 描述了你想要觸發的條件。

```html
<button class="bg-sky-500 hover:bg-sky-700">Save changes</button>
```

`hover:bg-sky-700` **預設不做任何事**，只在 hover 時才套用樣式。

**Variant 可以堆疊（stack）：**

```html
<button class="dark:md:hover:bg-fuchsia-600">Save changes</button>
```

**Tailwind 支援的 variant 種類：**
- **Pseudo-class**：`:hover`、`:focus`、`:first-child`、`:required` 等
- **Pseudo-element**：`::before`、`::after`、`::placeholder`、`::selection` 等
- **Media/feature query**：responsive breakpoint、dark mode、`prefers-reduced-motion` 等
- **Attribute selector**：`[dir="rtl"]`、`[open]`、ARIA attributes 等
- **Child selector**：`& > *`、`& *`

#### Pseudo-class

**互動狀態：**

```html
<button class="bg-violet-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700">
  Save changes
</button>
```

其他互動相關：`visited`、`focus-within`、`focus-visible`、`target`

**子元素位置：**

```html
<!-- first / last child -->
<li class="flex py-4 first:pt-0 last:pb-0">...</li>

<!-- odd / even（常用於表格斑馬紋） -->
<tr class="odd:bg-white even:bg-gray-50">...</tr>
```

進階選取：`nth-3`、`nth-[2n+1]`、`nth-last-5`、`nth-of-type-4`

**表單狀態：**

```html
<input class="disabled:bg-gray-50 disabled:text-gray-500 invalid:border-pink-500 required:border-red-500 read-only:bg-gray-100" />
```

支援：`disabled`、`enabled`、`checked`、`indeterminate`、`required`、`optional`、`valid`、`invalid`、`user-valid`、`user-invalid`、`in-range`、`out-of-range`、`placeholder-shown`、`autofill`、`read-only`

**`:has()` — 根據後代元素狀態設定樣式：**

```html
<label class="has-checked:bg-indigo-50 has-checked:text-indigo-900 has-checked:ring-indigo-200">
  Google Pay
  <input type="radio" class="checked:border-indigo-500" />
</label>
```

**`:not()` — 條件不成立時套用：**

```html
<button class="bg-indigo-600 hover:not-focus:bg-indigo-700">...</button>
```

#### Parent / Sibling 狀態

**`group` — 根據父元素狀態樣式化子元素：**

```html
<a href="#" class="group">
  <h3 class="text-gray-900 group-hover:text-white">New project</h3>
  <p class="text-gray-500 group-hover:text-white">Create a new project...</p>
</a>
```

**巢狀 group 可命名區分：**

```html
<li class="group/item">
  <a class="group/edit invisible group-hover/item:visible">
    <span class="group-hover/edit:text-gray-700">Call</span>
  </a>
</li>
```

**`in-*` — 隱式 group（不需要加 `group` class）：**

```html
<div tabindex="0">
  <div class="opacity-50 in-focus:opacity-100">...</div>
</div>
```

**`peer` — 根據前方兄弟元素狀態樣式化：**

```html
<input type="email" class="peer" />
<p class="invisible peer-invalid:visible">Please provide a valid email address.</p>
```

**重要：** `peer` 只能用在**前面的**兄弟元素（CSS subsequent-sibling combinator 的限制）。

#### Pseudo-element

**`::before` / `::after`：** Tailwind 自動加上 `content: ''`

```html
<span class="after:ml-0.5 after:text-red-500 after:content-['*']">Email</span>
```

**`::placeholder`：**
```html
<input class="placeholder:text-gray-500 placeholder:italic" placeholder="Search..." />
```

**`::file`（檔案上傳按鈕）：**
```html
<input type="file" class="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100" />
```

**`::marker`（清單符號）：**
```html
<ul class="list-disc marker:text-sky-400">...</ul>
```

**`::selection`（文字選取）：**
```html
<div class="selection:bg-fuchsia-300 selection:text-fuchsia-900">...</div>
```

**`::first-line` / `::first-letter`：**
```html
<p class="first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-line:tracking-widest first-line:uppercase">...</p>
```

**`::backdrop`（dialog 背景）：**
```html
<dialog class="backdrop:bg-gray-50">...</dialog>
```

#### Media / Feature Query

**`prefers-reduced-motion`：**

```html
<svg class="animate-spin motion-reduce:hidden">...</svg>
<!-- 或反向思考 -->
<button class="motion-safe:transition motion-safe:hover:-translate-x-0.5">Save</button>
```

**`prefers-contrast`：**
```html
<input class="contrast-more:border-gray-400 contrast-more:placeholder-gray-500" />
```

**`forced-colors`**、**`inverted-colors`**、**`pointer-fine` / `pointer-coarse`**、**`portrait` / `landscape`**、**`print`**、**`noscript`** 等皆有對應 variant。

**`@supports` — 功能偵測：**

```html
<div class="flex supports-[display:grid]:grid">...</div>
<div class="not-supports-[display:grid]:flex">...</div>
```

#### Attribute Selector

**ARIA 狀態：**

```html
<div aria-checked="true" class="bg-gray-600 aria-checked:bg-sky-700">...</div>
```

內建 ARIA variant：`aria-busy`、`aria-checked`、`aria-disabled`、`aria-expanded`、`aria-hidden`、`aria-pressed`、`aria-readonly`、`aria-required`、`aria-selected`

任意 ARIA 值：`aria-[sort=ascending]:bg-[url('/img/down-arrow.svg')]`

**Data attribute：**

```html
<!-- 檢查屬性是否存在 -->
<div data-active class="data-active:border-purple-500">...</div>

<!-- 檢查特定值 -->
<div data-size="large" class="data-[size=large]:p-8">...</div>
```

**RTL 支援：**
```html
<div class="ltr:ml-3 rtl:mr-3">...</div>
```

**Open/closed 狀態：**
```html
<details class="open:border-black/10 open:bg-gray-100">...</details>
```

#### Child Selector

**`*` — 直接子元素：**

```html
<ul class="*:rounded-full *:border *:border-sky-100 *:bg-sky-50 *:px-2 *:py-0.5">
  <li>Sales</li>
  <li>Marketing</li>
</ul>
```

**`**` — 所有後代元素：**

```html
<ul class="**:data-avatar:size-12 **:data-avatar:rounded-full">...</ul>
```

**注意：** 子元素上的 utility 與父元素的 `*:` 具有相同 specificity，無法覆蓋父元素的 child style。

#### 自訂 Variant

**Arbitrary variant** — 方括號中寫任意 selector：

```html
<li class="[&.is-dragging]:cursor-grabbing">...</li>
<div class="[&_p]:mt-4">...</div>
<div class="flex [@supports(display:grid)]:grid">...</div>
```

**`@custom-variant` — 註冊可重用的自訂 variant：**

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```
```html
<button class="theme-midnight:bg-black">...</button>
```

#### Quick Reference Table

| Variant | CSS |
|---------|-----|
| `hover` | `@media (hover: hover) { &:hover }` |
| `focus` | `&:focus` |
| `focus-within` | `&:focus-within` |
| `focus-visible` | `&:focus-visible` |
| `active` | `&:active` |
| `visited` | `&:visited` |
| `target` | `&:target` |
| `*` | `:is(& > *)` |
| `**` | `:is(& *)` |
| `has-[...]` | `&:has(...)` |
| `group-[...]` | `&:is(:where(.group)... *)` |
| `peer-[...]` | `&:is(:where(.peer)... ~ *)` |
| `in-[...]` | `:where(...) &` |
| `not-[...]` | `&:not(...)` |
| `first` | `&:first-child` |
| `last` | `&:last-child` |
| `odd` | `&:nth-child(odd)` |
| `even` | `&:nth-child(even)` |
| `disabled` | `&:disabled` |
| `checked` | `&:checked` |
| `required` | `&:required` |
| `valid` | `&:valid` |
| `invalid` | `&:invalid` |
| `before` | `&::before` |
| `after` | `&::after` |
| `placeholder` | `&::placeholder` |
| `file` | `&::file-selector-button` |
| `marker` | `&::marker, & *::marker` |
| `selection` | `&::selection` |
| `backdrop` | `&::backdrop` |
| `sm` | `@media (width >= 40rem)` |
| `md` | `@media (width >= 48rem)` |
| `lg` | `@media (width >= 64rem)` |
| `xl` | `@media (width >= 80rem)` |
| `2xl` | `@media (width >= 96rem)` |
| `dark` | `@media (prefers-color-scheme: dark)` |
| `motion-safe` | `@media (prefers-reduced-motion: no-preference)` |
| `motion-reduce` | `@media (prefers-reduced-motion: reduce)` |
| `portrait` | `@media (orientation: portrait)` |
| `landscape` | `@media (orientation: landscape)` |
| `print` | `@media print` |
| `aria-*` | `&[aria-…]` |
| `data-[...]` | `&[data-…]` |
| `rtl` | `&:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)` |
| `ltr` | `&:where(:dir(ltr), [dir="ltr"], [dir="ltr"] *)` |
| `open` | `&:is([open], :popover-open, :open)` |

---

### Responsive Design

> 原文連結：https://tailwindcss.com/docs/responsive-design

**核心概念：** Tailwind 中每個 utility class 都可以在不同 breakpoint **條件式套用**，只需加上 breakpoint prefix。

**前置需求** — 確保 HTML `<head>` 中有 viewport meta tag：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**基本用法：**

```html
<img class="w-16 md:w-32 lg:w-48" src="..." />
```

#### 預設 Breakpoint

| Prefix | 最小寬度 | CSS |
|--------|----------|-----|
| `sm` | 40rem (640px) | `@media (width >= 40rem)` |
| `md` | 48rem (768px) | `@media (width >= 48rem)` |
| `lg` | 64rem (1024px) | `@media (width >= 64rem)` |
| `xl` | 80rem (1280px) | `@media (width >= 80rem)` |
| `2xl` | 96rem (1536px) | `@media (width >= 96rem)` |

#### Mobile-first 設計原則

Tailwind 採用 **mobile-first** 方法：
- **無 prefix** 的 utility → 套用在**所有**螢幕尺寸
- **有 prefix** 的 utility → 在該 breakpoint **以上**才生效

```html
<!-- 錯誤理解：這不是「只在手機上置中」 -->
<div class="sm:text-center"></div>

<!-- 正確做法：手機置中，sm 以上靠左 -->
<div class="text-center sm:text-left"></div>
```

**最佳實踐：** 先實作 mobile layout，再往上層疊加 `sm`、`md`、`lg` 等變化。

#### Breakpoint 範圍

**Max-width variant** — 限定上限：

```html
<div class="md:max-xl:flex">
  <!-- 只在 md 到 xl 之間套用 flex -->
</div>
```

| Variant | Media query |
|---------|-------------|
| `max-sm` | `@media (width < 40rem)` |
| `max-md` | `@media (width < 48rem)` |
| `max-lg` | `@media (width < 64rem)` |
| `max-xl` | `@media (width < 80rem)` |
| `max-2xl` | `@media (width < 96rem)` |

**精確鎖定單一 breakpoint：**

```html
<div class="md:max-lg:flex">
  <!-- 只在 md (768px) 到 lg (1024px) 之間套用 -->
</div>
```

#### 自訂 Breakpoint

使用 `--breakpoint-*` theme 變數：

```css
@import "tailwindcss";

@theme {
  --breakpoint-xs: 30rem;
  --breakpoint-3xl: 120rem;
}
```

移除預設 breakpoint：

```css
@theme {
  --breakpoint-*: initial;
  --breakpoint-tablet: 40rem;
  --breakpoint-laptop: 64rem;
  --breakpoint-desktop: 80rem;
}
```

**Arbitrary breakpoint：**

```html
<div class="min-[320px]:text-center max-[600px]:bg-sky-300">...</div>
```

#### Container Query

Container query 讓元素根據**容器寬度**（而非 viewport）來調整樣式，使元件更具可攜性。

**基本用法：**

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    <!-- 當容器寬度 >= 28rem 時切換為 row -->
  </div>
</div>
```

用 `@container` 標記容器，再使用 `@sm`、`@md` 等 variant。

**Container query 的 breakpoint：**

| Variant | 最小寬度 |
|---------|----------|
| `@3xs` | 16rem (256px) |
| `@2xs` | 18rem (288px) |
| `@xs` | 20rem (320px) |
| `@sm` | 24rem (384px) |
| `@md` | 28rem (448px) |
| `@lg` | 32rem (512px) |
| `@xl` | 36rem (576px) |
| `@2xl` | 42rem (672px) |
| `@3xl` | 48rem (768px) |
| `@4xl` | 56rem (896px) |
| `@5xl` | 64rem (1024px) |
| `@6xl` | 72rem (1152px) |
| `@7xl` | 80rem (1280px) |

**Max-width container query：**

```html
<div class="@container">
  <div class="flex flex-row @max-md:flex-col">...</div>
</div>
```

**命名容器（Named container）** — 用於巢狀容器場景：

```html
<div class="@container/main">
  <div class="flex flex-row @sm/main:flex-col">
    <!-- 明確指定參考 /main 容器 -->
  </div>
</div>
```

**自訂 container size：**

```css
@theme {
  --container-8xl: 96rem;
}
```

**Arbitrary container query：**

```html
<div class="@container">
  <div class="flex flex-col @min-[475px]:flex-row">...</div>
</div>
```

---

### Dark Mode

> 原文連結：https://tailwindcss.com/docs/dark-mode

Tailwind CSS 將 dark mode 視為一等公民功能，提供 **`dark` variant** 讓你在深色模式下套用不同樣式。

**預設行為：使用 `prefers-color-scheme`**

預設情況下，`dark` variant 透過 CSS media feature `prefers-color-scheme` 來偵測系統設定：

```html
<div class="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
  <h3 class="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight">
    Writes upside-down
  </h3>
  <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
    The Zero Gravity Pen can be used to write in any orientation...
  </p>
</div>
```

只要在 utility class 前加上 `dark:` 前綴，該樣式就只會在深色模式下生效。

**手動切換 Dark Mode**

若要改用 **CSS class** 手動控制，可透過 `@custom-variant` 覆寫預設行為：

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

然後在 `<html>` 上加上 `dark` class 即可啟用：

```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-black"><!-- ... --></div>
  </body>
</html>
```

也可以改用 **data attribute** 的方式：

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

```html
<html data-theme="dark">
  <!-- ... -->
</html>
```

**三段式切換（Light / Dark / System）**

結合 `localStorage` 與 `window.matchMedia()` 可實作支援「亮色 / 深色 / 跟隨系統」的三段式切換：

```javascript
// 在 <head> 中 inline 執行，避免 FOUC（Flash of Unstyled Content）
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches),
);

// 使用者選擇亮色模式
localStorage.theme = "light";

// 使用者選擇深色模式
localStorage.theme = "dark";

// 使用者選擇跟隨系統
localStorage.removeItem("theme");
```

偏好設定可存放在 **localStorage**、資料庫，或由伺服器端渲染決定。

---

### Theme

> 原文連結：https://tailwindcss.com/docs/theme

Theme variables 是透過 **`@theme` directive** 定義的特殊 CSS variables，用來決定專案中可用的 utility classes。它們代表底層的設計決策，稱為 **design tokens**。

**`@theme` 與 `:root` 的差異**

- `@theme` 中定義的變數會**自動產生對應的 utility classes**
- `:root` 中定義的只是普通 CSS variables，不會產生 utility classes
- `@theme` 必須定義在**頂層**，不能巢狀在 selector 或 media query 中

```css
@import "tailwindcss";

@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

上述定義會自動產生 `bg-mint-500`、`text-mint-500`、`fill-mint-500` 等 utility classes。

**Theme Variable Namespaces**

每個 namespace 對應一組 utility classes：

| Namespace | 用途 |
|-----------|------|
| `--color-*` | 顏色（bg, text, border 等） |
| `--font-*` | 字型家族（font-sans, font-serif） |
| `--text-*` | 字體大小（text-xl, text-2xl） |
| `--font-weight-*` | 字重（font-bold） |
| `--tracking-*` | 字距（tracking-wide） |
| `--leading-*` | 行高（leading-tight） |
| `--breakpoint-*` | 響應式斷點（sm:, md:） |
| `--spacing-*` | 間距與尺寸（px-4, max-h-16） |
| `--radius-*` | 圓角（rounded-sm） |
| `--shadow-*` | 陰影（shadow-md） |
| `--blur-*` | 模糊濾鏡（blur-md） |
| `--ease-*` | 動畫曲線（ease-out） |
| `--animate-*` | 動畫（animate-spin） |
| `--aspect-*` | 長寬比（aspect-video） |

**擴充預設 Theme**

直接在 `@theme` 中新增變數，不會影響既有預設值：

```css
@import "tailwindcss";

@theme {
  --font-script: Great Vibes, cursive;
}
```

```html
<p class="font-script">This will use the Great Vibes font family.</p>
```

**覆寫預設 Theme**

覆寫單一變數：

```css
@theme {
  --breakpoint-sm: 30rem;
}
```

用 **星號語法** 重置整個 namespace 後重新定義：

```css
@theme {
  --color-*: initial;
  --color-white: #fff;
  --color-purple: #3f3cbb;
  --color-midnight: #121063;
  --color-tahiti: #3ab7bf;
  --color-bermuda: #78dcca;
}
```

**完全自訂 Theme（停用所有預設）**

使用 `--*: initial` 清除所有預設值：

```css
@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-lagoon: oklch(0.72 0.11 221.19);
  --color-coral: oklch(0.74 0.17 40.24);
}
```

**定義動畫 Keyframes**

可在 `@theme` 內直接定義 `@keyframes`：

```css
@theme {
  --animate-fade-in-scale: fade-in-scale 0.3s ease-out;

  @keyframes fade-in-scale {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
}
```

**`inline` 與 `static` 選項**

- **`@theme inline`**：當變數值需要引用其他 CSS variable 時使用，確保 utility 使用的是實際值而非參考

```css
@theme inline {
  --font-sans: var(--font-inter);
}
```

- **`@theme static`**：強制產生所有 CSS variables（即使未被使用）

```css
@theme static {
  --color-primary: var(--color-red-500);
  --color-secondary: var(--color-blue-500);
}
```

**跨專案共用 Theme**

將 theme 變數抽成獨立檔案，供其他專案 import：

```css
/* ./packages/brand/theme.css */
@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-lagoon: oklch(0.72 0.11 221.19);
}
```

```css
/* ./packages/admin/app.css */
@import "tailwindcss";
@import "../brand/theme.css";
```

**在自訂 CSS 中使用 Theme 變數**

所有 theme variables 編譯後會成為一般的 CSS variables，可在任何地方使用：

```css
@layer components {
  .typography {
    p {
      font-size: var(--text-base);
      color: var(--color-gray-700);
    }
    h1 {
      font-size: var(--text-2xl--line-height);
      font-weight: var(--font-weight-semibold);
      color: var(--color-gray-950);
    }
  }
}
```

**在 JavaScript 中讀取**

```javascript
let styles = getComputedStyle(document.documentElement);
let shadow = styles.getPropertyValue("--shadow-xl");
```

搭配動畫庫（如 Motion）使用：

```jsx
<motion.div animate={{ backgroundColor: "var(--color-blue-500)" }} />
```

---

### Colors

> 原文連結：https://tailwindcss.com/docs/colors

Tailwind CSS 內建豐富的色彩系統，每個色系包含 **11 個色階**（50 最淺，950 最深）。

**內建色系：** Red, Orange, Amber, Yellow, Lime, Green, Emerald, Teal, Cyan, Sky, Blue, Indigo, Violet, Purple, Fuchsia, Pink, Rose, Slate, Gray, Zinc, Neutral, Stone, Taupe, Mauve, Mist, Olive

**顏色相關的 Utility Classes**

| Utility | 用途 |
|---------|------|
| `bg-*` | 背景色 |
| `text-*` | 文字色 |
| `border-*` | 邊框色 |
| `outline-*` | 外框色 |
| `ring-*` | Ring 陰影色 |
| `shadow-*` | Box shadow 色 |
| `accent-*` | 表單控制項強調色 |
| `caret-*` | 表單游標色 |
| `fill-*` | SVG 填充色 |
| `stroke-*` | SVG 描邊色 |
| `decoration-*` | 文字裝飾色 |

**調整透明度**

使用 `/` 語法調整透明度：

```html
<div class="bg-sky-500/10"></div>
<div class="bg-sky-500/20"></div>
<div class="bg-sky-500/30"></div>
```

支援 **arbitrary values** 與 **CSS variables**：

```html
<div class="bg-pink-500/[71.37%]"></div>
<div class="bg-cyan-400/(--my-alpha-value)"></div>
```

**搭配 Dark Mode 使用**

```html
<div class="bg-white dark:bg-gray-800 rounded-lg px-6 py-8">
  <h3 class="text-gray-900 dark:text-white">標題</h3>
  <p class="text-gray-500 dark:text-gray-400">內容</p>
</div>
```

**在 CSS 中引用顏色變數**

所有顏色以 `--color-*` namespace 暴露為 CSS variables：

```css
@layer components {
  .typography {
    color: var(--color-gray-950);
    a {
      color: var(--color-blue-500);
      &:hover {
        color: var(--color-blue-800);
      }
    }
  }
}
```

使用 `--alpha()` 函式在 CSS 中調整透明度：

```css
@layer components {
  .DocSearch-Hit--Result {
    background-color: --alpha(var(--color-gray-950) / 10%);
  }
}
```

**新增自訂顏色**

```css
@theme {
  --color-midnight: #121063;
  --color-tahiti: #3ab7bf;
  --color-bermuda: #78dcca;
}
```

定義後即可使用 `bg-midnight`、`text-tahiti`、`fill-bermuda` 等 utility。

**覆寫預設顏色**

直接重新定義同名變數即可覆寫：

```css
@theme {
  --color-gray-50: oklch(0.984 0.003 247.858);
  --color-gray-100: oklch(0.968 0.007 247.896);
  /* ... 其餘色階 */
}
```

**停用特定色系**

將不需要的色系設為 `initial`：

```css
@theme {
  --color-lime-*: initial;
  --color-fuchsia-*: initial;
}
```

**完全替換成自訂調色盤**

先清除所有預設顏色，再定義自己的：

```css
@theme {
  --color-*: initial;
  --color-white: #fff;
  --color-purple: #3f3cbb;
  --color-midnight: #121063;
  --color-tahiti: #3ab7bf;
  --color-bermuda: #78dcca;
}
```

**用 `@theme inline` 引用其他 CSS 變數**

適合需要根據情境（如 dark mode）動態切換的場景：

```css
:root {
  --acme-canvas-color: oklch(0.967 0.003 264.542);
}

[data-theme="dark"] {
  --acme-canvas-color: oklch(0.21 0.034 264.665);
}

@theme inline {
  --color-canvas: var(--acme-canvas-color);
}
```

**預設色彩格式**

所有預設顏色使用 **OKLCH** 色彩格式定義，例如 Red 色系：

```css
--color-red-50: oklch(97.1% 0.013 17.38);
--color-red-100: oklch(93.6% 0.032 17.717);
--color-red-200: oklch(88.5% 0.062 18.334);
--color-red-300: oklch(80.8% 0.114 19.571);
--color-red-400: oklch(70.4% 0.191 22.216);
--color-red-500: oklch(63.7% 0.237 25.331);
--color-red-600: oklch(57.7% 0.245 27.325);
--color-red-700: oklch(50.5% 0.213 27.518);
--color-red-800: oklch(44.4% 0.177 26.899);
--color-red-900: oklch(39.6% 0.141 25.723);
--color-red-950: oklch(25.8% 0.092 26.042);
```

---

### Adding Custom Styles

> 原文連結：https://tailwindcss.com/docs/adding-custom-styles

#### 自訂 Theme

使用 `@theme` directive 在 CSS 中定義 design tokens（顏色、spacing、字型、breakpoints 等）：

```css
@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
```

#### Arbitrary Values（任意值）

使用**方括號語法**跳脫 design token 的限制，直接寫入任意 CSS 值：

```html
<div class="top-[117px]">...</div>
<div class="top-[117px] lg:top-[344px]">...</div>
<div class="bg-[#bada55] text-[22px] before:content-['Festivus']">...</div>
```

使用 CSS 變數時以 `--` 開頭，用圓括號包裹：

```html
<div class="fill-(--my-brand-color)">...</div>
```

**Arbitrary Properties** — 對任意 CSS 屬性也可使用方括號：

```html
<div class="[mask-type:luminance]">...</div>
<div class="[mask-type:luminance] hover:[mask-type:alpha]">...</div>
<div class="[--scroll-offset:56px] lg:[--scroll-offset:44px]">...</div>
```

**Arbitrary Variants** — 動態建立 selector 修飾：

```html
<li class="lg:[&:nth-child(-n+3)]:hover:underline">{item}</li>
```

**空白處理**：用底線 `_` 代替空格，Tailwind 會在 build 時轉換。若需要保留底線本身，用反斜線跳脫：`before:content-['hello\_world']`。

**解決歧義**：當 CSS 變數用途不明確時，加上 data type hint：

```html
<div class="text-(length:--my-var)">...</div>  <!-- font-size -->
<div class="text-(color:--my-var)">...</div>    <!-- color -->
```

#### 自訂 CSS 與 Layer

**Base styles** — 在 `@layer base` 中設定元素預設樣式：

```css
@layer base {
  h1 { font-size: var(--text-2xl); }
  h2 { font-size: var(--text-xl); }
}
```

**Component classes** — 在 `@layer components` 中建立可被 utility 覆蓋的可複用 class：

```css
@layer components {
  .card {
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    padding: var(--spacing-6);
    box-shadow: var(--shadow-xl);
  }
}
```

```html
<!-- utility 會覆蓋 component class -->
<div class="card rounded-none">...</div>
```

**在自訂 CSS 中使用 Variants**：

```css
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
}
```

#### 自訂 Utilities

使用 `@utility` directive 新增自訂 utility，**可搭配所有 variant 使用**：

```css
@utility content-auto {
  content-visibility: auto;
}
```

**Functional utilities** — 使用 `--value()` 建立接受參數的 utility：

```css
@theme {
  --tab-size-2: 2;
  --tab-size-4: 4;
  --tab-size-github: 8;
}

@utility tab-* {
  tab-size: --value(--tab-size-*);  /* 匹配 theme 值：tab-2, tab-4, tab-github */
}
```

`--value()` 支援多種匹配模式：

- **Bare values**：`--value(integer)` → 匹配 `tab-1`, `tab-76`
- **Literal values**：`--value("inherit", "initial", "unset")` → 匹配 `tab-inherit`
- **Arbitrary values**：`--value([integer])` → 匹配 `tab-[1]`, `tab-[76]`
- **組合使用**：多行 `--value()` 由上而下依序匹配

**Negative values** 需定義對應的 `-` 前綴 utility：

```css
@utility inset-* {
  inset: --spacing(--value(integer));
}
@utility -inset-* {
  inset: --spacing(--value(integer) * -1);
}
```

**Modifiers** — 用 `--modifier()` 處理 `/` 後的修飾值：

```css
@utility text-* {
  font-size: --value(--text-*, [length]);
  line-height: --modifier(--leading-*, [length], [*]);
}
```

#### 自訂 Variants

使用 `@custom-variant` 建立自訂 variant：

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

```html
<html data-theme="midnight">
  <button class="theme-midnight:bg-black ..."></button>
</html>
```

需要巢狀結構時使用完整語法，搭配 `@slot` 標記插入點：

```css
@custom-variant any-hover {
  @media (any-hover: hover) {
    &:hover {
      @slot;
    }
  }
}
```

---

### Detecting Classes in Source Files

> 原文連結：https://tailwindcss.com/docs/detecting-classes-in-source-files

#### 偵測原理

Tailwind 會**掃描專案中的所有原始檔**，將其當作純文字處理（不做語法解析），尋找可能是 class name 的 token，再產生對應的 CSS。這確保了**輸出的 CSS 體積最小化**。

#### 動態 Class Name 的限制

**Tailwind 無法理解字串串接或插值**，必須使用完整的 class name 字串。

```html
<!-- 錯誤：Tailwind 找不到 text-red-600 或 text-green-600 -->
<div class="text-{{ error ? 'red' : 'green' }}-600"></div>

<!-- 正確：使用完整的 class name -->
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```

在 React/Vue component 中，**用 map 對應 props 到完整的靜態 class name**：

```jsx
// 錯誤
<button className={`bg-${color}-600 hover:bg-${color}-500`}>{children}</button>

// 正確
const colorVariants = {
  blue: "bg-blue-600 hover:bg-blue-500 text-white",
  red: "bg-red-500 hover:bg-red-400 text-white",
  yellow: "bg-yellow-300 hover:bg-yellow-400 text-black",
};
<button className={`${colorVariants[color]} ...`}>{children}</button>
```

#### 掃描範圍

Tailwind 預設掃描專案中**所有檔案**，但排除以下：

- `.gitignore` 中列出的檔案
- `node_modules` 目錄
- Binary 檔案（圖片、影片、壓縮檔）
- CSS 檔案
- Package manager lock 檔案

#### 明確指定掃描來源

**`@source`** — 加入額外掃描路徑（例如 node_modules 中的 UI library）：

```css
@import "tailwindcss";
@source "../node_modules/@acmecorp/ui-lib";
```

**設定 base path** — 適用於 monorepo：

```css
@import "tailwindcss" source("../src");
```

**排除特定路徑**：

```css
@source not "../src/components/legacy";
```

**完全停用自動偵測**，手動指定所有來源：

```css
@import "tailwindcss" source(none);
@source "../admin";
@source "../shared";
```

#### Safelist（強制產生特定 Utility）

使用 `@source inline()` 強制產生指定的 utility，即使原始碼中未出現：

```css
@source inline("underline");
```

搭配 variant 使用（brace expansion 語法）：

```css
@source inline("{hover:,focus:,}underline");
```

搭配範圍展開：

```css
@source inline("{hover:,}bg-red-{50,{100..900..100},950}");
```

#### 排除特定 Class

```css
@source not inline("{hover:,focus:,}bg-red-{50,{100..900..100},950}");
```

即使原始碼中偵測到這些 class，也**不會產生對應 CSS**。

---

### Functions and Directives

> 原文連結：https://tailwindcss.com/docs/functions-and-directives

#### Directives

**`@import`** — 引入 CSS 檔案，包含 Tailwind 本身：

```css
@import "tailwindcss";
```

**`@theme`** — 定義自訂 design tokens（顏色、字型、breakpoints 等），這些值會變成 CSS 變數並可被 utility class 使用。

**`@source`** — 明確指定 Tailwind 應掃描的來源檔案路徑。

**`@utility`** — 新增自訂 utility，可與所有 variant 搭配使用：

```css
@utility tab-4 {
  tab-size: 4;
}
```

**`@variant`** — 在自訂 CSS 中套用 Tailwind variant：

```css
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
}
```

**`@custom-variant`** — 建立自訂 variant：

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

**`@apply`** — 在自訂 CSS 中內聯使用現有的 utility class：

```css
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
.select2-search {
  @apply rounded border border-gray-300;
}
.select2-results__group {
  @apply text-lg font-bold text-gray-900;
}
```

**`@reference`** — 引入 theme 變數、自訂 utility 和 variant 以供 `@apply` 使用，但**不會在輸出中重複產生 CSS**。適合用在 Vue/Svelte 的 `<style>` block 中：

```vue
<style>
  @reference "../../app.css";
  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

若無自訂 theme，可直接 reference Tailwind：

```vue
<style>
  @reference "tailwindcss";
</style>
```

**Subpath imports** — 搭配 `package.json` 的 `imports` 欄位使用路徑別名：

```json
{
  "imports": {
    "#app.css": "./src/css/app.css"
  }
}
```

```vue
<style>
  @reference "#app.css";
</style>
```

#### Functions

**`--alpha()`** — 調整顏色的透明度：

```css
.my-element {
  color: --alpha(var(--color-lime-300) / 50%);
}
/* 編譯後 */
.my-element {
  color: color-mix(in oklab, var(--color-lime-300) 50%, transparent);
}
```

**`--spacing()`** — 根據 theme 產生 spacing 值：

```css
.my-element {
  margin: --spacing(4);
}
/* 編譯後 */
.my-element {
  margin: calc(var(--spacing) * 4);
}
```

也可在 arbitrary values 中使用：

```html
<div class="py-[calc(--spacing(4)-1px)]">...</div>
```

#### v3 相容性

以下 directive 與 function 用於從 v3 漸進遷移：

- **`@config`** — 載入舊版 JavaScript 設定檔：`@config "../../tailwind.config.js";`
- **`@plugin`** — 載入舊版 JavaScript plugin：`@plugin "@tailwindcss/typography";`
- **`theme()`**（已棄用）— 用 dot notation 存取 theme 值：`margin: theme(spacing.12);`。**新專案建議改用 CSS theme 變數**。
