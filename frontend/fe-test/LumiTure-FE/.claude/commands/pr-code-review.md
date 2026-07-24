---
description: Generate a code review report by comparing two git branches and provide detailed review feedback.
argument-hint: --base <base_branch> --feature <feature_branch>
---

# Code Review

Generate a code review report by comparing two git branches and provide detailed review feedback.

## Input Context

The user ran the command with these arguments: `$ARGUMENTS`

## Argument Requirements (Reference)

- Format: `--base <branch> --feature <branch>`
- Example: `--base develop --feature lt-2039`

## Instructions

1. Parse the arguments to extract base branch and feature branch:
   - `--base`: The base branch to compare against (e.g., `develop`, `main`, or another feature branch)
   - `--feature`: The feature branch to review

2. Run the code reviewer script to generate the diff report:

   ```bash
   python3 .claude/scripts/code_review.py --base <base_branch> --feature <feature_branch> --output code_review_summary.md
   ```

3. Read the generated `code_review_summary.md` file to get the diff content.

4. For each changed file listed in the report, read the **current full source code** from the feature branch to understand the complete context (not just the diff).

5. Perform a thorough code review focusing on:
   - **TypeScript 型別安全**:
     - 避免使用 `any`（改用 `unknown` 或具體型別）
     - 優先使用 `interface` 而非 `type`（除非需要 union types）
     - Enum 定義使用 `const enum` 或 `as const`
     - Interface/Type 是否放在正確的位置（元件內 vs 獨立檔案）
     - 是否有共用型別可以提取到 `types/` 資料夾
     - 型別定義是否過於寬鬆或過於嚴格
     - 是否有重複的型別定義
   - **React 元件結構與職責劃分**:
     - 元件是否過大，違反單一職責原則（Single Responsibility Principle）
     - 是否應該拆分成更小的子元件或自訂 Hooks
     - 元件階層是否合理，避免 Props Drilling
     - 邏輯與 UI 是否適當分離
     - 使用函數式組件
     - 添加 `data-testid` 屬性以便測試
   - **Hooks 使用規範**:
     - 是否違反 Hooks 規則（Rules of Hooks）
     - 自訂 Hooks 的設計是否合理且可重用
     - `useEffect`、`useMemo`、`useCallback` 的依賴陣列是否正確
     - 是否有不必要的 Hook 呼叫或重複邏輯
     - 避免不必要的 re-render，適當使用 `useMemo` 和 `useCallback`
     - Form Hook 需搭配 Zod 做輸入驗證
   - **狀態管理架構**:
     - 狀態提升（State Lifting）是否合理
     - Context 的使用是否過度或不足
     - 全域狀態 vs 區域狀態的選擇是否恰當
     - 狀態更新邏輯是否一致
     - 保持一致的狀態管理模式
   - **API 層與資料流**:
     - API 呼叫的位置是否合理（在 Hook 或元件內）
     - **API 資料應透過 TanStack Query hooks 取得，避免透過 props 層層傳遞**（除非有特殊必要，如父元件需要控制子元件的資料狀態）
     - 錯誤處理是否完整（try-catch、error boundary）
     - Loading/Error 狀態處理是否完整
     - API 回應的型別定義是否正確
   - **程式碼邏輯與可讀性**:
     - **優先使用 Early Return**：避免深層巢狀，將錯誤處理、邊界條件放在函數開頭
     - 避免過度設計或添加未要求的功能
     - 保持現有程式碼風格一致性
     - 函數複雜度是否過高
     - Magic Number/String 是否提取為常數
   - **命名規範**:
     - 組件檔案：PascalCase（如 `AIAnalysis.tsx`）
     - 一般檔案：camelCase（如 `useWebSocket.ts`）
     - 常數：UPPER_SNAKE_CASE
     - 元件 Props 介面命名：`{ComponentName}Props`
     - Enum 命名：PascalCase + Enum 後綴
     - 函數/變數：camelCase
     - 資料夾命名：路由用 kebab-case、元件用 PascalCase、utils/hooks 用 camelCase
   - **Import 與模組化**:
     - 可以解構 import 時直接解構（如 MUI/Material 套件，不要一行一個元件）
     - 保持 import 語句簡潔
   - **效能與優化**:
     - 檢查不必要的 re-render
     - 適當使用 React 效能優化 Hooks
     - 注意元件渲染效能
   - **Security**: Input validation, XSS, authentication/authorization issues, resource access control

   **Risk Classification Criteria**:
   - **High Risk** 🔴:
     - Security vulnerabilities (XSS, authentication/authorization bypass)
     - 違反 Hooks 使用規範
     - 違反 TypeScript 型別安全規範
     - API 錯誤處理缺失導致未捕獲的異常
     - 未處理的 critical exceptions 導致白屏
     - 狀態更新邏輯錯誤導致資料不一致

   - **Medium Risk** 🟡:
     - API 資料透過 props 層層傳遞（Props Drilling），未使用 TanStack Query hooks
     - 深層巢狀邏輯，未使用 Early Return
     - 不必要的 re-render 導致效能問題
     - 缺少或多餘的 `useMemo`/`useCallback` 導致效能下降
     - 元件過大違反單一職責原則，難以維護
     - Loading/Error 狀態處理不完整影響使用者體驗
     - 狀態管理不當（State Lifting 錯誤、Context 過度使用）
     - 全域 vs 區域狀態選擇不當
     - 函數複雜度過高難以維護
     - 業務邏輯錯誤
     - 缺少輸入驗證
     - 元件階層不合理

   - **Low Risk** 🟢:
     - 複雜原件或邏輯可以補上文檔或註解
     - 小的重構建議
     - 其餘未符合規範的部分

6. Create a review file named `{feature_branch}-reviewed.md` with the following structure:

   ````markdown
   # Code Review: {feature_branch}

   **Base Branch**: {base_branch}
   **Feature Branch**: {feature_branch}
   **Review Date**: {date}

   ## Summary

   Brief overview of the changes and overall assessment.

   ## Risk Assessment

   ### High Risk

   - [List critical issues that must be addressed]

   ### Medium Risk

   - [List important issues that should be addressed]

   ### Low Risk

   - [List minor suggestions for improvement]

   ## File-by-File Review

   ### `path/to/file.py`

   **Changes**: Brief description of what changed

   **Issues**:

   1. [Issue description with line reference]
      - Risk: High/Medium/Low
      - Suggestion: [How to fix]
      ```python
      # Suggested fix
      ```
   ````

   ## Test Recommendations
   - [List suggested test cases]

   ## Overall Recommendations
   - [Summary of key actions needed before merge]

   ```

   ```

7. Present the review summary to the user and inform them where the full review file is saved.

8. **重要**：所有審查報告內容必須使用**繁體中文**撰寫，包括摘要、風險評估、逐檔審查建議、測試建議等所有章節。

## Example Usage

```
/code-review --base develop --feature lt-2039
/code-review --base lt-2290 --feature lt-2039
```
