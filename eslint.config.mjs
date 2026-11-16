import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { configs as airbnb, helpers, plugins } from 'eslint-config-airbnb-extended';
import prettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const workspaceRoot = fileURLToPath(new URL('.', import.meta.url));
const projects = ['./tsconfig.eslint.json'];
const packageDirectories = [workspaceRoot, `${workspaceRoot}packages/react-md3e`, `${workspaceRoot}apps/next-fixture`];
const developmentFiles = [
  '**/*.config.{js,mjs,ts}',
  '**/.storybook/**',
  '**/stories/**',
  '**/scripts/**',
  '**/tests/**',
  '**/*.styles.ts',
  '**/theme/create-theme.ts',
];

export default defineConfig(
  {
    name: 'react-md3e/ignores',
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/next-env.d.ts',
      '**/coverage/**',
      '**/storybook-static/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
  },
  eslint.configs.recommended,
  plugins.importX,
  plugins.stylistic,
  airbnb.base.recommended,
  {
    name: 'react-md3e/environment',
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaVersion: 'latest' },
      globals: globals.node,
    },
    rules: {
      // Named exports are the library API and Storybook's CSF format.
      'import-x/prefer-default-export': 'off',
      // ES2022 and Node 26 support for...of without a regenerator polyfill.
      'no-restricted-syntax': [
        'error',
        { selector: 'ForInStatement', message: 'Use Object.keys/entries instead of inherited-key iteration.' },
        { selector: 'LabeledStatement', message: 'Avoid labeled statements.' },
        { selector: 'WithStatement', message: 'Avoid with statements.' },
      ],
    },
  },
  {
    name: 'react-md3e/typescript',
    files: ['**/*.{ts,tsx}'],
    extends: [plugins.typescriptEslint, ...tseslint.configs.recommended, ...airbnb.base.typescript],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        // A single lint project covers library, consumer, stories, and tools.
        projectService: false,
        project: projects,
        tsconfigRootDir: workspaceRoot,
      },
    },
    settings: helpers.getImportSettings({
      javascript: true,
      typescript: true,
      jsx: true,
      typescriptResolver: { project: projects, alwaysTryTypes: true },
    }),
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    name: 'react-md3e/react',
    files: ['**/*.tsx'],
    extends: [plugins.react, plugins.reactA11y, plugins.reactHooks, ...airbnb.react.all],
    rules: {
      ...reactHooks.configs.recommended.rules,
      // React 19 uses the automatic JSX runtime and TypeScript props.
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      // These public controls contain Base UI's label-associated native inputs.
      'jsx-a11y/label-has-associated-control': ['error', { controlComponents: ['Checkbox', 'Radio'], depth: 3 }],
    },
  },
  {
    name: 'react-md3e/hooks',
    files: ['**/*.ts'],
    extends: [plugins.reactHooks],
    rules: reactHooks.configs.recommended.rules,
  },
  {
    name: 'react-md3e/workspace-dependencies',
    files: ['**/*.{js,mjs,ts,tsx}'],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          packageDir: packageDirectories,
          devDependencies: developmentFiles,
          optionalDependencies: false,
          peerDependencies: true,
          bundledDependencies: true,
        },
      ],
    },
  },
  {
    name: 'react-md3e/extensionless-source-imports',
    files: ['**/*.{js,mjs,ts,tsx}'],
    rules: {
      'import-x/extensions': [
        'error',
        'ignorePackages',
        {
          checkTypeImports: true,
          pattern: {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
            mjs: 'never',
            cjs: 'never',
            css: 'always',
            json: 'always',
          },
        },
      ],
    },
  },
  {
    name: 'react-md3e/sequential-checks',
    files: ['scripts/**/*.{js,mjs}', '**/tests/**/*.{js,mjs,ts,tsx}'],
    // Polling a server and reading a response stream require sequential awaits.
    rules: { 'no-await-in-loop': 'off' },
  },
  {
    name: 'react-md3e/ripple-press-state',
    files: ['packages/react-md3e/src/internal/hooks/use-ripple.hook.ts'],
    rules: {
      // Each input press is a private mutable record owned by the ripple controller.
      'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['press'] }],
    },
  },
  {
    name: 'react-md3e/library-boundaries',
    files: ['packages/react-md3e/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mui/*', '@emotion/*', 'styled-components', 'styled-components/*'],
              message:
                'The library owns its design and emits static CSS. Adapt source without importing MUI or a runtime CSS engine.',
            },
            {
              group: ['next', 'next/*'],
              message: 'Keep framework integration in the consumer or fixture app.',
            },
          ],
        },
      ],
    },
  },
  // Prettier owns formatting; the requested structural layout rules are applied afterward.
  prettier,
  {
    name: 'react-md3e/readable-control-flow',
    files: ['**/*.{js,mjs,ts,tsx}'],
    rules: {
      'curly': ['error', 'all'],
      '@stylistic/curly-newline': ['error', { minElements: 1, consistent: true }],
      // One modern rule covers the previous newline-before-return preference as well.
      'newline-before-return': 'off',
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: ['block-like', 'return'] },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        // Related declarations can remain a compact group; preserve hand-written spacing.
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      ],
    },
  },
);
