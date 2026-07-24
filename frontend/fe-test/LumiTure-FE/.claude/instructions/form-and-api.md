# Form 與 API 規範

## Form 管理（react-hook-form）

- **`values` + `defaultValues` 必須同時提供**：使用 `values` 選項時，一定要同時提供 `defaultValues`，避免 uncontrolled→controlled 警告

  ```typescript
  // ✅ 正確寫法
  useForm({
    defaultValues: { name: '', values: [] },
    values: serverData ? transform(serverData) : undefined,
  });
  ```

- **`values` 語意**：`values` 有值時 RHF 會 reset 整個 form；`undefined` 時退回 `defaultValues`
- **Schema**：定義放在 `zod/[feature].schema.ts`；表單 hook 放在 `hooks/useXxxForm.ts`
- **通知**：成功 / 失敗統一使用 `popSuccessToast` / `popErrorToast`
- **`useFieldArray` 禁用 `replace()`**：陣列 mutation 一律用內建 mutator（`append` / `remove` / `move` / `insert`）。`replace()` 會重新產生每個 item 的內部 `field.id`，導致 React 把所有 mapped 元件 unmount/mount，元件內 local state（如 `isCollapsed`、focus state）全部重置

  ```typescript
  // ✅
  const { fields, append, remove, move } = useFieldArray({ control, name: 'values' });
  move(from, to);
  remove(index);
  append(newItem);

  // ❌ 整片元件會被 unmount，local state 丟失
  const { fields, replace } = useFieldArray({ control, name: 'values' });
  replace([...current, newItem]);
  replace(filtered);
  ```

- 衍生欄位（如 `displayOrder`）改用 `setValue` 更新；不要用 `update()`（會重新產生 `field.id`，跟 `replace()` 同坑）

## API 層與資料流

- API 資料透過 **TanStack Query hooks** 取得，禁止透過 props 層層傳遞
- **Query Key**：不加 `as const`，`QueryKey` 型別已接受 `unknown[]`
  - ✅ `() => ['lumitag', tagId]`
  - ❌ `() => ['lumitag', tagId] as const`
- Loading / Error 狀態處理應完整
- 使用 try-catch 捕獲錯誤，考慮使用 Error Boundary
- API 回應型別定義應正確且嚴格
- **Server / Client state 分開**：Server state 用 TanStack Query；Client state 用 Zustand / local state，兩者不混用
- **Zustand store**：本質是 hook，一律放在 `hooks/` 目錄下（如 `hooks/useXxxStore.ts`）
- **API 欄位命名一律 camelCase**：FE / BE 接觸點（payload、response、`condition.field` 等）一律用 camelCase。後端有 auto-conversion middleware 雙向處理 snake_case ↔ camelCase，FE 不需要在邊界做轉換

## hooks-api 規範

新 feature 的 API hooks 一律放在 `apps/lumiture-ai/src/hooks-api/<feature>/`。

**命名**：

| 操作   | Hook 命名             | 範例                         |
| ------ | --------------------- | ---------------------------- |
| GET    | `useGet[Resource]`    | `useGetRightsizingSettings`  |
| POST   | `usePost[Resource]`   | `usePostRightsizingSettings` |
| PUT    | `usePut[Resource]`    | `usePutRightsizingSettings`  |
| DELETE | `useDelete[Resource]` | `useDeleteAWSResources`      |
| PATCH  | `usePatch[Resource]`  | `usePatchRecommendAction`    |

**GET hook 必須額外 export**（供 Hydration Server Component 使用）：

- **QueryKey 命名一律 `get[Resource]QueryKey`**（function 回傳 query key，動詞前綴對齊呼叫端 verb-first 的閱讀習慣）
- **QueryFn 命名一律 `[resource]QueryFn`**（不加 `get` 前綴，避免跟 hook 動詞重複）
  - ✅ `getLumiTagListQueryKey` / `lumiTagListQueryFn`
  - ❌ `lumiTagListQueryKey` / `getLumiTagListQueryFn`

```typescript
export const getXxxQueryKey = (param?: string) => ['/xxx', param].filter(Boolean);
export const xxxQueryFn = async (headers: RawAxiosRequestHeaders, param?: string) => { ... };
export const useGetXxx = (param?: string, options?: UseQueryOptions<XxxResponse>) => {
  const { headers, hasToken } = useAuthHeaders();
  return useQuery({ queryKey: getXxxQueryKey(param), queryFn: ..., enabled: hasToken, ...options });
};
```

**Mutation hook（POST / PUT / DELETE / PATCH）**：

- 無需 export queryFn
- `mutationKey` 需包含操作類型（`'create'`、`'update'`、`'delete'`）
- 接受 `UseMutationOptions<Success, AxiosError, Payload>` 供呼叫方傳入 `onSuccess`、`onError`
- **不在 hook 內部塞副作用**：不要預設 `onSuccess` 做 `invalidateQueries` / toast / navigation 等行為，全部交給呼叫端自己決定。Hook 只做純粹的 mutation 包裝，內部不該出現 `useQueryClient`
  - ✅ Hook 只設 `mutationKey` 與 `mutationFn`，spread `...options` 讓呼叫端決定 `onSuccess` / `onError`
  - ❌ Hook 內 `useQueryClient()` 並預設 `onSuccess: () => queryClient.invalidateQueries(...)`

**Mutation 呼叫端（使用方）**：

- 副作用（`invalidateQueries` / `popSuccessToast` / `popErrorToast` / navigation / 關閉 dialog）一律寫在傳給 hook 的 `onSuccess` / `onError`，**優先用 callback、不要用 `mutateAsync` + `try/catch`**
- `mutate(payload)` 只帶 payload；loading 狀態用回傳的 `isPending`，不自管 loading flag
- 「成功 / 失敗都要做」的收尾（如關閉 dialog）放 `onSettled`，避免在 `onSuccess` / `onError` 兩處重複

  ```typescript
  // ✅ 副作用放呼叫端 callback，無 try/catch
  const { mutate, isPending } = usePatchXxx({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: xxxBaseQueryKey });
      popSuccessToast({ description: '...' });
    },
    onError: (error) => {
      popErrorToast({ description: '...' });
      console.error(error);
    },
    onSettled: () => setIsDialogOpen(false),
  });
  const handleSubmit = (payload: PatchXxxPayload) => mutate(payload);

  // ❌ mutateAsync + try/catch（副作用散落、收尾重複）
  const { mutateAsync } = usePatchXxx();
  const handleSubmit = async (payload: PatchXxxPayload) => {
    try {
      await mutateAsync(payload);
      queryClient.invalidateQueries(...);
      popSuccessToast({ description: '...' });
      setIsDialogOpen(false);
    } catch (error) {
      popErrorToast({ description: '...' });
      setIsDialogOpen(false);
    }
  };
  ```

**型別**：

- **Response type 必須定義在 hook 檔案內**，用 `ResponseGenerics<T>` 包裝。**禁止寫在 `[domain].type.ts`**
  - ✅ `useGetXxx.ts` 檔頂：`export type XxxResponse = ResponseGenerics<Xxx>;`
  - ❌ 把 `XxxResponse` / `XxxListResponse` 集中放在 `[domain].type.ts`
- **Payload type 必須定義在自己的 mutation hook 檔案內**（POST / PUT 各自定義 `PostXxxPayload` / `PutXxxPayload`），**禁止放共用的 `[domain].type.ts`**
  - ✅ `usePostXxx.ts` 檔內：`export interface PostXxxPayload { ... }`
  - ❌ 把 `XxxPayload` 放在 `[domain].type.ts` 給多個 hook 共用
- **`[domain].type.ts` 只放 base / domain entity types**（enum、entity interface、欄位型別等），不放任何 `*Response` / `*Payload`
- 禁止使用 `any`，錯誤型別用 `AxiosError`

**目錄結構**：

```
apps/lumiture-ai/src/hooks-api/<feature>/
├── index.ts              ← export * from 所有 hooks 與 types
├── [domain].type.ts      ← 只放 base / domain entity types（enum、entity interface）
├── useGet[Resource].ts   ← 內含 [Resource]Response = ResponseGenerics<...>
├── usePost[Resource].ts  ← 內含 Post[Resource]Payload + Post[Resource]Response
├── usePut[Resource].ts   ← 內含 Put[Resource]Payload + Put[Resource]Response
└── useDelete[Resource].ts
```
