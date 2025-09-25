module.exports = {
  extends: ['./.eslintrc.json'],
  env: {
    jest: true,
    'jest/globals': true,
  },
  plugins: ['jest', 'testing-library', 'jest-dom'],
  rules: {
    // Jest-specific rules
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jest/valid-describe-callback': 'error',
    'jest/consistent-test-it': ['error', { fn: 'it' }],

    // Testing Library rules
    'testing-library/await-async-query': 'error',
    'testing-library/no-await-sync-query': 'error',
    'testing-library/no-debugging-utils': 'warn',
    'testing-library/no-dom-import': 'error',
    'testing-library/prefer-screen-queries': 'error',
    'testing-library/prefer-user-event': 'error',

    // Jest DOM rules
    'jest-dom/prefer-checked': 'error',
    'jest-dom/prefer-enabled-disabled': 'error',
    'jest-dom/prefer-required': 'error',
    'jest-dom/prefer-to-have-attribute': 'error',
    'jest-dom/prefer-to-have-class': 'error',
    'jest-dom/prefer-to-have-text-content': 'error',
    'jest-dom/prefer-to-have-value': 'error',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      env: {
        jest: true,
      },
      rules: {
        // Allow any in test files for mocking
        '@typescript-eslint/no-explicit-any': 'off',
        // Allow non-null assertions in tests
        '@typescript-eslint/no-non-null-assertion': 'off',
        // Allow empty functions in mocks
        '@typescript-eslint/no-empty-function': 'off',
        // Allow require in test files
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['tests/e2e/**/*'],
      env: {
        jest: false,
      },
      rules: {
        // Playwright-specific rules
        'testing-library/prefer-screen-queries': 'off',
        'testing-library/await-async-query': 'off',
      },
    },
  ],
}