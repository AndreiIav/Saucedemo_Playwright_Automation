// ESLint Flat Config (ESLint v9)
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import playwright from 'eslint-plugin-playwright';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist/',
      'build/',
      'out/',
      'node_modules/',
      'playwright-report/',
      'test-results/',
      'blob-report/',
      'tests/example.spec.ts',
      'tests-examples/',
      '.vscode/*',
      '.env',
      '.env.*',
      '*.js',
      '*.cjs',
      '*.mjs',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2020,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      playwright,
    },
    rules: {
      //Prevent missing await
      '@typescript-eslint/require-await': 'error',

      //Prevent unused promises
      '@typescript-eslint/no-floating-promises': 'error',

      // Correct use of async functions
      '@typescript-eslint/no-misused-promises': 'error',

      // Playwright best practices
      'playwright/no-wait-for-timeout': 'warn',
      // 'playwright/no-force-await': 'error',

      //Strong typing
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Disable rule conflicts with Prettier
  eslintConfigPrettier,
];
