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
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.mocha,
        cds: true,
        sap: true,
        CDL: true,
        CQL: true,
        CREATE: true,
        DELETE: true,
        DROP: true,
        INSERT: true,
        SELECT: true,
        UPDATE: true,
        UPSERT: true
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
