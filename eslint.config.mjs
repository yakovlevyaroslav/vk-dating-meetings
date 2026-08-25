import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import stylistic from '@stylistic/eslint-plugin';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    files: ['**/*.jsx', '**/*.tsx'],
    // src/components/ui — компоненты shadcn/ui, генерируются CLI (`shadcn add`), не редактируем руками под стиль проекта
    ignores: ['src/components/ui/**', 'src/hooks/**'],
    ...react.configs.flat.recommended,
    rules: {
      ...react.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/jsx-wrap-multilines': ['error', { return: 'parens-new-line' }],
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'FunctionDeclaration[id.name=/^[A-Z]/] > ObjectPattern',
          message:
            'Деструктуризация пропсов в параметрах реакт-компонента запрещена. Делайте деструктуризацию в теле функции.',
        },
      ],
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'function-expression',
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    ignores: ['**/*.d.ts'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-default-export': 'warn',
    },
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    // src/components/ui и src/hooks — код shadcn/ui, генерируется CLI, не редактируем руками под стиль/строгость проекта
    ignores: ['src/components/ui/**', 'src/hooks/**'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      'no-duplicate-imports': 'warn',
      'prefer-const': 'warn',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useConditionalEffectOnce|useDidUpdate)',
        },
      ],
    },
  },
  /** stylistic rules */
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    ignores: ['src/components/ui/**', 'src/hooks/**'],
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/object-property-newline': ['warn', { allowAllPropertiesOnSameLine: true }],
      '@stylistic/space-infix-ops': 'warn',
      '@stylistic/function-call-spacing': ['warn', 'never'],
      '@stylistic/space-before-function-paren': [
        'warn',
        {
          named: 'never',
          anonymous: 'always',
          asyncArrow: 'always',
        },
      ],
      '@stylistic/arrow-parens': 'warn',
      '@stylistic/jsx-tag-spacing': 'warn',
      '@stylistic/jsx-quotes': 'warn',
      '@stylistic/no-multi-spaces': 'warn',
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/array-bracket-newline': ['warn', 'consistent'],
      '@stylistic/array-bracket-spacing': ['warn', 'never'],
      '@stylistic/arrow-spacing': 'warn',
      '@stylistic/brace-style': 'warn',
      '@stylistic/comma-spacing': 'warn',
      '@stylistic/comma-style': 'warn',
      '@stylistic/computed-property-spacing': 'warn',
      '@stylistic/function-call-argument-newline': ['warn', 'consistent'],
      '@stylistic/jsx-closing-bracket-location': 'warn',
      '@stylistic/jsx-curly-spacing': 'warn',
      '@stylistic/jsx-equals-spacing': 'warn',
      '@stylistic/jsx-self-closing-comp': 'warn',
      '@stylistic/key-spacing': 'warn',
      '@stylistic/keyword-spacing': 'warn',
      '@stylistic/object-curly-newline': ['warn', { ObjectExpression: 'always' }],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/padded-blocks': ['warn', 'never'],
      '@stylistic/quote-props': ['warn', 'as-needed'],
      '@stylistic/rest-spread-spacing': 'warn',
      '@stylistic/semi-spacing': 'warn',
      '@stylistic/semi-style': 'warn',
      '@stylistic/space-before-blocks': 'warn',
      '@stylistic/space-in-parens': 'warn',
      '@stylistic/jsx-curly-brace-presence': ['warn', 'never'],
      '@stylistic/switch-colon-spacing': 'warn',
      '@stylistic/type-annotation-spacing': 'warn',
      '@stylistic/type-generic-spacing': 'warn',
      '@stylistic/indent-binary-ops': ['warn', 2],
      '@stylistic/no-multiple-empty-lines': ['warn', { max: 1 }],
      '@stylistic/indent': ['warn', 2, { ObjectExpression: 1, offsetTernaryExpressions: true, SwitchCase: 1 }],
      '@stylistic/semi': ['warn', 'always'],
      '@stylistic/max-len': [
        'warn',
        {
          code: 120,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
          ignoreRegExpLiterals: true,
        },
      ],
      '@stylistic/quotes': ['warn', 'single', { allowTemplateLiterals: 'always' }],
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      '@stylistic/eol-last': ['warn', 'always'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'semi', requireLast: true },
          singleline: { delimiter: 'semi', requireLast: false },
        },
      ],
    },
  },
  {
    // Next.js требует default export в служебных файлах фреймворка
    files: [
      '**/app/**/page.{ts,tsx}',
      '**/app/**/layout.{ts,tsx}',
      '**/app/**/template.{ts,tsx}',
      '**/app/**/loading.{ts,tsx}',
      '**/app/**/error.{ts,tsx}',
      '**/app/**/not-found.{ts,tsx}',
      '**/app/**/route.{ts,tsx}',
      '**/app/**/default.{ts,tsx}',
      '**/app/**/robots.ts',
      '**/app/**/sitemap.ts',
      '**/app/**/manifest.ts',
      '**/proxy.ts',
      'next.config.ts',
      'prisma.config.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  // src/hooks — код shadcn/ui (CLI-генерируемый), не редактируем руками;
  // eslint-config-next тянет свой react-hooks-конфиг, который не видит наши точечные ignores выше
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src/hooks/**']),
]);

export default eslintConfig;
