const cds = require('@sap/eslint-plugin-cds')
const globals = require('globals')
const js = require('@eslint/js')

module.exports = [
  cds.configs.recommended,
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        es2022: true,
        sap: true,
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.mocha,
        ...cds.configs.recommended.languageOptions.globals
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'require-atomic-updates': 'off',
      'require-await': 'warn'
    }
  }
]
