# Virtual Tag — Create / Edit Page 架構設計方案

> 本文件只產出架構設計，不包含實作 code。
> 範圍：只涵蓋 Virtual Tag 的 Create / Edit 表單頁面（不含 List / Preview / Delete）。
> 其他頁面（List、Preview、Detail）僅作為 API / 狀態流向的理解依據。

---

## 0. 範圍與前置決策

### 0.1 功能範圍（Scope）

- Create Virtual Tag：`/lumitag/settings`（無 `tagId`）
- Edit Virtual Tag：`/lumitag/settings?tagId=<id>`（有 `tagId`）
- Create / Edit **共用同一個路由**，依 `tagId` 決定新建或編輯 —— 對齊 `rightsizing/settings` 用 `searchParams` 區分的做法（非 `/new` + `/[id]/edit` 拆兩個路由）
- 底部固定按鈕：`Cancel`、`Save as Inactive Tag`、`Coverage Preview`
  - **本頁唯一的儲存按鈕就是 `Save as Inactive Tag`**，無「直接存成 Active」路徑；儲存後 tag 一律為 Inactive，後續由 Preview → Apply 流程改為 Active
  - `Coverage Preview` **不跳頁**，與 Create / Edit 共用同一路由，切換 `view` state（`'form' | 'preview'`）顯示不同元件，共用同一個 `<FormProvider>`；handler 只需 `setView('preview')`
  - 提交統一打 `POST /lumitag/`（create）或 `PUT /lumitag/{id}/`（edit）；最新 api-spec 的 payload 無 `status` 欄位，由後端依流程決定當下狀態
- **Edit 模式差異**（Figma `#10 Edit LumiTag` 確認）：
  - Tag Key input **disabled + lock icon**；help text 改為 `The Key Name cannot be changed once established to ensure data consistency.`
  - Tag Key label 右側顯示**當前 status chip**（Active / Inactive），由 GET detail 回傳的 `status` 決定
  - 其餘 Tag Values / Conditions / 底部按鈕結構與 Create 頁完全相同

### 0.2 技術決策


| 項目           | 決策                                                                                                                              | 理由                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Form 管理      | **react-hook-form + zodResolver**                                                                                               | 對齊 `rightsizing/settings`；spec 7.66/@hookform/resolvers 5/zod 4 皆已安裝                                                        |
| 狀態管理         | **RHF `FormProvider` + `useFieldArray` 三層巢狀**                                                                                   | `values` → `scopes` → `conditions` 三層陣列，RHF `useFieldArray` 原生支援                                                            |
| Server state | **TanStack Query**                                                                                                              | 對齊 `rightsizing`；Hydration pattern 預取 `GET /lumitag/{id}/` 與 `GET /lumitag/field-values/`                                   |
| Client state | `**view` state（`'form' | 'preview'`）放在 `LumitagSettings`**                                                                      | Preview 與 Create/Edit 同頁共用 FormProvider，切換 view 即可，無需 sessionStorage 或 Zustand。其餘 dropdown open/close 之類 UI 狀態用 local state |
| 拖曳排序         | **新引入 `@dnd-kit/core` + `@dnd-kit/sortable`**                                                                                   | 專案目前無 DnD 依賴；`@dnd-kit` 是目前最推薦的 React DnD 套件，size 小且支援鍵盤 a11y。須新增 dependency                                                |
| 驗證策略         | zod schema 作為型別與驗證單一來源，`values` 放 `RHF.setValue` 用，submit 前 resolver 轉成 `Validated…Data` 型別                                     | 對齊 rightsizing 寫法                                                                                                           |
| 提交邏輯         | `tagId` 存在 → `PUT /lumitag/{id}/`；否則 → `POST /lumitag/`。`Save as Inactive Tag` 為本頁唯一儲存路徑；`Coverage Preview` 走 preview 流程（本次不實作） | 對齊 rightsizing 用 `scopeStatus === Draft` 判斷的精神（此處改用 `tagId` 有無）                                                             |


---

## 1. 共同骨架

### 1.1 路由與檔案樹頂層（對齊 rightsizing/settings，扁平結構，不增加中間層）

```
src/app/(main)/(organization-settings)/lumitag/settings/
├── page.tsx                              ← server: Suspense + Hydration
├── components/
│   ├── LumitagSettingsHydration.tsx   ← server: prefetch queries
│   ├── LumitagSettings.tsx            ← client: <FormProvider> 主容器
│   ├── LumitagSettingsSkeleton.tsx
│   ├── LumitagSettingsToolbar.tsx     ← GoBack + Title
│   ├── LumitagKeySection.tsx          ← "Tag Key" 區塊
│   ├── LumitagValueSection/           ← "Tag Values" 區塊（含多個 Value Card）
│   │   ├── LumitagValueSection.tsx
│   │   ├── LumitagValueCard.tsx
│   │   ├── LumitagDataSourceBlock.tsx
│   │   ├── LumitagConditionRow.tsx
│   │   └── LumitagFieldValueInput.tsx
│   └── LumitagActionButtons.tsx       ← FixedBottomBarWrapper 內 3 顆按鈕
├── constants/
│   └── lumitagSettings.ts
├── hooks/
│   ├── useLumitagSettingsForm.ts      ← RHF + zod + prefill
│   ├── useValueArrayField.ts             ← 封裝 values 層 useFieldArray
│   ├── useScopeArrayField.ts             ← 封裝 scopes 層 useFieldArray
│   ├── useConditionArrayField.ts         ← 封裝 conditions 層 useFieldArray
│   └── useTagKeyNameValidation.ts        ← duplicate / format 檢查
├── utils/
│   ├── transformFormDataToPayload.ts
│   ├── transformPayloadToFormData.ts
│   └── __tests__/
└── zod/
    └── lumitagSettings.schema.ts
```

> **頂層資料夾僅 `components / constants / hooks / utils / zod` + `page.tsx`**，與 `rightsizing/settings` 完全一致。禁止出現 `_form/`、`_shared/`、`form/`、`logic/` 這類分組資料夾。

### 1.2 `hooks-api/lumitag/`（共享 API 層，feature 外部）

```
src/hooks-api/lumitag/
├── lumitag.api.ts
├── lumitag.type.ts
├── useGetLumitagList.ts        ← GET /lumitag/（List，用於 key name 重複檢查）
├── useGetLumitag.ts            ← GET /lumitag/{id}/（Edit 預填）
├── usePostLumitag.ts
├── usePutLumitag.ts
├── useGetLumitagFieldValues.ts ← GET /lumitag/field-values/（下拉選項來源）
└── index.ts（barrel export + query key getters）
```

> 其餘 Preview / CSV / Delete hooks 由其他頁面的 ticket 帶入，本 plan 不建。

### 1.3 Data flow 總覽

```
page.tsx (server, searchParams.tagId)
 └─ <Suspense fallback={Skeleton}>
     └─ LumitagSettingsHydration (server)
         ├─ prefetch useGetLumitagDetail(tagId)   ← 僅 Edit 模式
         ├─ prefetch useGetLumitagFieldValues()
         └─ <HydrationBoundary>
             └─ LumitagSettings (client)          ── useState<'form' | 'preview'>('form')
                 └─ <FormProvider {...useLumitagSettingsForm()}>
                     ├─ LumitagSettingsToolbar
                     ├─ {view === 'form' && (
                     │   ├─ LumitagKeySection          ── RHF: watch('name')
                     │   ├─ LumitagValueSection        ── useValueArrayField()
                     │   │   └─ LumitagValueCard       ── useScopeArrayField(valueIndex)
                     │   │       └─ LumitagDataSourceBlock ── useConditionArrayField(valueIndex, scopeIndex)
                     │   │           └─ LumitagConditionRow
                     │   │               └─ LumitagFieldValueInput  ── field-values query
                     │   └─ LumitagActionButtons (FixedBottomBarWrapper)  ── onPreview={() => setView('preview')}
                     │ )}
                     └─ {view === 'preview' && <LumitagPreview onBack={() => setView('form')} />}  ← 本次不實作，僅佔位
```

### 1.4 Form data shape（zod schema 推導）

```ts
// lumitagSettings.schema.ts（概念）
// OperatorEnum、LogicEnum 直接從 @hooks-api import，不在 feature 層重複定義
const conditionCriteriaSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('regular'), operator: z.enum(OperatorEnum), values: z.array(z.string()) }),
  z.object({ kind: z.literal('nativeTag'), tagKey: z.string(),
             tagValue: z.object({ operator: z.enum(OperatorEnum), values: z.array(z.string()) }).optional() }),
]);

const conditionSchema = z.object({
  logic: z.enum(LogicEnum),   // 從 @hooks-api import LogicEnum，不寫死 ['BASE', 'AND', 'OR']
  field: z.string(),
  criteria: conditionCriteriaSchema,
});

const scopeSchema = z.object({
  platform: PlatformEnum,           // gcp | aws | azure | focus
  conditions: z.array(conditionSchema).min(1).max(20),
});

const valueSchema = z.object({
  id: z.number().optional(),         // PUT 時帶回
  name: z.string().min(1).max(256),
  displayOrder: z.number(),
  scopes: z.array(scopeSchema).min(1),
});

export const lumitagSettingsSchema = z.object({
  name: z.string().regex(TAG_KEY_REGEX).max(128),
  values: z.array(valueSchema).max(1000),
});
```

> 最新 api-spec 的 POST / PUT payload 已移除 `status` 欄位，因此 form schema 也不含 `status`。PUT payload 中的 top-level `id` 由 `transformFormDataToPayload(form, tagId)` 從 `searchParams.tagId` 注入，不屬於 form data。

> - `name` 的 duplicate 檢查走 `useTagKeyNameValidation()`（async / 非 zod），理由：需要向 list data 比對且 case-insensitive，zod superRefine 可行但會耦合 API layer 到 schema，不符 rightsizing 把 API 存取留在 hook 的做法
> - `displayOrder` 由 `useValueArrayField` / 拖曳 reorder 邏輯自動維護，使用者無感

---

## 2. 架構方案（扁平結構 + 三個 Array Helper Hooks）

**核心精神**：維持與 rightsizing 完全一致的扁平頂層結構，但把三層巢狀陣列（values → scopes → conditions）的業務規則封裝成三個 domain-specific hook，讓 component 只關心 UI。

**採用此方案的理由**：Virtual Tag 的 form 是**三層巢狀陣列**，業務規則（1000 / 20 條上限、首列 BASE logic、displayOrder 自動維護、平台去重）散在每一層。若直接在 component 裡寫 `useFieldArray`，這些規則會在 3~4 個 component 重複；抽成三個 hook 可集中規則、符合 CLAUDE.md「複雜邏輯提取到自訂 Hooks」，同時完全維持 rightsizing 的扁平頂層資料夾結構，不加任何中間層。

### 2.1 架構圖

```
LumitagSettings (page.tsx)
├── LumitagSettingsToolbar
├── LumitagKeySection                         ── useFormContext() + watch('name')
├── LumitagValueSection
│   ├── useValueArrayField()                     ← hook: values + append/remove/duplicate/move + MAX_VALUES
│   ├── @dnd-kit/sortable 包在 Value Card map 外層
│   └── LumitagValueCard (map)
│       ├── useScopeArrayField(valueIndex)       ← platform 去重、Add Data Source 濾選
│       └── LumitagDataSourceBlock (map)
│           ├── useConditionArrayField(valueIndex, scopeIndex) ← 首列 BASE、MAX_CONDITIONS
│           └── LumitagConditionRow (map)
│               └── LumitagFieldValueInput    ── 依 mode 切換 text/multi/native-tag 輸入
└── LumitagActionButtons
```

### 2.2 關鍵檔案清單


| 路徑                                                          | 職責                                                                                                                           |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `page.tsx`                                                  | server; `searchParams.tagId`；Suspense + Hydration                                                                            |
| `components/LumitagSettingsHydration.tsx`                   | server; prefetch detail + field-values                                                                                       |
| `components/LumitagSettings.tsx`                            | client; `<FormProvider>`；mutation 提交                                                                                         |
| `components/LumitagKeySection.tsx`                          | Key 名稱 input + Recommended dropdown + 錯誤訊息；**Edit 模式下 input `disabled` + lock icon + 右側顯示當前 status chip（Active / Inactive）** |
| `components/LumitagValueSection/LumitagValueSection.tsx`    | 呼叫 `useValueArrayField()`；空狀態；Add Value；@dnd-kit DndContext                                                                  |
| `components/LumitagValueSection/LumitagValueCard.tsx`       | 單一 value；drag-handle；collapse；duplicate；remove；呼叫 `useScopeArrayField(valueIndex)`                                           |
| `components/LumitagValueSection/LumitagDataSourceBlock.tsx` | 單一 platform scope；呼叫 `useConditionArrayField(valueIndex, scopeIndex)`；Remove Data Source                                     |
| `components/LumitagValueSection/LumitagConditionRow.tsx`    | WHERE/AND/OR + field + operator + value input + ✕                                                                            |
| `components/LumitagValueSection/LumitagFieldValueInput.tsx` | 依 field mode（text/multi/native_tag）切換 input                                                                                  |
| `components/LumitagActionButtons.tsx`                       | FixedBottomBar 3 顆按鈕                                                                                                         |
| `constants/lumitagSettings.ts`                              | `MAX_VALUES=1000`、`MAX_CONDITIONS=20`、`RECOMMENDED_KEYS`、`TAG_KEY_REGEX`、`PLATFORM_FIELD_CONFIG`、`ALL_PLATFORMS`、錯誤訊息。**`OPERATORS` 已移除**，直接使用 `@hooks-api` 的 `OperatorEnum`        |
| `hooks/useLumitagSettingsForm.ts`                           | `useForm` + `zodResolver` + `values` prefill（Edit 時轉 API → form）                                                             |
| `hooks/useValueArrayField.ts`                               | 封裝 `useFieldArray('values')`；append/remove/duplicate/move + `displayOrder` 重算 + MAX_VALUES 控制                                |
| `hooks/useScopeArrayField.ts`                               | 封裝 `useFieldArray('values.i.scopes')`；`availablePlatforms` 計算；Add/Remove Data Source                                         |
| `hooks/useConditionArrayField.ts`                           | 封裝 `useFieldArray('...conditions')`；首列強制 `logic: BASE`；append 預設 `logic: AND`；MAX_CONDITIONS 控制                              |
| `hooks/useTagKeyNameValidation.ts`                          | async duplicate 檢查 + format 檢查，回傳 inline error message                                                                       |
| `utils/transformFormDataToPayload.ts`                       | form → POST/PUT body                                                                                                         |
| `utils/transformPayloadToFormData.ts`                       | GET response → form default values                                                                                           |
| `zod/lumitagSettings.schema.ts`                             | schema + `ValidatedLumitagData` / `LumitagFormData`                                                                          |


### 2.3 關鍵介面 sudo code

```ts
// useLumitagSettingsForm.ts
function useLumitagSettingsForm(): UseFormReturn<
  LumitagFormData,
  unknown,
  ValidatedLumitagData
>;

// useValueArrayField.ts
interface UseValueArrayFieldResult {
  fields: FieldArrayWithId<LumitagFormData, 'values'>[];
  appendValue: () => void;                        // 自動產生 displayOrder + 預設 scope
  duplicateValue: (index: number) => void;
  removeValue: (index: number) => void;
  moveValue: (from: number, to: number) => void;  // @dnd-kit 完成後呼叫；自動重算 displayOrder
  canAddMore: boolean;                            // fields.length < MAX_VALUES
}
function useValueArrayField(): UseValueArrayFieldResult;

// useScopeArrayField.ts
interface UseScopeArrayFieldResult {
  fields: FieldArrayWithId<LumitagFormData, `values.${number}.scopes`>[];
  availablePlatforms: Platform[];                 // 排除已用
  addScope: (platform: Platform) => void;
  removeScope: (scopeIndex: number) => void;
}
function useScopeArrayField(valueIndex: number): UseScopeArrayFieldResult;

// useConditionArrayField.ts
interface UseConditionArrayFieldResult {
  fields: FieldArrayWithId<LumitagFormData, `values.${number}.scopes.${number}.conditions`>[];
  appendCondition: () => void;                    // logic 自動 AND；首列維持 BASE
  removeCondition: (conditionIndex: number) => void;
  canAddMore: boolean;
}
function useConditionArrayField(valueIndex: number, scopeIndex: number): UseConditionArrayFieldResult;

// transformPayloadToFormData.ts
function transformPayloadToFormData(detail: LumitagResponse): LumitagFormData;

// transformFormDataToPayload.ts（PUT 時注入 top-level id）
function transformFormDataToPayload(
  form: ValidatedLumitagData,
  tagId?: string,
  status?: LumitagStatus  // 預設 LumitagStatusEnum.Active
): LumitagUpsertPayload;

// LumitagConditionRow.tsx
interface LumitagConditionRowProps {
  valueIndex: number;
  scopeIndex: number;
  conditionIndex: number;
  isFirst: boolean;                               // → 顯示 "WHERE" vs AND/OR 下拉
  onRemove: () => void;
}
```

### 2.4 建議的實作順序（給實作 ticket 參考，不在本 plan 範圍）

1. `hooks-api/lumitag/`（types、api、hooks）
2. `zod/lumitagSettings.schema.ts` + `constants/lumitagSettings.ts`
3. `utils/transform*.ts`（含 **tests**）
4. `hooks/useLumitagSettingsForm.ts` + 三個 array helper hooks ✅（含 `useTagKeyNameValidation`；`useForm` 需同時提供 `defaultValues` + `values` 避免 uncontrolled→controlled 警告）
5. ✅ `page.tsx` + `LumitagSettingsHydration` + `LumitagSettingsSkeleton` + `LumitagSettings`（view state）+ `LumitagPreview`（佔位）；`lumitag.api.ts` 同步 export 至 `@hooks-api` 供 Hydration 使用
6. `LumitagSettings` + `Toolbar` + `KeySection`（Key 名稱流程可先完成）
7. `LumitagValueSection` 空狀態 → Value Card → DataSourceBlock → ConditionRow → FieldValueInput
8. 導入 `@dnd-kit`，Value Card reorder
9. Error messages / Tooltips / 字元上限 / 上限 disable 行為
10. Submit（POST / PUT）+ Save as Inactive + Preview 按鈕 handler 預留

---

## 3. 已確認決策

1. **Duplicate 檢查 data source**：打 `GET /lumitag/` 取全部 list，前端本地 case-insensitive 比對。後端無專屬 endpoint。
2. `**GET /lumitag/{id}/` response schema**：api-spec 已更新，有完整範例（三層巢狀），直接照此定型別，`transformPayloadToFormData` 可確定性實作，不需要等待或留「待校對」TODO。
3. **Edit 衝突處理**：系統不存在同時修改的情境，不需要 ETag / version，`usePutLumitag` 直接送 PUT。
4. **Coverage Preview 同頁切換**：Preview 與 Create / Edit **同一路由、共用同一個 `<FormProvider>`**，以 `view` state（`'form' | 'preview'`）切換顯示元件。`Coverage Preview` 按鈕 handler 只需 `setView('preview')`，無需 sessionStorage / store。
5. **拖曳只影響 `displayOrder`**：Value Card 換位後，`displayOrder` 依新 index 重算，Card 內所有欄位（name / scopes / conditions）完全不變。

### 已由 Figma `#10 Edit LumiTag` 確認的項目

- Edit 模式下 Tag Key input **disabled** 並顯示 lock icon（見 §0.1、§2.2）
- 本頁不存在「直接 Save as Active」路徑，只有 `Save as Inactive Tag`（由 PO 確認）
- payload 無 `status` 欄位無需前端處理（由後端依流程決定）

---

