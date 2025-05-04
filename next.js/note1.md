# nextjs

- benefits
    
    a framework based on react, it has several benefits:
    
    - hot reloading
    - compiler
    - SSG
    - SSR
    - SEO optimization
    - routing
    - full stack
    - performance optimization
- features        
    - routing
        - route is determined by file structure
        - `page.js` and `route.js` let file structure routable
        - folder with prefix `_` makes it private
    - data fetching
        - server components
            - turn component into asynchronous function
            - make database queries using an ORM or database client
            
            ```jsx
            export default async function Page() {
              const data = await fetch('https://api.vercel.app/blog')
              const posts = await data.json()
              return ...
            }
            
            import { db, posts } from '@/lib/db'
             
            export default async function Page() {
              const allPosts = await db.select().from(posts)
              return ...
            }
            ```
            
        - client components
            - react `use` hook
            - SWR or React Query
            
            ```jsx
            'use client'
            import { use } from 'react'
             
            export default function Posts({
              posts,
            }: {
              posts: Promise<{ id: string; title: string }[]>
            }) {
              const allPosts = use(posts)
             
              return ...
            }
            
            'use client'
            import useSWR from 'swr'
             
            const fetcher = (url) => fetch(url).then((r) => r.json())
             
            export default function BlogPage() {
              const { data, error, isLoading } = useSWR(
                'https://api.vercel.app/blog',
                fetcher
              )
             
              if (isLoading) return <div>Loading...</div>
              if (error) return <div>Error: {error.message}</div>
             
              return ...
              )
            }
            ```
            
        - streaming
            
            When using `async/await` in Server Components, Next.js will opt into **dynamic rendering.**
            
            data will be fetched and **rendered** on the server for every user request.the whole route will be blocked from rendering. 
            
            Tips for handle blocking:
            
            - with `loading.js`
            
            Behind-the-scenes, `loading.js` will be nested inside `layout.js`, and will automatically wrap the `page.js` file and any children below in a `<Suspense>` boundary.
            
            - with react `Suspense` component
            
    - styling
        
        css module ⇒ create seperate css scope by `.module.css` file
        
    
    optimizations
    
    typescript
    
- file structure
    - .next
        
        this is the build folder where Next.js stores all the output files(compiled code, optimized assets)
        
        - optimized assets
            
            優化資源（optimized assets）**在「正式環境」比在開發模式更重要、也更有價值**，甚至可以說正式環境才是它的主要目的。開發模式下雖然也會使用，但優化的程度與效能並不是重點。
            
            ---
            
            ### ✅ 正式環境（`next build` → `next start`）的優化資產 **好處**
            
            1. **圖片自動壓縮與格式轉換**（JPEG → WebP、AVIF 等）
                - 減少圖片大小，提高載入速度
                - 根據瀏覽器支援情況提供最佳格式（Content Negotiation）
            2. **多尺寸版本自動生成（Responsive Images）**
                - `<Image />` 元件會根據 `width`/`sizes` 等屬性，請求對應大小
                - 小螢幕裝置就載入小尺寸圖，省流量又加快速度
            3. **快取優化**
                - 被優化後的圖像會加上內容雜湊（hash），可長時間快取（immutable assets）
            4. **CDN 支援（Vercel 等）**
                - 優化後的圖片會透過 Vercel 或其他 CDN 快取
                - 每個 device/resolution 請求不同圖，快取分層
            
            ---
            
            ### ⚠️ 開發模式（`next dev`）下的 optimized assets：
            
            - 為了 **模擬正式行為**，Next.js 還是會進行圖片優化
            - 但：
                - 效能並非優先考量（不會快）
                - 不會快取生成的圖
                - 每次請求可能都會重新生成（較慢）
            
            這也是為什麼你會看到 `.next/` 在開發中也有 media cache，但其實主要是「開發者預覽行為」，正式部屬時才是真正會發揮最大效益。
            
            ---
            
            ### ✅ 小總結：
            
            | 環境 | 圖片優化會發生嗎 | 主要效益 |
            | --- | --- | --- |
            | 開發 (`next dev`) | ✅ 有 | 預覽、開發測試 |
            | 正式 (`next build`) | ✅ 有（強化） | 壓縮、格式轉換、多尺寸、快取 |
            
            ---
            
            你有在用 `<Image />` 還是 `<img>`？如果你用 `<img src="/public/img.jpg">` 是**完全沒優化效果的喔**。
            
        - what happened after client request an image
            
            **「圖片優化的責任發生在哪裡：Server 還是 Client？」**
            
            答案是：**優化行為完全發生在 Server 端（或 edge server/CDN），Client 只是拿結果來用**。
            
            ---
            
            ## ✅ 圖片優化完整流程示意（使用 `next/image`）
            
            ### 🧠 假設情境：
            
            - `public/images/cat.jpg` 是原始圖片
            - 你在前端這樣使用：
            
            ```tsx
            import Image from "next/image";
            
            export default function Page() {
              return (
                <Image
                  src="/images/cat.jpg"
                  width={600}
                  height={400}
                  alt="A cat"
                />
              );
            }
            
            ```
            
            ---
            
            ## 🔄 實際發生流程（請求流程）
            
            ### 1. **Client 請求 HTML → 下載 `<img>` 標籤或 `<Image>` 結果**
            
            - Next.js 會渲染出 `<img src="/_next/image?url=%2Fimages%2Fcat.jpg&w=600&q=75">`
            - Client browser 會向這個特殊的 URL 發出圖片請求
            
            ### 2. **Server 接收 `/\_next/image` 請求**
            
            Next.js（或 Vercel edge server）會收到一個 GET 請求：
            
            ```
            GET /_next/image?url=/images/cat.jpg&w=600&q=75
            
            ```
            
            ### 3. **Server 處理這個 `/images/cat.jpg` 檔案**
            
            - Server 讀取 `public/images/cat.jpg`
            - 接著會進行以下步驟：
                - Resize → 寬度轉為 600px（根據 `w=600`）
                - 壓縮 → 品質設為 75（`q=75`）
                - 格式轉換 → 轉成 WebP 或 AVIF（取決於 browser 支援）
            - 生成後的圖片存在 `.next/cache/images` 內部 cache 資料夾（或 CDN 上）
            
            ### 4. **Server 回傳轉換後的圖片給 Client**
            
            - Server 把這張 **優化後的圖片** 傳給瀏覽器
            - 圖片直接呈現在使用者頁面上
            
            ---
            
            ## 🖼️ 圖片優化是一次性的
            
            - 第一次請求 `/_next/image?...` 時會花時間處理與壓縮
            - 之後相同的 request（相同 URL、寬度、品質）會直接回傳 **快取好的圖**
                - 不再重算（除非你清除 `.next` 或 CDN cache）
            
            ---
            
            ## 🔁 圖示流程（簡化版）
            
            ```
            Client
              |
              | -- requests --> GET /_next/image?url=/images/cat.jpg&w=600&q=75
              |
            Server
              | -- read --> public/images/cat.jpg
              | -- optimize (resize, compress, convert)
              | -- save cache --> .next/cache/images
              | <-- respond optimized image
              |
            Client
              | -- renders optimized image
            
            ```
            
            ---
            
            ## ✅ 總結關鍵點
            
            | 問題 | 答案 |
            | --- | --- |
            | 優化行為發生在哪裡？ | **Server 端（Next.js Server 或 Vercel edge）** |
            | Client 端負責什麼？ | 發出優化圖片的 request，顯示結果 |
            | 原圖會搬到 `.next` 嗎？ | ❌ 不會，原圖還在 `public/`，但 Server 用它來產出快取優化圖片 |
            | 如果用 `<img src="/images/cat.jpg">` 呢？ | ❌ 不經過優化，直接下載原圖 |
            
            ---
            
            你想要我用圖視覺化這個流程嗎？或者要我給你一個實際的例子 repo 跑起來看？
            
    - node modules
        
        stores all npm packages
        
    - public
        
        contains static files like image, fonts, icons
        
    - src
        - app folder
    - .gitignore
        
        specifies which files and folders git should ignore
        
    - eslint.config.mjs
        
        configuration file for ESLint, for code quality and consistency
        
    - next.env.d.ts
        
        a typescript declaration file that helps Next.js understand specific types used internally, like environment variables or file imports.
        
    - next.config.ts
        
        configuration file for Next.js where you can tweak various settings like redire
- special files
  - error.js
  - page.js
  - route.js
  - layout.js
  - loading.js
  - not-found.js
  - template.js
- linking 

  allow we navigate one page to another.
  ```typescript
  import { Link } from "next/link";
- useRouter

  method of useRouter:
  back / forward / prefetch / replace / push / refresh / hmrRefresh

  ```javascript
  "use client"

  import { useRouter } from "next/navigation"

  const Home = () => {
    const router = useRouter();

    return (
      <button onClick={() => router.push('/xxxPage')}</button>
    )
  }
- private route

  add `()` to the folder`s name if you don't want the folder to be a route

  ex: app => (auth) => login / register

  localhost:3000/auth/login (x)
  localhost:3000/auth/register (x)
  localhost:3000/login (v)
  localhost:3000/register (v)

