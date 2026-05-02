# Virtual Tag — Create / Edit Page 實作任務切分

> 依據 [feature-plan.md](./feature-plan.md) 切分。整體順序對齊 plan §2.4（由底層往 UI 走）。
> hooks-api 這層先回傳假資料，讓後端未好之前可以先驗收 UI 與表單流程。
>
> **每個 Phase 完成後必須跑 `pnpm check`（type-check + lint + format）並修正所有錯誤，才算該 Phase 完成。**

---

## Phase 1 — API 層 ✅ 已完成

**目標：Edit 模式能從「API」拿到 detail、field-values 預填；POST/PUT 假裝成功。**

### 1. 建立 `src/hooks-api/lumitag/` 骨架 ✅

- `lumitag.type.ts`：照 api-spec §List/Detail/POST/PUT/field-values 定義
  - `LumitagListItem`、`LumitagResponse`（非 `LumitagDetailResponse`）、`LumitagUpsertPayload`、`LumitagFieldValuesResponse`
  - `Platform`、`Operator`、`Logic`、`NativeTagCriteria` 等
  - `OperatorEnum`（含 `matches`）、`LogicEnum`、`LumitagStatusEnum`
- `lumitag.api.ts`：列出所有 function signature，body 先 `return Promise.resolve(mockXxx)`
  - `getLumitagList` / `getLumitag` / `getLumitagFieldValues` / `postLumitag` / `putLumitag`
  - 加 `MOCK_DELAY_MS` 模擬 latency
  - `getLumitag` mock 直接照 api-spec 的三層巢狀範例（`team` 那筆），schema 已定案
- `index.ts`：barrel export + query key getters
  - `lumitagQueryKeys.detail(id)` / `.fieldValues()` / `.list()`

### 2. 三支 GET hooks（回傳 mock）✅

- `useGetLumitagList.ts`：list，mock 2–3 筆含 `name` 的 item，給 key name 重複檢查用
- `useGetLumitag.ts`（非 `useGetLumitagDetail`）：直接回傳 api-spec §`GET /lumitag/{id}/` 範例那筆 `team` 當 mock
  - 可看到三層巢狀資料 prefill
- `useGetLumitagFieldValues.ts`：回 4 個 platform（gcp/aws/azure/focus），`staleTime: 5 分鐘`

### 3. 兩支 mutation hooks ✅

- `usePostLumitag.ts` / `usePutLumitag.ts`
  - `mutationFn` 直接 `return Promise.resolve({ success: true, id: 999 })`
  - 搭配 `queryClient.invalidateQueries` 保留 production 行為
- Barrel export 完整串起

> 所有 mock 集中在 `lumitag.api.ts` 檔頂 `const MOCK_*` 區塊。
> 日後切正式 API 只要把 function body 換成 `axios.get(...)`，呼叫端不變。

---

## Phase 2 — Schema / Constants / Transform ✅ 已完成

### 4. `zod/lumitagSettings.schema.ts` ✅

- 照 plan §1.4；discriminated union `regular | nativeTag`（`standard` 改為 `regular`，語意更清楚）
- `operator` 使用 `z.enum(OperatorEnum)`；`logic` 使用 `z.enum(LogicEnum)`，直接從 `@hooks-api` import，不在 feature 層重複定義
- export `LumitagFormData` / `ValidatedLumitagData`

### 5. `constants/lumitagSettings.ts` ✅

- `MAX_VALUES=1000`、`MAX_CONDITIONS=20`
- `RECOMMENDED_KEYS`、`TAG_KEY_REGEX`
- `ALL_PLATFORMS`、`PLATFORM_FIELD_CONFIG`
- 錯誤訊息
- `**OPERATORS` 未納入**（已由 `@hooks-api` 的 `OperatorEnum` 取代，feature 層不重複定義）
- `**OPERATOR_SETS`** 尚未實作，待 Phase 5 UI 層有需要時再補

### 6. `utils/transform*.ts` + `__tests__/` ✅

- `transformPayloadToFormData(detail: LumitagResponse)`：GET response → form（保留 `value.id`；加入 `kind` discriminant）
- `transformFormDataToPayload(form, tagId?, status?)`：form → POST/PUT body（`status` 預設 `LumitagStatusEnum.Active`；PUT 注入 `id`；剝除 `kind` 欄位）
- 用 api-spec 的 example JSON 當 fixture 跑單元測試，確保兩邊對稱，coverage 100%

---

## Phase 3 — Form Hooks ✅ 已完成

### 7. `useLumitagSettingsForm`

- `useForm<LumitagFormData, unknown, ValidatedLumitagData>` + `zodResolver`
- `values: transformPayloadToFormData(detail)`（detail 由 `useGetLumitag` 取得）

### 8. 三個 array helper hooks

- `**useValueArrayField`**：`useFieldArray('values')`
  - 封裝 `appendValue`（預設空 scope）、`duplicateValue`、`moveValue` 後重算 `displayOrder`、`canAddMore`
- `**useScopeArrayField(valueIndex)`**
  - `availablePlatforms = PLATFORMS \ usedPlatforms`
  - `addScope(platform)` 附首列 `logic: BASE`
- `**useConditionArrayField(valueIndex, scopeIndex)`**
  - 首列強制 `BASE`，append 預設 `AND`
  - `canAddMore = length < 20`

### 9. `useTagKeyNameValidation`

- 吃 `useGetLumitag` list
- 做 case-insensitive duplicate + `TAG_KEY_REGEX` format 檢查
- Edit 模式下排除自己
- 回 inline error message

---

## Phase 4 — 頁面骨架 ✅ 已完成[內碼]

### 10. `page.tsx` + `LumitagSettingsHydration` + `LumitagSettingsSkeleton`

- server 端讀 `searchParams.tagId`
- 有 id 才 prefetch detail，永遠 prefetch field-values
- `LumitagSettings`（client）持有 `view` state（`'form' | 'preview'`），初始為 `'form'`
  - `view === 'form'`：渲染表單元件 + `LumitagActionButtons`
  - `view === 'preview'`：渲染 `<LumitagPreview onBack={() => setView('form')} />`（本次不實作，僅留佔位元件）

---

## ✅ Phase 5 — UI 元件（由上往下）

### 11. `LumitagSettings` + `LumitagSettingsToolbar` + `LumitagKeySection`

- 主容器包 `<FormProvider>`，串 mutation 提交
- KeySection：Recommended dropdown
- **Edit 模式：input `disabled` + lock icon + 右側 status chip**（status 從 detail response 拿）

### 12. `LumitagValueSection` + `LumitagValueCard`

- 空狀態、Add Value、collapse、duplicate、remove、drag handle
- drag 行為留到 Phase 6

### 13. `LumitagDataSourceBlock` + `LumitagConditionRow` + `LumitagFieldValueInput`

- **DataSourceBlock**：Add Data Source dropdown 只顯示 `availablePlatforms`
- **ConditionRow**：首列顯示 `WHERE`，其餘顯示 `AND/OR` dropdown；✕ 刪除
- **FieldValueInput**：依 field mode 切 text / multi-select / native_tag（key + optional value）

---

## ✅ Phase 6 — 拖曳與收尾

### 14. @dnd-kit 拖曳

- `pnpm add @dnd-kit/core @dnd-kit/sortable`
- Value Card 外層 `DndContext` + `SortableContext`
- `onDragEnd` → `moveValue`

### 15. `LumitagActionButtons` + submit

- FixedBottomBar 3 顆
- Cancel → `router.back()`
- Save as Inactive → `handleSubmit(form => tagId ? putMutation : postMutation)`
- Coverage Preview → `onPreview()` callback，由 `LumitagSettings` 接收後執行 `setView('preview')`（Preview 元件本次不實作，僅留佔位）

### 16. 收尾

- error messages、tooltips、字元上限
- 達上限 disable Add Value / Add Condition
- loading / disabled states

---

## 已確認決策（原 §3 開放問題）

1. **Duplicate 檢查**：打 `GET /lumitag/` 拿全部 list，前端本地 case-insensitive 比對。`useTagKeyNameValidation` 照此實作。
2. **GET detail schema**：api-spec 已定案（三層巢狀範例），直接照此定型別，不需要留「待校對」TODO。
3. **Edit 衝突**：不會有同時修改的情境，不需要 ETag / version。
4. **Coverage Preview**：同頁以 `view` state 切換，`LumitagActionButtons` 透過 `onPreview` callback 觸發，無需 sessionStorage / store。
5. **拖曳**：只影響 `displayOrder`，Card 內容不變。`moveValue` 只需對陣列做 reorder 並重算 index 對應的 `displayOrder`。

