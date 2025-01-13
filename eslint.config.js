// @ts-check

import neverthrowPlugin from '@bufferings/eslint-plugin-neverthrow';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import tseslintParser from '@typescript-eslint/parser';

export default tseslint.config(
  {
    ignores: ['**/dist/', '**/.gitignore'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
  },
  {
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.*'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  neverthrowPlugin.configs.recommended,
  eslintConfigPrettier,
);
