module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/default'],
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['../src/**'],
  overrides: [
    {
      files: [
        '**/tests/**/*.ts',
        '**/tests/**/*.tsx',
        '**/tests/mocks/**/*.ts',
        '**/tests/mocks/**/*.tsx',
        '*.test.ts',
        '*.test.tsx',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './includes/tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      env: {
        jest: true, // Enable Jest global variables
        node: true, // Allow Node.js global variables
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_' },
        ],
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ],
};
