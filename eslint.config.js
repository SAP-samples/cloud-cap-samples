const eslintCds = require('@sap/eslint-plugin-cds')
const eslintJs = require('@eslint/js')
const globals = require('globals')

module.exports = [
  eslintJs.configs.recommended,
  eslintCds.configs.recommended,
  {
    languageOptions: {
      globals: {
        sap: true,
        ...globals.es2022,
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.mocha,
        ...eslintCds.configs.recommended.languageOptions.globals
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
