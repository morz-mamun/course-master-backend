import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    extends: ['js/recommended', ...tseslint.configs.recommended],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },  // Allow unused parameters starting with _
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },  // Same rule for TypeScript
      ],

      'no-undef': 'warn',
      'prefer-const': 'error',
      'no-console': 'warn',
    },
  },
  {
    ignores: ['node_modules', 'dist'],
  },
]);
