const globals = require('globals')
const js = require('@eslint/js')
const cds = require('@sap/eslint-plugin-cds')

module.exports = [
  cds.configs.recommended,
  {
    plugins: {
      '@sap/cds': cds
    },
    rules: {
      ...cds.configs.recommended.rules
    }
  },
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.mocha,
        es2022: true
      }
    },
    rules: {
      'no-console': 'off',
      'require-atomic-updates': 'off',
      'require-await': 'warn',
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '_' }]
    }
  }
]
