import love from 'eslint-config-love';
import nextConfig from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import sonarjs from 'eslint-plugin-sonarjs';
import nx from '@nx/eslint-plugin';
import globals from 'globals';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...nextConfig,
  {
    ignores: [
      '**/next-env.d.ts',
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      '**/out-tsc/**',
      '**/test-output/**',
      '**/.vercel/**',
      '**/coverage/**',
      '**/*.min.js',
      '**/.DS_Store',
      'eslint.config.mjs',
      '.lintstagedrc.mjs',
      '**/.prettierrc.mjs',
      '**/vitest.config.*.timestamp*',
    ],
  },
  prettier,
  love,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    plugins: {
      react,
      sonarjs,
    },
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // ============================================
      // React Rules
      // ============================================
      'react/jsx-key': 'error',
      'react/jsx-fragments': 'warn',
      'react/jsx-curly-brace-presence': 'warn',
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
      'react/self-closing-comp': 'warn',
      'react/prop-types': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',

      // ============================================
      // TypeScript Rules
      // ============================================
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/prefer-destructuring': [
        'warn',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: false, object: true },
        },
      ],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'error',
      '@typescript-eslint/naming-convention': [
        'warn',
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
        { selector: 'enum', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['PascalCase'] },
        { selector: 'variable', modifiers: ['destructured'], format: null },
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/triple-slash-reference': [
        'error',
        { path: 'always', types: 'prefer-import', lib: 'always' },
      ],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn',
        {
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
          ignorePrimitives: { string: true, number: true, boolean: true },
        },
      ],
      '@typescript-eslint/promise-function-async': 'warn',
      '@typescript-eslint/no-useless-default-assignment': 'warn',
      '@typescript-eslint/no-unsafe-type-assertion': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-misused-spread': 'off',
      '@typescript-eslint/max-params': 'off',
      '@typescript-eslint/strict-void-return': 'off',

      // ============================================
      // JavaScript Rules
      // ============================================
      eqeqeq: ['error', 'smart'],
      'object-shorthand': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      radix: ['error', 'as-needed'],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['acc', 'accumulator', 'state', 'draft', 'result'],
        },
      ],
      curly: 'off',

      // ============================================
      // Import Rules
      // ============================================
      'import/no-duplicates': ['warn', { 'prefer-inline': true }],

      // ============================================
      // SonarJS Rules
      // ============================================
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-duplicated-branches': 'warn',
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/prefer-single-boolean-return': 'warn',
      'sonarjs/no-redundant-boolean': 'warn',
      'sonarjs/no-unused-collection': 'warn',
      'sonarjs/no-identical-expressions': 'warn',

      // ============================================
      // Other Rules
      // ============================================
      '@eslint-community/eslint-comments/require-description': 'off',
      'eslint-comments/require-description': 'off',
      'require-unicode-regexp': ['warn', { requireFlag: 'u' }],
      'prefer-template': 'warn',
      'no-useless-assignment': 'warn',
      complexity: 'off',
      'prefer-named-capture-group': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
  },
];
